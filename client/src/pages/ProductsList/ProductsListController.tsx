import { useCallback, useEffect, useState } from "react";
import { ProductType } from "../../types/ProductType.ts";
import ProductsListView from "./ProductsListView.tsx";

const controller = new AbortController();
const signal = controller.signal;

function ProductsListController() {
    const [products, setProducts] = useState<ProductType[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    const requestProducts = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/products`, {
                signal,
            });

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
        <ProductsListView onRetry={onRetry} products={products} error={error} />
    );
}

export default ProductsListController;
