import { ProductType } from "../../../types/ProductType.ts";
import { UIEvent, useCallback, useEffect, useMemo, useState } from "react";

export const VERTICAL_GAP = 8;
export const HORIZONTAL_GAP = 8;
export const DEFAULT_WIDTH = 290;
export const DEFAULT_HEIGHT = 200;
export const SMALL_SCREEN_PADDINGS = 32;
export const SCROLL_BUFFER = 400;

function getXPosition(
    list: ProductToRenderType[],
    columnsNumber: number,
    index: number,
    productWidth: number
) {
    const leftNeighbor = list[index - 1];
    return index % columnsNumber === 0
        ? 0
        : leftNeighbor.position.x + HORIZONTAL_GAP + productWidth;
}

function getYPosition(
    list: ProductToRenderType[],
    columnsNumber: number,
    index: number
) {
    const topNeighbor = list[index - columnsNumber];
    return index < columnsNumber
        ? 0
        : topNeighbor.position.y + VERTICAL_GAP + DEFAULT_HEIGHT;
}

export type ProductToRenderType = ProductType & {
    hidden: boolean;
    index: number;
    width: number;
    position: {
        x: number;
        y: number;
        yTranslation?: number;
    };
};

export function getWindowViewWidth() {
    return document.getElementById("root")?.getBoundingClientRect()?.width || 0;
}

export function useSmallScreenWidth(columnsNumber: number) {
    const [tempWidth, setTempWidth] = useState<number>(
        SMALL_SCREEN_WIDTH_TREESCHOLD
    );
    const [width, setWidth] = useState<number>(SMALL_SCREEN_WIDTH_TREESCHOLD);
    useEffect(() => {
        if (columnsNumber > 1) return;
        const onResize = () => {
            setTempWidth(getWindowViewWidth());
        };

        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [columnsNumber]);

    useEffect(() => {
        const timer = setTimeout(
            () => setWidth(tempWidth - SMALL_SCREEN_PADDINGS),
            300
        );
        return () => clearTimeout(timer);
    }, [tempWidth]);
    return { smallScreenWidth: width };
}

const SMALL_SCREEN_WIDTH_TREESCHOLD = 420;

function getColumnNumber() {
    const width = getWindowViewWidth();
    console.log("width", width);
    if (width <= SMALL_SCREEN_WIDTH_TREESCHOLD) return 1;
    return Math.floor(width / (DEFAULT_WIDTH + HORIZONTAL_GAP));
}

export function useColumnsNumber() {
    const [columnsNumber, setColumnsNumber] = useState<number>(getColumnNumber);

    useEffect(() => {
        const onResize = () => {
            const newColumnsNumber = getColumnNumber();
            if (newColumnsNumber !== columnsNumber)
                setColumnsNumber(newColumnsNumber);
        };

        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [columnsNumber]);

    return { columnsNumber };
}

function buildProductsToRender({
    products,
    columnsNumber,
    smallScreenWidth,
}: {
    products: ProductType[];
    columnsNumber: number;
    smallScreenWidth: number;
}) {
    const productsWithPosition = products.reduce<ProductToRenderType[]>(
        (result, product, index) => {
            const productWidth =
                columnsNumber === 1
                    ? smallScreenWidth - SMALL_SCREEN_PADDINGS
                    : DEFAULT_WIDTH;

            const x = getXPosition(result, columnsNumber, index, productWidth);
            const y = getYPosition(result, columnsNumber, index);

            result.push({
                ...product,
                index,
                width: productWidth,
                hidden: false,
                position: {
                    x,
                    y,
                },
            });
            return result;
        },
        []
    );
    return productsWithPosition;
}

export function use2DimensionalList({
    products,
    columnsNumber,
    smallScreenWidth,
}: {
    products?: ProductType[];
    columnsNumber: number;
    smallScreenWidth: number;
}) {
    const [scrollPosition, setScrollPosition] = useState(0);

    const { productsWithPosition, containerHeight, containerWidth } =
        useMemo(() => {
            if (!products || !products.length) {
                return {
                    productsWithPosition: [],
                    containerHeight: 0,
                    containerWidth: 0,
                };
            }

            const productsWithPosition = buildProductsToRender({
                products,
                columnsNumber,
                smallScreenWidth,
            });

            const containerHeight = Math.max(
                ...productsWithPosition
                    .slice(
                        productsWithPosition.length - columnsNumber - 1,
                        productsWithPosition.length
                    )
                    .map((product) => DEFAULT_HEIGHT + product.position.y)
            );

            return {
                productsWithPosition,
                containerHeight: containerHeight,
                containerWidth:
                    columnsNumber === 1
                        ? smallScreenWidth - SMALL_SCREEN_PADDINGS
                        : columnsNumber * (DEFAULT_WIDTH + HORIZONTAL_GAP) -
                          HORIZONTAL_GAP,
            };
        }, [products, columnsNumber, smallScreenWidth]);

    const productsToRender = useMemo(() => {
        const visibleHeight =
            document.getElementById("root")?.getBoundingClientRect()?.height ||
            0;
        return productsWithPosition?.map((product) => {
            const y = product.position.y;
            let hidden = false;
            const scrollBuffer =
                columnsNumber === 1 ? SCROLL_BUFFER * 2 : SCROLL_BUFFER;

            if (y + DEFAULT_HEIGHT + scrollBuffer < scrollPosition)
                hidden = true;
            if (y - scrollBuffer > scrollPosition + visibleHeight)
                hidden = true;

            product.hidden = hidden;

            return product;
        });
    }, [productsWithPosition, scrollPosition]);

    const onScroll = useCallback((event: UIEvent<HTMLElement>) => {
        setScrollPosition(event.currentTarget.scrollTop);
    }, []);

    return {
        productsToRender,
        containerHeight,
        containerWidth,
        onScroll,
        columnsNumber,
    };
}
