import { MenuMixinConstructor } from './MenuMixin';
import { MultiSelectableMixinConstructor } from '@anypoint-web-components/anypoint-selector/src/MultiSelectableMixin';
import { SelectableMixinConstructor } from '@anypoint-web-components/anypoint-selector/src/SelectableMixin';

declare function MenubarMixin<T extends new (...args: any[]) => {}>(base: T): T & MenuMixinConstructor & MultiSelectableMixinConstructor & SelectableMixinConstructor & MenubarMixinConstructor;
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
