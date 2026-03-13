import FoodItem from '../models/FoodItem.js';

// Get all food items
// GET /api/food
export const getFoodItems = async (req, res) => {
    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    const foodItems = await FoodItem.find({ ...keyword });
    res.json(foodItems);
};

// Create a food item
// POST /api/food
export const createFoodItem = async (req, res) => {
    const { name, description, price, category, image, available } = req.body;

    const foodItem = new FoodItem({
        name,
        description,
        price,
        category,
        image,
        available,
        restaurantId: req.user._id,
    });

    const createdFoodItem = await foodItem.save();
    res.status(201).json(createdFoodItem);
};

// Update a food item
// PUT /api/food/:id
export const updateFoodItem = async (req, res) => {
    const { name, description, price, category, image, available } = req.body;

    const foodItem = await FoodItem.findById(req.params.id);

    if (foodItem) {
        if (foodItem.restaurantId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this item' });
        }

        foodItem.name = name || foodItem.name;
        foodItem.description = description || foodItem.description;
        foodItem.price = price !== undefined ? price : foodItem.price;
        foodItem.category = category || foodItem.category;
        foodItem.image = image || foodItem.image;
        foodItem.available = available !== undefined ? available : foodItem.available;

        const updatedFoodItem = await foodItem.save();
        res.json(updatedFoodItem);
    } else {
        res.status(404).json({ message: 'Food item not found' });
    }
};

// Delete a food item
// DELETE /api/food/:id
export const deleteFoodItem = async (req, res) => {
    const foodItem = await FoodItem.findById(req.params.id);

    if (foodItem) {
        if (foodItem.restaurantId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this item' });
        }

        await foodItem.deleteOne();
        res.json({ message: 'Food item removed' });
    } else {
        res.status(404).json({ message: 'Food item not found' });
    }
};
