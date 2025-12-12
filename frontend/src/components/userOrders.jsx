// frontend/src/components/Orders/UserOrders.jsx
import React, { useEffect, useState } from "react";
import API from "../api/api";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(()=> { load(); }, []);
  const load = async () => {
    try {
      const res = await API.get("/api/orders/my", { headers: { Authorization: "Bearer " + localStorage.getItem("token") }});
      setOrders(res.data);
    } catch (e) {
      console.error(e);
      alert("Failed to load your orders");
    }
  };

  const downloadInvoice = async (orderId) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/invoice`, { headers: { Authorization: "Bearer " + localStorage.getItem("token") }});
      if (!res.ok) throw new Error("Invoice failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `invoice-${orderId}.pdf`; document.body.appendChild(a); a.click(); a.remove();
    } catch (err) {
      console.error(err);
      alert("Invoice download failed");
    }
  };

  return (
    <div>
      <h2>Your Orders</h2>
      {orders.length === 0 ? <p>No orders yet</p> : (
        <div>
          {orders.map(o => (
            <div key={o._id} style={{border:"1px solid #ddd", padding:10, margin:8}}>
              <div><strong>Order:</strong> {o._id}</div>
              <div><strong>Status:</strong> {o.status}</div>
              <div><strong>Total:</strong> ₹{o.totalAmount}</div>
              <div><strong>Items:</strong>
                <ul>{o.items.map(it => <li key={it.product}>{it.name} x {it.qty}</li>)}</ul>
              </div>
              <button onClick={()=> downloadInvoice(o._id)}>Download Invoice</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
