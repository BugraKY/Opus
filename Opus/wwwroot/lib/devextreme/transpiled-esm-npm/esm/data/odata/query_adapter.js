import { isFunction } from '../../core/utils/type';
import { each } from '../../core/utils/iterator';
import config from '../../core/config';
import { extend } from '../../core/utils/extend';
import queryAdapters from '../query_adapters';
import { sendRequest, generateSelect, generateExpand, serializeValue, convertPrimitiveValue, serializePropName } from './utils';
import { errors } from '../errors';
import { isConjunctiveOperator, normalizeBinaryCriterion, isUnaryOperation } from '../utils';
var DEFAULT_PROTOCOL_VERSION = 2;
var STRING_FUNCTIONS = ['contains', 'notcontains', 'startswith', 'endswith'];

var compileCriteria = (() => {
  var protocolVersion;
  var forceLowerCase;
  var fieldTypes;

  var createBinaryOperationFormatter = op => (prop, val) => "".concat(prop, " ").concat(op, " ").concat(val);

  var createStringFuncFormatter = (op, reverse) => (prop, val) => {
    var bag = [op, '('];

    if (forceLowerCase) {
      prop = prop.indexOf('tolower(') === -1 ? "tolower(".concat(prop, ")") : prop;
      val = val.toLowerCase();
    }

    if (reverse) {
      bag.push(val, ',', prop);
    } else {
      bag.push(prop, ',', val);
    }

    bag.push(')');
    return bag.join('');
  };

  var isStringFunction = function isStringFunction(name) {
    return STRING_FUNCTIONS.some(funcName => funcName === name);
  };

  var formatters = {
    '=': createBinaryOperationFormatter('eq'),
    '<>': createBinaryOperationFormatter('ne'),
    '>': createBinaryOperationFormatter('gt'),
    '>=': createBinaryOperationFormatter('ge'),
    '<': createBinaryOperationFormatter('lt'),
    '<=': createBinaryOperationFormatter('le'),
    'startswith': createStringFuncFormatter('startswith'),
    'endswith': createStringFuncFormatter('endswith')
  };
  var formattersV2 = extend({}, formatters, {
    'contains': createStringFuncFormatter('substringof', true),
    'notcontains': createStringFuncFormatter('not substringof', true)
  });
  var formattersV4 = extend({}, formatters, {
    'contains': createStringFuncFormatter('contains'),
    'notcontains': createStringFuncFormatter('not contains')
  });

  var compileBinary = criteria => {
    var _fieldTypes;

    criteria = normalizeBinaryCriterion(criteria);
    var op = criteria[1];
    var fieldName = criteria[0];
    var fieldType = fieldTypes && fieldTypes[fieldName];

    if (fieldType && isStringFunction(op) && fieldType !== 'String') {
      throw new errors.Error('E4024', op, fieldName, fieldType);
    }

    var formatters = protocolVersion === 4 ? formattersV4 : formattersV2;
    var formatter = formatters[op.toLowerCase()];

    if (!formatter) {
      throw errors.Error('E4003', op);
    }

    var value = criteria[2];

    if ((_fieldTypes = fieldTypes) !== null && _fieldTypes !== void 0 && _fieldTypes[fieldName]) {
      value = convertPrimitiveValue(fieldTypes[fieldName], value);
    }

    return formatter(serializePropName(fieldName), serializeValue(value, protocolVersion));
  };

  var compileUnary = criteria => {
    var op = criteria[0];
    var crit = compileCore(criteria[1]);

    if (op === '!') {
      return "not (".concat(crit, ")");
    }

    throw errors.Error('E4003', op);
  };

  var compileGroup = criteria => {
    var bag = [];
    var groupOperator;
    var nextGroupOperator;
    each(criteria, function (index, criterion) {
      if (Array.isArray(criterion)) {
        if (bag.length > 1 && groupOperator !== nextGroupOperator) {
          throw new errors.Error('E4019');
        }

        bag.push("(".concat(compileCore(criterion), ")"));
        groupOperator = nextGroupOperator;
        nextGroupOperator = 'and';
      } else {
        nextGroupOperator = isConjunctiveOperator(this) ? 'and' : 'or';
      }
    });
    return bag.join(" ".concat(groupOperator, " "));
  };

  var compileCore = criteria => {
    if (Array.isArray(criteria[0])) {
      return compileGroup(criteria);
    }

    if (isUnaryOperation(criteria)) {
      return compileUnary(criteria);
    }

    return compileBinary(criteria);
  };

  return (criteria, version, types, filterToLower) => {
    fieldTypes = types;
    forceLowerCase = filterToLower !== null && filterToLower !== void 0 ? filterToLower : config().oDataFilterToLower;
    protocolVersion = version;
    return compileCore(criteria);
  };
})();

