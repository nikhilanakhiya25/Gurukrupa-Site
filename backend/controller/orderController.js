const Order = require("../models/Order");
const mongoose = require("mongoose");
const twilio = require("twilio");
const PDFDocument = require("pdfkit");

// Twilio initialization (lazy)
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

const SMS_FROM = process.env.TWILIO_SMS;
const WHATSAPP_FROM = process.env.TWILIO_WHATSAPP || "whatsapp:+14155238886";

// Normalize cart items
function normalizeItems(items) {
    return items.map((it) => ({
        product: it.product || it.productId || it._id,
        name: it.name || it.title || "",
        image: it.image || it.img || "",
        qty: Number(it.qty || it.quantity || 1),
        price: Number(it.price || it.unitPrice || 0)
    }));
}

// Normalize shipping address
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
        fullName: s.fullName || s.name || "Customer",
        phone: s.phone || s.mobile || s.contact,
        address: s.address || "",
        city: s.city || "",
        pincode: s.pincode || s.postalCode
    };
}

// --------------------------------- CREATE ORDER ---------------------------------
exports.createOrder = async (req, res) => {
    try {
        if (!req.user || !req.user.id)
            return res.status(401).json({
                message: "Not authorized"
            });

        let {
            items,
            orderItems,
            shippingAddress,
            totalAmount,
            totalPrice,
            paymentMethod
        } = req.body;

        const incoming = Array.isArray(items) ?
            items :
            Array.isArray(orderItems) ?
            orderItems :
            [];

        if (!incoming.length)
            return res.status(400).json({
                message: "Cart is empty"
            });

        const normalizedItems = normalizeItems(incoming);

        // Validate product IDs
        for (const it of normalizedItems) {
            if (!it.product)
                return res.status(400).json({
                    message: "Product ID missing"
                });

            if (!mongoose.Types.ObjectId.isValid(String(it.product)))
                return res.status(400).json({
                    message: "Invalid product ID"
                });
        }

        const finalShipping = normalizeShipping(shippingAddress);
        if (!finalShipping) return res.status(400).json({
            message: "Shipping missing"
        });

        if (!finalShipping.phone)
            return res.status(400).json({
                message: "Phone number required"
            });

        const finalTotal = totalAmount || totalPrice;
        if (finalTotal == null)
            return res.status(400).json({
                message: "Total amount missing"
            });

        const order = new Order({
            user: req.user.id,
            items: normalizedItems,
            shippingAddress: finalShipping,
            totalAmount: Number(finalTotal),
            paymentMethod: paymentMethod || "COD",
            status: "Pending"
        });

        const savedOrder = await order.save();

        // Send SMS/WhatsApp
        const client = getTwilioClient();
        const phone = finalShipping.phone;
        const msg = `Hello ${finalShipping.fullName}, your order (${savedOrder._id}) has been placed. Total: ₹${savedOrder.totalAmount}. Thank you!`;

        if (client && SMS_FROM && phone) {
            try {
                await client.messages.create({
                    from: SMS_FROM,
                    to: phone,
                    body: msg
                });

                // WhatsApp fallback
                try {
                    await client.messages.create({
                        from: WHATSAPP_FROM,
                        to: `whatsapp:${phone}`,
                        body: msg
                    });
                } catch (e) {
                    console.warn("WhatsApp failed:", e.message);
                }
            } catch (e) {
                console.warn("SMS failed:", e.message);
            }
        }

        return res.status(201).json({
            success: true,
            order: savedOrder
        });
    } catch (err) {
        console.error("ORDER CREATE ERROR:", err);
        return res.status(500).json({
            message: err.message
        });
    }
};

// --------------------------------- USER ORDERS ---------------------------------
exports.getMyOrders = async (req, res) => {
    try {
        if (!req.user || !req.user.id)
            return res.status(401).json({
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
            message: err.message
        });
    }
};

// --------------------------------- ADMIN ALL ORDERS ---------------------------------
exports.getAllOrders = async (req, res) => {
    try {
        if (!req.user || !req.user.isAdmin)
            return res.status(403).json({
                message: "Admin only"
            });

        const orders = await Order.find()
            .populate("user", "name email phone")
            .populate({
                path: "items.product",
                select: "name price image",
                model: "Product"
            })
            .sort({
                createdAt: -1
            });

        return res.json(orders);
    } catch (err) {
        console.error("GET ALL ORDERS ERROR:", err);
        return res.status(500).json({
            message: err.message
        });
    }
};

// --------------------------------- UPDATE ORDER STATUS ---------------------------------
exports.updateStatus = async (req, res) => {
    try {
        if (!req.user || !req.user.isAdmin)
            return res.status(403).json({
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

        const phone =
            (order.user && order.user.phone) ||
            (order.shippingAddress && order.shippingAddress.phone);

        const client = getTwilioClient();
        const text = `Order ${order._id} status updated to ${status}.`;

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
                } catch (err) {
                    console.warn("WhatsApp failed:", err.message);
                }
            } catch (err) {
                console.warn("SMS failed:", err.message);
            }
        }

        return res.json({
            message: "Status updated",
            order
        });
    } catch (err) {
        console.error("STATUS UPDATE ERROR:", err);
        return res.status(500).json({
            message: "Server error"
        });
    }
};

// --------------------------------- TRACKING MESSAGE ---------------------------------
exports.sendTrackingMessage = async (req, res) => {
    try {
        if (!req.user || !req.user.isAdmin)
            return res.status(403).json({
                message: "Admin only"
            });

        const {
            message
        } = req.body;
        const order = await Order.findById(req.params.id).populate("user");
        if (!order) return res.status(404).json({
            message: "Order not found"
        });

        const phone =
            (order.user && order.user.phone) ||
            (order.shippingAddress && order.shippingAddress.phone);

        if (!phone) return res.status(400).json({
            message: "Phone missing"
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
                console.warn("Send tracking failed:", e.message);
            }
        }

        return res.json({
            message: "Tracking message sent"
        });
    } catch (err) {
        console.error("TRACKING ERROR:", err);
        return res.status(500).json({
            message: "Server error"
        });
    }
};

// --------------------------------- GET INVOICE PDF ---------------------------------
exports.getInvoice = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user");
        if (!order) return res.status(404).json({
            message: "Order not found"
        });

        if (!req.user || (!req.user.isAdmin && String(order.user._id) !== String(req.user.id))) {
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

        doc.fontSize(20).text("Invoice", {
            align: "center"
        });
        doc.moveDown();

        doc.fontSize(12).text(`Order ID: ${order._id}`);
        doc.text(`Customer: ${order.shippingAddress.fullName}`);
        doc.text(`Phone: ${order.shippingAddress.phone}`);
        doc.text(`Date: ${order.createdAt.toLocaleString()}`);
        doc.moveDown();

        doc.fontSize(14).text("Items:");
        order.items.forEach((it, i) => {
            doc.fontSize(12).text(
                `${i + 1}. ${it.name} - ${it.qty} × ₹${it.price} = ₹${it.qty * it.price}`
            );
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
