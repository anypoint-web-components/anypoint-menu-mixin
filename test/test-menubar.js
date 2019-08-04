import { LitElement, html } from 'lit-element';
import { AnypointMenubarMixin } from '../anypoint-menubar-mixin.js';

class TestMenubar extends AnypointMenubarMixin(LitElement) {
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
window.customElements.define('test-menubar', TestMenubar);
