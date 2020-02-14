import React from 'react';
import PropTypes from 'prop-types';
import { useContent } from 'fusion:content';
import { useFusionContext } from 'fusion:context';
import getThemeStyle from 'fusion:themes';
import StoryItem from './_children/story-item';
import Title from './shared/title';
import './simple-list.scss';

// helpers start

const extractImage = (storyObject) => storyObject.promo_items
  && storyObject.promo_items.basic
  && storyObject.promo_items.basic.type === 'image'
  && storyObject.promo_items.basic.url;

const unserializeStory = (storyObject) => ({
  id: storyObject._id,
  itemTitle: storyObject.headlines.basic,
  imageURL: extractImage(storyObject) || '',
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

  const primaryFont = getThemeStyle(arcSite)['primary-font-family'];

  // set defualt value for list items
  let listItems = [];

  if (contentService !== '') {
    const rawQueryResponse = useContent({
      source: contentService,
      query: contentConfigValues,
    });

    if (
      rawQueryResponse
      && rawQueryResponse.content_elements
      && rawQueryResponse.content_elements.length > 0
    ) {
      listItems = [...rawQueryResponse.content_elements.map(unserializeStory)];
    }
  }

  return (
    <div key={id} className="list-container">
      {title.length > 0 ? (
        <Title className="list-title" primaryFont={primaryFont}>
          {title}
        </Title>
      ) : null}
      {listItems.length > 0
        ? listItems.map(({ id: listItemId, itemTitle, imageURL }) => (
          <StoryItem
            key={listItemId}
            id={listItemId}
            itemTitle={itemTitle}
            imageURL={imageURL}
            primaryFont={primaryFont}
          />
        ))
        : null}
    </div>
  );
};

SimpleList.propTypes = {
  customFields: PropTypes.shape({
    title: PropTypes.string.tag({ label: 'Title' }),
    listContentConfig: PropTypes.contentConfig('ans-feed').tag({
      label: 'Display Content Info',
    }),
  }),
};

SimpleList.label = 'Simple List – Arc Block';

export default SimpleList;
