import { useState, useEffect } from "react";

import { useSales } from "@wpmedia/arc-themes-components";

const STRIPE_PAYMENT_METHOD_ID = 18;
const PAYPAL_METHOD_ID = 10;

export const getPaymentMethodByID = (paymentOptions, paymentMethodTypeID, paymentMethodID) => {
	const stripeDefault = paymentOptions?.find(
		(opts) =>
			opts?.paymentMethodType === paymentMethodTypeID && opts?.paymentMethodID === paymentMethodID,
	);

	if (stripeDefault) {
		return stripeDefault;
	}

	if (!stripeDefault) {
		const allStripeIntents = paymentOptions?.filter(
			(opts) => opts?.paymentMethodType === paymentMethodTypeID,
		);

		return allStripeIntents.reduce((res, obj) =>
			obj.paymentMethodID < res.paymentMethodID ? obj : res,
		);
	}

	return undefined;
};

// On subscriptions side we can setup multiple payment providers with the same typeID.
// This hook is on charge to return the default one or the one with the min paymentMethodID
const usePaymentOptions = (stripeIntentsDefaultID, paypalDefaultID) => {
	const [paymentOpts, setPaymentOpts] = useState();
	const [paypal, setPaypal] = useState();
	const [stripeIntents, setStripeIntents] = useState();
	const [isFetching, setIsFetching] = useState(true);
	const [error, setError] = useState();

	const { Sales } = useSales();

	useEffect(() => {
		const fetchData = async () => {
			if (Sales && !error && isFetching) {
				try {
					const options = await Sales.getPaymentOptions();
					const stripeSettings = getPaymentMethodByID(
						options,
						STRIPE_PAYMENT_METHOD_ID,
						stripeIntentsDefaultID,
					);
					setStripeIntents(stripeSettings);
		
					const paypalSettings = getPaymentMethodByID(options, PAYPAL_METHOD_ID, paypalDefaultID);
					setPaypal(paypalSettings);
					
					setPaymentOpts(options);
					setIsFetching(false);
				} catch (e) {
					setError(e);
					setIsFetching(false);
				}
			}
		};

		fetchData();
	}, [Sales, stripeIntentsDefaultID, paypalDefaultID, error, isFetching]);

	return {
		paymentOpts,
		stripeIntents,
		paypal,
		error,
		isFetching,
	};
};

export default usePaymentOptions;
