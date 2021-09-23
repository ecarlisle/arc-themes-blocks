import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import getThemeStyle from 'fusion:themes';
import { useFusionContext } from 'fusion:context';
import { UserIcon, ChevronDownIcon, ChevronUpIcon } from '@wpmedia/engine-theme-sdk';

// handle non-dynamic styling not based on theme styles
import './styles.scss';

// naming comes from zeplin docs for types
export const BUTTON_STYLES = {
  FILLED: 'FILLED',
  OUTLINED: 'OUTLINED',
  WHITE_BACKGROUND_FILLED: 'WHITE_BACKGROUND_FILLED',
  OUTLINED_GREY: 'OUTLINED_GREY',
};

export const BUTTON_SIZES = {
  SMALL: 'SMALL',
  MEDIUM: 'MEDIUM',
  LARGE: 'LARGE',
};

export const BUTTON_TYPES = {
  LABEL_ONLY: 'LABEL_ONLY',
  ICON_ONLY: 'ICON_ONLY',
  LABEL_AND_ICON: 'LABEL_AND_ICON',
  LABEL_AND_TWO_ICONS: 'LABEL_AND_TWO_ICONS',
};

const iconTypeStringToIconTypeComponent = (iconTypeString, iconHeightWidth, primaryColor) => {
  let Icon = null;

  if (iconTypeString) {
    switch (iconTypeString) {
      case 'user':
        Icon = (
          // todo: width and height for large and medium icons are different
          // https://app.zeplin.io/project/603fa53e2626ed1592e7c0e6/screen/60411633bdf9b380a0f087ca
          <UserIcon
            height={iconHeightWidth}
            width={iconHeightWidth}
            fill={primaryColor}
          />
        );
        break;
      case 'chevron-up':
        Icon = (
          <ChevronUpIcon
            height={iconHeightWidth}
            width={iconHeightWidth}
            fill={primaryColor}
          />
        );
        break;
      case 'chevron-down':
        Icon = (
          <ChevronDownIcon
            height={iconHeightWidth}
            width={iconHeightWidth}
            fill={primaryColor}
          />
        );
        break;
      default:
        Icon = null;
        break;
    }
  }

  return Icon;
};

// istanbul ignoring because we don't have a good way to test styled components yet
// hover overrides link hover global style
const StyledDynamicButton = styled.button.attrs((props) => ({
  buttonStyle: props.buttonStyle,
  primaryColor: props.primaryColor,
  font: props.font,
}))`
  /* istanbul ignore next */
  font-family: ${({ font }) => font};

  ${({ buttonStyle, primaryColor }) => {
    // istanbul ignore next
    switch (buttonStyle) {
      // istanbul ignore next
      case BUTTON_STYLES.WHITE_BACKGROUND_FILLED:
        return `
          background-color: #ffffff;
          border-color: #ffffff;
          color: ${primaryColor};

          &:hover {
            color: ${primaryColor};
          }
        `;
      case BUTTON_STYLES.OUTLINED:
        // istanbul ignore next
        return `
          background-color: transparent;
          border-color: ${primaryColor};
          color: ${primaryColor};

          &:hover {
            color: ${primaryColor};
          }
        `;
      case BUTTON_STYLES.OUTLINED_GREY:
        // istanbul ignore next
        return `
          background-color: transparent;
          border-color: rgba(255, 255, 255, 0.5);
          color: #ffffff;

          &:hover {
            color: #ffffff;
          }
        `;
      case BUTTON_STYLES.FILLED:
      default:
        // istanbul ignore next
        return `
          background-color: ${primaryColor};
          border-color: ${primaryColor};
          color: #ffffff;

          &:hover {
            color: #ffffff;
          }
        `;
    }
  }}
`;

// get the class name for the button based on the button size based on mocks
const matchButtonSizeWithClass = (matchedButtonSize) => {
  switch (matchedButtonSize) {
    case BUTTON_SIZES.SMALL:
      return 'xpmedia-button--small';
    case BUTTON_SIZES.LARGE:
      return 'xpmedia-button--large';
    case BUTTON_SIZES.MEDIUM:
    default:
      return 'xpmedia-button--medium';
  }
};

function renderButtonContents(matchedButtonType, text, iconComponent, secondaryIconComponent) {
  switch (matchedButtonType) {
    case BUTTON_TYPES.LABEL_AND_TWO_ICONS:
      return (
        <>
          <div className="xpmedia-button--left-icon-container">
            {iconComponent}
          </div>
          {text}
          <div className="xpmedia-button--right-icon-container">
            {secondaryIconComponent}
          </div>
        </>
      );
    case BUTTON_TYPES.LABEL_AND_ICON:
      return (
        <>
          <div className="xpmedia-button--left-icon-container">
            {iconComponent}
          </div>
          {text}
        </>
      );
    case BUTTON_TYPES.ICON_ONLY:
      return (iconComponent);
    case BUTTON_TYPES.LABEL_ONLY:
    default:
      return (text);
  }
}

function Button(props) {
  const { arcSite } = useFusionContext();

  const {
    ariaLabel,
    as,
    buttonSize,
    buttonStyle,
    buttonType,
    fullWidth,
    iconType,
    secondaryIconType,
    text,
    type,
  } = props;

  const matchedButtonSizeClass = matchButtonSizeWithClass(buttonSize);

  let iconHeightWidth = 16;

  const primaryColor = getThemeStyle(arcSite)['primary-color'];
  const primaryFont = getThemeStyle(arcSite)['primary-font-family'];

  const elementType = !type && as === undefined ? 'button' : null;

  switch (buttonSize) {
    case BUTTON_SIZES.LARGE:
      iconHeightWidth = 26;
      break;
    case BUTTON_SIZES.MEDIUM:
      iconHeightWidth = 24;
      break;
    case BUTTON_SIZES.SMALL:
    default:
      iconHeightWidth = 16;
  }

  const PrimaryIcon = iconTypeStringToIconTypeComponent(
    iconType,
    iconHeightWidth,
    primaryColor,
  );
  const SecondaryIcon = iconTypeStringToIconTypeComponent(
    secondaryIconType,
    iconHeightWidth,
    primaryColor,
  );

  return (
    <StyledDynamicButton
      arcSite={arcSite}
      aria-label={buttonType === BUTTON_TYPES.ICON_ONLY ? (ariaLabel || text) : null}
      as={as}
      buttonStyle={buttonStyle}
      className={`xpmedia-button ${matchedButtonSizeClass}${fullWidth ? ' xpmedia-button--full-width' : ''}`}
      font={primaryFont}
      primaryColor={primaryColor}
      type={elementType}
      {...props}
    >
      {renderButtonContents(buttonType, text, PrimaryIcon, SecondaryIcon)}
    </StyledDynamicButton>
  );
}

Button.propTypes = {
  buttonSize: PropTypes.oneOf(Object.values(BUTTON_SIZES)),
  buttonStyle: PropTypes.oneOf(Object.values(BUTTON_STYLES)),
  buttonType: PropTypes.oneOf(Object.values(BUTTON_TYPES)),
  iconType: PropTypes.string,
  text: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string,

  // for if button
  type: PropTypes.string,

  // for if a tag
  href: PropTypes.string,
};

Button.defaultProps = {
  buttonSize: BUTTON_SIZES.MEDIUM,
  buttonStyle: BUTTON_STYLES.FILLED,
  buttonType: BUTTON_TYPES.LABEL_ONLY,
  iconType: '',
};

export default Button;
