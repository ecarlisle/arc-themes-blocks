import React from "react";
import ProductAssortmentCarousel from "./features/product-assortment-carousel/default";

// for more info on storybook and using the component explorer
// https://storybook.js.org/
export default {
	title: "Blocks/Product Assortment Carousel",
	parameters: {
		chromatic: { viewports: [320, 1200] },
	},
};

export const withHeader = () => (
	<ProductAssortmentCarousel customFields={{ headerText: "Product Assortment Carousel" }} />
);

export const withOutHeader = () => <ProductAssortmentCarousel customFields={{}} />;
