import React, { useEffect, useState } from 'react';
import PropTypes from '@arc-fusion/prop-types';
import { isServerSide } from '@wpmedia/engine-theme-sdk';
import getProperties from 'fusion:properties';
import getTranslatedPhrases from 'fusion:intl';
import { PrimaryFont } from '@wpmedia/shared-styles';
import FormInputField, { FIELD_TYPES } from '../../components/FormInputField';
import useIdentity from '../../components/Identity';

import './styles.scss';

function validatePasswordRegex(
  pwLowercase,
  pwMinLength,
  pwPwNumbers,
  pwSpecialCharacters,
  pwUppercase,
) {
  // eslint-disable-next-line no-useless-escape
  return `^(?=.*[a-z]{${pwLowercase},})(?=.*[A-Z]{${pwUppercase},})(?=.*\d{${pwPwNumbers},})(?=.*[@$!%*?&]{${pwSpecialCharacters},})[A-Za-z\d@$!%*?&]{${pwMinLength},}$`;
}

const SignUp = ({ customFields, arcSite }) => {
  let { redirectURL } = customFields;
  const { redirectToPreviousPage } = customFields;
  const { locale = 'en' } = getProperties(arcSite);
  const phrases = getTranslatedPhrases(locale);

  const { Identity, isInitialized } = useIdentity();

  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const [passwordRequirements, setPasswordRequirements] = useState({
    status: 'initial',
  });

  const [error, setError] = useState();

  useEffect(() => {
    const getConfig = async () => {
      await Identity.getConfig()
        .then((response) => {
          const {
            pwLowercase,
            pwMinLength,
            pwPwNumbers,
            pwSpecialCharacters,
            pwUppercase,
          } = response;

          setPasswordRequirements({
            pwLowercase,
            pwMinLength,
            pwPwNumbers,
            pwSpecialCharacters,
            pwUppercase,
            status: 'success',
          });
        })
        .catch(() => setPasswordRequirements({ status: 'error' }));
    };

    if (Identity) {
      // https://redirector.arcpublishing.com/alc/docs/swagger/?url=./arc-products/arc-identity-v1.json#/Tenant_Configuration/get
      getConfig();
    }
  }, [Identity]);

  if (!isInitialized) {
    return null;
  }

  if (redirectToPreviousPage && !isServerSide()) {
    redirectURL = document?.referrer;
  }

  const {
    pwLowercase,
    pwMinLength,
    pwPwNumbers,
    pwSpecialCharacters,
    pwUppercase,
    status,
  } = passwordRequirements;
  return (
    <section>
      <PrimaryFont
        as="h1"
      >
        {phrases.t('identity-block.sign-up')}
      </PrimaryFont>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          return Identity.signUp({
            userName: email,
            credentials: password,
          }, {
            email,
          })
            .then(() => { window.location = redirectURL; })
            .catch(() => setError('Something went wrong'));
        }}
      >
        <FormInputField
          label={phrases.t('identity-block.email')}
          name="email"
          onChange={setEmail}
          required
          showDefaultError={false}
          type={FIELD_TYPES.EMAIL}
          validationErrorMessage={phrases.t('identity-block.email-requirements')}
        />
        <FormInputField
          label={phrases.t('identity-block.password')}
          name="password"
          onChange={setPassword}
          required
          showDefaultError={false}
          type={FIELD_TYPES.PASSWORD}
          validationErrorMessage={status === 'success' ? phrases.t('identity-block.password-requirements', {
            pwLowercase,
            pwMinLength,
            pwPwNumbers,
            pwSpecialCharacters,
            pwUppercase,
          }) : ''}
          validationPattern={validatePasswordRegex(
            pwLowercase,
            pwMinLength,
            pwPwNumbers,
            pwSpecialCharacters,
            pwUppercase,
          )}
        />
        <PrimaryFont
          as="button"
          className="xpmedia-subs-filled-button xpmedia-subs-medium-button"
          type="submit"
        >
          {phrases.t('identity-block.sign-up')}
        </PrimaryFont>
        {error ? (
          <section>
            <PrimaryFont
              as="p"
            >
              {error}
            </PrimaryFont>
          </section>
        ) : null}
      </form>
    </section>
  );
};

SignUp.label = 'Identity Sign Up - Arc Block';

SignUp.propTypes = {
  customFields: PropTypes.shape({
    redirectURL: PropTypes.string.tag({
      name: 'Redirect URL',
      defaultValue: '/account/',
    }),
    redirectToPreviousPage: PropTypes.bool.tag({
      name: 'Redirect to previous page',
      defaultValue: true,
      description: 'Do you wish for the user to be redirected to the page they entered from before signing up? This overrides redirect URL',
    }),
  }),
};

export default SignUp;
