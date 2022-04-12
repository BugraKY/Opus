"use strict";

exports.getGroupPanelData = void 0;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var extendGroupItemsForGroupingByDate = function extendGroupItemsForGroupingByDate(groupRenderItems, columnCountPerGroup) {
  return _toConsumableArray(new Array(columnCountPerGroup)).reduce(function (currentGroupItems, _, index) {
    return groupRenderItems.map(function (groupsRow, rowIndex) {
      var currentRow = currentGroupItems[rowIndex] || [];
      return [].concat(_toConsumableArray(currentRow), _toConsumableArray(groupsRow.map(function (item, columnIndex) {
        return _extends({}, item, {
          key: "".concat(item.key, "_group_by_date_").concat(index),
          isFirstGroupCell: columnIndex === 0,
          isLastGroupCell: columnIndex === groupsRow.length - 1
        });
      })));
    });
  }, []);
};

var getGroupPanelData = function getGroupPanelData(groups, columnCountPerGroup, groupByDate, baseColSpan) {
  var repeatCount = 1;
  var groupPanelItems = groups.map(function (group) {
    var result = [];
    var data = group.data,
        items = group.items,
        resourceName = group.name;

    var _loop = function _loop(iterator) {
      result.push.apply(result, _toConsumableArray(items.map(function (_ref, index) {
        var color = _ref.color,
            id = _ref.id,
            text = _ref.text;
        return {
          id: id,
          text: text,
          color: color,
          key: "".concat(iterator, "_").concat(resourceName, "_").concat(id),
          resourceName: resourceName,
          data: data === null || data === void 0 ? void 0 : data[index]
        };
      })));
    };

    for (var iterator = 0; iterator < repeatCount; iterator += 1) {
      _loop(iterator);
    }

    repeatCount *= items.length;
    return result;
  });

  if (groupByDate) {
    groupPanelItems = extendGroupItemsForGroupingByDate(groupPanelItems, columnCountPerGroup);
  }

  return {
    groupPanelItems: groupPanelItems,
    baseColSpan: baseColSpan
  };
};

exports.getGroupPanelData = getGroupPanelData;