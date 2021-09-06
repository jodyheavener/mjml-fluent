import { FluentBundle, FluentResource } from '@fluent/bundle';

const enUsFtl = `
bundle-lookup = This bundle exists
basic-text = This is some localized basic text
rich-text = This is a localized <a data-l10n-name="link">link</a>
basic-button = This is localized button text
image-with-attrs =
  .alt = This is a localized image alt
  .title = This is a localized image title
button-with-attrs-args = This is { $foo } localized button text
  .title = This is a { $bar } localized button title
`;

export const setUpBundle = (): Iterable<FluentBundle> => {
  const bundle = new FluentBundle('en-US');
  bundle.addResource(new FluentResource(enUsFtl));
  return [bundle];
};
