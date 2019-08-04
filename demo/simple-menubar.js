import { LitElement, html, css } from 'lit-element';
import { AnypointMenubarMixin } from '../anypoint-menubar-mixin.js';

class SimpleMenubar extends AnypointMenubarMixin(LitElement) {
  static get styles() {
    return css`:host > ::slotted(a) {
      display: inline-block;
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
window.customElements.define('simple-menubar', SimpleMenubar);