var createODataQueryAdapter = queryOptions => {
  var _sorting = [];
  var _criteria = [];
  var _expand = queryOptions.expand;

  var _select;

  var _skip;

  var _take;

  var _countQuery;

  var _oDataVersion = queryOptions.version || DEFAULT_PROTOCOL_VERSION;

  var hasSlice = () => _skip || _take !== undefined;

  var hasFunction = criterion => {
    for (var i = 0; i < criterion.length; i++) {
      if (isFunction(criterion[i])) {
        return true;
      }

      if (Array.isArray(criterion[i]) && hasFunction(criterion[i])) {
        return true;
      }
    }

    return false;
  };

  var requestData = () => {
    var result = {};

    if (!_countQuery) {
      if (_sorting.length) {
        result['$orderby'] = _sorting.join(',');
      }

      if (_skip) {
        result['$skip'] = _skip;
      }

      if (_take !== undefined) {
        result['$top'] = _take;
      }

      result['$select'] = generateSelect(_oDataVersion, _select) || undefined;
      result['$expand'] = generateExpand(_oDataVersion, _expand, _select) || undefined;
    }

    if (_criteria.length) {
      var criteria = _criteria.length < 2 ? _criteria[0] : _criteria;
      var fieldTypes = queryOptions === null || queryOptions === void 0 ? void 0 : queryOptions.fieldTypes;
      var filterToLower = queryOptions === null || queryOptions === void 0 ? void 0 : queryOptions.filterToLower;
      result['$filter'] = compileCriteria(criteria, _oDataVersion, fieldTypes, filterToLower);
    }

    if (_countQuery) {
      result['$top'] = 0;
    }

    if (queryOptions.requireTotalCount || _countQuery) {
      // todo: tests!!!
      if (_oDataVersion !== 4) {
        result['$inlinecount'] = 'allpages';
      } else {
        result['$count'] = 'true';
      }
    }

    return result;
  };

  var tryLiftSelect = tasks => {
    var selectIndex = -1;

    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].name === 'select') {
        selectIndex = i;
        break;
      }
    }

    if (selectIndex < 0 || !isFunction(tasks[selectIndex].args[0])) return;
    var nextTask = tasks[1 + selectIndex];
    if (!nextTask || nextTask.name !== 'slice') return;
    tasks[1 + selectIndex] = tasks[selectIndex];
    tasks[selectIndex] = nextTask;
  };

  return {
    optimize: tryLiftSelect,

    exec(url) {
      return sendRequest(_oDataVersion, {
        url,
        params: extend(requestData(), queryOptions === null || queryOptions === void 0 ? void 0 : queryOptions.params)
      }, {
        beforeSend: queryOptions.beforeSend,
        jsonp: queryOptions.jsonp,
        withCredentials: queryOptions.withCredentials,
        countOnly: _countQuery,
        deserializeDates: queryOptions.deserializeDates,
        fieldTypes: queryOptions.fieldTypes,
        isPaged: isFinite(_take)
      });
    },

    multiSort(args) {
      var rules;

      if (hasSlice()) {
        return false;
      }

      for (var i = 0; i < args.length; i++) {
        var getter = args[i][0];
        var desc = !!args[i][1];
        var rule = void 0;

        if (typeof getter !== 'string') {
          return false;
        }

        rule = serializePropName(getter);

        if (desc) {
          rule += ' desc';
        }

        rules = rules || [];
        rules.push(rule);
      }

      _sorting = rules;
    },

    slice(skipCount, takeCount) {
      if (hasSlice()) {
        return false;
      }

      _skip = skipCount;
      _take = takeCount;
    },

    filter(criterion) {
      if (hasSlice()) {
        return false;
      }

      if (!Array.isArray(criterion)) {
        criterion = [].slice.call(arguments);
      }

      if (hasFunction(criterion)) {
        return false;
      }

      if (_criteria.length) {
        _criteria.push('and');
      }

      _criteria.push(criterion);
    },

    select(expr) {
      if (_select || isFunction(expr)) {
        return false;
      }

      if (!Array.isArray(expr)) {
        expr = [].slice.call(arguments);
      }

      _select = expr;
    },

    count: () => _countQuery = true
  };
};

queryAdapters.odata = createODataQueryAdapter;
export var odata = createODataQueryAdapter;