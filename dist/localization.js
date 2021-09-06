"use strict";
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
Object.defineProperty(exports, "__esModule", { value: true });
var sequence_1 = require("@fluent/sequence");
// @ts-expect-error
var cached_iterable_1 = require("cached-iterable");
var MjmlLocalization = /** @class */ (function () {
    function MjmlLocalization(bundles) {
        this.bundles = cached_iterable_1.CachedSyncIterable.from(bundles);
    }
    MjmlLocalization.prototype.getBundle = function (id) {
        return (0, sequence_1.mapBundleSync)(this.bundles, id);
    };
    MjmlLocalization.prototype.getString = function (id, args, fallback) {
        var bundle = this.getBundle(id);
        var errors = [];
        if (bundle) {
            var msg = bundle.getMessage(id);
            if (msg && msg.value) {
                return bundle.formatPattern(msg.value, args, errors);
            }
        }
        for (var _i = 0, errors_1 = errors; _i < errors_1.length; _i++) {
            var error = errors_1[_i];
            this.reportError(error);
        }
        return fallback || id;
    };
    MjmlLocalization.prototype.reportError = function (error) {
        console.warn("[fluent-mjml] " + error.name + ": " + error.message);
    };
    return MjmlLocalization;
}());
exports.default = MjmlLocalization;
