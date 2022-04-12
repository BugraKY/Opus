"use strict";

exports.FunctionTemplate = void 0;

var _template_base = require("./template_base");

var _dom = require("../utils/dom");

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var FunctionTemplate = /*#__PURE__*/function (_TemplateBase) {
  _inheritsLoose(FunctionTemplate, _TemplateBase);

  function FunctionTemplate(render) {
    var _this;

    _this = _TemplateBase.call(this) || this;
    _this._render = render;
    return _this;
  }

  var _proto = FunctionTemplate.prototype;

  _proto._renderCore = function _renderCore(options) {
    return (0, _dom.normalizeTemplateElement)(this._render(options));
  };

  return FunctionTemplate;
}(_template_base.TemplateBase);

exports.FunctionTemplate = FunctionTemplate;