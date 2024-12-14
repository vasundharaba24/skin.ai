import React, { createContext, useState, useEffect } from 'react';
import { db } from '../../../firebase'; 
import { collection, getDocs } from 'firebase/firestore';

const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [productDetails, setProductDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Product'));
        const products = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProductDetails(products);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, []);

  return (
    <ProductContext.Provider value={{ productDetails, loading }}>
      {children}
    </ProductContext.Provider>
  );
};

export { ProductContext, ProductProvider };
