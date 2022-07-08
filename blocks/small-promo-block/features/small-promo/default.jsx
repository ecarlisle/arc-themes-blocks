import React from "react";
import PropTypes from "@arc-fusion/prop-types";
import { useContent } from "fusion:content";
import { useComponentContext, useFusionContext } from "fusion:context";
import getProperties from "fusion:properties";
import {
	formatURL,
	Heading,
	HeadingSection,
	Image,
	isServerSide,
	Link,
	MediaItem,
	Grid,
} from "@wpmedia/arc-themes-components";
import { LazyLoad } from "@wpmedia/engine-theme-sdk";

const BLOCK_CLASS_NAME = "b-small-promo";

const SmallPromo = ({ customFields }) => {
	const { imagePosition, lazyLoad, showHeadline, showImage } = customFields;
	const { registerSuccessEvent } = useComponentContext();
	const { arcSite, isAdmin } = useFusionContext();
	const shouldLazyLoad = lazyLoad && !isAdmin;

	const content =
		useContent({
			source: customFields?.itemContentConfig?.contentService ?? null,
			query: customFields?.itemContentConfig?.contentConfigValues
				? {
						feature: "small-promo",
						...customFields.itemContentConfig.contentConfigValues,
				  }
				: null,
			// does not need embed_html because no video section
			// does not need website section nor label because no overline
			// does not need byline because no byline shown
			filter: `{
		_id
		description {
			basic
		}
		display_date
		type
		headlines {
			basic
		}
		promo_items {
			type
			url
			lead_art {
				type
				promo_items {
					basic {
						type
						url
						resized_params {
							800x600
							800x533
							800x450
							600x450
							600x400
							600x338
						}
					}
				}
			}
			basic {
				type
				url
				resized_params {
					800x600
					800x533
					800x450
					600x450
					600x400
					600x338
				}
			}
		}
		websites {
			${arcSite} {
				website_url
			}
		}
	}`,
		}) || null;

	const linkURL = content?.websites?.[arcSite]?.website_url;
	const imageURL =
		content.promo_items?.basic?.type === "image" && content.promo_items?.basic?.url
			? content.promo_items.basic.url
			: null;
	const headline = content?.description?.basic;

	if (shouldLazyLoad && isServerSide()) {
		return null;
	}

	const PromoImage = () => {
		const { fallbackImage } = getProperties(arcSite);
		const ImageDisplay =
			showImage && imageURL ? (
				<MediaItem>
					<Image alt="" src={imageURL || fallbackImage} />
				</MediaItem>
			) : null;
		return showImage && linkURL ? (
			<Link href={formatURL(linkURL)} onClick={registerSuccessEvent} assistiveHidden>
				{ImageDisplay}
			</Link>
		) : (
			ImageDisplay
		);
	};

	const PromoHeading = () =>
		showHeadline && headline ? (
			<Heading>
				{linkURL ? (
					<Link href={formatURL(linkURL)} onClick={registerSuccessEvent}>
						{headline}
					</Link>
				) : (
					headline
				)}
			</Heading>
		) : null;

	const containerClassNames = [
		BLOCK_CLASS_NAME,
		!showImage || !showHeadline ? null : `${BLOCK_CLASS_NAME}--${imagePosition}`,
	]
		.filter((classString) => classString)
		.join(" ");

	return (
		<LazyLoad enabled={shouldLazyLoad}>
			<HeadingSection>
				<Grid as="article" className={containerClassNames}>
					{["below", "right"].includes(imagePosition) ? (
						<>
							<PromoHeading />
							<PromoImage />
						</>
					) : (
						<>
							<PromoImage />
							<PromoHeading />
						</>
					)}
				</Grid>
			</HeadingSection>
		</LazyLoad>
	);
};

SmallPromo.propTypes = {
	customFields: PropTypes.shape({
		itemContentConfig: PropTypes.contentConfig("ans-item").tag({
			group: "Configure Content",
			label: "Display Content Info",
		}),
		showHeadline: PropTypes.bool.tag({
			label: "Show headline",
			defaultValue: true,
			group: "Show promo elements",
		}),
		showImage: PropTypes.bool.tag({
			label: "Show image",
			defaultValue: true,
			group: "Show promo elements",
		}),
		imageOverrideURL: PropTypes.string.tag({
			label: "Image URL",
			group: "Image",
			searchable: "image",
		}),
		imagePosition: PropTypes.oneOf(["right", "left", "above", "below"]).tag({
			defaultValue: "right",
			label: "Image Position",
			group: "Image",
			labels: {
				right: "Image Right",
				left: "Image Left",
				above: "Image Above",
				below: "Image Below",
			},
		}).isRequired,
		imageRatio: PropTypes.oneOf(["16:9", "3:2", "4:3"]).tag({
			defaultValue: "3:2",
			label: "Image ratio",
			group: "Art",
		}),
		lazyLoad: PropTypes.bool.tag({
			name: "Lazy Load block?",
			defaultValue: false,
			description:
				"Turning on lazy-loading will prevent this block from being loaded on the page until it is nearly in-view for the user.",
		}),
	}),
};

SmallPromo.label = "Small Promo – Arc Block";

SmallPromo.icon = "paragraph-bullets";

export default SmallPromo;
