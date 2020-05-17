import { MenuMixinConstructor } from './MenuMixin';

declare function MenubarMixin<T extends new (...args: any[]) => {}>(base: T): T & MenuMixinConstructor & MenubarMixinConstructor;
interface MenubarMixinConstructor {
  new(...args: any[]): MenubarMixin;
}

interface MenubarMixin {
  readonly _isRTL: boolean;
  connectedCallback(): void;
  _onUpKey(e: KeyboardEvent): void;
  _onDownKey(e: KeyboardEvent): void;
  _onLeftKey(e: KeyboardEvent): void;
  _onRightKey(e: KeyboardEvent): void;
  _onKeydown(e: KeyboardEvent): void;
}

export {MenubarMixinConstructor};
export {MenubarMixin};
