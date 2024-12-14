import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import './filter.css';
import { ProductContext } from './Admin/Dashboard/ProductContext';
import '../src/Demo.css';
import Navbar from './Component/Navbar/Navbar';

const Products = () => {
  const { productDetails } = useContext(ProductContext);
  const [sortOption, setSortOption] = useState(1); 
  const [selectedCategories, setSelectedCategories] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(''); 

  const handleSortChange = (e) => {
    setSortOption(parseInt(e.target.value));
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategories((prevCategories) =>
      e.target.checked
        ? [...prevCategories, category] 
        : prevCategories.filter((c) => c !== category) 
    );
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const filteredProducts = productDetails.filter((product) => {
    const matchesCategory = selectedCategories.length > 0
      ? selectedCategories.some((category) => category.toLowerCase() === product.productCategory.toLowerCase()) 
      : true;

    const matchesSearchTerm = product.productName.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearchTerm;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 2) {
      return a.productPrice - b.productPrice;
    } else if (sortOption === 3) {
      return b.productPrice - a.productPrice;
    }
    return 0;
  });

  return (
   
    <div className='full'>
      <Navbar />
      <main>
        <div className="container mt-5">
          <div className="row">
            <div className="col-md-3">
              <section>
                <section id="filters" data-auto-filter="true">
                  <h5>Filters</h5>
                  <section className="mb-4" data-filter="condition">
                    <h6 className="font-weight-bold mb-3">Condition</h6>
                    {/* Category Checkboxes */}
                    {['Acne', 'Vitamin serum', 'Hydration', 'Skin-Lightening', 'Ageing', 'Dark Circle', 'Wrinkles'].map((category) => (
                      <div className="form-check mb-3" key={category}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={category}
                          id={`condition-checkbox-${category}`}
                          onChange={handleCategoryChange}
                          checked={selectedCategories.includes(category)}
                        />
                        <label className="form-check-label text-uppercase small text-muted" htmlFor={`condition-checkbox-${category}`}>
                          {category}
                        </label>
                      </div>
                    ))}
                    {/* Sorting Dropdown */}
                    <div className="row justify-content-center">
                      <div className="col-md- my-auto py-3">
                        <label htmlFor="sort-select" className="form-label select-label">Sort</label>
                        <select className="form-select" id="sort-select" aria-label="Sort options" value={sortOption} onChange={handleSortChange}>
                          <option value={1}>No sorting</option>
                          <option value={2}>Lowest price first</option>
                          <option value={3}>Highest price first</option>
                        </select>
                      </div>
                    </div>
                  </section>
                </section>
              </section>
            </div>
            <div className="col-md-9">
              {/* Search Section */}
              <div className="row justify-content-center mb-4">
                <form className="form-inline my-2 my-lg-0 d-flex" onSubmit={handleSearchSubmit}>
                  <input
                    className="form-control mr-sm-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <button className="btn btn-outline-success ml-2" type="submit">Search</button>
                </form>
              </div>
              {/* Product Display Section */}
              <div className="bg-main">
                <h1 className="title-shop">SHOP</h1>
                <main className="main bd-grid">
                  {sortedProducts && sortedProducts.map((product) => {
                    const { id, productName, productPrice, productCategory, imageUrls } = product;

                    return (
                      <article className="card" key={id}>
                        <div className="card__img">
                          <Link to={`/product/${id}`}> {/* Link to ProductDetails page */}
                            <img
                              src={imageUrls && imageUrls.length > 0 ? imageUrls[0] : "https://via.placeholder.com/150"}
                              alt={productName}
                              style={{ width: '250px', height: '250px', objectFit: 'cover' }}
                            />
                          </Link>
                        </div>
                        <div className="card__name">
                          <p>{productName}</p>
                          <p className="text-muted">{productCategory}</p> {/* Displaying product type */}
                        </div>
                        <div className="card__precis">
                          <a href="#" className="card__icon"><ion-icon name="heart-outline" /></a>
                          <div>
                            <span className="card__preci card__preci--now mb-2">
                              ₹{productPrice}
                            </span>
                          </div>
                          <a href="#" className="card__icon"><ion-icon name="cart-outline" /></a>
                        </div>
                      </article>
                    );
                  })}
                </main>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Products;