import Component from "../common/component";
import { Deferred } from "../../../core/utils/deferred";
export class ScrollableWrapper extends Component {
  handleMove(event) {
    this.viewRef.scrollableRef.handleMove(event);
  }

  update() {
    var _this$viewRef;

    (_this$viewRef = this.viewRef) === null || _this$viewRef === void 0 ? void 0 : _this$viewRef.updateHandler();
    return Deferred().resolve();
  }

  isRenovated() {
    return !!Component.IS_RENOVATED_WIDGET;
  }

  _visibilityChanged() {}

  _dimensionChanged() {
    var _this$viewRef2;

    (_this$viewRef2 = this.viewRef) === null || _this$viewRef2 === void 0 ? void 0 : _this$viewRef2.updateHandler();
  }

  $content() {
    return this.$element().find(".dx-scrollable-content").eq(0);
  }

  _moveIsAllowed(event) {
    return this.viewRef.scrollableRef.moveIsAllowed(event);
  }

  _prepareDirections(value) {
    this.viewRef.scrollableRef.prepareDirections(value);
  }

  _optionChanged(option) {
    var {
      name
    } = option;

    if (name === "useNative") {
      this._isNodeReplaced = false;
    }

    super._optionChanged(option);
  }

}