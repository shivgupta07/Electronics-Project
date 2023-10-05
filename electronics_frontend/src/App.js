import Category from "./Components/Category";
import DisplayAllCategory from "./Components/DisplayAllCategory";
import { Routes,Route,BrowserRouter as Router } from "react-router-dom";
import Brands from "./Components/Brands/brands"
import DisplayAllBrands from "./Components/Brands/DisplayAllBrands";
import Products from "./Components/Products/Products"
import DisplayAllProducts from "./Components/Products/DisplayAllProducts";
import ProductDetails from "./Components/ProductDetails/ProductDetails";
function App() {
  return (<div>
     <Router>
      <Routes>
        <Route element={<Category/>} path="/category"/>
        <Route element={<DisplayAllCategory/>} path="/displayallcategory"/>
        <Route element={<Brands/>} path="/brands"/>
        <Route element={<DisplayAllBrands/>} path="/displayallbrands"/>
        <Route element={<Products/>} path="/products"/>
        <Route element={<DisplayAllProducts/>} path="/displayallproducts"/>
        <Route element={<ProductDetails/>} path="/productdetails"/>
      </Routes>
     </Router>
  </div>);
}

export default App;
