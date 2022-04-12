import _extends from "@babel/runtime/helpers/esm/extends";
import { BasePagerProps } from "./base_pager_props";
export var PagerProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(BasePagerProps), Object.getOwnPropertyDescriptors({
  defaultPageSize: 5,
  pageSizeChange: () => {},
  defaultPageIndex: 1,
  pageIndexChange: () => {}
})));
export var InternalPagerProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(BasePagerProps), Object.getOwnPropertyDescriptors({
  pageSize: 5,
  pageIndex: 1
})));