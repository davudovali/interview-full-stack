import React, { act } from "react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import ProductsListView from "./ProductsListView";

const mockProductsList = [
    {
        id: 0,
        name: "Lego Set",
        description: "A creative and engaging toy for kids and adults alike.",
        price: 75.63,
    },
    {
        id: 1,
        name: "Smartphone",
        description:
            "A cutting-edge device with advanced features and a sleek design.",
        price: 459.72,
    },
    {
        id: 2,
        name: "Running Shoes",
        description:
            "Lightweight and comfortable, perfect for athletes and casual joggers.",
        price: 103.62,
    },
    {
        id: 3,
        name: "Cooking Pan",
        description: "Durable and non-stick, ideal for everyday cooking.",
        price: 43.18,
    },
    {
        id: 4,
        name: "Electric Toothbrush",
        description: "Ensures deep cleaning with advanced brushing technology.",
        price: 103.64,
    },
    {
        id: 5,
        name: "Yoga Mat",
        description: "Non-slip and cushioned, suitable for all fitness levels.",
        price: 452.84,
    },
    {
        id: 6,
        name: "Bluetooth Speaker",
        description: "Compact and portable, delivering high-quality sound.",
        price: 350.68,
    },
    {
        id: 7,
        name: "Gaming Mouse",
        description:
            "Ergonomic design with customizable buttons for pro-level gaming.",
        price: 84.25,
    },
    {
        id: 8,
        name: "Cereal Box",
        description: "A nutritious and tasty breakfast choice for all ages.",
        price: 31.86,
    },
    {
        id: 9,
        name: "Water Bottle",
        description:
            "Reusable and insulated, keeps drinks hot or cold for hours.",
        price: 396.42,
    },
    {
        id: 10,
        name: "Desk Lamp Uniq",
        description: "Adjustable brightness, perfect for reading or working.",
        price: 11.59,
    },
    {
        id: 11,
        name: "Camping Tent",
        description: "Spacious and weatherproof, great for outdoor adventures.",
        price: 28.1,
    },
    {
        id: 12,
        name: "Board Game",
        description: "Fun and engaging, ideal for family game nights.",
        price: 19.8,
    },
    {
        id: 13,
        name: "Organic Coffee Beans",
        description: "Rich and aromatic, sourced from sustainable farms.",
        price: 370.21,
    },
    {
        id: 14,
        name: "Vacuum Cleaner",
        description: "Powerful suction and versatile for all floor types.",
        price: 280.88,
    },
    {
        id: 15,
        name: "Lego Set",
        description: "A creative and engaging toy for kids and adults alike.",
        price: 209.47,
    },
    {
        id: 16,
        name: "Smartphone",
        description:
            "A cutting-edge device with advanced features and a sleek design.",
        price: 274.44,
    },
    {
        id: 17,
        name: "Running Shoes",
        description:
            "Lightweight and comfortable, perfect for athletes and casual joggers.",
        price: 463.37,
    },
    {
        id: 18,
        name: "Cooking Pan",
        description: "Durable and non-stick, ideal for everyday cooking.",
        price: 223.71,
    },
    {
        id: 19,
        name: "Electric Toothbrush",
        description: "Ensures deep cleaning with advanced brushing technology.",
        price: 148.72,
    },
    {
        id: 20,
        name: "Yoga Mat",
        description: "Non-slip and cushioned, suitable for all fitness levels.",
        price: 430.12,
    },
    {
        id: 21,
        name: "Bluetooth Speaker",
        description: "Compact and portable, delivering high-quality sound.",
        price: 185.45,
    },
    {
        id: 22,
        name: "Gaming Mouse",
        description:
            "Ergonomic design with customizable buttons for pro-level gaming.",
        price: 480.87,
    },
    {
        id: 23,
        name: "Cereal Box",
        description: "A nutritious and tasty breakfast choice for all ages.",
        price: 143.21,
    },
    {
        id: 24,
        name: "Water Bottle",
        description:
            "Reusable and insulated, keeps drinks hot or cold for hours.",
        price: 86.59,
    },
    {
        id: 25,
        name: "Desk Lamp",
        description: "Adjustable brightness, perfect for reading or working.",
        price: 70.14,
    },
    {
        id: 26,
        name: "Camping Tent",
        description: "Spacious and weatherproof, great for outdoor adventures.",
        price: 29.34,
    },
    {
        id: 27,
        name: "Board Game",
        description: "Fun and engaging, ideal for family game nights.",
        price: 139.42,
    },
];

describe("ProductsListView", () => {
    it("renders error component with retry button if error is present", () => {
        const mockOnRetry = vi.fn();
        const errorMessage = "Something went wrong";

        render(
            <BrowserRouter>
                <ProductsListView
                    products={null}
                    error={errorMessage}
                    onRetry={mockOnRetry}
                />
            </BrowserRouter>
        );

        expect(screen.getByText(errorMessage)).toBeInTheDocument();

        const retryButton = screen.getByText("Retry");
        expect(retryButton).toBeInTheDocument();

        fireEvent.click(retryButton);
        expect(mockOnRetry).toHaveBeenCalledTimes(1);
    });

    it("should renders Spin when products are null and no error is present", () => {
        render(
            <BrowserRouter>
                <ProductsListView
                    products={null}
                    error={null}
                    onRetry={() => {}}
                />
            </BrowserRouter>
        );

        expect(screen.getByTestId("spinner")).toBeInTheDocument();
    });

    it("virtual list should react to resize and render more cards", async () => {
        Object.defineProperty(HTMLElement.prototype, "getBoundingClientRect", {
            value: function () {
                return {
                    width: 1000,
                    height: 800,
                };
            },
            writable: true,
            configurable: true,
        });

        render(
            <div id="root">
                <BrowserRouter>
                    <ProductsListView
                        products={mockProductsList}
                        error={null}
                        onRetry={() => {}}
                    />
                </BrowserRouter>
            </div>
        );

        act(() => {
            window.dispatchEvent(new Event("resize"));
        });

        expect(
            screen.getByTestId(`product_card_${mockProductsList[0].id}`)
        ).toBeInTheDocument();

        expect(
            screen.queryAllByTestId(
                `product_card_${mockProductsList[mockProductsList.length - 1].id}`
            )
        ).toHaveLength(0);

        Object.defineProperty(HTMLElement.prototype, "getBoundingClientRect", {
            value: function () {
                return {
                    width: 1920,
                    height: 1080,
                };
            },
            writable: true,
            configurable: true,
        });

        act(() => {
            window.dispatchEvent(new Event("resize"));
        });
        expect(
            screen.getByTestId(`product_card_${mockProductsList[0].id}`)
        ).toBeInTheDocument();

        expect(
            screen.queryAllByTestId(
                `product_card_${mockProductsList[mockProductsList.length - 1].id}`
            )
        ).toHaveLength(1);
    });
});
