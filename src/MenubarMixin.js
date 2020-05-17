import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { MenuMixin } from './MenuMixin.js';
/* eslint-disable no-plusplus */
/* eslint-disable no-continue */

/**
 * @param {typeof HTMLElement} base
 * @mixes MultiSelectableMixin
 */
const mxFunction = (base) => {
  class MenubarMixinImpl extends MenuMixin(base) {
    get _isRTL() {
      return window.getComputedStyle(this).direction === 'rtl';
    }

    connectedCallback() {
      /* istanbul ignore else */
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      if (this.getAttribute('role') === 'menu') {
        this.setAttribute('role', 'menubar');
      }
    }

    _onUpKey(e) {
      this.focusedItem.click();
      e.preventDefault();
    }

    _onDownKey(e) {
      this.focusedItem.click();
      e.preventDefault();
    }

    _onLeftKey(e) {
      if (this._isRTL) {
        this._focusNext();
      } else {
        this._focusPrevious();
      }
      e.preventDefault();
    }

    _onRightKey(e) {
      if (this._isRTL) {
        this._focusPrevious();
      } else {
        this._focusNext();
      }
      e.preventDefault();
    }

    _onKeydown(e) {
      if (e.key === 'ArrowLeft') {
        this._onLeftKey(e);
      } else if (e.key === 'ArrowRight') {
        this._onRightKey(e);
      } else {
        super._onKeydown(e);
      }
    }
  }
  return MenubarMixinImpl;
};

/**
 * Port of `@polymer/iron-menubar-behavior`.
 *
 * A mixin that implement accessible menubar.
 *
 * Note, by default the mixin works with LitElement. If used with different class
 * make sure that attributes are reflected to properties correctly.
 *
 * @mixin
 */
export const MenubarMixin = dedupeMixin(mxFunction);
