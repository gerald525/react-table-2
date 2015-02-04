/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FixedDataTableColumn.react
 * @typechecks
 */

var React = require('React');

var PropTypes = React.PropTypes;

/**
 * Component that defines the attributes of table column.
 */
var FixedDataTableColumn = React.createClass({
  statics: {
    __TableColumn__: true
  },

  propTypes: {
    /**
     * The horizontal alignment of the table cell content.
     */
    align: PropTypes.oneOf(['left', 'center', 'right']),

    /**
     * className for each of this column's data cells.
     */
    cellClassName: PropTypes.string,

    /**
     * The data cell renderer
     * `function(
     *   any_cellData,
     *   string_cellDataKey,
     *   object_rowData,
     *   number_rowIndex,
     *   any_columnData,
     *   number_width
     *)`
     * that returns React-renderable content for table cell.
     */
    cellRenderer: PropTypes.func,

    /**
     * The getter `function(string_cellDataKey, object_rowData)` that returns
     * the cell data for the `cellRenderer`.
     * If not provided, the cell data will be collected from
     * `rowData[cellDataKey]` instead. The value that `cellDataGetter` returns
     * will be used to determine whether the cell should re-render.
     */
    cellDataGetter: PropTypes.func,

    /**
     * The key to retrieve the cell data from the data row. Provided key type
     * must be either `string` or `number`. Since we use this
     * for keys, it must be specified for each column.
     */
    dataKey: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,

    /**
     * The header cell renderer
     * `function(
     *   any_cellData,
     *   string_cellDataKey,
     *   object_rowData,
     *   any_columnData
     *)`
     * that returns React-renderable content for table column header.
     */
    headerRenderer: PropTypes.func,

    /**
     * The footer cell renderer
     * `function(
     *   any_cellData,
     *   string_cellDataKey,
     *   object_rowData,
     *   any_columnData
     *)`
     * that returns React-renderable content for table column footer.
     */
    footerRenderer: PropTypes.func,

    /**
     * Bucket for any data to be passed into column renderer functions.
     */
    columnData: PropTypes.object,

    /**
     * The column's header label.
     */
    label: PropTypes.string,

    /**
     * The pixel width of the column.
     */
    width: PropTypes.number.isRequired,

    /**
     * If this is a resizable column this is its minimum pixel width.
     */
    minWidth: PropTypes.number,

    /**
     * If this is a resizable column this is its maximum pixel width.
     */
    maxWidth: PropTypes.number,

    /**
     * The grow factor relative to other columns. Same as the flex-grow API
     * from http://www.w3.org/TR/css3-flexbox/. Basically, take any available
     * extra width and distribute it proportionally according to all columns'
     * flexGrow values. Defaults to zero (no-flexing).
     */
    flexGrow: PropTypes.number,

    /**
     * Whether the column can be resized with the
     * FixedDataTableColumnResizeHandle. Please note that if a column
     * has a flex grow, once you resize the column this will be set to 0.
     */
    isResizable: PropTypes.bool,
  },

  render() {
    if (__DEV__) {
      throw new Error(
        'Component <FixedDataTableColumn /> should never render'
      );
    }
    return null;
  },
});

module.exports = FixedDataTableColumn;
