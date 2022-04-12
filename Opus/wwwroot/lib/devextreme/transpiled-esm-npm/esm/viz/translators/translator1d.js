var _Number = Number;
export function Translator1D() {
  this.setDomain(arguments[0], arguments[1]).setCodomain(arguments[2], arguments[3]).setInverted(false);
}
Translator1D.prototype = {
  constructor: Translator1D,
  setDomain: function setDomain(domain1, domain2) {
    var that = this;
    that._domain1 = _Number(domain1);
    that._domain2 = _Number(domain2);
    that._domainDelta = that._domain2 - that._domain1;
    return that;
  },
  setCodomain: function setCodomain(codomain1, codomain2) {
    var that = this;
    that._codomain1 = _Number(codomain1);
    that._codomain2 = _Number(codomain2);
    that._codomainDelta = that._codomain2 - that._codomain1;
    return that;
  },

  setInverted(state) {
    this.inverted = state;
  },

  getDomain: function getDomain() {
    return [this._domain1, this._domain2];
  },
  getCodomain: function getCodomain() {
    return [this._codomain1, this._codomain2];
  },
  getDomainStart: function getDomainStart() {
    return this._domain1;
  },
  getDomainEnd: function getDomainEnd() {
    return this._domain2;
  },
  getCodomainStart: function getCodomainStart() {
    return this._codomain1;
  },
  getCodomainEnd: function getCodomainEnd() {
    return this._codomain2;
  },
  getDomainRange: function getDomainRange() {
    return this._domainDelta;
  },
  getCodomainRange: function getCodomainRange() {
    return this._codomainDelta;
  },
  translate: function translate(value) {
    var ratio = (_Number(value) - this._domain1) / this._domainDelta;

    this.inverted && (ratio = 1 - ratio);
    return 0 <= ratio && ratio <= 1 ? this._codomain1 + ratio * this._codomainDelta : NaN;
  },
  adjust: function adjust(value) {
    var ratio = (_Number(value) - this._domain1) / this._domainDelta;

    var result = NaN;

    if (ratio < 0) {
      result = this._domain1;
    } else if (ratio > 1) {
      result = this._domain2;
    } else if (0 <= ratio && ratio <= 1) {
      result = _Number(value);
    }

    return result;
  }
};