import { memo } from "react";
import { Spin } from "antd";
import { ProductType } from "../../types/ProductType.ts";

import ErrorWithRetryButton from "../../components/ErrorWithRetryButton/ErrorWithRetryButton.tsx";
import Virtual2DimensionList from "./Virtual2DimensionList/Virtual2DimensionList.tsx";

function ProductsListView({
    products,
    error,
    onRetry,
}: {
    products: ProductType[] | null;
    onRetry: () => void;
    error: string | null;
}) {
    return (
        <main
            style={{
                height: "100vh",
                width: "100vw",
                overflow: "hidden",
                margin: "0 auto",
            }}
        >
            {error && (
                <ErrorWithRetryButton
                    onReset={onRetry}
                    errorText={error}
                    buttonLabel="Retry"
                />
            )}
            {!products && !error && <Spin size="large" data-testid="spinner" />}
            {products && <Virtual2DimensionList products={products} />}
        </main>
    );
}

export default memo(ProductsListView);
