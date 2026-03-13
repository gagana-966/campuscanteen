import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        customerName: {
            type: String,
            required: true,
        },
        customerPhone: {
            type: String,
            required: true,
        },
        notes: {
            type: String,
        },
        items: [
            {
                name: { type: String, required: true },
                qty: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                foodItem: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'FoodItem',
                },
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
            default: 0.0,
        },
        status: {
            type: String,
            enum: ['Pending', 'Preparing', 'Ready', 'Completed'],
            default: 'Pending',
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
