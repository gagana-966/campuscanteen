import mongoose from 'mongoose';

const foodItemSchema = mongoose.Schema(
    {
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        available: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const FoodItem = mongoose.model('FoodItem', foodItemSchema);

export default FoodItem;
