import React, { useState } from "react";
import PropTypes from "@arc-fusion/prop-types";
import { useFusionContext } from "fusion:context";
import getProperties from "fusion:properties";
import getTranslatedPhrases from "fusion:intl";
import {
	Input,
	useIdentity,
	Paragraph,
	BotChallengeProtection,
} from "@wpmedia/arc-themes-components";
import HeadlinedSubmitForm from "../../components/headlined-submit-form";
import useLogin from "../../components/login";
import useOIDCLogin from "../../utils/useOIDCLogin";
import validateURL from "../../utils/validate-redirect-url";

const BLOCK_CLASS_NAME = "b-login-form";

const errorCodes = {
	100015: "identity-block.login-form-error.account-is-disabled",
	130001: "identity-block.login-form-error.captcha-token-invalid",
	130051: "identity-block.login-form-error.unverified-email-address",
	100013: "identity-block.login-form-error.max-devices",
	0: "identity-block.login-form-error.invalid-email-password",
};

export function definedMessageByCode(code) {
	return errorCodes[code] || errorCodes["0"];
}

const Login = ({ customFields }) => {
	const {
		redirectURL,
		redirectToPreviousPage,
		loggedInPageLocation,
		OIDC,
		termsAndPrivacyURL,
	} = customFields;

	let urlString = '';
	let url = '';

	if (window?.location?.href) {
		urlString = window.location.href;
		url = new URL(urlString);
	}

	const { isAdmin, arcSite } = useFusionContext();
	const { locale } = getProperties(arcSite);
	const phrases = getTranslatedPhrases(locale);

	const isOIDC =
		OIDC && url.searchParams.get("client_id") && url.searchParams.get("response_type") === "code";

	const { Identity, isInitialized } = useIdentity();

	const [captchaToken, setCaptchaToken] = useState();
	const [captchaError, setCaptchaError] = useState();
	const [resetRecaptcha, setResetRecaptcha] = useState(true);

	const [error, setError] = useState();

	const { loginRedirect } = useLogin({
		isAdmin,
		redirectURL,
		redirectToPreviousPage,
		loggedInPageLocation,
		isOIDC,
	});
	const { loginByOIDC } = useOIDCLogin();

	if (!isInitialized) {
		return null;
	}

	return (
		<HeadlinedSubmitForm
			buttonLabel={phrases.t("identity-block.log-in")}
			className={BLOCK_CLASS_NAME}
			headline={phrases.t("identity-block.log-in-headline")}
			onSubmit={({ email, password }) => {
				setError(null);
				setCaptchaError(null);
				return Identity.login(email, password, {
					rememberMe: true,
					recaptchaToken: captchaToken,
				})
					.then(() => {
						if (isOIDC) {
							loginByOIDC();
						} else {
							const validatedURL = validateURL(loginRedirect);
							window.location = validatedURL;
						}
					})
					.catch((e) => {
						setResetRecaptcha(!resetRecaptcha);
						if (e?.code === "130001") {
							setCaptchaError(phrases.t(definedMessageByCode(e.code)));
						} else {
							setError(phrases.t(definedMessageByCode(e.code)));
						}
					});
			}}
		>
			{error ? (
				<div className={`${BLOCK_CLASS_NAME}__login-form-error`}>
					<Paragraph>{error}</Paragraph>
				</div>
			) : null}
			<Input
				autoComplete="email"
				label={phrases.t("identity-block.email-label")}
				name="email"
				required
				showDefaultError={false}
				type="email"
				validationErrorMessage={phrases.t("identity-block.email-requirements")}
			/>
			<Input
				autoComplete="current-password"
				label={phrases.t("identity-block.password")}
				name="password"
				required
				showDefaultError={false}
				type="password"
			/>
			<BotChallengeProtection
				challengeIn="signin"
				setCaptchaToken={setCaptchaToken}
				captchaError={captchaError}
				error={error}
				setCaptchaError={setCaptchaError}
				resetRecaptcha={resetRecaptcha}
			/>
			<div className={`${BLOCK_CLASS_NAME}__tos-container`}>
				<Paragraph
					dangerouslySetInnerHTML={{
						__html: phrases.t("identity-block.terms-service-privacy-text", { termsAndPrivacyURL }),
					}}
				/>
			</div>
		</HeadlinedSubmitForm>
	);
};

Login.label = "Identity Log In - Arc Block";

Login.propTypes = {
	customFields: PropTypes.shape({
		redirectURL: PropTypes.string.tag({
			name: "Redirect URL",
			defaultValue: "/account/",
		}),
		redirectToPreviousPage: PropTypes.bool.tag({
			name: "Redirect to previous page",
			defaultValue: true,
			description:
				"Do you wish for the user to be redirected to the page they entered from before logging in? This overrides redirect URL",
		}),
		loggedInPageLocation: PropTypes.string.tag({
			name: "Logged In URL",
			defaultValue: "/account/",
			description:
				"The URL to which a user would be redirected to if visiting a login page when already logged in.",
		}),
		OIDC: PropTypes.bool.tag({
			name: "Login with OIDC",
			defaultValue: false,
			description:
				"Used when authenticating a third party site with OIDC PKCE flow. This will use an ArcXp Org as an auth provider",
		}),
		termsAndPrivacyURL: PropTypes.string.tag({
			name: "Privacy Policy URL",
			defaultValue: "/privacy-policy/",
		}),
	}),
};

export default Login;
