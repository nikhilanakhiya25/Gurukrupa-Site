import React, { useState, useEffect } from 'react';
import API from '../../api/api';
import './Product.css';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({});
    const [file, setFile] = useState(null);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const res = await API.get('/admin/products');
            setProducts(res.data.products || res.data);
        } catch (err) {
            console.error("LOAD PRODUCTS ERROR:", err.response?.data || err);
        }
    };

    const submitProduct = async (e) => {
        e.preventDefault();

        const fd = new FormData();
        fd.append('name', form.name || '');
        fd.append('price', form.price || 0);
        fd.append('colors', form.colors || '');
        fd.append('countInStock', form.countInStock || 0);
        if (file) fd.append('image', file);

        try {
            if (editingId) {
                await API.put(`/admin/product/${editingId}`, fd);
                setEditingId(null);
            } else {
                await API.post('/admin/product', fd);
            }

            setForm({});
            setFile(null);
            loadProducts();
            alert('Saved!');
        } catch (err) {
            console.log("SAVE ERROR:", err.response?.data || err);
            alert(err.response?.data?.message || "Something went wrong");
        }
    };

    const editProduct = (p) => {
        setForm(p);
        setEditingId(p._id);
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            const res = await API.delete(`/admin/product/${id}`);
            console.log("DELETE SUCCESS:", res.data);
            loadProducts();
        } catch (err) {
            console.log("DELETE ERROR:", err.response?.data || err);
            alert(err.response?.data?.message || "Delete failed! Check backend API route.");
        }
    };

    return (
        <div className="products-container">
            <h2 className="page-title">
                {editingId ? "Edit Product" : "Add New Product"}
            </h2>

            {/* FORM */}
            <form className="product-form" onSubmit={submitProduct}>
                <div className="form-row">
                    <input
                        type="text"
                        placeholder="Name"
                        value={form.name || ''}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={form.price || ''}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        required
                    />
                </div>

                <div className="form-row">
                    <input
                        type="text"
                        placeholder="Colors (comma separated)"
                        value={form.colors || ''}
                        onChange={(e) => setForm({ ...form, colors: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Stock"
                        value={form.countInStock || ''}
                        onChange={(e) => setForm({ ...form, countInStock: e.target.value })}
                    />
                </div>

                <div className="form-row">
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </div>

                <button className="btn-submit">
                    {editingId ? "Update Product" : "Add Product"}
                </button>
            </form>

            {/* PRODUCT LIST */}
            <h2 className="page-title">Products List</h2>

            <div className="products-grid">
                {products.map((p) => (
                    <div className="product-card" key={p._id}>
                        <img
                            src={p.image || 'https://via.placeholder.com/150'}
                            alt={p.name}
                            className="product-img"
                        />

                        <div className="product-info">
                            <h3>{p.name}</h3>
                            <p>Price: <strong>₹{p.price}</strong></p>
                            <p>Stock: {p.countInStock}</p>
                            <p>Colors: {p.colors}</p>
                        </div>

                        <div className="product-actions">
                            <button className="btn-edit" onClick={() => editProduct(p)}>Edit</button>
                            <button className="btn-delete" onClick={() => deleteProduct(p._id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
