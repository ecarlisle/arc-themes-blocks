import React from 'react';
import { useEditableContent } from 'fusion:content';
import SecondaryFont from '../secondary-font';

const PromoDescription = (props) => {
  const {
    content = {},
    text,
    className = '',
  } = props;
  const { editableContent } = useEditableContent();

  const descriptionText = content?.description?.basic || text;
  const editableItem = content?.description ? editableContent(content, 'description.basic') : {};

  return descriptionText ? (
    <SecondaryFont
      as="p"
      className={className}
      {...editableItem}
      suppressContentEditableWarning
    >
      {descriptionText}
    </SecondaryFont>
  ) : null;
};

export default PromoDescription;
