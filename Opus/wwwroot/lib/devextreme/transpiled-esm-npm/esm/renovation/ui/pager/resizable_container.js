import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["contentTemplate", "pagerProps"];
import { createComponentVNode, normalizeProps } from "inferno";
import { InfernoEffect, InfernoComponent } from "@devextreme/runtime/inferno";
import resizeCallbacks from "../../../core/utils/resize_callbacks";
import { getElementWidth, getElementStyle } from "./utils/get_element_width";
import { isDefined } from "../../../core/utils/type";
export var viewFunction = _ref => {
  var {
    contentAttributes,
    infoTextRef,
    infoTextVisible,
    isLargeDisplayMode,
    pageSizesRef,
    pagesRef,
    parentRef,
    props: {
      contentTemplate: Content
    }
  } = _ref;
  return Content(_extends({
    rootElementRef: parentRef,
    pageSizesRef: pageSizesRef,
    infoTextRef: infoTextRef,
    pagesRef: pagesRef,
    infoTextVisible: infoTextVisible,
    isLargeDisplayMode: isLargeDisplayMode
  }, contentAttributes));
};
export function calculateAdaptivityProps(_ref2) {
  var {
    info: infoWidth,
    pageSizes: pageSizesWidth,
    pages: pagesWidth,
    parent: parentWidth
  } = _ref2;
  var minimalWidth = pageSizesWidth + pagesWidth + infoWidth;
  var infoTextVisible = parentWidth - minimalWidth > 0;
  var isLargeDisplayMode = parentWidth - (pageSizesWidth + pagesWidth) > 0;
  return {
    infoTextVisible,
    isLargeDisplayMode
  };
}

function getElementsWidth(_ref3) {
  var {
    info,
    pageSizes,
    pages,
    parent
  } = _ref3;
  var parentWidth = getElementWidth(parent);
  var pageSizesWidth = getElementWidth(pageSizes);
  var infoWidth = getElementWidth(info);
  var pagesHtmlWidth = getElementWidth(pages);
  return {
    parent: parentWidth,
    pageSizes: pageSizesWidth,
    info: infoWidth + getElementStyle("marginLeft", info) + getElementStyle("marginRight", info),
    pages: pagesHtmlWidth
  };
}

export var ResizableContainerProps = {};
import { createRef as infernoCreateRef } from "inferno";

var getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => normalizeProps(createComponentVNode(2, TemplateProp, _extends({}, props))) : TemplateProp);

export class ResizableContainer extends InfernoComponent {
  constructor(props) {
    super(props);
    this.parentRef = infernoCreateRef();
    this.pageSizesRef = infernoCreateRef();
    this.infoTextRef = infernoCreateRef();
    this.pagesRef = infernoCreateRef();
    this.state = {
      infoTextVisible: true,
      isLargeDisplayMode: true
    };
    this.subscribeToResize = this.subscribeToResize.bind(this);
    this.effectUpdateChildProps = this.effectUpdateChildProps.bind(this);
    this.updateAdaptivityProps = this.updateAdaptivityProps.bind(this);
  }

  createEffects() {
    return [new InfernoEffect(this.subscribeToResize, [this.state.infoTextVisible, this.state.isLargeDisplayMode]), new InfernoEffect(this.effectUpdateChildProps, [this.props, this.state.infoTextVisible, this.state.isLargeDisplayMode, this.props.pagerProps, this.props.contentTemplate])];
  }

  updateEffects() {
    var _this$_effects$, _this$_effects$2;

    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 ? void 0 : _this$_effects$.update([this.state.infoTextVisible, this.state.isLargeDisplayMode]);
    (_this$_effects$2 = this._effects[1]) === null || _this$_effects$2 === void 0 ? void 0 : _this$_effects$2.update([this.props, this.state.infoTextVisible, this.state.isLargeDisplayMode, this.props.pagerProps, this.props.contentTemplate]);
  }

  subscribeToResize() {
    var callback = () => {
      this.parentWidth > 0 && this.updateAdaptivityProps();
    };

    resizeCallbacks.add(callback);
    return () => {
      resizeCallbacks.remove(callback);
    };
  }

  effectUpdateChildProps() {
    if (this.parentWidth > 0) {
      this.updateAdaptivityProps();
    }
  }

  get contentAttributes() {
    var {
      className,
      displayMode,
      gridCompatibility,
      hasKnownLastPage,
      infoText,
      lightModeEnabled,
      maxPagesCount,
      onKeyDown,
      pageCount,
      pageIndex,
      pageIndexChange,
      pageSize,
      pageSizeChange,
      pageSizes,
      pagesCountText,
      pagesNavigatorVisible,
      rtlEnabled,
      showInfo,
      showNavigationButtons,
      showPageSizes,
      totalCount,
      visible
    } = this.props.pagerProps;
    return _extends({}, this.restAttributes, {
      pageSize,
      pageIndex,
      pageIndexChange,
      pageSizeChange,
      gridCompatibility,
      className,
      showInfo,
      infoText,
      lightModeEnabled,
      displayMode,
      maxPagesCount,
      pageCount,
      pagesCountText,
      visible,
      hasKnownLastPage,
      pagesNavigatorVisible,
      showPageSizes,
      pageSizes,
      rtlEnabled,
      showNavigationButtons,
      totalCount,
      onKeyDown
    });
  }

  get parentWidth() {
    return this.parentRef.current ? getElementWidth(this.parentRef.current) : 0;
  }

  updateAdaptivityProps() {
    var currentElementsWidth = getElementsWidth({
      parent: this.parentRef.current,
      pageSizes: this.pageSizesRef.current,
      info: this.infoTextRef.current,
      pages: this.pagesRef.current
    });

    if (isDefined(this.actualAdaptivityProps) && (this.actualAdaptivityProps.infoTextVisible !== this.state.infoTextVisible || this.actualAdaptivityProps.isLargeDisplayMode !== this.state.isLargeDisplayMode)) {
      return;
    }

    var isEmpty = !isDefined(this.elementsWidth);

    if (isEmpty) {
      this.elementsWidth = {};
    }

    if (isEmpty || this.state.isLargeDisplayMode) {
      this.elementsWidth.pageSizes = currentElementsWidth.pageSizes;
      this.elementsWidth.pages = currentElementsWidth.pages;
    }

    if (isEmpty || this.state.infoTextVisible) {
      this.elementsWidth.info = currentElementsWidth.info;
    }

    this.actualAdaptivityProps = calculateAdaptivityProps(_extends({
      parent: currentElementsWidth.parent
    }, this.elementsWidth));
    this.setState(__state_argument => ({
      infoTextVisible: this.actualAdaptivityProps.infoTextVisible
    }));
    this.setState(__state_argument => ({
      isLargeDisplayMode: this.actualAdaptivityProps.isLargeDisplayMode
    }));
  }

  get restAttributes() {
    var _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);

    return restProps;
  }

  render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        contentTemplate: getTemplate(props.contentTemplate)
      }),
      infoTextVisible: this.state.infoTextVisible,
      isLargeDisplayMode: this.state.isLargeDisplayMode,
      parentRef: this.parentRef,
      pageSizesRef: this.pageSizesRef,
      infoTextRef: this.infoTextRef,
      pagesRef: this.pagesRef,
      contentAttributes: this.contentAttributes,
      parentWidth: this.parentWidth,
      updateAdaptivityProps: this.updateAdaptivityProps,
      restAttributes: this.restAttributes
    });
  }

}
ResizableContainer.defaultProps = ResizableContainerProps;