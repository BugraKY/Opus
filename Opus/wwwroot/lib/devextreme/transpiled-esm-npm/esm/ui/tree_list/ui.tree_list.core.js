import { extend } from '../../core/utils/extend';
import modules from '../grid_core/ui.grid_core.modules';
export default extend({}, modules, {
  modules: [],
  foreachNodes: function foreachNodes(nodes, callBack, ignoreHasChildren) {
    for (var i = 0; i < nodes.length; i++) {
      if (callBack(nodes[i]) !== false && (ignoreHasChildren || nodes[i].hasChildren) && nodes[i].children.length) {
        this.foreachNodes(nodes[i].children, callBack, ignoreHasChildren);
      }
    }
  }
});