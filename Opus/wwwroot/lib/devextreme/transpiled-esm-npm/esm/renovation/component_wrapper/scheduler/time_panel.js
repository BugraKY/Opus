import _extends from "@babel/runtime/helpers/esm/extends";
import Component from "../common/component";
export class TimePanel extends Component {
  _setOptionsByReference() {
    super._setOptionsByReference();

    this._optionsByReference = _extends({}, this._optionsByReference, {
      timeCellTemplate: true
    });
  }

}