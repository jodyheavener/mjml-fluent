import { JSDOM } from 'jsdom';
import { MJMLJsonObject } from 'mjml-core';
import MjmlLocalization from './localization';

const localizeComponent = ({
  component,
  id,
  attrs,
  args,
  localizer,
}: {
  component: MJMLJsonObject;
  id: string;
  attrs: string;
  args: string;
  localizer: InstanceType<typeof MjmlLocalization>;
}): MJMLJsonObject => {
  const bundle = localizer.getBundle(id);

  if (!bundle) {
    return component;
  }

  const parsedAttrs: string[] = attrs.split(',');
  const parsedArgs: Record<string, string> = JSON.parse(args);
  const msg = bundle.getMessage(id);
  let errors: Error[] = [];

  const selectors = {
    name: 'data-l10n-name',
    id: 'data-l10n-id',
  };

  if (msg?.value && 'content' in component) {
    const htmlContent = new JSDOM(component.content.trim()).window.document
      .body;
    const htmlL10n = new JSDOM(
      bundle.formatPattern(msg.value, parsedArgs, errors)
    ).window.document.body;

    htmlL10n.querySelectorAll(`[${selectors.name}]`).forEach((element) => {
      // nodeType 1 = HTML node
      if (element.nodeType === 1) {
        const fallbackElement = htmlContent.querySelector(
          `[${selectors.id}=${element.getAttribute(selectors.name)}]`
        );

        if (fallbackElement) {
          element.removeAttribute(selectors.name);

          Array.from(fallbackElement.attributes).forEach((attr) => {
            if (attr.name !== selectors.id) {
              element.setAttribute(attr.name, attr.value);
            }
          });
        }
      }
    });

    component.content = htmlL10n.innerHTML;

    for (const error of errors) {
      localizer.reportError(error);
    }
  }

  if (msg?.attributes) {
    errors = [];

    for (const key of parsedAttrs) {
      if (msg.attributes[key]) {
        (component.attributes as Record<string, string>)[key] =
          bundle.formatPattern(msg.attributes[key], parsedArgs, errors);
      }
    }

    for (const error of errors) {
      localizer.reportError(error);
    }
  }

  return component;
};

export default localizeComponent;
