/**
 * Copyright Schrodinger, LLC
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * This is to be used with the FixedDataTable. It is a read line
 * that when you click on a column that is resizable appears and allows
 * you to resize the corresponding column.
 *
 * @providesModule FixedDataTableColumnResizeHandle
 * @typechecks
 */

import DOMMouseMoveTracker from 'DOMMouseMoveTracker';
import Locale from 'Locale';
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import ReactComponentWithPureRenderMixin from 'ReactComponentWithPureRenderMixin';

import clamp from 'clamp';
import cx from 'cx';

var FixedDataTableColumnResizeHandle = createReactClass({
  displayName: 'FixedDataTableColumnResizeHandle',
  mixins: [ReactComponentWithPureRenderMixin],

  propTypes: {
    visible: PropTypes.bool.isRequired,

    /**
     * This is the height of the line
     */
    height: PropTypes.number.isRequired,

    /**
     * Offset from left border of the table, please note
     * that the line is a border on diff. So this is really the
     * offset of the column itself.
     */
    leftOffset: PropTypes.number.isRequired,

    /**
     * Height of the clickable region of the line.
     * This is assumed to be at the top of the line.
     */
    knobHeight: PropTypes.number.isRequired,

    /**
     * The line is a border on a diff, so this is essentially
     * the width of column.
     */
    initialWidth: PropTypes.number,

    /**
     * The minimum width this dragger will collapse to
     */
    minWidth: PropTypes.number,

    /**
     * The maximum width this dragger will collapse to
     */
    maxWidth: PropTypes.number,

    /**
     * Initial click event on the header cell.
     */
    initialEvent: PropTypes.object,

    /**
     * When resizing is complete this is called.
     */
    onColumnResizeEnd: PropTypes.func,

    /**
     * Column key for the column being resized.
     */
    columnKey: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),

    /**
     * Whether the resize handle should respond to touch events or not.
     */
    touchEnabled: PropTypes.bool,
  },

  getInitialState() /*object*/ {
    return {
      width: 0,
      cursorDelta: 0
    };
  },

  componentWillReceiveProps(/*object*/ newProps) {
    if (newProps.initialEvent && !this._mouseMoveTracker.isDragging()) {
      this._mouseMoveTracker.captureMouseMoves(newProps.initialEvent);
      this.setState({
        width: newProps.initialWidth,
        cursorDelta: newProps.initialWidth
      });
    }
  },

  componentDidMount() {
    this._mouseMoveTracker = new DOMMouseMoveTracker(
      this._onMove,
      this._onColumnResizeEnd,
      document.body,
      this.props.touchEnabled
    );
  },

  componentWillUnmount() {
    this._mouseMoveTracker.releaseMouseMoves();
    this._mouseMoveTracker = null;
  },

  render() /*object*/ {
    var style = {
      width: this.state.width,
      height: this.props.height,
    };
    if (Locale.isRTL()) {
      style.right = this.props.leftOffset;
    } else {
      style.left = this.props.leftOffset;
    }
    return (
      <div
        className={cx({
          'fixedDataTableColumnResizerLineLayout/main': true,
          'fixedDataTableColumnResizerLineLayout/hiddenElem': !this.props.visible,
          'public/fixedDataTableColumnResizerLine/main': true,
        })}
        style={style}>
        <div
          className={cx('fixedDataTableColumnResizerLineLayout/mouseArea')}
          style={{height: this.props.height}}
        />
      </div>
    );
  },

  _onMove(/*number*/ deltaX) {
    if (Locale.isRTL()) {
      deltaX = -deltaX;
    }
    var newWidth = this.state.cursorDelta + deltaX;
    var newColumnWidth =
      clamp(newWidth, this.props.minWidth, this.props.maxWidth);

    // Please note cursor delta is the different between the currently width
    // and the new width.
    this.setState({
      width: newColumnWidth,
      cursorDelta: newWidth
    });
  },

  _onColumnResizeEnd() {
    this._mouseMoveTracker.releaseMouseMoves();
    this.props.onColumnResizeEnd(
      this.state.width,
      this.props.columnKey
    );
  },
});

module.exports = FixedDataTableColumnResizeHandle;
