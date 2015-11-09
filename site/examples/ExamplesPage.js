/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

"use strict";

var ExampleHeader = require('./ExampleHeader');
var ExamplesWrapper = require('./ExamplesWrapper');
var TouchExampleWrapper = require('./TouchExampleWrapper');
var React = require('react');
var Constants = require('../Constants');

var ExamplePages = Constants.ExamplePages;

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
    require('fixed-data-table/css/style/fixedDataTableRow.css');
    require('fixed-data-table/css/style/Scrollbar.css');

    switch (this.props.example) {
      case ExamplePages.OBJECT_DATA_EXAMPLE:
        var ObjectDataExample = require('./old/ObjectDataExample');
        return (
          <TouchExampleWrapper {...this.state}>
            <ObjectDataExample />
          </TouchExampleWrapper>
        );
      case ExamplePages.RESIZE_EXAMPLE:
        var ResizeExample = require('./old/ResizeExample');
        return (
          <TouchExampleWrapper {...this.state}>
            <ResizeExample />
          </TouchExampleWrapper>
        );
      case ExamplePages.FLEXGROW_EXAMPLE:
        var FlexGrowExample = require('./old/FlexGrowExample');
        return (
          <TouchExampleWrapper {...this.state}>
            <FlexGrowExample />
          </TouchExampleWrapper>
        );
      case ExamplePages.COLUMN_GROUPS_EXAMPLE:
        var ColumnGroupsExample = require('./old/ColumnGroupsExample');
        return (
          <TouchExampleWrapper {...this.state}>
            <ColumnGroupsExample />
          </TouchExampleWrapper>
        );
      case ExamplePages.FILTER_EXAMPLE:
        var FilterExample = require('./old/FilterExample');
        return (
          <TouchExampleWrapper {...this.state}>
            <FilterExample />
          </TouchExampleWrapper>
        );
      case ExamplePages.SORT_EXAMPLE:
        var SortExample = require('./old/SortExample');
        return (
          <TouchExampleWrapper {...this.state}>
            <SortExample />
          </TouchExampleWrapper>
        );
    }
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
