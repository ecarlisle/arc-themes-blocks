import React from "react";
import { useFusionContext } from "fusion:context";
import getProperties from "fusion:properties";
import getTranslatedPhrases from "fusion:intl";
import { Button, Icon } from "@wpmedia/arc-themes-components";
import SearchBox from "./search-box";
import QuerylySearch from "./queryly-search";
import { WIDGET_CONFIG, PLACEMENT_AREAS } from "../nav-helper";

const NavWidget = ({
	children = [],
	customSearchAction,
	menuButtonClickAction,
	placement = PLACEMENT_AREAS.NAV_BAR,
	position = 0,
	type,
}) => {
	const { arcSite } = useFusionContext();
	const { locale } = getProperties(arcSite);
	const phrases = getTranslatedPhrases(locale);
	if (!type || type === "none") return null;

	const predefinedWidget =
		(type === "search" && (
			<SearchBox
				iconSize={WIDGET_CONFIG[placement]?.iconSize}
				placeholderText={phrases.t("header-nav-chain-block.search-text")}
				customSearchAction={customSearchAction}
				alwaysOpen={WIDGET_CONFIG[placement]?.expandSearch}
			/>
		)) ||
		(type === "queryly" && (
			<QuerylySearch
				// passing in placement for nav-spcific styling
				placement={placement}
			/>
		)) ||
		(type === "menu" && (
			<Button
				aria-label={phrases.t("header-nav-chain-block.sections-button")}
				onClick={menuButtonClickAction}
				iconLeft={<Icon name="HamburgerMenu" />}
				variant="secondary-reverse"
				size="small"
			>
				{phrases.t("header-nav-chain-block.sections-button")}
			</Button>
		));

	return (
		predefinedWidget ||
		(children &&
		children.length > 0 &&
		position &&
		position > 0 &&
		Number.isInteger(position) &&
		position <= children.length
			? children[position - 1]
			: null)
	);
};

export default NavWidget;
