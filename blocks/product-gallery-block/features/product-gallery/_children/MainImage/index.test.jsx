import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MainImage from "./index";
import mockData from "../../mock-data";

jest.mock("fusion:environment", () => ({
	RESIZER_TOKEN_VERSION: 1,
}));

const observe = jest.fn();
const disconnect = jest.fn();
window.IntersectionObserver = jest.fn(() => ({
	observe,
	disconnect,
}));

describe("Product Focus View : Main Image", () => {
	it("Renders an image.", () => {
		const isVisible = true;
		render(
			<MainImage image={mockData[0]} loading={isVisible ? "eager" : "lazy"} onVisible={() => 0} />,
		);
		expect(screen.queryAllByRole("img")).toHaveLength(1);
	});
	it("Renders an image.", () => {
		const isVisible = false;
		render(
			<MainImage image={mockData[0]} loading={isVisible ? "eager" : "lazy"} onVisible={() => 0} />,
		);
		expect(screen.queryAllByRole("img")).toHaveLength(1);
	});
});
