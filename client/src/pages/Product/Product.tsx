import { useParams, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Card, Spin, Flex, Button } from "antd";
import { ProductType } from "../../types/ProductType.ts";
import ProductUpdateForm from "./ProductUpdateForm.tsx";
import ErrorWithRetryButton from "../../components/ErrorWithRetryButton/ErrorWithRetryButton.tsx";

const controller = new AbortController();
const signal = controller.signal;

export default function Product() {
    const { id } = useParams();
    const [product, setProduct] = useState<ProductType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const requestProduct = useCallback(async () => {
        try {
            const response = await fetch(
                `http://localhost:3000/api/products/${id}`,
                { signal }
            );
            if (response.status === 200) {
                const data = await response.json();
                setProduct(data);
            } else if (response.status === 404) {
                setError("Product not found");
            } else {
                setError("Something went wrong");
            }
        } catch (e) {
            setError("Something went wrong");
        }
    }, []);

    useEffect(() => {
        requestProduct();
    }, [id]);

    const onGoBack = useCallback(() => {
        navigate("/");
    }, []);

    const onSuccessfullUpdate = useCallback((newProduct: ProductType) => {
        setProduct(newProduct);
    }, []);

    const onRetry = useCallback(() => {
        setError(null);
        requestProduct();
    }, []);

    return (
        <Flex
            style={{ height: "100vh", width: "100vw" }}
            vertical
            justify="center"
            align="center"
        >
            <Card style={{ height: "auto", gap: "1rem" }}>
                <Flex vertical gap="large">
                    <Button
                        onClick={onGoBack}
                        variant="dashed"
                    >{`<- Go Back`}</Button>
                    {product === null && error === null && (
                        <Spin size="large" />
                    )}
                    {error && (
                        <ErrorWithRetryButton
                            errorText={error}
                            onReset={onRetry}
                            buttonLabel="Retry"
                        />
                    )}
                </Flex>
                <br />
                {product && (
                    <Flex gap="middle">
                        <div>
                            <h3>{product.name}</h3>
                            <div style={{ maxWidth: "20rem" }}>
                                {product.description}
                            </div>
                            <span>
                                Price: <b>{product.price}</b>
                            </span>
                        </div>
                        <ProductUpdateForm
                            product={product}
                            onSuccessfulUpdate={onSuccessfullUpdate}
                        />
                    </Flex>
                )}
            </Card>
        </Flex>
    );
}
