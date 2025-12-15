import React, { useState, useEffect } from "react";
import API, { imageBaseURL } from "../../api/api";
import "./Product.css";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        name: "",
        price: "",
        colors: "",
        countInStock: "",
    });
    const [file, setFile] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    // =========================
    // LOAD PRODUCTS
    // =========================
    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const res = await API.get("/admin/products");
            setProducts(res.data.products || res.data);
        } catch (err) {
            console.error("LOAD PRODUCTS ERROR:", err.response?.data || err);
        }
    };

    // =========================
    // ADD / UPDATE PRODUCT
    // =========================
    const submitProduct = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const fd = new FormData();
            fd.append("name", form.name);
            fd.append("price", form.price);
            fd.append(
                "colors",
                JSON.stringify(
                    form.colors
                        .split(",")
                        .map((c) => c.trim())
                        .filter(Boolean)
                )
            );
            fd.append("countInStock", form.countInStock);

            if (file) fd.append("image", file);

            if (editingId) {
                // UPDATE
                await API.put(`/admin/products/${editingId}`, fd);
                alert("Product updated successfully");
            } else {
                // CREATE
                await API.post("/admin/products", fd);
                alert("Product added successfully");
            }

            resetForm();
            loadProducts();
        } catch (err) {
            console.error("SAVE ERROR:", err.response?.data || err);
            alert(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // EDIT PRODUCT
    // =========================
    const editProduct = (p) => {
        setForm({
            name: p.name || "",
            price: p.price || "",
            colors: Array.isArray(p.colors) ? p.colors.join(", ") : p.colors || "",
            countInStock: p.countInStock || "",
        });

        setFile(null);
        setEditingId(p._id);

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // =========================
    // DELETE PRODUCT
    // =========================
    const deleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            await API.delete(`/admin/products/${id}`);
            alert("Product deleted");
            loadProducts();
        } catch (err) {
            console.error("DELETE ERROR:", err.response?.data || err);
            alert(err.response?.data?.message || "Delete failed");
        }
    };

    // =========================
    // RESET FORM
    // =========================
    const resetForm = () => {
        setForm({
            name: "",
            price: "",
            colors: "",
            countInStock: "",
        });
        setFile(null);
        setEditingId(null);
    };

    return (
        <div className="products-container">
            {/* ================= FORM ================= */}
            <h2 className="page-title">
                {editingId ? "Edit Product" : "Add New Product"}
            </h2>

            <form className="product-form" onSubmit={submitProduct}>
                <div className="form-row">
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />

                    <input
                        type="number"
                        placeholder="Price"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        required
                    />
                </div>

                <div className="form-row">
                    <input
                        type="text"
                        placeholder="Colors (red, blue, black)"
                        value={form.colors}
                        onChange={(e) => setForm({ ...form, colors: e.target.value })}
                    />

                    <input
                        type="number"
                        placeholder="Stock"
                        value={form.countInStock}
                        onChange={(e) =>
                            setForm({ ...form, countInStock: e.target.value })
                        }
                    />
                </div>

                <div className="form-row">
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                </div>

                <button className="btn-submit" type="submit" disabled={loading}>
                    {loading
                        ? "Saving..."
                        : editingId
                            ? "Update Product"
                            : "Add Product"}
                </button>

                {editingId && (
                    <button
                        type="button"
                        className="btn-cancel"
                        onClick={resetForm}
                    >
                        Cancel Edit
                    </button>
                )}
            </form>

            {/* ================= LIST ================= */}
            <h2 className="page-title">Products List</h2>

            <div className="products-grid">
                {products.map((p) => (
                    <div className="product-card" key={p._id}>
                        <img
                            src={p.image ? `http://localhost:5000${p.image}` : "https://via.placeholder.com/150"}
                            alt={p.name}
                            className="product-img"
                        />

                        <div className="product-info">
                            <h3>{p.name}</h3>
                            <p>
                                Price: <strong>₹{p.price}</strong>
                            </p>
                            <p>Stock: {p.countInStock}</p>
                            <p>
                                Colors:{" "}
                                {Array.isArray(p.colors) ? p.colors.join(", ") : p.colors}
                            </p>
                        </div>

                        <div className="product-actions">
                            <button className="btn-edit" onClick={() => editProduct(p)}>
                                Edit
                            </button>
                            <button
                                className="btn-delete"
                                onClick={() => deleteProduct(p._id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
