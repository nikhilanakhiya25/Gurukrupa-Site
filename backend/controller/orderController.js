// backend/controllers/orderController.js
const Order = require("../models/Order");
const mongoose = require("mongoose");
const twilio = require("twilio");
const PDFDocument = require("pdfkit");

// Twilio client (created lazily — safe if env not set)
let twilioClient = null;
const getTwilioClient = () => {
    if (!twilioClient) {
        const sid = process.env.TWILIO_SID;
        const token = process.env.TWILIO_AUTH_TOKEN;
        if (sid && token) {
            try {
                twilioClient = twilio(sid, token);
            } catch (e) {
                console.warn("Twilio init failed:", e.message);
                twilioClient = null;
            }
        }
    }
    return twilioClient;
};

const SMS_FROM = process.env.TWILIO_SMS; // e.g. "+1...."
const WHATSAPP_FROM = process.env.TWILIO_WHATSAPP || "whatsapp:+14155238886";

// Utility: normalize items array
function normalizeItems(incomingItems) {
    return incomingItems.map((it) => {
        const product = it.product || it.productId || it._id || null;
        const name = it.name || it.title || "";
        const image = it.image || it.img || "";
        const qty = Number(it.qty || it.quantity || it.count || 1);
        const price = Number(it.price || it.unitPrice || 0);
        return {
            product,
            name,
            image,
            qty,
            price
        };
    });
}

// Utility: normalize shipping address
function normalizeShipping(s) {
    if (!s) return null;
    if (typeof s === "string") {
        return {
            fullName: "Customer",
            phone: null,
            address: s,
            city: "",
            pincode: ""
        };
    }
    return {
        fullName: s.fullName || s.name || s.full_name || "Customer",
        phone: s.phone || s.mobile || s.contact || null,
        address: s.address || s.line1 || "",
        city: s.city || s.town || "",
        pincode: s.pincode || s.postalCode || s.postal_code || ""
    };
}

// ------------------ Create Order ------------------
exports.createOrder = async (req, res) => {
    try {
        // ensure auth
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "Not authorized"
            });
        }

        // accept various field names from frontend
        let {
            items,
            orderItems,
            shippingAddress,
            totalAmount,
            totalPrice,
            paymentMethod
        } = req.body;

        const incoming = Array.isArray(items) ? items : (Array.isArray(orderItems) ? orderItems : []);
        if (!incoming || incoming.length === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            });
        }

        const normalizedItems = normalizeItems(incoming);

        // validate product ids
        for (const it of normalizedItems) {
            if (!it.product) return res.status(400).json({
                message: "Product ID missing in an item"
            });
            if (!mongoose.Types.ObjectId.isValid(String(it.product))) {
                return res.status(400).json({
                    message: `Invalid product id: ${it.product}`
                });
            }
        }

        const finalShipping = normalizeShipping(shippingAddress);
        if (!finalShipping) return res.status(400).json({
            message: "Shipping address missing"
        });

        // require phone so Twilio works; if you don't want to require, remove this check
        if (!finalShipping.phone) {
            return res.status(400).json({
                message: "Phone number missing in shipping address"
            });
        }

        const finalTotal = (totalAmount || totalPrice);
        if (finalTotal === undefined || finalTotal === null) {
            return res.status(400).json({
                message: "Total amount missing"
            });
        }

        const order = new Order({
            user: req.user.id,
            items: normalizedItems,
            shippingAddress: {
                fullName: finalShipping.fullName,
                phone: finalShipping.phone,
                address: finalShipping.address,
                city: finalShipping.city,
                pincode: finalShipping.pincode
            },
            totalAmount: Number(finalTotal),
            paymentMethod: paymentMethod || "COD",
            status: "Pending"
        });

        const savedOrder = await order.save();

        // send confirmation SMS/WhatsApp (best-effort)
        const phone = finalShipping.phone;
        const client = getTwilioClient();
        const msg = `Hello ${finalShipping.fullName}, your order (${savedOrder._id}) has been placed. Total: ₹${savedOrder.totalAmount}. Thank you!`;

        if (client && SMS_FROM && phone) {
            try {
                await client.messages.create({
                    from: SMS_FROM,
                    to: phone,
                    body: msg
                });
                // try whatsapp too (optional)
                try {
                    await client.messages.create({
                        from: WHATSAPP_FROM,
                        to: `whatsapp:${phone}`,
                        body: msg
                    });
                } catch (e) {
                    console.warn("WhatsApp send failed:", e.message);
                }
            } catch (e) {
                console.warn("SMS send failed:", e.message);
            }
        }

        return res.status(201).json({
            success: true,
            order: savedOrder
        });
    } catch (err) {
        console.error("ORDER CREATE ERROR:", err);
        return res.status(500).json({
            message: err.message || "Server error"
        });
    }
};

