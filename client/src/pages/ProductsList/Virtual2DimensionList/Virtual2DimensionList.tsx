import ProductCard from "../ProductCard/ProductCard.tsx";
import { ProductType } from "../../../types/ProductType.ts";
import {
    use2DimensionalList,
    useColumnsNumber,
    useSmallScreenWidth,
    DEFAULT_HEIGHT,
} from "./use2DimensionalList.ts";

const BOTTOM_MARGIN = 70;

export default function Virtual2DimensionList({
    products,
}: {
    products: ProductType[];
}) {
    const { columnsNumber } = useColumnsNumber();
    const { smallScreenWidth } = useSmallScreenWidth(columnsNumber);
    const { productsToRender, containerHeight, containerWidth, onScroll } =
        use2DimensionalList({
            products,
            columnsNumber,
            smallScreenWidth,
        });

    return (
        <div
            style={{
                paddingTop: 32,
                paddingBottom: 32,
                height: "100vh",
                width: "100%",
                overflow: "scroll",
                scrollBehavior: "smooth",
            }}
            onScroll={onScroll}
        >
            <div
                style={{
                    height: containerHeight + BOTTOM_MARGIN,
                    width: containerWidth,
                    margin: "0 auto",
                    position: "relative",
                    display: "block",
                }}
            >
                {productsToRender.map((product) => {
                    if (product.hidden) return null;

                    return (
                        <ProductCard
                            product={product}
                            key={product.id}
                            position={product.position}
                            width={product.width}
                            height={DEFAULT_HEIGHT}
                        />
                    );
                })}
            </div>
        </div>
    );
}
