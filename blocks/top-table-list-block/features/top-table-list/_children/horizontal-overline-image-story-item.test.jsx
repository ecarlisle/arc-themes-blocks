import React from 'react';
import { mount } from 'enzyme';

jest.mock('fusion:context', () => ({
  useFusionContext: jest.fn(() => ({
    arcSite: 'the-sun',
    globalContent: {},
  })),
}));

jest.mock('fusion:content', () => ({
  useEditableContent: jest.fn(() => ({
    editableContent: {},
  })),
}));

describe('horizontal overline image story item', () => {
  jest.mock('fusion:themes', () => (jest.fn(() => ({}))));
  it('renders with the full required props', () => {
    const imageURL = 'pic';
    const constructedURL = 'url';
    const itemTitle = 'title';
    const descriptionText = 'description';
    const primaryFont = 'arial';
    const by = ['jack'];
    const element = { credits: { by: [] } };
    const displayDate = '';
    const overlineURL = 'overline';
    const overlineText = 'overline';
    const id = 'test';
    const { default: HorizontalOverlineImageStoryItem } = require('./horizontal-overline-image-story-item');

    const wrapper = mount(
      <HorizontalOverlineImageStoryItem
        imageURL={imageURL}
        constructedURL={constructedURL}
        itemTitle={itemTitle}
        descriptionText={descriptionText}
        primaryFont={primaryFont}
        by={by}
        element={element}
        displayDate={displayDate}
        overlineURL={overlineURL}
        overlineText={overlineText}
        id={id}
      />,
    );

    // doesn't show placeholder
    // expect(wrapper.find('.top-table-large-image-placeholder').length).toBe(0);

    // finds overline
    expect(wrapper.find('a.overline').length).toBe(1);
    expect(wrapper.props().overlineText).toBe('overline');
    expect(wrapper.find('a.overline').text()).toBe(overlineText);

    // does not find default spacing for headline descriptions
    // expect(wrapper.find('.headline-description-spacing').length).toBe(0);
  });
  it('renders with empty props with defaults', () => {
    jest.mock('fusion:context', () => ({
      useFusionContext: jest.fn(() => ({
        arcSite: 'the-sun',
        globalContent: {},
      })),
    }));
    const imageURL = '';
    const constructedURL = '';
    const itemTitle = '';
    const descriptionText = '';
    const primaryFont = '';
    const by = [];
    const element = {};
    const displayDate = '';
    const overlineURL = '';
    const overlineText = '';
    const id = 'test';
    const { default: HorizontalOverlineImageStoryItem } = require('./horizontal-overline-image-story-item');

    const wrapper = mount(
      <HorizontalOverlineImageStoryItem
        imageURL={imageURL}
        constructedURL={constructedURL}
        itemTitle={itemTitle}
        descriptionText={descriptionText}
        primaryFont={primaryFont}
        by={by}
        element={element}
        displayDate={displayDate}
        overlineURL={overlineURL}
        overlineText={overlineText}
        id={id}
      />,
    );

    // Should be no img present
    expect(wrapper.find('img').length).toBe(0);

    // does not find overline
    expect(wrapper.find('a.overline').length).toBe(0);
    expect(wrapper.props().overlineText).toBe('');

    // finds default spacing for headline descriptions
    // expect(wrapper.find('.headline-description-spacing').length).toBe(1);
  });
});
