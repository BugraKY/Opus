import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
var _excluded = ["isLargeDisplayMode", "pageSize", "pageSizeChange", "pageSizes", "rootElementRef"];
import { createVNode, createComponentVNode } from "inferno";
import { InfernoEffect, InfernoComponent } from "@devextreme/runtime/inferno";
import { PageSizeSmall } from "./small";
import { PageSizeLarge } from "./large";
import { InternalPagerProps } from "../common/pager_props";
import messageLocalization from "../../../../localization/message";
import { PAGER_PAGE_SIZES_CLASS } from "../common/consts";
export var viewFunction = _ref => {
  var {
    htmlRef,
    normalizedPageSizes,
    props: {
      isLargeDisplayMode,
      pageSize,
      pageSizeChange
    }
  } = _ref;
  return createVNode(1, "div", PAGER_PAGE_SIZES_CLASS, [isLargeDisplayMode && createComponentVNode(2, PageSizeLarge, {
    "pageSizes": normalizedPageSizes,
    "pageSize": pageSize,
    "pageSizeChange": pageSizeChange
  }), !isLargeDisplayMode && createComponentVNode(2, PageSizeSmall, {
    "parentRef": htmlRef,
    "pageSizes": normalizedPageSizes,
    "pageSize": pageSize,
    "pageSizeChange": pageSizeChange
  })], 0, null, null, htmlRef);
};

function getAllText() {
  return messageLocalization.getFormatter("dxPager-pageSizesAllText")();
}

var PageSizeSelectorProps = {
  isLargeDisplayMode: true
};
var PageSizeSelectorPropsType = {
  get pageSize() {
    return InternalPagerProps.pageSize;
  },

  get pageSizes() {
    return InternalPagerProps.pageSizes;
  },

  get isLargeDisplayMode() {
    return PageSizeSelectorProps.isLargeDisplayMode;
  }

};
import { createRef as infernoCreateRef } from "inferno";
export class PageSizeSelector extends InfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.htmlRef = infernoCreateRef();
    this.__getterCache = {};
    this.setRootElementRef = this.setRootElementRef.bind(this);
  }

  createEffects() {
    return [new InfernoEffect(this.setRootElementRef, [])];
  }

  setRootElementRef() {
    var {
      rootElementRef
    } = this.props;

    if (rootElementRef) {
      rootElementRef.current = this.htmlRef.current;
    }
  }

  get normalizedPageSizes() {
    if (this.__getterCache["normalizedPageSizes"] !== undefined) {
      return this.__getterCache["normalizedPageSizes"];
    }

    return this.__getterCache["normalizedPageSizes"] = (() => {
      var {
        pageSizes
      } = this.props;
      return pageSizes.map(p => p === "all" || p === 0 ? {
        text: getAllText(),
        value: 0
      } : {
        text: String(p),
        value: p
      });
    })();
  }

  get restAttributes() {
    var _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);

    return restProps;
  }

  componentWillUpdate(nextProps, nextState, context) {
    super.componentWillUpdate();

    if (this.props["pageSizes"] !== nextProps["pageSizes"]) {
      this.__getterCache["normalizedPageSizes"] = undefined;
    }
  }

  render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props),
      htmlRef: this.htmlRef,
      normalizedPageSizes: this.normalizedPageSizes,
      restAttributes: this.restAttributes
    });
  }

}
PageSizeSelector.defaultProps = PageSizeSelectorPropsType;