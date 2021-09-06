/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// import { parse } from "node-html-parser";
import MjmlLocalization from "./localization";

export type MjmlComponent = {
  tagName: string;
  attributes: Record<string, string>;
  content?: string;
  children: MjmlComponent[];
};

// enum NodeType {
//   ELEMENT_NODE = 1,
//   TEXT_NODE = 3,
//   COMMENT_NODE = 8,
// }

function localizeComponent({
  component,
  id,
  attrs,
  args,
  localizer,
}: {
  component: MjmlComponent;
  id: string;
  attrs: string;
  args: string;
  localizer: InstanceType<typeof MjmlLocalization>;
}): MjmlComponent {
  const bundle = localizer.getBundle(id);

  if (!bundle) {
    return component;
  }

  const parsedAttrs: string[] = attrs.split(",");
  const parsedArgs: Record<string, string> = JSON.parse(args);
  const msg = bundle.getMessage(id);
  let errors: Error[] = [];

  if (msg?.value && component.content) {
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

    for (let error of errors) {
      localizer.reportError(error);
    }
  }

  if (msg?.attributes) {
    errors = [];

    for (const key of parsedAttrs) {
      if (msg.attributes[key]) {
        component.attributes[key] = bundle.formatPattern(
          msg.attributes[key],
          parsedArgs,
          errors
        );
      }
    }

    for (let error of errors) {
      localizer.reportError(error);
    }
  }

  return component;
}

export default localizeComponent;
