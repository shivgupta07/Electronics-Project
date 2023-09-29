import Category from "./Components/Category";
import DisplayAllCategory from "./Components/DisplayAllCategory";
import { Routes,Route,BrowserRouter as Router } from "react-router-dom";
import Brands from "./Components/Brands/brands";
function App() {
  return (<div>
     <Router>
      <Routes>
        <Route element={<Category/>} path="/category"/>
        <Route element={<DisplayAllCategory/>} path="/displayallcategory"/>
        <Route element={<Brands/>} path="/brands"/>
      </Routes>
     </Router>
  </div>);
}

export default App;
