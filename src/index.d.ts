// Adapted from https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/anchor-js/index.d.ts

declare namespace simpleAnchor {
  interface Anchor {
      options: AnchorOptions;

      add(selector?: string): Anchor;
      remove(selector?: string): Anchor;
      removeAll(): void;
  }

  type AnchorPlacement = 'left' | 'right';
  type AnchorVisibility = 'always' | 'hover' | 'touch';

  interface AnchorOptions {
      ariaLabel?: string | undefined;
      base?: string | undefined;
      class?: string | undefined;
      icon?: string | undefined;
      placement?: AnchorPlacement | undefined;
      titleText?: string | undefined;
      visible?: AnchorVisibility | undefined;
  }

  interface AnchorStatic {
      new(options?: AnchorOptions): Anchor;
  }
}

declare const anchors: simpleAnchor.Anchor;
declare const SimpleAnchor: simpleAnchor.AnchorStatic;

export = SimpleAnchor;

export as namespace SimpleAnchor;

declare global {
  const anchors: simpleAnchor.Anchor;
}