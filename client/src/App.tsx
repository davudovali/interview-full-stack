import { Route, Routes } from "react-router";
import { lazy, Suspense } from "react";
import { Spin } from "antd";

const ProductsList = lazy(
    () => import("./pages/ProductsList/ProductsListController.tsx")
);
const Product = lazy(() => import("./pages/Product/Product"));

function App() {
    return (
        <div className="appContainer">
            <Suspense fallback={<Spin size="large" />}>
                <Routes>
                    <Route path="/" element={<ProductsList />} />
                    <Route path="/products/:id" element={<Product />} />
                </Routes>
            </Suspense>
        </div>
    );
}

export default App;
