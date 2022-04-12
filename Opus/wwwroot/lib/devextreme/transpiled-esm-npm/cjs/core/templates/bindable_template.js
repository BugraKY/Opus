"use strict";

exports.BindableTemplate = void 0;

var _renderer = _interopRequireDefault(require("../renderer"));

var _template_base = require("./template_base");

var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));

var _remove = require("../../events/remove");

var _type = require("../utils/type");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var watchChanges = function () {
  var globalWatch = function globalWatch(data, watchMethod, callback) {
    return watchMethod(function () {
      return data;
    }, callback);
  };

  var fieldsWatch = function fieldsWatch(data, watchMethod, fields, fieldsMap, callback) {
    var resolvedData = {};
    var missedFields = fields.slice();
    var watchHandlers = fields.map(function (name) {
      var fieldGetter = fieldsMap[name];
      return watchMethod(fieldGetter ? function () {
        return fieldGetter(data);
      } : function () {
        return data[name];
      }, function (value) {
        resolvedData[name] = value;

        if (missedFields.length) {
          var index = missedFields.indexOf(name);

          if (index >= 0) {
            missedFields.splice(index, 1);
          }
        }

        if (!missedFields.length) {
          callback(resolvedData);
        }
      });
    });
    return function () {
      watchHandlers.forEach(function (dispose) {
        return dispose();
      });
    };
  };

  return function (rawData, watchMethod, fields, fieldsMap, callback) {
    var fieldsDispose;
    var globalDispose = globalWatch(rawData, watchMethod, function (dataWithRawFields) {
      fieldsDispose && fieldsDispose();

      if ((0, _type.isPrimitive)(dataWithRawFields)) {
        callback(dataWithRawFields);
        return;
      }

      fieldsDispose = fieldsWatch(dataWithRawFields, watchMethod, fields, fieldsMap, callback);
    });
    return function () {
      fieldsDispose && fieldsDispose();
      globalDispose && globalDispose();
    };
  };
}();

var BindableTemplate = /*#__PURE__*/function (_TemplateBase) {
  _inheritsLoose(BindableTemplate, _TemplateBase);

  function BindableTemplate(render, fields, watchMethod, fieldsMap) {
    var _this;

    _this = _TemplateBase.call(this) || this;
    _this._render = render;
    _this._fields = fields;
    _this._fieldsMap = fieldsMap || {};
    _this._watchMethod = watchMethod;
    return _this;
  }

  var _proto = BindableTemplate.prototype;

  _proto._renderCore = function _renderCore(options) {
    var _this2 = this;

    var $container = (0, _renderer.default)(options.container);
    var dispose = watchChanges(options.model, this._watchMethod, this._fields, this._fieldsMap, function (data) {
      $container.empty();

      _this2._render($container, data, options.model);
    });

    _events_engine.default.on($container, _remove.removeEvent, dispose);

    return $container.contents();
  };

  return BindableTemplate;
}(_template_base.TemplateBase);

exports.BindableTemplate = BindableTemplate;