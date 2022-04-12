import { extend } from '../core/utils/extend';
export default {
  _formatNumberCore: function _formatNumberCore(value, format, formatConfig) {
    if (format === 'currency') {
      formatConfig.precision = formatConfig.precision || 0;
      var result = this.format(value, extend({}, formatConfig, {
        type: 'fixedpoint'
      }));
      var currencyPart = this.getCurrencySymbol().symbol.replace(/\$/g, '$$$$');
      result = result.replace(/^(\D*)(\d.*)/, '$1' + currencyPart + '$2');
      return result;
    }

    return this.callBase.apply(this, arguments);
  },
  getCurrencySymbol: function getCurrencySymbol() {
    return {
      symbol: '$'
    };
  },
  getOpenXmlCurrencyFormat: function getOpenXmlCurrencyFormat() {
    return '$#,##0{0}_);\\($#,##0{0}\\)';
  }
};