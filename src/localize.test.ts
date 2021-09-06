import '@testing-library/jest-dom';
import { MJMLJsonWithContent } from 'mjml-core';
import MjLocalize, { MjmlLocalization } from '.';
import localizeComponent from './localize';
import { setUpBundle } from './tests/fluent';

describe('localizeComponent', () => {
  let localizer: MjmlLocalization;
  let basicComponent: MJMLJsonWithContent;
  let defaultArgs: Parameters<typeof localizeComponent>[0];

  beforeAll(async () => {
    localizer = new MjmlLocalization(setUpBundle());
  });

  beforeEach(() => {
    basicComponent = {
      tagName: 'mj-text',
      attributes: {},
      content: 'This is some basic text',
    };

    defaultArgs = {
      component: basicComponent,
      ...MjLocalize.defaultAttributes,
      localizer,
    };
  });

  it('returns the unaltered component if the translation cant be found', () => {
    const component = localizeComponent({ ...defaultArgs, id: 'invalid-id' });

    expect(component).toEqual(defaultArgs.component);
  });

  it('replaces a components content using a valid bundle id', () => {
    const component = localizeComponent({ ...defaultArgs, id: 'basic-text' });

    expect((component as MJMLJsonWithContent).content).toEqual(
      localizer.getString('basic-text')
    );
  });

  it('replaces inner html using l10n data attributes', () => {
    const component = localizeComponent({
      ...defaultArgs,
      id: 'rich-text',
      component: {
        ...basicComponent,
        content: `
          This is a basic
          <a data-l10n-id="link" href="http://mozilla.com">link</a>
        `,
      },
    });

    expect((component as MJMLJsonWithContent).content).toEqual(
      // Can this be replaced with localizer.getString('rich-text')?
      'This is a localized <a href="http://mozilla.com">link</a>'
    );
  });

  it('replaces requested component attributes', () => {
    const component = localizeComponent({
      ...defaultArgs,
      id: 'image-with-attrs',
      attrs: 'alt,title',
      component: {
        tagName: 'mj-image',
        attributes: {
          alt: 'This is basic image alt text',
          title: 'This is basic image title text',
        },
      },
    });

    expect(component.attributes).toEqual({
      alt: localizer.getString('image-with-attrs.alt'),
      title: localizer.getString('image-with-attrs.title'),
    });
  });

  it('interpolates arguments into translations for content and attributes', () => {
    const args = { foo: 'awesome', bar: 'sauce' };
    const component = localizeComponent({
      ...defaultArgs,
      id: 'button-with-attrs-args',
      attrs: 'title',
      args: JSON.stringify(args),
      component: {
        tagName: 'mj-button',
        content: 'This is basic button text',
        attributes: {
          title: 'This is basic image title text',
        },
      },
    });

    expect((component as MJMLJsonWithContent).content).toEqual(
      localizer.getString('button-with-attrs-args', args)
    );
    expect(component.attributes).toEqual({
      title: localizer.getString('button-with-attrs-args.title', args),
    });
  });
});
