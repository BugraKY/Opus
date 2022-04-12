import _extends from "@babel/runtime/helpers/esm/extends";
import Component from "../common/component";
export class GroupPanelWrapper extends Component {
  _setOptionsByReference() {
    super._setOptionsByReference();

    this._optionsByReference = _extends({}, this._optionsByReference, {
      resourceCellTemplate: true
    });
  }

}