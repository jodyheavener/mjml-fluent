import '@testing-library/jest-dom';
import { registerComponent } from 'mjml-core';
import { render, screen } from 'mjml-testing-library';
import MjLocalize, { MjmlLocalization, setLocalizer } from '.';
import { setUpBundle } from './tests/fluent';

const template = (content: string) => `
  <mjml>
    <mj-body>
      <mj-section>
        <mj-column>
          ${content}
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
`;

describe('MjLocalize', () => {
  let localizer: MjmlLocalization;

  beforeAll(() => {
    registerComponent(MjLocalize);
  });

  beforeEach(async () => {
    localizer = new MjmlLocalization(setUpBundle());
    setLocalizer(localizer);
  });

  it('requires a localizer', () => {
    // @ts-ignore - easier to reset the localizer
    // just for this one test
    setLocalizer(undefined);

    expect(() => {
      render(
        template(`
          <mj-localize>
            <mj-text>Fancy pants</mj-text>
          </mj-localize>
        `)
      );
    }).toThrowError('Localizer not set');
  });

  it('requires an id in the tag', () => {
    expect(() => {
      render(
        template(`
          <mj-localize>
            <mj-text>Fancy pants</mj-text>
          </mj-localize>
        `)
      );
    }).toThrowError('An ID was not provided for this localization');
  });

  it('can only handle one child node', () => {
    expect(() => {
      render(
        template(`
          <mj-localize id="fancy-pants">
            <mj-text>Fancy pants</mj-text>
            <mj-text>Super fancy pants</mj-text>
          </mj-localize>
        `)
      );
    }).toThrowError('Localizer expected to receive a single child node');
  });

  it('localizes mj-text', async () => {
    const fallback = 'This is some basic text';

    render(
      template(`
        <mj-localize id="basic-text">
          <mj-text>${fallback}</mj-text>
        </mj-localize>
      `)
    );

    const element = screen.queryByText(localizer.getString('basic-text'));
    expect(element).toBeInTheDocument();
    expect(element).toMatchSnapshot();
    expect(screen.queryByText(fallback)).not.toBeInTheDocument();
  });

  it('localizes mj-image', async () => {
    const fallbackAlt = 'This is basic image alt text';
    const fallbackTitle = 'This is basic image title text';

    render(
      template(`
        <mj-localize id="image-with-attrs" attrs="alt,title">
          <mj-image src="image.png" alt="${fallbackAlt}" title="${fallbackTitle}" />
        </mj-localize>
      `)
    );

    const element = screen.queryByAltText(
      localizer.getString('image-with-attrs.alt')
    );
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute(
      'title',
      localizer.getString('image-with-attrs.title')
    );
    expect(element).toMatchSnapshot();
    expect(screen.queryByAltText(fallbackAlt)).not.toBeInTheDocument();
    expect(screen.queryByTitle(fallbackTitle)).not.toBeInTheDocument();
  });

  it('localizes mj-button', async () => {
    const fallback = 'This is some basic button text';

    render(
      template(`
        <mj-localize id="basic-button">
          <mj-button>${fallback}</mj-button>
        </mj-localize>
      `)
    );

    const element = screen.queryByText(localizer.getString('basic-button'));
    expect(element).toBeInTheDocument();
    expect(element).toMatchSnapshot();
    expect(screen.queryByText(fallback)).not.toBeInTheDocument();
  });
});
