"use strict";

exports.GridPagerWrapper = void 0;

var _component = _interopRequireDefault(require("./common/component"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var GridPagerWrapper = /*#__PURE__*/function (_Component) {
  _inheritsLoose(GridPagerWrapper, _Component);

  function GridPagerWrapper() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = GridPagerWrapper.prototype;

  _proto._optionChanged = function _optionChanged(args) {
    switch (args.name) {
      case "pageIndex":
        {
          var pageIndexChanged = this.option("pageIndexChanged");

          if (pageIndexChanged) {
            pageIndexChanged(args.value);
          }

          break;
        }

      case "pageSize":
        {
          var pageSizeChanged = this.option("pageSizeChanged");

          if (pageSizeChanged) {
            pageSizeChanged(args.value);
          }

          break;
        }

      default:
        break;
    }

    _Component.prototype._optionChanged.call(this, args);
  };

  return GridPagerWrapper;
}(_component.default);

exports.GridPagerWrapper = GridPagerWrapper;