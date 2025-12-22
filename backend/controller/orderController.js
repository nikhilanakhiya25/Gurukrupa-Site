import Order from "../models/Order.js";
import mongoose from "mongoose";
import twilio from "twilio";
import PDFDocument from "pdfkit";

/* ======================= TWILIO ======================= */
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

// 🔧 ADD STRONG LOGGING HELPER
async function sendNotifications(phone, message) {
    const client = getTwilioClient();
    if (!client) {
        console.log("❌ Twilio client not ready");
        return;
    }

    if (!phone || !phone.startsWith("+")) {
        console.log("❌ Invalid phone format:", phone);
        return;
    }

    console.log("📨 SMS_FROM:", SMS_FROM);
    console.log("📨 WHATSAPP_FROM:", WHATSAPP_FROM);
    console.log("📨 TO PHONE:", phone);
    console.log("📨 TWILIO READY:", !!getTwilioClient());

    try {
        if (SMS_FROM) {
            await client.messages.create({
                from: SMS_FROM,
                to: phone,
                body: message
            });
            console.log("✅ SMS sent");
        }

        await client.messages.create({
            from: WHATSAPP_FROM,
            to: `whatsapp:${phone}`,
            body: message
        });
        console.log("✅ WhatsApp sent");

    } catch (err) {
        console.error("❌ Twilio send error:", err.message);
    }
}

/* ======================= HELPERS ======================= */
const normalizeItems = (items) =>
    items.map((it) => ({
        product: it.product || it.productId || it._id,
        name: it.name || it.title || "",
        image: it.image || "",
        qty: Number(it.qty || it.quantity || 1),
        price: Number(it.price || it.unitPrice || 0)
    }));

const normalizeShipping = (s) => {
    if (!s) return null;
    return {
        fullName: s.fullName || s.name || "Customer",
        phone: s.phone || s.mobile || null,
        address: s.address || "",
        city: s.city || "",
        pincode: s.pincode || s.postalCode || ""
    };
};

/* ======================= CREATE ORDER ======================= */
export const createOrder = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "Not authorized"
            });
        }

        const {
            items,
            orderItems,
            shippingAddress,
            totalAmount,
            totalPrice,
            paymentMethod
        } = req.body;

        const incoming = Array.isArray(orderItems) ?
            orderItems :
            Array.isArray(items) ?
            items :
            [];

        if (!incoming.length) {
            return res.status(400).json({
                message: "Cart is empty"
            });
        }

        const normalizedItems = normalizeItems(incoming);

        for (const it of normalizedItems) {
            if (!it.product || !mongoose.Types.ObjectId.isValid(it.product)) {
                return res.status(400).json({
                    message: "Invalid product ID"
                });
            }
        }

        const shipping = normalizeShipping(shippingAddress);
        if (!shipping) {
            return res.status(400).json({
                message: "Shipping missing"
            });
        }

        const finalTotal = totalAmount || totalPrice;
        if (finalTotal == null) {
            return res.status(400).json({
                message: "Total missing"
            });
        }

        const order = await Order.create({
            user: req.user.id,
            items: normalizedItems,
            shippingAddress: shipping,
            totalAmount: Number(finalTotal),
            paymentMethod: paymentMethod || "COD",
            status: "Pending"
        });

        /* -------- Notifications (NON BLOCKING) -------- */
        await sendNotifications(
            shipping.phone,
            `✅ Order Confirmed
Order ID: ${order._id}
Total: ₹${order.totalAmount}`
        );

        return res.status(201).json({
            success: true,
            _id: order._id, // ⭐ frontend friendly
            order
        });
    } catch (err) {
        console.error("ORDER CREATE ERROR:", err);
        return res.status(500).json({
            message: "Order creation failed"
        });
    }
};

/* ======================= USER ORDERS ======================= */
export const getMyOrders = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "Not authorized"
            });
        }

        const orders = await Order.find({
                user: req.user.id
            })
            .populate("items.product", "name price image")
            .sort({
                createdAt: -1
            });

        res.json(orders);
    } catch (err) {
        console.error("GET MY ORDERS ERROR:", err);
        res.status(500).json({
            message: "Server error"
        });
    }
};

/* ======================= ADMIN ORDERS ======================= */
export const getAllOrders = async (req, res) => {
    try {
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({
                message: "Admin only"
            });
        }

        const orders = await Order.find()
            .populate("user", "name email phone")
            .populate("items.product", "name price image")
            .sort({
                createdAt: -1
            });

        res.json(orders);
    } catch (err) {
        console.error("GET ALL ORDERS ERROR:", err);
        res.status(500).json({
            message: "Server error"
        });
    }
};

/* ======================= UPDATE STATUS ======================= */
export const updateStatus = async (req, res) => {
    try {
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({
                message: "Admin only"
            });
        }

        const order = await Order.findById(req.params.id).populate("user");
        if (!order) return res.status(404).json({
            message: "Order not found"
        });

        order.status = req.body.status;
        await order.save();

        res.json({
            message: "Status updated",
            order
        });
    } catch (err) {
        console.error("STATUS ERROR:", err);
        res.status(500).json({
            message: "Server error"
        });
    }
};

/* ======================= INVOICE PDF ======================= */
export const getInvoice = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user");
        if (!order) return res.status(404).json({
            message: "Order not found"
        });

        if ((!req.user || !req.user.isAdmin) && String(order.user._id) !== String(req.user.id)) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        const doc = new PDFDocument({
            size: "A4",
            margin: 50
        });
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=invoice-${order._id}.pdf`
        );
        doc.pipe(res);

        doc.fontSize(20).text("Invoice", {
            align: "center"
        }).moveDown();
        doc.fontSize(12)
            .text(`Order ID: ${order._id}`)
            .text(`Name: ${order.shippingAddress.fullName}`)
            .text(`Phone: ${order.shippingAddress.phone || "-"}`)
            .text(`Date: ${order.createdAt.toLocaleString()}`)
            .moveDown();

        order.items.forEach((it, i) => {
            doc.text(
                `${i + 1}. ${it.name} - ${it.qty} × ₹${it.price} = ₹${
                    it.qty * it.price
                }`
            );
        });

        doc.moveDown().fontSize(14).text(
            `Total: ₹${order.totalAmount}`, {
                align: "right"
            }
        );

        doc.end();
    } catch (err) {
        console.error("INVOICE ERROR:", err);
        res.status(500).json({
            message: "Server error"
        });
    }
};

/* ======================= SEND TRACKING MESSAGE ======================= */
export const sendTrackingMessage = async (req, res) => {
    try {
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({
                message: "Admin only"
            });
        }

        const order = await Order.findById(req.params.id).populate("user");
        if (!order) return res.status(404).json({
            message: "Order not found"
        });

        const { trackingNumber, carrier } = req.body;
        if (!trackingNumber || !carrier) {
            return res.status(400).json({
                message: "Tracking number and carrier required"
            });
        }

        /* -------- Notifications (NON BLOCKING) -------- */
        await sendNotifications(
            order.shippingAddress.phone,
            `📦 Tracking Update
Order ID: ${order._id}
Tracking Number: ${trackingNumber}
Carrier: ${carrier}
Track your order at: https://www.${carrier.toLowerCase()}.com/track/${trackingNumber}`
        );

        res.json({
            message: "Tracking message sent"
        });
    } catch (err) {
        console.error("TRACKING MESSAGE ERROR:", err);
        res.status(500).json({
            message: "Server error"
        });
    }
};
