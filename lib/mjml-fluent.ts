/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { BodyComponent } from "mjml-core";
import MjmlLocalization from "./localization";
import localizeComponent, { MjmlComponent } from "./localize";

let localizer: InstanceType<typeof MjmlLocalization>;

export default class MjLocalize extends BodyComponent {
  static endingTag = false;

  static dependencies = {
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

  static allowedAttributes = {
    id: "string",
    attrs: "string",
    args: "string",
  };

  static defaultAttributes = {
    id: undefined,
    attrs: "",
    args: "{}",
  };

  render() {
    const id = this.getAttribute("id");
    const attrs = this.getAttribute("attrs");
    const args = this.getAttribute("args");

    if (!localizer) {
      throw new Error("Localizer not set");
    }

    if (!id) {
      throw new Error("An ID was not provided for this localization");
    }

    if (this.props.children.length > 1) {
      throw new Error("Localizer expected to receive a single child node");
    }

    const component: MjmlComponent = this.props.children[0];
    this.props.children[0] = localizeComponent({
      component,
      id,
      attrs,
      args,
      localizer,
    });

    return this.renderMJML(
      this.renderChildren(this.props.children, {
        rawXML: true,
        renderer: (component) => component.render,
      })
    );
  }
}

function setLocalizer(
  localizerInstance: InstanceType<typeof MjmlLocalization>
) {
  localizer = localizerInstance;
}

export { MjmlLocalization, setLocalizer };
