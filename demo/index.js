import { html } from 'lit-html';
import { ArcDemoPage } from '@advanced-rest-client/arc-demo-helper/ArcDemoPage.js';
import '@advanced-rest-client/arc-demo-helper/arc-demo-helper.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
import './simple-menu.js';
import './simple-menubar.js';

class ComponentDemo extends ArcDemoPage {
  constructor() {
    super();
    this._componentName = 'anypoint-menu-mixin';
    this._mdHandler = this._mdHandler.bind(this);
    this.fruits = ['Apple', 'Apricot', 'Avocado',
      'Banana', 'Bilberry', 'Blackberry', 'Blackcurrant', 'Blueberry',
      'Boysenberry', 'Cantaloupe', 'Currant', 'Cherry', 'Cherimoya',
      'Cloudberry', 'Coconut', 'Cranberry', 'Damson', 'Date', 'Dragonfruit',
      'Durian', 'Elderberry', 'Feijoa', 'Fig', 'Goji berry', 'Gooseberry',
      'Grape', 'Grapefruit', 'Guava', 'Huckleberry', 'Jabuticaba', 'Jackfruit',
      'Jambul', 'Jujube', 'Juniper berry', 'Kiwi fruit', 'Kumquat', 'Lemon',
      'Lime', 'Loquat', 'Lychee', 'Mango', 'Marion berry', 'Melon', 'Miracle fruit',
      'Mulberry', 'Nectarine', 'Olive', 'Orange'
    ];
  }

  _mdHandler(e) {
    if (e.target.checked) {
      document.body.classList.add('material');
    } else {
      document.body.classList.remove('material');
    }
  }


  _headerControlsTemplate() {
    return html`<div class="settings-action-item">
      <paper-toggle-button @checked-changed="${this._darkThemeHandler}">Toggle dark theme</paper-toggle-button>
    </div>
    <div class="settings-action-item">
      <paper-toggle-button @checked-changed="${this._mdHandler}">Toggle material design</paper-toggle-button>
    </div>
    <div class="settings-action-item">
      <paper-toggle-button @checked-changed="${this._narrowHandler}">Toggle narrow attribute</paper-toggle-button>
    </div>
    <div class="settings-action-item">
      <paper-toggle-button checked @checked-changed="${this._stylesHandler}">Toggle styles</paper-toggle-button>
    </div>`;
  }

  contentTemplate() {
    return html`
      <div class="card">
        <h3>Simple menu</h3>
        <div class="horizontal-section">
          <simple-menu>
            <a href="javascript:void(0)" role="menuitem">Item 0</a>
            <a href="javascript:void(0)" role="menuitem">Item 1</a>
            <a href="javascript:void(0)" role="menuitem" disabled>Item 2</a>
            <a href="javascript:void(0)" role="menuitem" hidden>Ghost</a>
            <a href="javascript:void(0)" role="menuitem">Item 3</a>
            <a href="javascript:void(0)" role="menuitem" style="display:none">Another ghost</a>
          </simple-menu>
        </div>
      </div>

      <div class="card">
        <h3>Multi-select menu</h3>
        <div class="horizontal-section">
          <simple-menu multi>
            <a href="javascript:void(0)" role="menuitem">Item 0</a>
            <a href="javascript:void(0)" role="menuitem" disabled>Item 1</a>
            <a href="javascript:void(0)" role="menuitem" hidden>Ghost</a>
            <a href="javascript:void(0)" role="menuitem">Item 2</a>
            <a href="javascript:void(0)" role="menuitem">Item 3</a>
            <a href="javascript:void(0)" role="menuitem" style="display:none">Another ghost</a>
          </simple-menu>
        </div>
      </div>

      <div class="card">
        <h3>Auto focuses while typoing a name</h3>
        <simple-menu class="scrolled">
          ${this.fruits.map((item) => html`<anypoint-item role="menuitem">${item}</anypoint-item>`)}
        </simple-menu>
      </div>

      <div class="card">
        <div class="row">
          <h3>Simple menubar</h3>
          <div class="horizontal-section">
            <simple-menubar>
              <a href="javascript:void(0)" role="menuitem">Item 0</a>
              <a href="javascript:void(0)" role="menuitem">Item 1</a>
              <a href="javascript:void(0)" role="menuitem" disabled>Item 2</a>
              <a href="javascript:void(0)" role="menuitem">Item 3</a>
            </simple-menubar>
          </div>
        </div>

        <div class="row">
          <h3>Multi-select menubar</h3>
          <div class="horizontal-section">
            <simple-menubar multi>
              <a href="javascript:void(0)" role="menuitem">Item 0</a>
              <a href="javascript:void(0)" role="menuitem">Item 1</a>
              <a href="javascript:void(0)" role="menuitem">Item 2</a>
              <a href="javascript:void(0)" role="menuitem">Item 3</a>
            </simple-menubar>
          </div>
        </div>
      </div>
    `;
  }
}
const instance = new ComponentDemo();
instance.render();
window.demo = instance;
