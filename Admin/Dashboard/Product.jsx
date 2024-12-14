import React, { useContext } from 'react';
import { Carousel } from 'react-bootstrap';
import { ProductContext } from './ProductContext'; // Adjust path as needed
<link rel="stylesheet" href="bootstrap/dist/css/bootstrap.min.css" />
const Product = () => {
  const { productDetails, loading } = useContext(ProductContext);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-5 'bg-main'">
      <div className="row">
        {productDetails.map((product) => {
          const { id, productName, productPrice, imageUrls } = product;

          return (
            <div className="col-md-4" key={id}>
              <div className="card mb-4" style={{ width: '18rem' }}>
                <Carousel>
                  {imageUrls && imageUrls.length > 0 ? (
                    imageUrls.map((url, index) => (
                      <Carousel.Item key={index}>
                        <img
                          className="d-block w-100"
                          src={url}
                          alt={`Slide ${index}`}
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                      </Carousel.Item>
                    ))
                  ) : (
                    <Carousel.Item>
                     
                    </Carousel.Item>
                  )}
                </Carousel>
                <div className="card-body">
                  <h5 className="card-title">{productName}</h5>
                  <p className="card-text">Price: {productPrice}RS</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Product;