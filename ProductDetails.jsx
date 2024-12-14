import React, { useContext, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ProductContext } from './Admin/Dashboard/ProductContext';
import Navbar from './Component/Navbar/Navbar';
import './ProductDetails.css'; 
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { auth } from '../firebase';
import Modal from './Model';
const ProductDetails = () => {
  const { id } = useParams(); 
  const { productDetails, loading } = useContext(ProductContext); 
  const db = getFirestore(); // Initialize Firestore
  const navigate = useNavigate();

  const product = productDetails.find((item) => item.id === id);

  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleBuyNow = () => {
    setModalVisible(true); // Show the modal to enter delivery details
  };

  const makePayment = async () => {
    const user = auth.currentUser; // Get currently logged-in user
    const email = user ? user.email : "user@example.com"; // Use user's email

    const options = {
      key: "rzp_test_YszXynKy3oW66a",
      amount: product.productPrice * 100, // Amount in paise
      currency: "INR",
      name: "E-Bharat",
      description: product.productName,
      image: product.imageUrls[0], // Add image URL if available
      handler: async function (response) {
        // Payment success handler
        console.log("Payment Successful:", response);

        const orderData = {
          productId: id,
          productName: product.productName,
          productPrice: product.productPrice,
          email: email, // Use the user's email
          address: address, // Get address from modal
          name: name, // Get name from modal
          pincode: pincode, // Get pincode from modal
          phoneNumber: phoneNumber, // Get phone number from modal
          timestamp: new Date(),
          razorpayPaymentId: response.razorpay_payment_id,
        };

        try {
          const orderRef = doc(db, 'Orders', `${id}-${Date.now()}`); // Unique ID for the order
          await setDoc(orderRef, orderData);
          toast.success("Order placed successfully!");
          navigate('/'); // Redirect to home page after order placement
        } catch (err) {
          console.error("Error storing order details:", err);
          toast.error("Failed to place order.");
        }
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const { productName, productPrice, productCategory, imageUrls, productDescription } = product;

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mt-5">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Navbar />
        <div className="container mt-5">
          <h2>Product Not Found</h2>
          <Link to="/" className="btn btn-primary mt-3">Go Back to Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mt-5 product-detail">
        <div className="row">
          {/* Product Image Section */}
          <div className="col-md-6">
            <img
              src={imageUrls && imageUrls.length > 0 ? imageUrls[0] : 'https://via.placeholder.com/500'}
              alt={productName}
              className="img-fluid"
              style={{ maxHeight: '500px', objectFit: 'cover' }}
            />
          </div>

          {/* Product Information Section */}
          <div className="col-md-6">
            <h2>{productName}</h2>
            <p className="text-muted text-uppercase">{productCategory}</p>
            <h4 className="text-success">₹{productPrice}</h4>
            <p>{productDescription}</p>

            {/* Buy Button */}
            <button className="btn btn-primary btn-lg" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>

        <div className="mt-5">
          <Link to="/" className="btn btn-secondary">Go Back</Link>
        </div>
      </div>

      {/* Modal for entering delivery details */}
      {modalVisible && (
        <Modal 
          name={name} 
          address={address} 
          pincode={pincode} 
          phoneNumber={phoneNumber} 
          setName={setName} 
          setAddress={setAddress} 
          setPincode={setPincode} 
          setPhoneNumber={setPhoneNumber} 
          buyNow={async (e) => {
            e.preventDefault();
            await makePayment();
            setModalVisible(false); // Hide the modal after payment
          }}
        />
      )}
    </div>
  );
};

export default ProductDetails;
