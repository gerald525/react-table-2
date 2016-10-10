/**
 * Copyright Schrodinger, LLC
 */

"use strict";

const FakeObjectDataListStore = require('./helpers/FakeObjectDataListStore');
const { TextCell } = require('./helpers/cells');
const { Table, Column, Cell } = require('fixed-data-table-2');
const React = require('react');

var SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
};

function reverseSortDirection(sortDir) {
  return sortDir === SortTypes.DESC ? SortTypes.ASC : SortTypes.DESC;
}

class SortHeaderCell extends React.Component {
  constructor(props) {
    super(props);

    this._onSortChange = this._onSortChange.bind(this);
  }

  render() {
    var {onSortChange, sortDir, children, ...props} = this.props;
    return (
      <Cell {...props}>
        <a onClick={this._onSortChange}>
          {children} {sortDir ? (sortDir === SortTypes.DESC ? '↓' : '↑') : ''}
        </a>
      </Cell>
    );
  }

  _onSortChange(e) {
    e.preventDefault();

    if (this.props.onSortChange) {
      this.props.onSortChange(
        this.props.columnKey,
        this.props.sortDir ?
          reverseSortDirection(this.props.sortDir) :
          SortTypes.DESC
      );
    }
  }
}

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
      this._indexMap[index],
    );
  }
}

class SortExample extends React.Component {
  constructor(props) {
    super(props);

    this._dataList = new FakeObjectDataListStore(2000);

    this._defaultSortIndexes = [];
    var size = this._dataList.getSize();
    for (var index = 0; index < size; index++) {
      this._defaultSortIndexes.push(index);
    }

    this.state = {
      sortedDataList: this._dataList,
      colSortDirs: {},
    };

    this._onSortChange = this._onSortChange.bind(this);
  }

  _onSortChange(columnKey, sortDir) {
    var sortIndexes = this._defaultSortIndexes.slice();
    sortIndexes.sort((indexA, indexB) => {
      var valueA = this._dataList.getObjectAt(indexA)[columnKey];
      var valueB = this._dataList.getObjectAt(indexB)[columnKey];
      var sortVal = 0;
      if (valueA > valueB) {
        sortVal = 1;
      }
      if (valueA < valueB) {
        sortVal = -1;
      }
      if (sortVal !== 0 && sortDir === SortTypes.ASC) {
        sortVal = sortVal * -1;
      }

      return sortVal;
    });

    this.setState({
      sortedDataList: new DataListWrapper(sortIndexes, this._dataList),
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  }

  render() {
    var {sortedDataList, colSortDirs} = this.state;
    return (
      <Table
        rowHeight={50}
        rowsCount={sortedDataList.getSize()}
        headerHeight={50}
        width={1000}
        height={500}
        {...this.props}>
        <Column
          columnKey="id"
          header={
            <SortHeaderCell
              onSortChange={this._onSortChange}
              sortDir={colSortDirs.id}>
              id
            </SortHeaderCell>
          }
          cell={<TextCell data={sortedDataList} />}
          width={100}
        />
        <Column
          columnKey="firstName"
          header={
            <SortHeaderCell
              onSortChange={this._onSortChange}
              sortDir={colSortDirs.firstName}>
              First Name
            </SortHeaderCell>
          }
          cell={<TextCell data={sortedDataList} />}
          width={200}
        />
        <Column
          columnKey="lastName"
          header={
            <SortHeaderCell
              onSortChange={this._onSortChange}
              sortDir={colSortDirs.lastName}>
              Last Name
            </SortHeaderCell>
          }
          cell={<TextCell data={sortedDataList} />}
          width={200}
        />
        <Column
          columnKey="city"
          header={
            <SortHeaderCell
              onSortChange={this._onSortChange}
              sortDir={colSortDirs.city}>
              City
            </SortHeaderCell>
          }
          cell={<TextCell data={sortedDataList} />}
          width={200}
        />
        <Column
          columnKey="companyName"
          header={
            <SortHeaderCell
              onSortChange={this._onSortChange}
              sortDir={colSortDirs.companyName}>
              Company Name
            </SortHeaderCell>
          }
          cell={<TextCell data={sortedDataList} />}
          width={200}
        />
      </Table>
    );
  }
}

module.exports = SortExample;
