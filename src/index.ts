import { BodyComponent, MJMLJsonObject } from 'mjml-core';
import MjmlLocalization from './localization';
import localizeComponent from './localize';

let localizer: InstanceType<typeof MjmlLocalization>;

export default class MjLocalize extends BodyComponent {
  static endingTag = false;

  static dependencies = {
    'mj-localize': [
      'mj-button',
      'mj-html',
      'mj-image',
      'mj-raw',
      'mj-table',
      'mj-text',
      'mj-navbar',
    ],
    'mj-body': ['mj-localize'],
    'mj-wrapper': ['mj-localize'],
  };

  static allowedAttributes = {
    id: 'string',
    attrs: 'string',
    args: 'string',
  };

  static defaultAttributes = {
    id: '',
    attrs: '',
    args: '{}',
  };

  render(): string {
    const id = this.getAttribute('id');
    const attrs = this.getAttribute('attrs');
    const args = this.getAttribute('args');

    if (!localizer) {
      throw new Error('Localizer not set');
    }

    if (id.length === 0) {
      throw new Error('An ID was not provided for this localization');
    }

    if (this.props.children.length > 1) {
      throw new Error('Localizer expected to receive a single child node');
    }

    const component: MJMLJsonObject = this.props.children[0];
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

export const setLocalizer = (
  localizerInstance: InstanceType<typeof MjmlLocalization>
): void => {
  localizer = localizerInstance;
};

export { MjmlLocalization };
