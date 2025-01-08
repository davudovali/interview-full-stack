import React from "react";
import { Card } from "antd";
import { Link } from "react-router-dom";
import { ProductType } from "../../../types/ProductType.ts";

function ProductCard({
    product,
    position,
    height,
    width,
}: {
    product: ProductType;
    position: { x: number; y: number };
    width: number;
    height: number;
}) {
    return (
        <Link
            to={`/products/${product.id}`}
            data-testid={`product_card_${product.id}`}
            style={{
                textDecoration: "none",
                position: "absolute",
                top: position.y,
                left: position.x,
                width,
                height,
            }}
        >
            <Card
                hoverable
                style={{
                    paddingBlock: 0,
                    width,
                    height,
                    cursor: "pointer",
                    position: "relative",
                    overflow: "auto",
                }}
            >
                <h3
                    style={{
                        margin: "0 0 0.5rem 0",
                        maxWidth: "100%",
                        whiteSpace: "wrap",
                        wordBreak: "break-word",
                    }}
                >
                    {product.name}
                </h3>
                <div>
                    Price: <b>{product.price}</b>
                </div>
                <div>{product.description}</div>
            </Card>
        </Link>
    );
}

export default React.memo(ProductCard);
