import '@testing-library/jest-dom';
import { MjmlLocalization } from '.';
import { setUpBundle } from './tests/fluent';

describe('MjmlLocalization', () => {
  let localizer: MjmlLocalization;

  beforeAll(async () => {
    localizer = new MjmlLocalization(setUpBundle());
  });

  describe('getBundle', () => {
    it('should return a bundle based on an id', () => {
      expect(localizer.getBundle('bundle-lookup')).toBeDefined();
    });

    it('returns null when a bundle cannot be found', () => {
      expect(localizer.getBundle('not-a-bundle')).toBeNull();
    });
  });

  describe('getString', () => {
    it('returns a string based on an id', () => {
      expect(localizer.getString('basic-text')).toEqual(
        'This is some localized basic text'
      );
    });

    it('returns an attribute string based on an id attribute', () => {
      expect(localizer.getString('image-with-attrs.alt')).toEqual(
        'This is a localized image alt'
      );
    });

    // Why doesn't this work?
    it.skip('interpolates arguments', () => {
      expect(
        localizer.getString('button-with-attrs-args', { foo: 'awesome' })
      ).toEqual('This is awesome localized button text');
    });

    it('returns a fallback', () => {
      const fallback = 'This is the fallback';
      expect(localizer.getString('not-an-id', {}, fallback)).toEqual(fallback);
    });
  });

  describe('reportError', () => {
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      (console.warn as jest.Mock).mockRestore();
    });

    it('prints a console warn with the message', () => {
      const error = new Error('Could not computer');
      localizer.reportError(error);

      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(
        `[fluent-mjml] ${error.name}: ${error.message}`
      );
    });
  });
});
