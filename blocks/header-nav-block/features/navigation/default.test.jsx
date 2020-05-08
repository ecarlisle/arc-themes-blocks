import React from 'react';
import { mount } from 'enzyme';
import getProperties from 'fusion:properties';
import Navigation from './default';
import SearchBox from './_children/search-box';

jest.mock('fusion:themes', () => (jest.fn(() => ({}))));
jest.mock('fusion:properties', () => (jest.fn(() => ({}))));
jest.mock('fusion:context', () => ({
  useFusionContext: jest.fn(() => ({
    contextPath: 'pf',
    deployment: jest.fn(() => ({})).mockReturnValue('path/image.svg'),
  })),
}));
jest.mock('fusion:content', () => ({
  useContent: jest.fn(() => ({})),
}));

describe('the header navigation feature for the default output type', () => {
  it('should be a nav element with class .news-theme-navigation', () => {
    const wrapper = mount(<Navigation />);

    expect(wrapper.find('nav').hasClass('news-theme-navigation-feature')).toBe(true);
  });

  it('should render a SearchBox component in the top navbar', () => {
    const wrapper = mount(<Navigation />);

    expect(wrapper.find('.nav-left').find(SearchBox)).toHaveLength(1);
  });

  it('should render a SearchBox component in the side navbar', () => {
    const wrapper = mount(<Navigation />);

    expect(wrapper.find('#nav-sections').find(SearchBox)).toHaveLength(1);
  });

  describe('when the showSignIn customField is set to true', () => {
    it('should render a Sign In button', () => {
      const wrapper = mount(<Navigation customFields={{ showSignIn: true }} />);

      expect(wrapper.find('.nav-right span')).toIncludeText('Sign In');
    });
  });

  describe('the navigation bar image/logo', () => {
    describe('when the theme manifest provides a logo url', () => {
      it('should make the src of the logo the provided image', () => {
        getProperties.mockImplementation(() => ({ primaryLogo: 'https://test.com/my-nav-logo.svg' }));
        const wrapper = mount(<Navigation />);

        expect(wrapper.find('div.nav-logo > a > img')).toHaveProp('src', 'https://test.com/my-nav-logo.svg');
      });

      it('should make the alt text of the logo the default text', () => {
        const wrapper = mount(<Navigation />);

        expect(wrapper.find('div.nav-logo > a > img')).toHaveProp('alt', 'Navigation bar logo');
      });

      describe('when the theme manifest provides alt text for the logo', () => {
        it('should make the alt text of the logo the provided text', () => {
          getProperties.mockImplementation(() => ({ primaryLogo: 'my-nav-logo.svg', primaryLogoAlt: 'My Nav Logo' }));
          const wrapper = mount(<Navigation />);

          expect(wrapper.find('div.nav-logo > a > img')).toHaveProp('alt', 'My Nav Logo');
        });
      });
      describe('when the provided logo is a relative url', () => {
        it('should create a url with a context path', () => {
          getProperties.mockImplementation(() => ({ primaryLogo: 'image.svg' }));
          const wrapper = mount(<Navigation />);

          expect(wrapper.find('div.nav-logo > a > img')).toHaveProp('src', 'path/image.svg');
        });
      });
    });

    describe('when the theme does not provide a logo url', () => {
      it('should not render a logo', () => {
        getProperties.mockImplementation(() => ({}));
        const wrapper = mount(<Navigation />);

        expect(wrapper.find('div.nav-logo > a > img').length).toBe(0);
      });
    });
  });


  describe('when the nav color is set to "dark"', () => {
    it('should set the "dark" class on the component', () => {
      const wrapper = mount(<Navigation customFields={{ navColor: 'dark' }} />);

      expect(wrapper.find('.news-theme-navigation-feature')).toHaveClassName('dark');
    });

    it('should set all buttons to use the light color scheme', () => {
      const wrapper = mount(<Navigation customFields={{ navColor: 'dark' }} />);

      expect(wrapper.find('.nav-btn.nav-sections-btn').every('.nav-btn-dark')).toEqual(true);
    });

    it('should pass the navColor to the SearchBox', () => {
      const wrapper = mount(<Navigation customFields={{ navColor: 'dark' }} />);

      expect(wrapper.find(SearchBox).first()).toHaveProp('navBarColor', 'dark');
    });
  });

  describe('when the nav color is set to "light"', () => {
    it('should set the "light" class on the component', () => {
      const wrapper = mount(<Navigation customFields={{ navColor: 'light' }} />);

      expect(wrapper.find('.news-theme-navigation-feature')).toHaveClassName('light');
    });
    it('should set all buttons to use the light color scheme', () => {
      const wrapper = mount(<Navigation customFields={{ navColor: 'light' }} />);

      expect(wrapper.find('.nav-btn.nav-sections-btn').every('.nav-btn-light')).toEqual(true);
    });

    it('should pass the navColor to the SearchBox', () => {
      const wrapper = mount(<Navigation customFields={{ navColor: 'light' }} />);

      expect(wrapper.find(SearchBox).first()).toHaveProp('navBarColor', 'light');
    });
  });
});
