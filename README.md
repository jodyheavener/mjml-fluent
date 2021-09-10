# mjml-fluent

A component for localizing other [MJML](https://mjml.io/) components using [Fluent](https://projectfluent.org/).

## Setup

This module is distributed via [npm](https://www.npmjs.com/) which is bundled with [node](https://nodejs.org) and should be installed as one of your project's `dependencies`:

```
npm install mjml-fluent
```

Or for installation via [yarn](https://classic.yarnpkg.com):

```
yarn add mjml-fluent
```

(You may also be interested in installing [`mjml-test-library`](https://www.npmjs.com/package/mjml-testing-library) to test the output of your MJML components.)

Once installed you need to register the component, instantiate the localizer with your Fluent bundles, and set it as the active localizer:

```js
import { registerComponent } from 'mjml-core';
import MjLocalize, { MjmlLocalization, setLocalizer } from 'mjml-fluent';

registerComponent(MjLocalize);

const localizer = new MjmlLocalization(generateBundles());
setLocalizer(localizer);
```

With this you should now be able to use the component in your MJML templates.

## Examples

Use the `<mj-localize>` tag to localize the contents or attributes of MJML components.

### Basic text

```ftl
basic-text = This is some localized basic text
```

```html
<mj-localize id="basic-text">
  <mj-text>This is some basic text</mj-text>
</mj-localize>
```

Would produce something like:

```html
<div
  style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;"
>
  This is some localized basic text
</div>
```

### Text with inner HTML

```ftl
rich-text = This is a localized <a data-l10n-name="link">link</a>
```

```html
<mj-localize id="rich-text">
  <mj-text
    >This is a basic
    <a data-l10n-id="link" href="http://mozilla.com">link</a></mj-text
  >
</mj-localize>
```

Would produce something like:

```html
<div
  style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;"
>
  This is a localized <a href="http://mozilla.com">link</a>
</div>
```

### Image with attributes

```ftl
image-with-attrs =
  .alt = This is a localized image alt
  .title = This is a localized image title
```

```html
<mj-localize id="image-with-attrs" attrs="alt,title">
  <mj-image
    src="image.png"
    alt="This is basic image alt text"
    title="This is basic image title text"
  />
</mj-localize>
```

Would produce something like:

```html
<img
  alt="This is a localized image alt"
  height="auto"
  src="image.png"
  style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"
  title="This is a localized image title"
  width="550"
/>
```

### Button with arguments

```ftl
button-with-args = This is { $type } button text
```

```html
<mj-localize id="button-with-args" args='{ "type": "localized" }'>
  <mj-button>This is basic button text</mj-button>
</mj-localize>
```

Would produce something like:

```html
<table
  border="0"
  cellpadding="0"
  cellspacing="0"
  role="presentation"
  style="vertical-align:top;"
  width="100%"
>
  <tbody>
    <tr>
      <td style="font-size:0px;word-break:break-word;">
        <div
          style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;"
        >
          This is some localized basic text
        </div>
      </td>
    </tr>
  </tbody>
</table>
```

## Attributes

The `<mj-localize>` tag supports three attributes:

| Name  | Description                                                  | Required? | Default |
| ----- | ------------------------------------------------------------ | --------- | ------- |
| id    | The ID to look up the Fluent value with                      | Yes       |         |
| attrs | A comma-separated list of attributes to replace              | No        | ''      |
| args  | A JSON string of values to interpolate into the localization | No        | '{}'    |

## Issues

Looking to contribute? Look for the [Good First Issue](https://github.com/jodyheavener/mjml-fluent/issues?utf8=✓&q=is%3Aissue+is%3Aopen+sort%3Areactions-%2B1-desc+label%3A"good+first+issue"+) label.

### 🐛 Bugs

Please file an issue for bugs, missing documentation, or unexpected behavior.

[**See Bugs**](https://github.com/jodyheavener/mjml-fluent/issues?q=is%3Aissue+is%3Aopen+label%3Abug+sort%3Acreated-desc)

### 💡 Feature Requests

Please file an issue to suggest new features. Vote on feature requests by adding a 👍. This helps maintainers prioritize what to work on.

[**See Feature Requests**](https://github.com/jodyheavener/mjml-fluent/issues?q=is%3Aissue+sort%3Areactions-%2B1-desc+label%3Aenhancement+is%3Aopen)

## LICENSE

[MIT](LICENSE)
