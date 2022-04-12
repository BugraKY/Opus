import { isDefined } from '../../../core/utils/type'; // Returns IPdfRowInfo[]
// [
//    {
//      rowType, - readonly
//      rowIndex, - readonly
//      indentLevel, - readonly
//      cells: [ - readonly
//        {
//          colSpan, - readonly (for internal use/hide from api/useless???)
//          rowSpan, - readonly (for internal use/hide from api/useless???)
//          gridCell, - readonly
//          pdfCell : {
//              text,
//              textColor: '#0000ff', // TODO: specify color format for docs
//              backgroundColor: '#0000ff', // TODO: specify color format for docs
//              verticalAlign: 'top' | 'bottom' | 'middle | undefined. Default value is middle
//              horizontalAlign: 'left' | 'right' | 'center' | undefined. Default value is left
//              wordWrapEnabled, // true | false. Default value is inherited from grid props,
//              drawRightBorder,
//              drawLeftBorder
//              drawTopBorder
//              drawBottomBorder
//          }
//        }
//      ],
//    }
// ]

function generateRowsInfo(dataProvider, dataGrid, headerBackgroundColor) {
  var result = [];
  var rowsCount = dataProvider.getRowsCount();
  var wordWrapEnabled = !!dataGrid.option('wordWrapEnabled');
  var columns = dataProvider.getColumns();

  for (var rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
    var rowType = dataProvider.getCellData(rowIndex, 0, true).cellSourceData.rowType;
    var indentLevel = rowType !== 'header' ? dataProvider.getGroupLevel(rowIndex) : 0;
    var previousRow = result[rowIndex - 1];

    if (rowType === 'groupFooter' && (previousRow === null || previousRow === void 0 ? void 0 : previousRow.rowType) === 'groupFooter') {
      indentLevel = previousRow.indentLevel - 1;
    }

    result.push({
      rowType: rowType,
      indentLevel,
      cells: generateRowCells({
        dataProvider,
        rowIndex,
        wordWrapEnabled,
        columns,
        rowType,
        backgroundColor: rowType === 'header' ? headerBackgroundColor : undefined
      }),
      rowIndex
    });
  }

  return result;
}

function generateRowCells(_ref) {
  var {
    dataProvider,
    rowIndex,
    wordWrapEnabled,
    columns,
    rowType,
    backgroundColor
  } = _ref;
  var result = [];

  for (var cellIndex = 0; cellIndex < columns.length; cellIndex++) {
    var _cellData$value, _columns$cellIndex$al;

    var cellData = dataProvider.getCellData(rowIndex, cellIndex, true);
    var cellInfo = {
      gridCell: cellData.cellSourceData,
      pdfCell: {
        text: (_cellData$value = cellData.value) === null || _cellData$value === void 0 ? void 0 : _cellData$value.toString(),
        verticalAlign: 'middle',
        horizontalAlign: (_columns$cellIndex$al = columns[cellIndex].alignment) !== null && _columns$cellIndex$al !== void 0 ? _columns$cellIndex$al : 'left',
        wordWrapEnabled,
        backgroundColor,
        padding: 0,
        _rect: {}
      }
    };

    if (rowType === 'header') {
      var cellMerging = dataProvider.getCellMerging(rowIndex, cellIndex);

      if (cellMerging && cellMerging.rowspan > 0) {
        cellInfo.rowSpan = cellMerging.rowspan;
      }

      if (cellMerging && cellMerging.colspan > 0) {
        cellInfo.colSpan = cellMerging.colspan;
      }
    } else if (rowType === 'group') {
      cellInfo.pdfCell.drawLeftBorder = cellIndex === 0;
      cellInfo.pdfCell.drawRightBorder = cellIndex === columns.length - 1;

      if (cellIndex > 0) {
        var isEmptyCellsExceptFirst = result.slice(1).reduce((accumulate, cellInfo) => {
          return accumulate && !isDefined(cellInfo.pdfCell.text);
        }, true);

        if (!isDefined(cellInfo.pdfCell.text) && isEmptyCellsExceptFirst) {
          result[0].pdfCell.drawRightBorder = true;

          for (var i = 0; i < result.length; i++) {
            result[i].colSpan = result.length;
          }

          cellInfo.colSpan = result.length;
        }
      }
    }

    result.push(cellInfo);
  }

  return result;
}

export { generateRowsInfo };