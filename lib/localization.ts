/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { FluentBundle, FluentVariable } from "@fluent/bundle";
import { mapBundleSync } from "@fluent/sequence";
// @ts-expect-error
import { CachedSyncIterable } from "cached-iterable";

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
    const bundle = this.getBundle(id);
    const errors: Error[] = [];

    if (bundle) {
      const msg = bundle.getMessage(id);

      if (msg && msg.value) {
        return bundle.formatPattern(msg.value, args, errors);
      }
    }

    for (let error of errors) {
      this.reportError(error);
    }

    return fallback || id;
  }

  reportError(error: Error): void {
    console.warn(`[fluent-mjml] ${error.name}: ${error.message}`);
  }
}
