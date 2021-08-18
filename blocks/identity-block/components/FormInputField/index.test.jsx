import React from 'react';
import { mount } from 'enzyme';

import FormInputField, { FIELD_TYPES } from '.';

describe('Form Input Field', () => {
  it('renders with no properties', () => {
    const wrapper = mount(<FormInputField />);

    expect(wrapper.html()).not.toBe(null);
  });

  it('renders with a label', () => {
    const wrapper = mount(<FormInputField label="label text" />);

    expect(wrapper.find('label text')).not.toBe(null);
  });

  it('renders with a tip', () => {
    const wrapper = mount(<FormInputField tip="tip text" />);

    expect(wrapper.find('tip text')).not.toBe(null);
  });

  it('renders with an error', () => {
    const wrapper = mount(
      <FormInputField
        type={FIELD_TYPES.EMAIL}
        defaultValue="invalid"
        validationErrorMessage="error message"
      />,
    );

    wrapper.find('input').simulate('change');

    expect(wrapper.find('error message')).not.toBe(null);
  });

  it('renders with an error overriding tip', () => {
    const wrapper = mount(
      <FormInputField
        type={FIELD_TYPES.EMAIL}
        defaultValue="invalid"
        tip="should not be found after change"
        validationErrorMessage="error message"
      />,
    );

    expect(wrapper.find('should not be found after change')).not.toBe(null);

    wrapper.find('input').simulate('change');

    expect(wrapper.find('should not be found after change')).not.toExist();
    expect(wrapper.find('error message')).not.toBe(null);
  });
});
