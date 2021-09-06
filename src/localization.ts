import { FluentBundle, FluentVariable } from '@fluent/bundle';
import { mapBundleSync } from '@fluent/sequence';
// @ts-expect-error
import { CachedSyncIterable } from 'cached-iterable';

export default class MjmlLocalization {
  bundles: Iterable<FluentBundle>;

  constructor(bundles: Iterable<FluentBundle>) {
    this.bundles = CachedSyncIterable.from(bundles);
  }

  getBundle(id: string): FluentBundle | null {
    return mapBundleSync(this.bundles, id);
  }

  getString(
    id: string,
    args?: Record<string, FluentVariable> | null,
    fallback?: string
  ): string {
    const [key, attr] = id.split('.');
    const bundle = this.getBundle(key);
    const errors: Error[] = [];

    if (bundle) {
      const msg = bundle.getMessage(key);

      if (msg) {
        if (attr && msg.attributes[attr]) {
          return bundle.formatPattern(msg.attributes[attr], args, errors);
        } else if (msg.value) {
          return bundle.formatPattern(msg.value, args, errors);
        }
      }
    }

    for (const error of errors) {
      this.reportError(error);
    }

    return fallback || key;
  }

  reportError(error: Error): void {
    console.warn(`[fluent-mjml] ${error.name}: ${error.message}`);
  }
}
