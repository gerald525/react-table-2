/**
 * Copyright Schrodinger, LLC
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * This is utility that handles onWheel events and calls provided wheel
 * callback with correct frame rate.
 *
 * @providesModule ReactWheelHandler
 * @typechecks
 */

'use strict';

import emptyFunction from 'emptyFunction';
import normalizeWheel from 'normalizeWheel';
import requestAnimationFramePolyfill from 'requestAnimationFramePolyfill';

class ReactWheelHandler {
  /**
   * onWheel is the callback that will be called with right frame rate if
   * any wheel events happened
   * onWheel should is to be called with two arguments: deltaX and deltaY in
   * this order
   */
  constructor(
    /*function*/ onWheel,
    /*boolean|function*/ handleScrollX,
    /*boolean|function*/ handleScrollY,
    /*?boolean|?function*/ stopPropagation
  ) {
    this._animationFrameID = null;
    this._deltaX = 0;
    this._deltaY = 0;
    this._didWheel = this._didWheel.bind(this);
    this._rootRef = null;
    if (typeof handleScrollX !== 'function') {
      handleScrollX = handleScrollX ?
        emptyFunction.thatReturnsTrue :
        emptyFunction.thatReturnsFalse;
    }

    if (typeof handleScrollY !== 'function') {
      handleScrollY = handleScrollY ?
        emptyFunction.thatReturnsTrue :
        emptyFunction.thatReturnsFalse;
    }

    if (typeof stopPropagation !== 'function') {
      stopPropagation = stopPropagation ?
        emptyFunction.thatReturnsTrue :
        emptyFunction.thatReturnsFalse;
    }

    this._handleScrollX = handleScrollX;
    this._handleScrollY = handleScrollY;
    this._stopPropagation = stopPropagation;
    this._onWheelCallback = onWheel;
    this.onWheel = this.onWheel.bind(this);
  }

  contains(target) {
    var parent = target;
    while (parent != document.body) {
      if (parent === this._rootRef) {
        return true;
      }
      parent = parent.parentNode;
    }
    return false;
  }

  onWheel(/*object*/ event) {
    var normalizedEvent = normalizeWheel(event);

    // if shift is held, swap the axis of scrolling.
    if (event.shiftKey) {
      normalizedEvent = this._swapNormalizedWheelAxis(normalizedEvent);
    }

    var deltaX = this._deltaX + normalizedEvent.pixelX;
    var deltaY = this._deltaY + normalizedEvent.pixelY;
    var handleScrollX = this._handleScrollX(deltaX, deltaY);
    var handleScrollY = this._handleScrollY(deltaY, deltaX);
    if (!handleScrollX && !handleScrollY) {
      return;
    }

    if (this._rootRef && !this.contains(event.target)) {
      return;
    }

    this._deltaX += handleScrollX ? normalizedEvent.pixelX : 0;
    this._deltaY += handleScrollY ? normalizedEvent.pixelY : 0;
    event.preventDefault();

    var changed;
    if (this._deltaX !== 0 || this._deltaY !== 0) {
      if (this._stopPropagation()) {
        event.stopPropagation();
      }
      changed = true;
    }

    if (changed === true && this._animationFrameID === null) {
      this._animationFrameID = requestAnimationFramePolyfill(this._didWheel);
    }
  }

  setRoot(rootRef) {
    this._rootRef = rootRef;
  }

  _didWheel() {
    this._animationFrameID = null;
    this._onWheelCallback(this._deltaX, this._deltaY);
    this._deltaX = 0;
    this._deltaY = 0;
  }

  _swapNormalizedWheelAxis(/*object*/normalizedEvent) /*object*/{
    return {
      spinX: normalizedEvent.spinY,
      spinY: normalizedEvent.spinX,
      pixelX: normalizedEvent.pixelY,
      pixelY: normalizedEvent.pixelX,
    };
  }
}

module.exports = ReactWheelHandler;
