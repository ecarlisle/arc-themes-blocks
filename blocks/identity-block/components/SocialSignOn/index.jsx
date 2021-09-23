import React, { useEffect, useState } from 'react';
import useIdentity from '../Identity';
import './styles.scss';

const SocialSignOn = ({ onError, redirectURL }) => {
  const { Identity } = useIdentity();
  const config = Identity?.configOptions ?? {};

  const [isGoogleInitialized, setIsGoogleInitialized] = useState(false);
  const [isFacebookInitialized, setIsFacebookInitialized] = useState(false);

  if (!window.onFacebookSignOn) {
    window.onFacebookSignOn = async () => {
      try {
        await Identity.facebookSignOn();
        window.location = redirectURL;
      } catch (e) {
        onError();
      }
    };
  }

  useEffect(() => {
    const fetchConfig = async () => {
      await Identity.getConfig();
    };
    if (!Identity && !Identity.configOptions) {
      fetchConfig();
    }
  }, [Identity]);

  useEffect(() => {
    const initializeFacebook = async () => {
      await Identity.initFacebookLogin(null);
    };
    const initializeGoogle = async () => {
      await Identity.initGoogleLogin(null, {
        width: 300,
        height: 48,
        onSuccess: () => { window.location = redirectURL; },
        onFailure: () => { onError(); },
      });
    };
    if (config.googleClientId && !isGoogleInitialized) {
      initializeGoogle();
      setIsGoogleInitialized(true);
    }
    if (config.facebookAppId && !isFacebookInitialized) {
      initializeFacebook();
      setIsFacebookInitialized(true);
    }
  }, [Identity,
    config.facebookAppId,
    config.googleClientId,
    isFacebookInitialized,
    isGoogleInitialized,
    onError,
    redirectURL]);

  if (!Identity) {
    return null;
  }

  if (!config.facebookAppId && !config.googleClientId) {
    return null;
  }

  return (
    <section className="xpmedia-social-signin-wrapper">
      {
        config.googleClientId ? <div id="google-sign-in-button" /> : null
      }
      {
        config.facebookAppId ? (
          <div
            className="fb-login-button"
            data-width="512"
            data-size="large"
            data-button-type="login_with"
            data-scope="public_profile,email"
            data-auto-logout-link="false"
            data-use-continue-as="true"
            data-onlogin="window.onFacebookSignOn()"
          />
        ) : null
      }
    </section>
  );
};

SocialSignOn.displayName = 'SocialSignOn';

export default SocialSignOn;
