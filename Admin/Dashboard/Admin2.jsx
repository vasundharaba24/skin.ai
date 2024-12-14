import React, { useState, useEffect, useContext } from 'react';
import './admin.css';
import UploadForm from './UploadForm';
import { ProductContext } from './ProductContext';
import { OrderContext } from '../../OrdersContext';
import { db } from '../../../firebase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

function Admin2() {
  const [showForm, setShowForm] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [products, setProducts] = useState([]);
  const { productDetails, loading: productLoading } = useContext(ProductContext);
  const { orders, loading: ordersLoading } = useContext(OrderContext);  // Fetch orders from context
  const [editingProduct, setEditingProduct] = useState(null); 
  const [updatedDetails, setUpdatedDetails] = useState({ productName: '', productPrice: '' });

  useEffect(() => {
    setProducts(productDetails);
  }, [productDetails]);

  const handleNavClick = (e) => {
    e.preventDefault();
    const id = e.currentTarget.getAttribute('href');
    setShowForm(id === "#upload-products");
    setShowProducts(id === "#product");
  };

  const handleBackClick = () => {
    setShowForm(false);
    setEditingProduct(null); 
  };

  const handleDelete = async (productId) => {
    try {
      await deleteDoc(doc(db, 'Product', productId));
      const updatedProducts = products.filter(product => product.id !== productId);
      setProducts(updatedProducts);
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error("Error deleting product: ", error);
      toast.error('Failed to delete the product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product.id); 
    setUpdatedDetails({ productName: product.productName, productPrice: product.productPrice }); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, 'Product', editingProduct), updatedDetails);
      const updatedProducts = products.map(product =>
        product.id === editingProduct ? { ...product, ...updatedDetails } : product
      );
      setProducts(updatedProducts);
      setEditingProduct(null); 
      toast.success('Product updated successfully');
    } catch (error) {
      console.error("Error updating product: ", error);
      toast.error('Failed to update the product');
    }
  };

  return (
    <div className='admin'>
      <div className="site-wrap">
        <nav className="site-nav">
          <Link to={"/"}>
          <div className="name">Skin.ai</div></Link>
          <ul>
            <li className={showForm ? "" : "active"}>
              <a href="#upload-products" onClick={handleNavClick}>Upload Products</a>
            </li>
            <li className={showProducts ? "" : "active"}>
              <a href="#product" onClick={handleNavClick}>Product <span>{productLoading ? '...' : products.length}</span></a>
            </li>
          </ul>
        </nav>
        <main>
          {showForm ? (
            <>
              <button className='btn' onClick={handleBackClick}>Back</button>
              <UploadForm />
            </>
          ) : showProducts ? (
            <>
              <header>
                <h1 className="title">Products</h1>
              </header>
              <div className="content-columns">
                <div className="col">
                  {products.map(product => (
                    <div key={product.id} className="item">
                      {editingProduct === product.id ? (
                        <>
                          <input
                            type="text"
                            name="productName"
                            value={updatedDetails.productName}
                            onChange={handleInputChange}
                            placeholder="Edit Product Name"
                            style={{ marginBottom: '10px', marginRight: '8px' }}
                          />
                          <input
                            type="number"
                            name="productPrice"
                            value={updatedDetails.productPrice}
                            onChange={handleInputChange}
                            placeholder="Edit Product Price"
                            style={{ marginBottom: '10px', marginRight: '8px' }}
                          />
                          <button onClick={handleSave} style={{ marginRight: '8px' }}>Save</button>
                          <button onClick={() => setEditingProduct(null)}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <h4 className='p-3'>{product.productName}</h4>
                          <p className='p-3' style={{ marginTop: '-10px' }}>${product.productPrice}</p>
                          <svg
                            onClick={() => handleEdit(product)}
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="blue"
                            viewBox="0 0 24 24"
                            style={{ cursor: 'pointer', marginRight: '8px' }}
                          >
                            <path d="M3 17.25V21h3.75l11.7-11.7-3.75-3.75L3 17.25zM20.71 7.04a1.5 1.5 0 0 0 0-2.12l-2.12-2.12a1.5 1.5 0 0 0-2.12 0l-1.41 1.41 3.75 3.75 2.12-2.12z" />
                          </svg>
                          <svg
                            onClick={() => handleDelete(product.id)}
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="red"
                            viewBox="0 0 24 24"
                            style={{ cursor: 'pointer' }}
                          >
                            <path d="M3 6l3 18h12l3-18h-18zm19-4h-5.5l-1-2h-8l-1 2h-5.5v2h21v-2z" />
                          </svg>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            
            <div className="content-columns">
             
              <div className="col">
                <div className="item">ORDERS</div>
                <div className="orders-list">
                  {ordersLoading ? (
                    <p>Loading orders...</p>
                  ) : (
                    orders.map(order => (
                      <div key={order.id} style={{
                        backgroundColor: '#f9f9f9',
                        padding: '15px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        marginBottom: '15px'
                      }}>
                        <p><strong>Order ID:</strong> {order.id}</p>
                        <p><strong>Product Name:</strong> {order.productName}</p>
                        <p><strong>Price:</strong> ${order.productPrice}</p>
                        <p><strong>Email:</strong> {order.email}</p>
                        <p><strong>Date:</strong> {new Date(order.timestamp?.seconds * 1000).toLocaleString()}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Admin2;
