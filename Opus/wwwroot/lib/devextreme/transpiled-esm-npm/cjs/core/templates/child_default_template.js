"use strict";

exports.ChildDefaultTemplate = void 0;

var _template_base = require("./template_base");

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ChildDefaultTemplate = /*#__PURE__*/function (_TemplateBase) {
  _inheritsLoose(ChildDefaultTemplate, _TemplateBase);

  function ChildDefaultTemplate(name) {
    var _this;

    _this = _TemplateBase.call(this) || this;
    _this.name = name;
    return _this;
  }

  return ChildDefaultTemplate;
}(_template_base.TemplateBase);

exports.ChildDefaultTemplate = ChildDefaultTemplate;