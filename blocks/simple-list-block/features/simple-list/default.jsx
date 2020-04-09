import React from 'react';
import PropTypes from 'prop-types';
import { useContent } from 'fusion:content';
import { useFusionContext } from 'fusion:context';
import getThemeStyle from 'fusion:themes';
import getProperties from 'fusion:properties';
import Title from './_children/title';
import StoryItem from './_children/story-item';
import './simple-list.scss';

// helpers start

// todo: fix camelcase storyobject parsing
const extractResizedParams = (storyObject) => {
  // eslint-disable-next-line camelcase
  const basicStoryObject = storyObject?.promo_items?.basic;

  if (basicStoryObject?.type === 'image') {
    // eslint-disable-next-line camelcase
    return basicStoryObject?.resized_params;
  }

  return [];
};

const extractImage = (storyObject) => storyObject.promo_items
  && storyObject.promo_items.basic
  && storyObject.promo_items.basic.type === 'image'
  && storyObject.promo_items.basic.url;

const unserializeStory = (storyObject) => ({
  id: storyObject._id,
  itemTitle: storyObject.headlines.basic,
  imageURL: extractImage(storyObject) || '',
  websiteURL: storyObject.website_url || '',
  resizedImageOptions: extractResizedParams(storyObject),
});

// helpers end

const SimpleList = (props) => {
  const {
    customFields: {
      listContentConfig: {
        contentService = '',
        contentConfigValues = {},
      } = {},
      title = '',
    } = {},
    id = '',
  } = props;

  const { arcSite } = useFusionContext();

  const {
    websiteDomain,
  } = getProperties(arcSite);

  const primaryFont = getThemeStyle(arcSite)['primary-font-family'];

  const { content_elements: contentElements = [] } = useContent({
    source: contentService,
    query: contentConfigValues,
  }) || {};

  return (
    <div key={id} className="list-container">
      <Title className="list-title" primaryFont={primaryFont}>
        {title}
      </Title>
      {
        contentElements.map(unserializeStory).map(({
          id: listItemId, itemTitle, imageURL, websiteURL, resizedImageOptions,
        }) => (
          <StoryItem
            key={listItemId}
            id={listItemId}
            itemTitle={itemTitle}
            imageURL={imageURL}
            primaryFont={primaryFont}
            websiteURL={websiteURL}
            websiteDomain={websiteDomain}
            resizedImageOptions={resizedImageOptions}
          />
        ))
      }
    </div>
  );
};

SimpleList.propTypes = {
  customFields: PropTypes.shape({
    listContentConfig: PropTypes.contentConfig('ans-feed').tag(
      {
        group: 'Configure Content',
        label: 'Display Content Info',
      },
    ),
    title: PropTypes.string.tag({ label: 'Title' }),
  }),
};

SimpleList.label = 'Simple List – Arc Block';

export default SimpleList;
