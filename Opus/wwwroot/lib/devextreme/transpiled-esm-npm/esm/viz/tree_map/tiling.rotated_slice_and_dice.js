import { getAlgorithm, addAlgorithm } from './tiling';
var sliceAndDiceAlgorithm = getAlgorithm('sliceanddice');

function rotatedSliceAndDice(data) {
  data.isRotated = !data.isRotated;
  return sliceAndDiceAlgorithm.call(this, data);
}

addAlgorithm('rotatedsliceanddice', rotatedSliceAndDice);