// frontend/src/components/Admin/AdminOrders.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sendingTrack, setSendingTrack] = useState(null);
    const { token } = useAuth ? useAuth() : { token: localStorage.getItem("token") };

    useEffect(() => { loadOrders(); }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const res = await API.get("/api/orders", { headers: { Authorization: "Bearer " + localStorage.getItem("token") } });
            setOrders(res.data);
        } catch (e) {
            console.error(e);
            alert("Failed to load orders");
        } finally { setLoading(false); }
    };

    const updateStatus = async (orderId, status) => {
        try {
            await API.put(`/api/orders/${orderId}/status`, { status }, { headers: { Authorization: "Bearer " + localStorage.getItem("token") } });
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
            alert("Status updated");
        } catch (e) {
            console.error(e);
            alert("Failed to update status");
        }
    };

    const sendTrack = async (orderId) => {
        const message = window.prompt("Enter update message to send to customer:");
        if (!message) return;
        setSendingTrack(orderId);
        try {
            await API.post(`/api/orders/${orderId}/track`, { message }, { headers: { Authorization: "Bearer " + localStorage.getItem("token") } });
            alert("Message sent");
        } catch (e) {
            console.error(e);
            alert("Failed to send message");
        } finally { setSendingTrack(null); }
    };

    const downloadInvoice = (orderId) => {
        // Open PDF in new tab
        const url = `/api/orders/${orderId}/invoice`;
        // must include token if protected; easiest: open with token in header not possible — fetch blob
        fetch(url, {
            headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        })
            .then(res => {
                if (!res.ok) throw new Error("Invoice download failed");
                return res.blob();
            })
            .then(blob => {
                const blobUrl = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = blobUrl;
                a.download = `invoice-${orderId}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            })
            .catch(err => {
                console.error(err);
                alert("Invoice download failed");
            });
    };

    return (
        <div>
            <h2>All Orders (Admin)</h2>
            {loading ? <p>Loading...</p> : (
                <div>
                    {orders.length === 0 ? <p>No orders yet.</p> : null}
                    {orders.map(o => (
                        <div key={o._id} style={{ border: "1px solid #ddd", margin: 10, padding: 10 }}>
                            <div><strong>Order:</strong> {o._id} — <strong>Status:</strong> {o.status}</div>
                            <div><strong>User:</strong> {o.user?.name} ({o.user?.phone || o.shippingAddress?.phone})</div>
                            <div><strong>Total:</strong> ₹{o.totalAmount}</div>
                            <div>
                                <strong>Items:</strong>
                                <ul>{o.items?.map(it => <li key={it.product}>{it.name} x {it.qty}</li>)}</ul>
                            </div>

                            <div style={{ display: "flex", gap: 8 }}>
                                <select defaultValue={o.status} onChange={(e) => updateStatus(o._id, e.target.value)}>
                                    <option>Pending</option>
                                    <option>Accepted</option>
                                    <option>Shipped</option>
                                    <option>Delivered</option>
                                    <option>Rejected</option>
                                </select>

                                <button onClick={() => sendTrack(o._id)} disabled={sendingTrack === o._id}>{sendingTrack === o._id ? "Sending..." : "Send Update"}</button>

                                <button onClick={() => downloadInvoice(o._id)}>Download Invoice</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
