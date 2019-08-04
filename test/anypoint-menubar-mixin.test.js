import { fixture, assert, aTimeout } from '@open-wc/testing';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import './test-menubar.js';

describe('AnypointMenubarMixin', () => {
  async function basicFixture() {
    return await fixture(`<test-menubar>
      <div role="menuitem">item 1</div>
      <div role="menuitem">item 2</div>
      <div role="menuitem">item 3</div>
    </test-menubar>`);
  }

  async function multiFixture() {
    return await fixture(`<test-menubar multi>
      <div>item 1</div>
      <div>item 2</div>
      <div>item 3</div>
    </test-menubar>`);
  }

  async function rtlFixture() {
    return await fixture(`
    <div dir="rtl">
      <test-menubar>
        <div>item 1</div>
        <div>item 2</div>
        <div>item 3</div>
      </test-menubar>
    </div>`);
  }

  describe('menubar keyboard tests', function() {
    it('menubar has role="menubar"', async function() {
      const menubar = await basicFixture();
      assert.equal(menubar.getAttribute('role'), 'menubar', 'has role="menubar"');
    });

    it('first item gets focus when menubar is focused', async () => {
      const menubar = await basicFixture();
      MockInteractions.focus(menubar);
      await aTimeout();
      assert.equal(document.activeElement, menubar.firstElementChild, 'document.activeElement is first item');
    });

    it('selected item gets focus when menubar is focused', async () => {
      const menubar = await basicFixture();
      menubar.selected = 1;
      MockInteractions.focus(menubar);
      await aTimeout();
      assert.equal(document.activeElement, menubar.selectedItem, 'document.activeElement is selected item');
    });

    it('selectes focused item in up arrow', async () => {
      const menubar = await basicFixture();
      MockInteractions.focus(menubar);
      await aTimeout();
      // Key press up
      MockInteractions.keyDownOn(menubar, 38, [], 'ArrowUp');
      await aTimeout();
      assert.equal(document.activeElement, menubar.selectedItem, 'document.activeElement is selected item');
    });

    it('selectes focused item in down arrow', async () => {
      const menubar = await basicFixture();
      MockInteractions.focus(menubar);
      await aTimeout();
      // Key press up
      MockInteractions.keyDownOn(menubar, 40, [], 'ArrowDown');
      await aTimeout();
      assert.equal(document.activeElement, menubar.selectedItem, 'document.activeElement is selected item');
    });

    it('focusing non-item content does not auto-focus an item', async () => {
      const menubar = await basicFixture();
      menubar.extraContent.focus();
      await aTimeout();
      const ownerRoot = (menubar.extraContent.getRootNode && menubar.extraContent.getRootNode()) || document;
      const activeElement = ownerRoot.activeElement;
      assert.equal(activeElement, menubar.extraContent, 'menubar.extraContent is focused');
      assert.equal(document.activeElement, menubar, 'menubar is document.activeElement');
    });

    it('last activated item in a multi select menubar is focused', async () => {
      const menubar = await multiFixture();
      await aTimeout();
      menubar.selected = 0;
      menubar.items[1].click();
      await aTimeout();
      assert.equal(document.activeElement, menubar.items[1], 'document.activeElement is last activated item');
    });

    it('deselection in a multi select menubar focuses deselected item', async () => {
      const menubar = await multiFixture();
      menubar.selected = 0;
      menubar.items[0].click();
      await aTimeout();
      assert.equal(document.activeElement, menubar.items[0], 'document.activeElement is last activated item');
    });

    describe('left / right keys are reversed when the menubar has RTL directionality', function() {
      const LEFT = 37;
      const RIGHT = 39;

      it('left key moves to the previous item', async () => {
        const menubar = await basicFixture();
        menubar.selected = 0;
        menubar.items[1].click();
        assert.equal(document.activeElement, menubar.items[1]);
        MockInteractions.pressAndReleaseKeyOn(menubar, LEFT, [], 'ArrowLeft');
        assert.equal(
          document.activeElement,
          menubar.items[0],
          '`document.activeElement` should be the previous item.'
        );
        assert.equal(menubar.selected, 1, '`menubar.selected` should not change.');
      });

      it('right key moves to the next item', async () => {
        const menubar = await basicFixture();
        menubar.selected = 0;
        menubar.items[1].click();
        assert.equal(document.activeElement, menubar.items[1]);
        MockInteractions.pressAndReleaseKeyOn(menubar, RIGHT, [], 'ArrowRight');
        assert.equal(
          document.activeElement,
          menubar.items[2],
          '`document.activeElement` should be the previous item.'
        );
        assert.equal(menubar.selected, 1, '`menubar.selected` should not change.');
      });

      it('left key moves to the next item with RTL', async () => {
        const rtlContainer = await rtlFixture();
        const menubar = rtlContainer.querySelector('test-menubar');
        menubar.selected = 0;
        menubar.items[1].click();
        assert.equal(document.activeElement, menubar.items[1]);
        MockInteractions.pressAndReleaseKeyOn(menubar, LEFT, [], 'ArrowLeft');
        assert.equal(
          document.activeElement,
          menubar.items[2],
          '`document.activeElement` should be the next item.'
        );
        assert.equal(menubar.selected, 1, '`menubar.selected` should not change.');
      });

      it('right key moves to the previous item', async () => {
        const rtlContainer = await rtlFixture();
        const menubar = rtlContainer.querySelector('test-menubar');
        menubar.selected = 0;
        menubar.items[1].click();
        assert.equal(document.activeElement, menubar.items[1]);
        MockInteractions.pressAndReleaseKeyOn(menubar, RIGHT, [], 'ArrowRight');
        assert.equal(
          document.activeElement,
          menubar.items[0],
          '`document.activeElement` should be the previous item'
        );
        assert.equal(menubar.selected, 1, '`menubar.selected` should not change.');
      });
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
      const menu = await fixture(`<test-menubar role="tablist"></test-menubar>`);
      assert.equal(menu.getAttribute('role'), 'tablist');
    });
  });
});
