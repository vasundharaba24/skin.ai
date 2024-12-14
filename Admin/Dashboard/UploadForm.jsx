import React, { useState, useEffect } from 'react';  
import './uploadform.css';  
import { db, storage } from '../../../firebase'; // Import Firebase utilities  
import { collection, addDoc, getDocs } from 'firebase/firestore';  
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';  
import { toast, ToastContainer } from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS  

const UploadForm = () => {  
  const [productName, setProductName] = useState('');  
  const [productPrice, setProductPrice] = useState('');  
  const [productDescription, setProductDescription] = useState('');  
  const [productCategory, setProductCategory] = useState('');  
  const [files, setFiles] = useState([]);  
  const [collectionExists, setCollectionExists] = useState(false);  

  useEffect(() => {  
    const checkAndCreateCollection = async () => {  
      const querySnapshot = await getDocs(collection(db, 'Product'));  
      if (querySnapshot.empty) {  
        setCollectionExists(false);  
        console.log('Collection "Product" does not exist. It will be created upon first addition.');  
      } else {  
        setCollectionExists(true);  
        console.log('Collection "Product" already exists.');  
      }  
    };  

    checkAndCreateCollection();  
  }, []);  

  const handleFileChange = (e) => {  
    setFiles(e.target.files);  
  };  

  const handleSubmit = async (e) => {  
    e.preventDefault();  
    try {  
      const fileUrls = [];  
      for (let i = 0; i < files.length; i++) {  
        const file = files[i];  
        const fileRef = ref(storage, `products/${file.name}`);  
        await uploadBytes(fileRef, file);  
        const url = await getDownloadURL(fileRef);  
        fileUrls.push(url);  
      }  

      await addDoc(collection(db, 'Product'), {  
        productName,  
        productPrice,  
        productDescription,  
        productCategory,  
        imageUrls: fileUrls,  
      });  

      if (!collectionExists) {  
        setCollectionExists(true);  
        console.log('Table "Product" created and first product added.');  
        toast.success('Table "Product" created successfully and product uploaded!');  
      } else {  
        toast.success('Product uploaded successfully!');  
      }  

      setProductName('');  
      setProductPrice('');  
      setProductDescription('');  
      setProductCategory('');  
      setFiles([]);  
      document.getElementById('inputFile').value = null;  
    } catch (error) {  
      console.error('Error uploading product:', error.message);  
      toast.error('Failed to upload product. Please check your setup and try again.');  
    }  
  };  

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="p-4 rounded">
            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <h2 className='text-center mb-2'>Upload Product</h2>
                <label htmlFor="inputName">Product Name</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="inputName"
                  placeholder="Enter name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="inputPrice">Product Price</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  id="inputPrice"
                  placeholder="Enter price"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="inputDescription">Product Description</label>
                <textarea
                  className="form-control form-control-sm"
                  id="inputDescription"
                  rows="4"
                  placeholder="Enter description"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="inputCategory">Product Category</label>
                <select
                  className="form-control form-control-sm"
                  id="inputCategory"
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                >
                  <option value="">Select category</option>
                  <option value="acne">Acne</option>
                  <option value="skin-lightening">Skin Lightening</option>
                  <option value="dark-circle">Dark Circle</option>
                  <option value="wrinkles">Wrinkles</option>
                  <option value="vitamin-serum">Vitamin Serum</option>
                  <option value="hydration">Hydration</option>
                </select>
              </div>
              <div className="form-group mb-3">
                <label htmlFor="inputFile">Choose files (max 3)</label>
                <input
                  type="file"
                  className="form-control form-control-sm"
                  id="inputFile"
                  multiple
                  onChange={handleFileChange}
                />
              </div>
              <button type="submit" className="btn btn-primary mt-3">
                Upload
              </button>
            </form>
            <ToastContainer /> {/* Add this component to display toasts */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;