/**
 * Copyright Schrodinger, LLC
 */

"use strict";

const FakeObjectDataListStore = require('./helpers/FakeObjectDataListStore');
const { DateCell, ImageCell, LinkCell, TextCell } = require('./helpers/cells');
const { Table, Column, Cell } = require('fixed-data-table-2');
const React = require('react');

// wrapper over a DataList that allows you to specify custom index mapping
class DataListWrapper {
  constructor(indexMap, data) {
    this._indexMap = indexMap;
    this._data = data;
  }

  getSize() {
    return this._indexMap.length;
  }

  getObjectAt(index) {
    return this._data.getObjectAt(
      this._indexMap[index]
    );
  }
}

class FixedRowsExample extends React.Component {
  constructor(props) {
    super(props);

    const dataList = new FakeObjectDataListStore(1000000);
    const fixedRowsCount = 3;
    const topIndexMap = [];
    const bottomIndexMap = [];
    const middleIndexMap = [];

    let i = 0;
    while (i < fixedRowsCount) {
      topIndexMap.push(++i);
    }
    while (i < dataList.size - fixedRowsCount) {
      middleIndexMap.push(++i);
    }
    while (i < dataList.size) {
      bottomIndexMap.push(++i);
    }

    this.state = {
      headerDataList: new DataListWrapper([], dataList),
      topDataList: new DataListWrapper(topIndexMap, dataList),
      middleDataList: new DataListWrapper(middleIndexMap, dataList),
      bottomDataList: new DataListWrapper(bottomIndexMap, dataList),
      scrollLeft: 0,
    };
  }

  render() {
    const {
      headerDataList,
      topDataList,
      middleDataList,
      bottomDataList,
      scrollLeft,
    } = this.state;

    const totalTableHeight = this.props.height;
    const headerHeight = 50;
    const topTableHeight = topDataList.getSize() * 50;
    const bottomTableHeight = bottomDataList.getSize() * 50;
    const middleTableHeight = totalTableHeight - topTableHeight - bottomTableHeight - headerHeight;
    return (
      <div>
        {this.renderTable(headerDataList, {
          height: headerHeight,
          showScrollbarY: false,
          showScrollbarX: false,
          headerHeight,
          scrollLeft,
        })}
        {this.renderTable(topDataList, {
          height: topTableHeight,
          showScrollbarY: false,
          showScrollbarX: false,
          headerHeight: 0,
          scrollLeft,
        })}
        {this.renderTable(middleDataList, {
          height: middleTableHeight,
          showScrollbarX: false,
          headerHeight: 0,
          scrollLeft,
        })}
        {this.renderTable(bottomDataList, {
          height: bottomTableHeight,
          showScrollbarY: false,
          headerHeight: 0,
          onHorizontalScroll: this.onHorizontalScroll,
          scrollLeft,
        })}
      </div>
    );
  }

  renderTable(dataList, additionalProps={}) {
    return (
      <Table
        rowHeight={50}
        rowsCount={dataList.getSize()}
        width={500}
        {...this.props}
        {...additionalProps}
      >
        <Column
          columnKey="id"
          header={<Cell>Id</Cell>}
          cell={<TextCell data={dataList} />}
          fixed={true}
          width={100}
        />
        <Column
          columnKey="avatar"
          header={<Cell>Avatar</Cell>}
          cell={<ImageCell data={dataList} />}
          width={50}
        />
        <Column
          columnKey="firstName"
          header={<Cell>First Name</Cell>}
          cell={<LinkCell data={dataList} />}
          width={100}
        />
        <Column
          columnKey="lastName"
          header={<Cell>Last Name</Cell>}
          cell={<TextCell data={dataList} />}
          width={100}
        />
        <Column
          columnKey="city"
          header={<Cell>City</Cell>}
          cell={<TextCell data={dataList} />}
          width={250}
        />
        <Column
          columnKey="street"
          header={<Cell>Street</Cell>}
          cell={<TextCell data={dataList} />}
          width={250}
        />
        <Column
          columnKey="zipCode"
          header={<Cell>Zip Code</Cell>}
          cell={<TextCell data={dataList} />}
          width={100}
        />
        <Column
          columnKey="email"
          header={<Cell>Email</Cell>}
          cell={<LinkCell data={dataList} />}
          width={400}
        />
        <Column
          columnKey="date"
          header={<Cell>DOB</Cell>}
          cell={<DateCell data={dataList} />}
          width={200}
        />
        <Column
          columnKey="catchPhrase"
          header={<Cell>Catch Phrase</Cell>}
          cell={<TextCell data={dataList} />}
          width={200}
        />
        <Column
          columnKey="companyName"
          header={<Cell>Company Name</Cell>}
          cell={<TextCell data={dataList} />}
          width={200}
        />
        <Column
          columnKey="words"
          header={<Cell>Words</Cell>}
          cell={<TextCell data={dataList} />}
          width={200}
        />
        <Column
          columnKey="sentence"
          header={<Cell>Sentence</Cell>}
          cell={<TextCell data={dataList} />}
          width={200}
        />
      </Table>
    );
  }

  onHorizontalScroll = (scrollLeft) => {
    this.setState({ scrollLeft });
    return false;
  }
}

module.exports = FixedRowsExample;
