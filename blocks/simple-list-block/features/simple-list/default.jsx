/* eslint-disable camelcase */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { useContent } from 'fusion:content';
import { useFusionContext } from 'fusion:context';
import { extractResizedParams } from '@wpmedia/resizer-image-block';
import getThemeStyle from 'fusion:themes';
import getProperties from 'fusion:properties';
import Consumer from 'fusion:consumer';
import Title from './_children/title';
import StoryItem from './_children/story-item';
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
  websiteURL: storyObject.website_url || '',
  resizedImageOptions: extractResizedParams(storyObject),
});

// helpers end

@Consumer
class SimpleListWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placeholderResizedImageOptions: {},
    };
    this.fetchPlaceholder();
  }

  getFallbackImageURL() {
    const { arcSite, deployment, contextPath } = this.props;
    let targetFallbackImage = getProperties(arcSite).fallbackImage;

    if (!targetFallbackImage.includes('http')) {
      targetFallbackImage = deployment(`${contextPath}/${targetFallbackImage}`);
    }

    return targetFallbackImage;
  }

  fetchPlaceholder() {
    const targetFallbackImage = this.getFallbackImageURL();

    // using the fetchContent seems both more reliable
    // and allows for conditional calls whereas useContent hook does not
    if (!targetFallbackImage.includes('/resources/')) {
      this.fetchContent({
        placeholderResizedImageOptions: {
          source: 'resize-image-api',
          query: { raw_image_url: targetFallbackImage, respect_aspect_ratio: true },
        },
      });
    }
  }

  render() {
    const { placeholderResizedImageOptions } = this.state;
    const targetFallbackImage = this.getFallbackImageURL();
    return (
      <SimpleList
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...this.props}
        placeholderResizedImageOptions={placeholderResizedImageOptions}
        targetFallbackImage={targetFallbackImage}
      />
    );
  }
}

const SimpleList = (props) => {
  const {
    customFields: {
      listContentConfig: {
        contentService = '',
        contentConfigValues = {},
      } = {},
      title = '',
      showHeadline = true,
      showImage = true,
    } = {},
    id = '',
    placeholderResizedImageOptions,
    targetFallbackImage,
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
            showHeadline={showHeadline}
            showImage={showImage}
            resizedImageOptions={resizedImageOptions}
            placeholderResizedImageOptions={placeholderResizedImageOptions}
            targetFallbackImage={targetFallbackImage}
          />
        ))
      }
    </div>
  );
};

SimpleListWrapper.propTypes = {
  customFields: PropTypes.shape({
    listContentConfig: PropTypes.contentConfig('ans-feed').tag(
      {
        group: 'Configure Content',
        label: 'Display Content Info',
      },
    ),
    title: PropTypes.string.tag({ label: 'Title' }),
    showHeadline: PropTypes.bool.tag({
      label: 'Show headline',
      defaultValue: true,
      group: 'Show promo elements',
    }),
    showImage: PropTypes.bool.tag({
      label: 'Show image',
      defaultValue: true,
      group: 'Show promo elements',
    }),
  }),
};

SimpleListWrapper.label = 'Simple List – Arc Block';

export default SimpleListWrapper;
