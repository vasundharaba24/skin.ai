import { useState, useEffect  } from 'react';
import './App.jsx';
import { BrowserRouter, Route, Routes} from "react-router-dom";
import Navbar from './Component/Navbar/Navbar';
import Login from './User/Login/Login.jsx';
import Signup from './User/Signup/Signup.jsx';
import AdminLogin from './Admin/Login/AdminLogin';
import Home from './Pages/Home/Home';
import DocLogin from './Doctor/Login/DocLogin';
import 'react-toastify/dist/ReactToastify.css';
import DocDashboard from './Doctor/Doc-Dashboard/DocDashboard.jsx';
import Admin2 from './Admin/Dashboard/Admin2.jsx';
import UploadForm from './Admin/Dashboard/UploadForm.jsx';
import DocSignup from './Doctor/Login/DocSignup.jsx'
import EditDocDetails from './Doctor/Doc-Dashboard/EditDocDetails.jsx';
import { DoctorContextProvider } from './Doctor/Doc-Dashboard/DoctorContext.jsx';
import EditUserDetails from './User/User-Dashboard/EditUserDetails.jsx';
import User from './User/User-Dashboard/User.jsx';
import { ProductProvider } from './Admin/Dashboard/ProductContext.jsx';
import Product from './Admin/Dashboard/Product.jsx';
import ForgotPassword from './User/Login/ForgetPassword.jsx';
import Aboutus from './Pages/Aboutus.jsx';
import Dark_circles from './Dark_circles.jsx';
import Demo from './Demo.jsx';
import Page from './Page.jsx';
import SkinType from './SkinType.jsx';
import Products from './Products.jsx';
import ProductDetails from './ProductDetails.jsx'
import { auth } from '../firebase.js';
import Modal from './Model.jsx';
import SkinTone from './SkinTone.jsx';
import { OrderProvider } from './OrdersContext.jsx';
function App() {
  const [count, setCount] = useState(0)

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); 
  }, []);

  return (
    <>

<OrderProvider>
    <DoctorContextProvider>
      <ProductProvider>
       <BrowserRouter>
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/demo" element={<Demo/>} />
            <Route path="/page" element={<Page/>} />
          
        <Route path="/product" element={<Products />} />
        <Route path="/model" element={<Modal />} /> 

        <Route path="/product/:id" element={<ProductDetails />} /> 

           {/* Login */}
            <Route path="/navbar" element={<Navbar  user={user} />} />
            <Route path="/login" element={<Login setUser={setUser} />} /> 
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/doc-login" element={<DocLogin />} />
            <Route path="/doc-signup" element={<DocSignup />} />

            {/* ML */}
       
            <Route path="/darkcircles" element={<Dark_circles />} />
            <Route path="/skin-type" element={<SkinType/>} />  
            <Route path="/skin-tone" element={<SkinTone/>} />

           
            {/* Dashboard */}
            <Route path="/doc-dash" element={<DocDashboard/>} />
            <Route path="/admin2" element={<Admin2/>} />
            <Route path="/upload-product" element={<UploadForm/>} />
            <Route path="/edit-doc-details" element={<EditDocDetails/>} />
            <Route path="/edit-user" element={<EditUserDetails />} />
            <Route path="/user" element={<User />} />
            <Route path="/forget-password" element={<ForgotPassword />} />
            <Route path="/aboutus" element={<Aboutus />} />

            {/* Product */}
            <Route path="/products" element={<Product />} />
          
        </Routes>
      </BrowserRouter>
    </ProductProvider>
  </DoctorContextProvider>
  </OrderProvider>
    </>
  )
}

export default App;