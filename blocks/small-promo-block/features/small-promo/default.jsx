/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { useContent } from 'fusion:content';
import { useFusionContext } from 'fusion:context';
import { LazyLoad, isServerSide } from '@wpmedia/engine-theme-sdk';

import '@wpmedia/shared-styles/scss/_small-promo.scss';

import {
  imageRatioCustomField,
  ratiosFor,
} from '@wpmedia/resizer-image-block';
import PromoImage from './_children/promo_image';
import PromoHeadline from './_children/promo_headline';
import getPromoStyle from './_children/promo_style';
import getPromoContainer from './_children/promo_container';

const SmallPromoItem = ({ customFields }) => {
  const { arcSite } = useFusionContext();

  const content = useContent({
    source: customFields?.itemContentConfig?.contentService ?? null,
    query: customFields?.itemContentConfig?.contentConfigValues
      ? {
        'arc-site': arcSite,
        ...customFields.itemContentConfig.contentConfigValues,
      }
      : null,
  }) || null;

  const ratios = ratiosFor('SM', customFields.imageRatio);

  const headline = customFields?.showHeadline && (
  <PromoHeadline customFields={customFields} content={content} />
  );

  const image = customFields?.showImage && (
    <PromoImage content={content} customFields={customFields} ratios={ratios} />
  );

  const imagePosition = customFields?.imagePosition || 'right';

  const promoContainersStyles = {
    containerClass: getPromoStyle(imagePosition, 'container'),
    headlineClass: customFields.showImage
      ? 'col-sm-xl-8'
      : 'col-sm-xl-12 no-image-padding',
    imageClass: 'col-sm-xl-4',
  };

  return content ? (
    <>
      <article className="container-fluid small-promo">
        {getPromoContainer(headline, image, promoContainersStyles, imagePosition)}
      </article>
      <hr />
    </>
  ) : null;
};

const SmallPromo = ({ customFields }) => {
  if (customFields.lazyLoad && isServerSide()) { // On Server
    return null;
  }
  return (
    <LazyLoad enabled={customFields.lazyLoad}>
      <SmallPromoItem customFields={{ ...customFields }} />
    </LazyLoad>
  );
};

SmallPromo.propTypes = {
  customFields: PropTypes.shape({
    itemContentConfig: PropTypes.contentConfig('ans-item').tag({
      group: 'Configure Content',
      label: 'Display Content Info',
    }),
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
    imageOverrideURL: PropTypes.string.tag({
      label: 'Image URL',
      group: 'Image',
    }),
    imagePosition: PropTypes.oneOf([
      'right', 'left', 'above', 'below',
    ]).tag({
      defaultValue: 'right',
      label: 'Image Position',
      group: 'Image',
      labels: {
        right: 'Image Right',
        left: 'Image Left',
        above: 'Image Above',
        below: 'Image Below',
      },
    }).isRequired,
    ...imageRatioCustomField('imageRatio', 'Art', '3:2'),
    lazyLoad: PropTypes.bool.tag({
      name: 'Lazy Load block?',
      defaultValue: false,
      description: 'Turning on lazy-loading will prevent this block from being loaded on the page until it is nearly in-view for the user.',
    }),
  }),
};

SmallPromo.label = 'Small Promo – Arc Block';

export default SmallPromo;
