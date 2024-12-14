import React, { useContext } from 'react';
import { ProductContext } from './Admin/Dashboard/ProductContext';
import '../src/Demo.css';

const Demo = () => {
  const { productDetails, loading } = useContext(ProductContext);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-main">
      <h1 className="title-shop">SHOP</h1>
      <main className="main bd-grid">
        {productDetails.map((product) => {
          const { id, productName, productPrice, imageUrls } = product;

          return (
            <article className="card" key={id}>
              <div className="card__img">
                <img
                  src={imageUrls && imageUrls.length > 0 ? imageUrls[0] : "https://via.placeholder.com/150"}
                  alt={productName}
                  style={{ width: '250px', height: '250px', objectFit: 'cover' }}
                />
              </div>
              <div className="card__name">
                <p>{productName}</p>
              </div>
              <div className="card__precis">
                <a href="#" className="card__icon"><ion-icon name="heart-outline" /></a>
                <div>
               
                  <span className="card__preci card__preci--now mb-2">
                    ${productPrice}
                  </span>
                </div>
                <a href="#" className="card__icon"><ion-icon name="cart-outline" /></a>
              </div>
            </article>
          );
        })}
      </main>
    </div>
  );
};

export default Demo;