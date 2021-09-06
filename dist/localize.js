"use strict";
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
Object.defineProperty(exports, "__esModule", { value: true });
// enum NodeType {
//   ELEMENT_NODE = 1,
//   TEXT_NODE = 3,
//   COMMENT_NODE = 8,
// }
function localizeComponent(_a) {
    var component = _a.component, id = _a.id, attrs = _a.attrs, args = _a.args, localizer = _a.localizer;
    var bundle = localizer.getBundle(id);
    if (!bundle) {
        return component;
    }
    var parsedAttrs = attrs.split(",");
    var parsedArgs = JSON.parse(args);
    var msg = bundle.getMessage(id);
    var errors = [];
    if ((msg === null || msg === void 0 ? void 0 : msg.value) && component.content) {
        component.content = bundle.formatPattern(msg.value, parsedArgs, errors);
        // const htmlContent = parse(component.content.trim());
        // if (
        //   htmlContent.childNodes.length > 0 &&
        //   // 3 = Text node
        //   htmlContent.childNodes[0].nodeType === 3
        // ) {
        //   component.content = bundle.formatPattern(msg.value, parsedArgs, errors);
        // }
        // for (const node of htmlContent.childNodes) {
        // }
        for (var _i = 0, errors_1 = errors; _i < errors_1.length; _i++) {
            var error = errors_1[_i];
            localizer.reportError(error);
        }
    }
    if (msg === null || msg === void 0 ? void 0 : msg.attributes) {
        errors = [];
        for (var _b = 0, parsedAttrs_1 = parsedAttrs; _b < parsedAttrs_1.length; _b++) {
            var key = parsedAttrs_1[_b];
            if (msg.attributes[key]) {
                component.attributes[key] = bundle.formatPattern(msg.attributes[key], parsedArgs, errors);
            }
        }
        for (var _c = 0, errors_2 = errors; _c < errors_2.length; _c++) {
            var error = errors_2[_c];
            localizer.reportError(error);
        }
    }
    return component;
}
exports.default = localizeComponent;
