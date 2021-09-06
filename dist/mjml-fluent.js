"use strict";
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLocalizer = exports.MjmlLocalization = void 0;
var mjml_core_1 = require("mjml-core");
var localization_1 = __importDefault(require("./localization"));
exports.MjmlLocalization = localization_1.default;
var localize_1 = __importDefault(require("./localize"));
var localizer;
var MjLocalize = /** @class */ (function (_super) {
    __extends(MjLocalize, _super);
    function MjLocalize() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MjLocalize.prototype.render = function () {
        var id = this.getAttribute("id");
        var attrs = this.getAttribute("attrs");
        var args = this.getAttribute("args");
        if (!localizer) {
            throw new Error("Localizer not set");
        }
        if (!id) {
            throw new Error("An ID was not provided for this localization");
        }
        if (this.props.children.length > 1) {
            throw new Error("Localizer expected to receive a single child node");
        }
        var component = this.props.children[0];
        this.props.children[0] = (0, localize_1.default)({
            component: component,
            id: id,
            attrs: attrs,
            args: args,
            localizer: localizer,
        });
        return this.renderMJML(this.renderChildren(this.props.children, {
            rawXML: true,
            renderer: function (component) { return component.render; },
        }));
    };
    MjLocalize.endingTag = false;
    MjLocalize.dependencies = {
        "mj-localize": [
            "mj-button",
            "mj-html",
            "mj-image",
            "mj-raw",
            "mj-table",
            "mj-text",
            "mj-navbar",
        ],
        "mj-body": ["mj-localize"],
        "mj-wrapper": ["mj-localize"],
    };
    MjLocalize.allowedAttributes = {
        id: "string",
        attrs: "string",
        args: "string",
    };
    MjLocalize.defaultAttributes = {
        id: undefined,
        attrs: "",
        args: "{}",
    };
    return MjLocalize;
}(mjml_core_1.BodyComponent));
exports.default = MjLocalize;
function setLocalizer(localizerInstance) {
    localizer = localizerInstance;
}
exports.setLocalizer = setLocalizer;
