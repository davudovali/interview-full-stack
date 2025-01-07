import { useCallback, useEffect, useState } from "react";
import { Spin } from "antd";
import { ProductType } from "../../types/ProductType.ts";

import ErrorWithRetryButton from "../../components/ErrorWithRetryButton/ErrorWithRetryButton.tsx";
import Virtual2DimensionList from "./Virtual2DimensionList/Virtual2DimensionList.tsx";

function App() {
    const [products, setProducts] = useState<ProductType[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    const requestProducts = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/products`);

            if (response.status === 200) {
                const data = await response.json();
                setProducts(data);
            } else {
                setError("Something went wrong");
            }
        } catch (e) {
            setError("Something went wrong");
        }
    }, []);

    useEffect(() => {
        requestProducts();
    }, []);

    const onRetry = useCallback(() => {
        setError(null);
        requestProducts();
    }, []);

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
            {!products && !error && <Spin size="large" />}
            {products && <Virtual2DimensionList products={products} />}
        </main>
    );
}

export default App;
