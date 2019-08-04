import { fixture, assert, aTimeout, nextFrame } from '@open-wc/testing';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import './test-menu.js';
import './test-nested-menu.js';

const style = document.createElement('style');
style.innerHTML = `.ghost, [hidden] {
  display: none;
}
.invisible {
  visibility: hidden;
}`;
document.head.appendChild(style);

describe('AnypointMenuMixin', () => {
  async function basicFixture() {
    return await fixture(`<test-menu>
      <div role="menuitem">item 1</div>
      <div role="menuitem">item 2</div>
      <div role="menuitem">item 3</div>
    </test-menu>`);
  }

  async function singleItenFixture() {
    return await fixture(`<test-menu>
      <div>item 1</div>
    </test-menu>`);
  }

  async function disabledFixture() {
    return await fixture(`<test-menu>
      <div>a item 1</div>
      <div disabled>item 2</div>
      <div>b item 3</div>
      <div disabled>c item 4</div>
    </test-menu>`);
  }

  async function invisibleFixture() {
    return await fixture(`<test-menu>
      <div>item 1</div>
      <div hidden>item 2</div>
      <div class="ghost">item 3</div>
      <div class="invisible">item 3.1</div>
      <div>item 4</div>
      <div hidden>item 5</div>
      <div class="ghost">item 6</div>
    </test-menu>`);
  }

  async function nestedInvisibleFixture() {
    return await fixture(`
      <test-nested-menu>
      </test-nested-menu>
  `);
  }

  async function onlyDisabledFixture() {
    return await fixture(`<test-menu>
      <div disabled>disabled item</div>
    </test-menu>`);
  }

  async function multiFixture() {
    return await fixture(`<test-menu multi>
      <div>item 1</div>
      <div>item 2</div>
      <div>item 3</div>
    </test-menu>`);
  }

  async function nestedFixture() {
    return await fixture(`<test-menu>
      <test-menu>
        <div>item 1</div>
        <div>item 2</div>
        <div>item 3</div>
      </test-menu>
    </test-menu>`);
  }

  async function emptyFixture() {
    return await fixture(`<test-menu></test-menu>`);
  }

  async function disabledGroupAndOptionsFixture() {
    return await fixture(`<test-menu disabled>
      <div disabled>one</div>
      <div disabled>two</div>
    </test-menu>`);
  }

  async function nonzeroTabindexFixture() {
    return await fixture(`<test-menu tabindex="32">
      <div disabled>one</div>
      <div disabled>two</div>
    </test-menu>`);
  }

  async function countriesFixture() {
    return await fixture(`<test-menu>
      <div>Ghana</div>
      <div>Uganda</div>
    </test-menu>`);
  }

  async function bogusAttrForItemTitleFixture() {
    return await fixture(`<test-menu attrforitemtitle="totally-doesnt-exist">
      <div>Focused by default</div>
      <div>I'm not entitled!</div>
    </test-menu>`);
  }

  async function useAriaSelectedFixture() {
    return await fixture(`<test-menu useariaselected>
      <div>item 1</div>
      <div>item 2</div>
    </test-menu>`);
  }

  describe('menu keyboard tests', async () => {
    it('menu has role="menu"', async () => {
      const menu = await basicFixture();
      assert.equal(menu.getAttribute('role'), 'menu', 'has role="menu"');
    });

    it('first item gets focus when menu is focused', async () => {
      const menu = await basicFixture();
      MockInteractions.focus(menu);
      await aTimeout();
      const ownerRoot = (menu.firstElementChild.getRootNode && menu.firstElementChild.getRootNode()) || document;
      const activeElement = ownerRoot.activeElement;
      assert.equal(activeElement, menu.firstElementChild, 'menu.firstElementChild is focused');
    });

    it('first item gets focus when menu is focused in a single item menu', async () => {
      const menu = await singleItenFixture();
      MockInteractions.focus(menu);
      await aTimeout();
      const ownerRoot = (menu.firstElementChild.getRootNode && menu.firstElementChild.getRootNode()) || document;
      let activeElement = ownerRoot.activeElement;
      assert.equal(activeElement, menu.firstElementChild, 'menu.firstElementChild is focused');
    });

    it('selected item gets focus when menu is focused', async () => {
      const menu = await basicFixture();
      menu.selected = 1;
      MockInteractions.focus(menu);
      await aTimeout();
      const ownerRoot = (menu.selectedItem.getRootNode && menu.selectedItem.getRootNode()) || document;
      let activeElement = ownerRoot.activeElement;
      assert.equal(activeElement, menu.selectedItem, 'menu.selectedItem is focused');
    });

    it('focusing on next item skips disabled items', async () => {
      const menu = await disabledFixture();
      MockInteractions.focus(menu);
      await aTimeout();
      // Key press down
      MockInteractions.keyDownOn(menu, 40, [], 'ArrowDown');
      await aTimeout();
      const focusedItem = menu.focusedItem;
      assert.equal(focusedItem, menu.items[2], 'menu.items[2] is focused');
    });

    it('focusing on next item skips invisible items', async () => {
      const menu = await invisibleFixture();
      MockInteractions.focus(menu);
      await aTimeout();
      // Key press down
      MockInteractions.keyDownOn(menu, 40, [], 'ArrowDown');
      await aTimeout();
      const focusedItem = menu.focusedItem;
      assert.equal(focusedItem, menu.items[4], 'menu.items[4] is focused');
    });

    it('focusing on next item skips nested invisible items', async () => {
      const nestedMenu = await nestedInvisibleFixture();
      await aTimeout();
      const menu = nestedMenu.actualMenu;
      MockInteractions.focus(menu);
      // Wait for async focus
      await aTimeout();
      // Key press down
      MockInteractions.keyDownOn(menu, 40, [], 'ArrowDown');
      await aTimeout();
      const focusedItem = menu.focusedItem;
      assert.equal(focusedItem, menu.items[4], 'menu.items[4] is focused');
    });

    it('focusing on next item in empty menu', async () => {
      // This menu will not dispatch an 'iron-items-changed' event.
      const menu = await emptyFixture();
      MockInteractions.focus(menu);
      // Wait for async focus
      await aTimeout();
      // Key press down
      MockInteractions.keyDownOn(menu, 40, [], 'ArrowDown');
      await aTimeout();
      const focusedItem = menu.focusedItem;
      assert.equal(focusedItem, undefined, 'no focused item');
    });

    it('focusing on next item in all disabled menu', async () => {
      const menu = await onlyDisabledFixture();
      MockInteractions.focus(menu);
      // Wait for async focus
      await aTimeout();
      MockInteractions.keyDownOn(menu, 40, [], 'ArrowDown');
      await aTimeout();
      const focusedItem = menu.focusedItem;
      assert.equal(focusedItem, undefined, 'no focused item');
    });

    it('focusing on previous item skips disabled items', async () => {
      const menu = await disabledFixture();
      MockInteractions.focus(menu);
      // Wait for async focus
      await aTimeout();
      // Key press up
      MockInteractions.keyDownOn(menu, 38, [], 'ArrowUp');
      await aTimeout();
      const focusedItem = menu.focusedItem;
      assert.equal(focusedItem, menu.items[2], 'menu.items[2] is focused');
    });

    it('focusing on previous item skips invisible items', async () => {
      const menu = await invisibleFixture();
      MockInteractions.focus(menu);
      // Wait for async focus
      await aTimeout();
      // Key press up
      MockInteractions.keyDownOn(menu, 38, [], 'ArrowUp');
      await aTimeout();
      const focusedItem = menu.focusedItem;
      assert.equal(focusedItem, menu.items[4], 'menu.items[4] is focused');
    });

    it('focusing on previous item skips nested invisible items', async () => {
      const nestedMenu = await nestedInvisibleFixture();
      const menu = nestedMenu.actualMenu;
      MockInteractions.focus(menu);
      // Wait for async focus
      await aTimeout();
      // Key press up
      MockInteractions.keyDownOn(menu, 38, [], 'ArrowUp');
      await aTimeout();
      const focusedItem = menu.focusedItem;
      assert.equal(focusedItem, menu.items[4], 'menu.items[4] is focused');
    });

    it('focusing on previous item in empty menu', async () => {
      // This menu will not dispatch an 'iron-items-changed' event.
      const menu = await emptyFixture();
      MockInteractions.focus(menu);
      // Wait for async focus
      await aTimeout();
      // Key press up
      MockInteractions.keyDownOn(menu, 38, [], 'ArrowUp');
      await aTimeout();
      const focusedItem = menu.focusedItem;
      assert.equal(focusedItem, undefined, 'no focused item');
    });

    it('focusing on previous item in all disabled menu', async () => {
      const menu = await onlyDisabledFixture();
      await aTimeout();
      MockInteractions.focus(menu);
      // Wait for async focus
      await aTimeout();
      // Key press up
      MockInteractions.keyDownOn(menu, 38, [], 'ArrowUp');
      await aTimeout();
      const focusedItem = menu.focusedItem;
      assert.equal(focusedItem, undefined, 'no focused item');
    });

    it('focusing on item using key press skips disabled items', async () => {
      const menu = await disabledFixture();
      MockInteractions.focus(menu);
      // Wait for async focus
      await aTimeout();
      // Key press 'b'
      MockInteractions.keyDownOn(menu, 66, [], 'b');
      await aTimeout();
      const focusedItem = menu.focusedItem;
      assert.equal(focusedItem, menu.items[2], 'menu.items[2] is focused');
    });

    it('focusing on item using key press ignores disabled items', async () => {
      const menu = await disabledFixture();
      await aTimeout();
      MockInteractions.focus(menu);
      // Wait for async focus
      await aTimeout();
      // Key press 'c'
      MockInteractions.keyDownOn(menu, 67, [], 'c');
      await aTimeout();
      const focusedItem = menu.focusedItem;
      assert.equal(focusedItem, menu.items[0], 'menu.items[0] is focused');
    });

    it('focusing on item using key press in all disabled items', async () => {
      const menu = await onlyDisabledFixture();
      MockInteractions.focus(menu);
      // Wait for async focus
      await aTimeout();
      // Key press 'c'
      MockInteractions.keyDownOn(menu, 67, [], 'c');
      await aTimeout();
      const focusedItem = menu.focusedItem;
      assert.equal(focusedItem, undefined, 'no focused item');
    });

    it('focusing on item with multi-char, quick input', async () => {
      const menu = await countriesFixture();
      MockInteractions.focus(menu);
      // Wait for async focus
      await aTimeout();
      // Key press 'u'
      MockInteractions.keyDownOn(menu, 85, [], 'u');
      // Key press 'g'
      MockInteractions.keyDownOn(menu, 71, [], 'g');
      await aTimeout();
      const focusedItem = menu.focusedItem;
      assert.equal(focusedItem, menu.items[1], 'menu.items[1] is focused');
    });

    it('focusing on item with multi-char ignoring modifier keys, quick input', async () => {
      const menu = await countriesFixture();
      MockInteractions.focus(menu);
      // Wait for async focus
      await aTimeout();
      // Key press 'u'
      MockInteractions.keyDownOn(menu, 85, [], 'u');
      // Key press 'Alt', should be ignored.
      MockInteractions.keyDownOn(menu, 18, [], 'Alt');
      // Key press 'Caps Lock', should be ignored.
      MockInteractions.keyDownOn(menu, 20, [], 'CapsLock');
      // Key press 'Control', should be ignored.
      MockInteractions.keyDownOn(menu, 17, [], 'Control');
      // Key press 'Num Lock', should be ignored.
      MockInteractions.keyDownOn(menu, 144, [], 'NumLock');
      // Key press 'Scroll Lock', should be ignored.
      MockInteractions.keyDownOn(menu, 145, [], 'ScrollLock');
      // Key press 'Shift', should be ignored.
      MockInteractions.keyDownOn(menu, 16, [], 'Shift');
      // Key press 'g'
      MockInteractions.keyDownOn(menu, 71, [], 'g');
      await aTimeout();
      const focusedItem = menu.focusedItem;
      assert.equal(focusedItem, menu.items[1], 'menu.items[1] is focused');
    });

    it('focusing on item with bogus attr-for-item-title', async () => {
      const menu = await bogusAttrForItemTitleFixture();
      MockInteractions.focus(menu);
      // Wait for async focus
      await aTimeout();
      // Key press 'i'
      MockInteractions.keyDownOn(menu, 73, [], 'i');
      await aTimeout();
      const focusedItem = menu.focusedItem;
      assert.equal(focusedItem, menu.items[0], 'menu.items[0] is still focused');
    });

    it('focusing non-item content does not auto-focus an item', async () => {
      const menu = await basicFixture();
      menu.extraContent.focus();
      await aTimeout();
      const menuOwnerRoot = (menu.extraContent.getRootNode && menu.extraContent.getRootNode()) || document;
      const menuActiveElement = menuOwnerRoot.activeElement;
      assert.equal(menuActiveElement, menu.extraContent, 'menu.extraContent is focused');
      assert.equal(document.activeElement, menu, 'menu is document.activeElement');
    });

    it('last activated item in a multi select menu is focused', async () => {
      const menu = await multiFixture();
      menu.selected = 0;
      menu.items[1].click();
      await aTimeout();
      const ownerRoot = (menu.items[1].getRootNode && menu.items[1].getRootNode()) || document;
      const activeElement = ownerRoot.activeElement;
      assert.equal(activeElement, menu.items[1], 'menu.items[1] is focused');
    });

    it('deselection in a multi select menu focuses deselected item', async () => {
      const menu = await multiFixture();
      menu.selected = 0;
      menu.items[0].click();
      await aTimeout();
      const ownerRoot = (menu.items[0].getRootNode && menu.items[0].getRootNode()) || document;
      const activeElement = ownerRoot.activeElement;
      assert.equal(activeElement, menu.items[0], 'menu.items[0] is focused');
    });

    it('keyboard events should not bubble', async () => {
      const menu = await nestedFixture();
      let keyCounter = 0;
      menu.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
          keyCounter++;
        }
        if (event.key === 'ArrowUp') {
          keyCounter++;
        }
        if (event.key === 'ArrowDown') {
          keyCounter++;
        }
      });
      // up
      MockInteractions.keyDownOn(menu.firstElementChild, 38, [], 'ArrowUp');
      // down
      MockInteractions.keyDownOn(menu.firstElementChild, 40, [], 'ArrowDown');
      // esc
      MockInteractions.keyDownOn(menu.firstElementChild, 27, [], 'Escape');
      await aTimeout();
      assert.equal(menu.firstElementChild.tagName, 'TEST-MENU');
      assert.equal(keyCounter, 0);
    });

    it('empty menus do not unfocus themselves', async () => {
      // This menu will not dispatch an 'iron-items-changed' event.
      const menu = await emptyFixture();
      menu.focus();
      await aTimeout();
      assert.equal(document.activeElement, menu);
    });

    it('A disabled menu should not be focusable', async () => {
      const menu = await disabledGroupAndOptionsFixture();
      menu.focus();
      await aTimeout();
      assert.notEqual(document.activeElement, menu);
      assert.notEqual(document.activeElement, menu.items[0]);
      assert.notEqual(document.activeElement, menu.items[1]);
    });

    it('A disabled menu will not have a tab index.', async () => {
      const menu = await countriesFixture();
      assert.equal(menu.getAttribute('tabindex'), '0');
      menu.disabled = true;
      assert.equal(menu.getAttribute('tabindex'), null);
      menu.disabled = false;
      assert.equal(menu.getAttribute('tabindex'), '0');
    });

    it('Updated tab index of disabled element should remain.', async () => {
      const menu = await countriesFixture();
      assert.equal(menu.getAttribute('tabindex'), '0');
      menu.disabled = true;
      assert.equal(menu.getAttribute('tabindex'), null);
      menu.setAttribute('tabindex', 15);
      assert.equal(menu.getAttribute('tabindex'), '15');
      menu.disabled = false;
      assert.equal(menu.getAttribute('tabindex'), '15');
    });

    it('A disabled menu will regain its non-zero tab index when re-enabled.', async () => {
      const menu = await nonzeroTabindexFixture();
      assert.equal(menu.getAttribute('tabindex'), '32');
      menu.disabled = true;
      assert.equal(menu.getAttribute('tabindex'), null);
      menu.disabled = false;
      assert.equal(menu.getAttribute('tabindex'), '32');
    });

    it('`tabIndex` properties of all items are updated when items change', async () => {
      const menu = await basicFixture();
      function assertTabIndexCounts(nodes, expected) {
        let tabIndexCounts = {};
        for (let i = 0; i < nodes.length; i++) {
          let tabIndex = nodes[i].tabIndex;
          if (tabIndexCounts[tabIndex]) {
            tabIndexCounts[tabIndex]++;
          } else {
            tabIndexCounts[tabIndex] = 1;
          }
        }
        assert.equal(Object.keys(tabIndexCounts).length, Object.keys(expected).length);
        Object.keys(expected).forEach(function(key) {
          assert.equal(tabIndexCounts[key], expected[key]);
        });
      }
      function divWithTabIndex(tabIndex) {
        let div = document.createElement('div');
        div.tabIndex = tabIndex;
        return div;
      }
      // Only the selected item will have tabIndex 0.
      menu.select(0);
      assertTabIndexCounts(menu.items, { '-1': 2, '0': 1 });
      menu.appendChild(divWithTabIndex(1));
      menu.appendChild(divWithTabIndex(2));
      menu.appendChild(divWithTabIndex(3));
      await nextFrame();
      // Async wait for `observeNodes`.
      await aTimeout();
      assertTabIndexCounts(menu.items, { '-1': 5, '0': 1 });
    });

    it('shift+tab removes focus', async () => {
      const menu = await countriesFixture();
      MockInteractions.focus(menu);
      // Wait for async focus
      await aTimeout();
      // Key press 'Tab'
      MockInteractions.keyDownOn(menu, 9, ['shift'], 'Tab');
      assert.equal(menu.getAttribute('tabindex'), '-1');
      assert.isTrue(menu._shiftTabPressed);
      assert.equal(menu._focusedItem, null);
      await aTimeout(1);
      assert.isFalse(menu._shiftTabPressed);
      assert.equal(menu.getAttribute('tabindex'), '0');
    });

    it('sets default aria-selected on children', async () => {
      const menu = await useAriaSelectedFixture();
      const nodes = menu.querySelectorAll('div');
      for (let i = 0; i < nodes.length; i++) {
        assert.equal(nodes[i].getAttribute('aria-selected'), 'false');
      }
    });

    it('updates aria-selected when selection is made', async () => {
      const menu = await useAriaSelectedFixture();
      menu.select(0);
      await aTimeout();
      const nodes = menu.querySelectorAll('div');
      assert.equal(nodes[0].getAttribute('aria-selected'), 'true', '1st node has aria-selected = true');
      assert.equal(nodes[1].getAttribute('aria-selected'), 'false', '2nd node has aria-selected = false');
    });

    it('updates aria-selected when another selection is made', async () => {
      const menu = await useAriaSelectedFixture();
      menu.select(0);
      await aTimeout();
      menu.select(1);
      await aTimeout();
      const nodes = menu.querySelectorAll('div');
      assert.equal(nodes[0].getAttribute('aria-selected'), 'false', '1st node has aria-selected = false');
      assert.equal(nodes[1].getAttribute('aria-selected'), 'true', '2nd node has aria-selected = true');
    });
  });

  describe('_clearSearchText()', () => {
    let menu;
    beforeEach(async () => {
      menu = await basicFixture();
    });

    it('clears _searchText', () => {
      menu._searchText = 'test';
      menu._clearSearchText();
      assert.equal(menu._searchText, '');
    });
  });

  describe('a11y', async () => {
    it('is accessible without selection', async () => {
      const element = await basicFixture();
      await assert.isAccessible(element);
    });

    it('is accessible with focus', async () => {
      const menu = await basicFixture();
      menu.focus();
      await aTimeout();
      await assert.isAccessible(menu);
    });

    it('respects existing role', async () => {
      const menu = await fixture(`<test-menu role="tablist"></test-menu>`);
      assert.equal(menu.getAttribute('role'), 'tablist');
    });
  });
});
