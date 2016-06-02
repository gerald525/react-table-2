/**
 * Copyright Schrodinger, LLC
 */

"use strict";

// Require common FixedDataTable CSS.
require('fixed-data-table/css/layout/ScrollbarLayout.css');
require('fixed-data-table/css/layout/fixedDataTableLayout.css');
require('fixed-data-table/css/layout/fixedDataTableCellLayout.css');
require('fixed-data-table/css/layout/fixedDataTableCellGroupLayout.css');
require('fixed-data-table/css/layout/fixedDataTableColumnResizerLineLayout.css');
require('fixed-data-table/css/layout/fixedDataTableRowLayout.css');
require('fixed-data-table/css/style/fixedDataTable.css');
require('fixed-data-table/css/style/fixedDataTableCell.css');
require('fixed-data-table/css/style/fixedDataTableColumnResizerLine.css');
require('fixed-data-table/css/style/fixedDataTableColumnReorder.css');
require('fixed-data-table/css/style/fixedDataTableRow.css');
require('fixed-data-table/css/style/Scrollbar.css');

var ExampleHeader = require('./ExampleHeader');
var ExamplesWrapper = require('./ExamplesWrapper');
var TouchExampleWrapper = require('./TouchExampleWrapper');
var React = require('react');
var Constants = require('../Constants');

var ExamplePages = Constants.ExamplePages;

var EXAMPLE_COMPONENTS = {
  [ExamplePages.OBJECT_DATA_EXAMPLE.location]: require('../../examples/ObjectDataExample'),
  [ExamplePages.RESIZE_EXAMPLE.location]: require('../../examples/ResizeExample'),
  [ExamplePages.REORDER_EXAMPLE.location]: require('../../examples/ReorderExample'),
  [ExamplePages.HIDE_COLUMN_EXAMPLE.location]: require('../../examples/HideColumnExample'),
  [ExamplePages.SCROLL_TO_EXAMPLE.location]: require('../../examples/ScrollToExample'),
  [ExamplePages.COLLAPSE_EXAMPLE.location]: require('../../examples/CollapseExample'),
  [ExamplePages.FLEXGROW_EXAMPLE.location]: require('../../examples/FlexGrowExample'),
  [ExamplePages.COLUMN_GROUPS_EXAMPLE.location]: require('../../examples/ColumnGroupsExample'),
  [ExamplePages.PAGINATION_EXAMPLE.location]: require('../../examples/PaginationExample'),
  [ExamplePages.FILTER_EXAMPLE.location]: require('../../examples/FilterExample'),
  [ExamplePages.SORT_EXAMPLE.location]: require('../../examples/SortExample'),
};

// Render old examples
// var EXAMPLE_COMPONENTS_OLD = {
//   [ExamplePages.OBJECT_DATA_EXAMPLE.location]: require('../../examples/old/ObjectDataExample'),
//   [ExamplePages.RESIZE_EXAMPLE.location]: require('../../examples/old/ResizeExample'),
//   [ExamplePages.FLEXGROW_EXAMPLE.location]: require('../../examples/old/FlexGrowExample'),
//   [ExamplePages.COLUMN_GROUPS_EXAMPLE.location]: require('../../examples/old/ColumnGroupsExample'),
//   [ExamplePages.FILTER_EXAMPLE.location]: require('../../examples/old/FilterExample'),
//   [ExamplePages.SORT_EXAMPLE.location]: require('../../examples/old/SortExample'),
// };

var ExamplesPage = React.createClass({
  getInitialState() {
    return {
      renderPage: false
    };
  },

  render() {
    return (
      <ExamplesWrapper {...this.props}>
        <ExampleHeader {...this.props} />
        {this.state.renderPage && this._renderPage()}
      </ExamplesWrapper>
    );
  },

  _renderPage() {
    var Example = EXAMPLE_COMPONENTS[this.props.page.location];

    return (
      <TouchExampleWrapper {...this.state}>
        <Example />
      </TouchExampleWrapper>
    );
  },

  componentDidMount() {
    this._update();
    var win = window;
    if (win.addEventListener) {
      win.addEventListener('resize', this._onResize, false);
    } else if (win.attachEvent) {
      win.attachEvent('onresize', this._onResize);
    } else {
      win.onresize = this._onResize;
    }
  },

  _onResize() {
    clearTimeout(this._updateTimer);
    this._updateTimer = setTimeout(this._update, 16);
  },

  _update() {
    var win = window;

    var widthOffset = win.innerWidth < 680 ? 0 : 240;

    this.setState({
      renderPage: true,
      tableWidth: win.innerWidth - widthOffset,
      tableHeight: win.innerHeight - 200,
    });
  }
});

module.exports = ExamplesPage;
