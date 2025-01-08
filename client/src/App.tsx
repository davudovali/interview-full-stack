import { Route, Routes } from "react-router";

import ProductsList from "./pages/ProductsList/ProductsListController.tsx";
import Product from "./pages/Product/Product";

function App() {
    return (
        <div className="appContainer">
            <Routes>
                <Route path="/" element={<ProductsList />} />
                <Route path="/products/:id" element={<Product />} />
            </Routes>
        </div>
    );
}

export default App;
