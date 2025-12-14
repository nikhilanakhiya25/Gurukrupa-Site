import React, { useEffect, useState, useContext } from 'react';
import API from '../api/api';
import { CartContext } from '../contexts/CartContext';
import './productlist.css';

export default function ProductList() {
  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [price, setPrice] = useState(1000);

  useEffect(() => {
    API.get('/products')
      .then(res => {
        const list = res.data.products || res.data;
        setProducts(list);
        setFiltered(list);
      })
      .catch(console.error);
  }, []);

  function applyFilters() {
    let list = [...products];

    if (search.trim() !== '') {
      list = list.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== 'All') {
      list = list.filter(p => p.category === category);
    }

    list = list.filter(p => p.price <= price);

    setFiltered(list);
  }

  useEffect(() => applyFilters(), [search, category, price, products]);

  // Extract unique categories
  const categories = ['All', ...new Set(products.map(p => p.category))];

  return (
    <div className="product-page">

      {/* --- SIDEBAR FILTERS --- */}
      <div className="filters">
        <h3>Filters</h3>

        <div className="filter-box">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <label>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}>
          {categories.map((cat, index) => (
    <option key={cat || index} value={cat}>
      {cat}
    </option>
  ))}
          </select>
        </div>

        <div className="filter-box">
          <label>Max Price: ₹{price}</label>
          <input
            type="range"
            min="0"
            max="10000"
            value={price}
            onChange={e => setPrice(Number(e.target.value))}
          />
        </div>
      </div>

      {/* --- PRODUCT GRID --- */}
      <div className="products-grid">
        {filtered.map(p => (
          <div key={p._id} className="product-card">
            <div className="img-box">
              <img
                src={p.image || 'https://via.placeholder.com/250'}
                alt={p.name}
              />
            </div>

            <h3>{p.name}</h3>
            <p className="price"> ₹{p.price}</p>

            <button
              className="btn-add"
              onClick={() => addToCart(p, 1)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
