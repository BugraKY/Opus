import graphModule from './graph';
var validator = {
  validate: function validate(data, incidentOccurred) {
    var result = null;

    if (this._hasCycle(data)) {
      result = 'E2006';
      incidentOccurred('E2006');
    }

    return result;
  },
  _hasCycle: function _hasCycle(data) {
    return graphModule.struct.hasCycle(data);
  }
};
export default validator;