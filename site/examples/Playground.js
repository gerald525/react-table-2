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

var ROWS = 1000000;

var ExampleImage = require('./ExampleImage');
var FakeObjectDataListStore = require('./FakeObjectDataListStore');

var FixedDataTable = require('fixed-data-table');
var React = require('react');

var PropTypes = React.PropTypes;
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;

function renderImage(/*string*/ cellData) {
  return <ExampleImage src={cellData} />;
}

function renderLink(/*string*/ cellData) {
  return <a href="#">{cellData}</a>;
}

function renderDate(/*object*/ cellData) {
  return <span>{cellData.toLocaleString()}</span>;
}

var dataList = new FakeObjectDataListStore(ROWS);

var ImageCell = React.createClass({
  propTypes: {
    dataKey: PropTypes.string
  },
  _getData() {
    if (this.props.rowIndex >= 0){
      return dataList.getObjectAt(this.props.rowIndex)[this.props.dataKey];
    }
    return '';
  },
  render() {
    return (
      <ExampleImage src={this._getData()} />
    )
  }
})

var MyHeaderCell = React.createClass({
  propTypes: {
    label: PropTypes.string.isRequired
  },
  render() {
    return (
      <div>{this.props.label}</div>
    )
  }
})

var TextCell = React.createClass({
  propTypes: {
    dataKey: PropTypes.string,
  },
  _getData() {
    if (this.props.rowIndex >= 0){
      return dataList.getObjectAt(this.props.rowIndex)[this.props.dataKey];
    }
  },
  render() {
    return (
      <div
        className="public_fixedDataTableCell_cellContent">
        {this._getData()}
      </div>
    )
  }
})

var ObjectDataExample = React.createClass({

  propTypes: {
    onContentDimensionsChange: PropTypes.func,
    left: PropTypes.number,
    top: PropTypes.number,
  },

  _onContentHeightChange(contentHeight) {
    this.props.onContentDimensionsChange &&
      this.props.onContentDimensionsChange(contentHeight, 1150);
  },

  render() {
    var controlledScrolling =
      this.props.left !== undefined || this.props.top !== undefined;

    return (
      <Table
        rowHeight={50}
        headerHeight={50}
        rowsCount={dataList.getSize()}
        width={this.props.tableWidth}
        height={this.props.tableHeight}
        onContentHeightChange={this._onContentHeightChange}
        scrollTop={this.props.top}
        scrollLeft={this.props.left}
        overflowX={controlledScrolling ? "hidden" : "auto"}
        overflowY={controlledScrolling ? "hidden" : "auto"}>
        <Column
          header={
            <MyHeaderCell label="Image" />
          }
          cell={
            <ImageCell dataKey="avartar" />
          }
          fixed={true}
          width={50}
        />
        <Column
          header={
            <MyHeaderCell label="First Name" />
          }
          cell={
            <TextCell dataKey="firstName" />
          }
          width={100}
        />
        <Column
          header={<MyHeaderCell label="First Name" />}
          cell={<TextCell dataKey="lastName" />}
          width={100}
        />
        <Column
          width={100}
          cell={<TextCell dataKey="city" />}
        />
        <Column
          width={100}
          cell={<TextCell dataKey="street" />}
        />
        <Column
          width={200}
          cell={<TextCell dataKey="zipCode" />}
        />
      </Table>
    );
  },
});

module.exports = ObjectDataExample;