// ------------------ Get logged-in user's orders ------------------
exports.getMyOrders = async (req, res) => {
    try {
        if (!req.user || !req.user.id) return res.status(401).json({
            message: "Not authorized"
        });
        const orders = await Order.find({
                user: req.user.id
            })
            .populate("items.product", "name price image")
            .sort({
                createdAt: -1
            });
        return res.json(orders);
    } catch (err) {
        console.error("GET MY ORDERS ERROR:", err);
        return res.status(500).json({
            message: err.message || "Server error"
        });
    }
};

// ------------------ Admin: get all orders ------------------
exports.getAllOrders = async (req, res) => {
    try {
        if (!req.user || !req.user.isAdmin) return res.status(403).json({
            message: "Admin only"
        });
        const orders = await Order.find()
            .populate("user", "name email phone")
            .populate("items.product", "name price image")
            .sort({
                createdAt: -1
            });
        return res.json(orders);
    } catch (err) {
        console.error("GET ALL ORDERS ERROR:", err);
        return res.status(500).json({
            message: err.message || "Server error"
        });
    }
};

// ------------------ Update Order Status (admin) ------------------
exports.updateStatus = async (req, res) => {
    try {
        if (!req.user || !req.user.isAdmin) return res.status(403).json({
            message: "Admin only"
        });

        const {
            status
        } = req.body;
        const order = await Order.findById(req.params.id).populate("user");
        if (!order) return res.status(404).json({
            message: "Order not found"
        });

        order.status = status;
        await order.save();

        const phone = (order.user && order.user.phone) || (order.shippingAddress && order.shippingAddress.phone);
        const client = getTwilioClient();
        const text = `Hello ${(order.user && order.user.name) || (order.shippingAddress && order.shippingAddress.fullName) || "Customer"}, order ${order._id} status changed to ${status}.`;

        if (client && SMS_FROM && phone) {
            try {
                await client.messages.create({
                    from: SMS_FROM,
                    to: phone,
                    body: text
                });
                try {
                    await client.messages.create({
                        from: WHATSAPP_FROM,
                        to: `whatsapp:${phone}`,
                        body: text
                    });
                } catch (e) {
                    console.warn("WhatsApp send failed:", e.message);
                }
            } catch (e) {
                console.warn("SMS send failed:", e.message);
            }
        }

        return res.json({
            message: "Order status updated",
            order
        });
    } catch (err) {
        console.error("UPDATE STATUS ERROR:", err);
        return res.status(500).json({
            message: "Server error"
        });
    }
};

// ------------------ Admin: send tracking message ------------------
exports.sendTrackingMessage = async (req, res) => {
    try {
        if (!req.user || !req.user.isAdmin) return res.status(403).json({
            message: "Admin only"
        });
        const {
            message
        } = req.body;
        const order = await Order.findById(req.params.id).populate("user");
        if (!order) return res.status(404).json({
            message: "Order not found"
        });

        const phone = order.user ? .phone || order.shippingAddress ? .phone;
        if (!phone) return res.status(400).json({
            message: "User phone missing"
        });

        const client = getTwilioClient();
        const body = `Update for order ${order._id}: ${message}`;

        if (client && SMS_FROM) {
            try {
                await client.messages.create({
                    from: SMS_FROM,
                    to: phone,
                    body
                });
                await client.messages.create({
                    from: WHATSAPP_FROM,
                    to: `whatsapp:${phone}`,
                    body
                });
            } catch (e) {
                console.warn("Send tracking msg failed:", e.message);
            }
        }

        return res.json({
            message: "Tracking message sent"
        });
    } catch (err) {
        console.error("TRACK ERROR:", err);
        return res.status(500).json({
            message: "Server error"
        });
    }
};

// ------------------ Invoice PDF generation ------------------
exports.getInvoice = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name email phone");
        if (!order) return res.status(404).json({
            message: "Order not found"
        });

        if (!req.user || (!req.user.isAdmin && String(order.user) !== String(req.user.id))) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        const doc = new PDFDocument({
            size: "A4",
            margin: 50
        });
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=invoice-${order._id}.pdf`);
        doc.pipe(res);

        // header
        doc.fontSize(20).text("Invoice", {
            align: "center"
        });
        doc.moveDown();
        doc.fontSize(12).text(`Order ID: ${order._id}`);
        doc.text(`Date: ${order.createdAt.toLocaleString()}`);
        doc.text(`Customer: ${order.shippingAddress.fullName || (order.user && order.user.name)}`);
        doc.text(`Phone: ${order.shippingAddress.phone || (order.user && order.user.phone) || "N/A"}`);
        doc.moveDown();

        // items
        doc.fontSize(14).text("Items:");
        order.items.forEach((it, idx) => {
            doc.fontSize(12).text(`${idx + 1}. ${it.name} - ${it.qty} x ₹${it.price} = ₹${(it.qty * it.price)}`);
        });
        doc.moveDown();
        doc.fontSize(14).text(`Total: ₹${order.totalAmount}`, {
            align: "right"
        });

        doc.end();
    } catch (err) {
        console.error("INVOICE ERROR:", err);
        return res.status(500).json({
            message: "Server error"
        });
    }
};