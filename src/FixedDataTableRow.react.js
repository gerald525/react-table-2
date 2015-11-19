/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FixedDataTableRow.react
 * @typechecks
 */

'use strict';

var React = require('React');
var FixedDataTableCellGroup = require('FixedDataTableCellGroup.react');

var cx = require('cx');
var joinClasses = require('joinClasses');
var translateDOMPositionXY = require('FixedDataTableTranslateDOMPosition');

var {PropTypes} = React;

/**
 * Component that renders the row for <FixedDataTable />.
 * This component should not be used directly by developer. Instead,
 * only <FixedDataTable /> should use the component internally.
 */
var FixedDataTableRowImpl = React.createClass({

  propTypes: {

    isScrolling: PropTypes.bool,

    /**
     * Array of <FixedDataTableColumn /> for the fixed columns.
     */
    fixedColumns: PropTypes.array.isRequired,

    /**
     * Height of the row.
     */
    height: PropTypes.number.isRequired,

    /**
     * The row index.
     */
    index: PropTypes.number.isRequired,

    /**
     * Array of <FixedDataTableColumn /> for the scrollable columns.
     */
    scrollableColumns: PropTypes.array.isRequired,

    /**
     * The distance between the left edge of the table and the leftmost portion
     * of the row currently visible in the table.
     */
    scrollLeft: PropTypes.number.isRequired,

    /**
     * Width of the row.
     */
    width: PropTypes.number.isRequired,

    /**
     * Fire when a row is clicked.
     */
    onClick: PropTypes.func,

    /**
     * Fire when a row is double clicked.
     */
    onDoubleClick: PropTypes.func,

    /**
     * Callback for when resizer knob (in FixedDataTableCell) is clicked
     * to initialize resizing. Please note this is only on the cells
     * in the header.
     * @param number combinedWidth
     * @param number leftOffset
     * @param number cellWidth
     * @param number|string columnKey
     * @param object event
     */
    onColumnResize: PropTypes.func,
  },

  render() /*object*/ {
    var style = {
      width: this.props.width,
      height: this.props.height,
    };

    var className = cx({
      'fixedDataTableRowLayout/main': true,
      'public/fixedDataTableRow/main': true,
      'public/fixedDataTableRow/highlighted': (this.props.index % 2 === 1),
      'public/fixedDataTableRow/odd': (this.props.index % 2 === 1),
      'public/fixedDataTableRow/even': (this.props.index % 2 === 0),
    });

    var fixedColumnsWidth = this._getColumnsWidth(this.props.fixedColumns);
    var fixedColumns =
      <FixedDataTableCellGroup
        key="fixed_cells"
        isScrolling={this.props.isScrolling}
        height={this.props.height}
        left={0}
        width={fixedColumnsWidth}
        zIndex={2}
        columns={this.props.fixedColumns}
        onColumnResize={this.props.onColumnResize}
        rowHeight={this.props.height}
        rowIndex={this.props.index}
      />;
    var columnsShadow = this._renderColumnsShadow(fixedColumnsWidth);
    var scrollableColumns =
      <FixedDataTableCellGroup
        key="scrollable_cells"
        isScrolling={this.props.isScrolling}
        height={this.props.height}
        left={this.props.scrollLeft}
        offsetLeft={fixedColumnsWidth}
        width={this.props.width - fixedColumnsWidth}
        zIndex={0}
        columns={this.props.scrollableColumns}
        onColumnResize={this.props.onColumnResize}
        rowHeight={this.props.height}
        rowIndex={this.props.index}
      />;

    return (
      <div
        className={joinClasses(className, this.props.className)}
        onClick={this.props.onClick ? this._onClick : null}
        onDoubleClick={this.props.onDoubleClick ? this._onDoubleClick : null}
        onMouseDown={this.props.onMouseDown ? this._onMouseDown : null}
        onMouseEnter={this.props.onMouseEnter ? this._onMouseEnter : null}
        onMouseLeave={this.props.onMouseLeave ? this._onMouseLeave : null}
        style={style}>
        <div className={cx('fixedDataTableRowLayout/body')}>
          {fixedColumns}
          {scrollableColumns}
          {columnsShadow}
        </div>
      </div>
    );
  },

  _getColumnsWidth(/*array*/ columns) /*number*/ {
    var width = 0;
    for (var i = 0; i < columns.length; ++i) {
      width += columns[i].props.width;
    }
    return width;
  },

  _renderColumnsShadow(/*number*/ left) /*?object*/ {
    if (left > 0) {
      var className = cx({
        'fixedDataTableRowLayout/fixedColumnsDivider': true,
        'fixedDataTableRowLayout/columnsShadow': this.props.scrollLeft > 0,
        'public/fixedDataTableRow/fixedColumnsDivider': true,
        'public/fixedDataTableRow/columnsShadow': this.props.scrollLeft > 0,
      });
      var style = {
        left: left,
        height: this.props.height
      };
      return <div className={className} style={style} />;
    }
  },

  _onClick(/*object*/ event) {
    this.props.onClick(event, this.props.index);
  },

  _onDoubleClick(/*object*/ event) {
    this.props.onDoubleClick(event, this.props.index);
  },

  _onMouseDown(/*object*/ event) {
    this.props.onMouseDown(event, this.props.index);
  },

  _onMouseEnter(/*object*/ event) {
    this.props.onMouseEnter(event, this.props.index);
  },

  _onMouseLeave(/*object*/ event) {
    this.props.onMouseLeave(event, this.props.index);
  },
});

var FixedDataTableRow = React.createClass({

  propTypes: {

    isScrolling: PropTypes.bool,

    /**
     * Height of the row.
     */
    height: PropTypes.number.isRequired,

    /**
     * Z-index on which the row will be displayed. Used e.g. for keeping
     * header and footer in front of other rows.
     */
    zIndex: PropTypes.number,

    /**
     * The vertical position where the row should render itself
     */
    offsetTop: PropTypes.number.isRequired,

    /**
     * Width of the row.
     */
    width: PropTypes.number.isRequired,
  },

  componentWillMount() {
    this._initialRender = true;
  },

  componentDidMount() {
    this._initialRender = false;
  },

  render() /*object*/ {
    var style = {
      width: this.props.width,
      height: this.props.height,
      zIndex: (this.props.zIndex ? this.props.zIndex : 0),
    };
    translateDOMPositionXY(style, 0, this.props.offsetTop, this._initialRender);

    return (
      <div
        style={style}
        className={cx('fixedDataTableRowLayout/rowWrapper')}>
        <FixedDataTableRowImpl
          {...this.props}
          offsetTop={undefined}
          zIndex={undefined}
        />
      </div>
    );
  },
});


module.exports = FixedDataTableRow;
