import { LitElement, html } from 'lit-element';
import { MenuMixin } from '../index.js';

class TestMenu extends MenuMixin(LitElement) {
  get extraContent() {
    return this.shadowRoot.querySelector('.extraContent');
  }

  render() {
    return html`
      <slot></slot>
      <div class="extraContent" tabindex="-1">focusable extra content</div>
    `;
  }
}
window.customElements.define('test-menu', TestMenu);
