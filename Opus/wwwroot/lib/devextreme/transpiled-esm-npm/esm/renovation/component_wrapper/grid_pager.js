import Component from "./common/component";
export class GridPagerWrapper extends Component {
  _optionChanged(args) {
    switch (args.name) {
      case "pageIndex":
        {
          var pageIndexChanged = this.option("pageIndexChanged");

          if (pageIndexChanged) {
            pageIndexChanged(args.value);
          }

          break;
        }

      case "pageSize":
        {
          var pageSizeChanged = this.option("pageSizeChanged");

          if (pageSizeChanged) {
            pageSizeChanged(args.value);
          }

          break;
        }

      default:
        break;
    }

    super._optionChanged(args);
  }

}