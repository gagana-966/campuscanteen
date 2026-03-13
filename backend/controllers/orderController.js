import Order from '../models/Order.js';

// Create new order
// POST /api/orders
export const addOrderItems = async (req, res) => {
    const { name, phone, notes, items, totalAmount } = req.body;

    if (items && items.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    } else {
        const order = new Order({
            customerId: req.user._id,
            customerName: name,
            customerPhone: phone,
            notes,
            items,
            totalAmount,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
};

// Get all orders for a restaurant or a user
// GET /api/orders
export const getOrders = async (req, res) => {
    let orders;
    if (req.user.role === 'restaurant') {
        // A restaurant should ideally see orders that contain their food items.
        // For simplicity, we can just return all orders or filter by their food items.
        // Since an order items array contains foodItem refs, we can find orders with those refs.
        // Assuming a simple implementation where the restaurant sees orders for their items.
        orders = await Order.find({ 'items.foodItem': { $exists: true } }).sort({ createdAt: -1 });
    } else {
        orders = await Order.find({ customerId: req.user._id }).sort({ createdAt: -1 });
    }
    res.json(orders);
};
