import { LitElement, html, css } from 'lit-element';
import { AnypointMenuMixin } from '../anypoint-menu-mixin.js';

class SimpleMenu extends AnypointMenuMixin(LitElement) {
  static get styles() {
    return css`:host > ::slotted(a) {
      display: block;
    }

    :host > ::slotted(.selected) {
      color: white;
      background-color: #2196F3;
    }

    :host > ::slotted([disabled]) {
      pointer-events: none;
    }`;
  }

  render() {
    return html`<slot></slot>`;
  }
}
window.customElements.define('simple-menu', SimpleMenu);
