import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import FoodItem from './models/FoodItem.js';
import Order from './models/Order.js';

dotenv.config();

const INITIAL_FOOD_ITEMS = [
    {
        name: "Classic Burger",
        description: "Juicy beef patty with fresh lettuce, tomato, and special sauce",
        price: 149,
        category: "Main Course",
        image: "https://images.unsplash.com/photo-1688246780164-00c01647e78c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBmb29kfGVufDF8fHx8MTc3MDI2Mzk1OXww&ixlib=rb-4.1.0&q=80&w=1080",
        available: true,
    },
    {
        name: "Margherita Pizza",
        description: "Fresh mozzarella, tomato sauce, and basil on thin crust",
        price: 299,
        category: "Main Course",
        image: "https://images.unsplash.com/photo-1544982503-9f984c14501a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHNsaWNlfGVufDF8fHx8MTc3MDE4ODc4OXww&ixlib=rb-4.1.0&q=80&w=1080",
        available: true,
    },
    {
        name: "Creamy Pasta",
        description: "Penne pasta in rich creamy alfredo sauce with herbs",
        price: 249,
        category: "Main Course",
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGRpc2h8ZW58MXx8fHwxNzcwMTczMTUwfDA&ixlib=rb-4.1.0&q=80&w=1080",
        available: true,
    },
    {
        name: "Garden Fresh Salad",
        description: "Mixed greens, cherry tomatoes, cucumber with vinaigrette",
        price: 129,
        category: "Salads",
        image: "https://images.unsplash.com/photo-1624340209404-4f479dd59708?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxhZCUyMGJvd2wlMjBoZWFsdGh5fGVufDF8fHx8MTc3MDIzOTIxMHww&ixlib=rb-4.1.0&q=80&w=1080",
        available: true,
    },
    {
        name: "Club Sandwich",
        description: "Triple-decker with chicken, bacon, lettuce, and mayo",
        price: 199,
        category: "Main Course",
        image: "https://images.unsplash.com/photo-1763647814142-b1eb054d42f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW5kd2ljaCUyMGZyZXNofGVufDF8fHx8MTc3MDE5NDQ1NXww&ixlib=rb-4.1.0&q=80&w=1080",
        available: false,
    },
    {
        name: "Cappuccino",
        description: "Rich espresso with steamed milk and foam",
        price: 99,
        category: "Beverages",
        image: "https://images.unsplash.com/photo-1592663527359-cf6642f54cff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBkcmlua3xlbnwxfHx8fDE3NzAyMzI1NzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
        available: true,
    },
    {
        name: "Fresh Lemonade",
        description: "Homemade lemonade with fresh mint",
        price: 79,
        category: "Beverages",
        image: "https://images.unsplash.com/photo-1716925539259-ce0115263d37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2RhJTIwYmV2ZXJhZ2V8ZW58MXx8fHwxNzcwMjcwODA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
        available: true,
    },
    {
        name: "Chocolate Cake",
        description: "Decadent chocolate layer cake with ganache",
        price: 159,
        category: "Desserts",
        image: "https://images.unsplash.com/photo-1679942262057-d5732f732841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwY2FrZXxlbnwxfHx8fDE3NzAxOTM3Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        available: true,
    },
    {
        name: "Chicken Biryani",
        description: "Aromatic basmati rice cooked with tender chicken and traditional spices",
        price: 249,
        category: "Main Course",
        image: "https://images.unsplash.com/photo-1735233024815-7986206a18a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYmlyeWFuaSUyMGJvd2x8ZW58MXx8fHwxNzcwMTk5MTI0fDA&ixlib=rb-4.1.0&q=80&w=1080",
        available: true,
    },
    {
        name: "Vegetable Fried Rice",
        description: "Wok-tossed rice with fresh colorful vegetables and soy sauce",
        price: 189,
        category: "Main Course",
        image: "https://images.unsplash.com/photo-1581184953987-5668072c8420?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGUlMjBmcmllZCUyMHJpY2V8ZW58MXx8fHwxNzcwMjYzNjg0fDA&ixlib=rb-4.1.0&q=80&w=1080",
        available: true,
    },
    {
        name: "Paneer Tikka Masala",
        description: "Grilled cottage cheese cubes in spicy and creamy tomato gravy",
        price: 229,
        category: "Main Course",
        image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGRpc2h8ZW58MXx8fHwxNzcwMTczMTUwfDA&ixlib=rb-4.1.0&q=80&w=1080",
        available: true,
    },
    {
        name: "Caesar Salad",
        description: "Crisp romaine lettuce with parmesan, croutons and caesar dressing",
        price: 179,
        category: "Salads",
        image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWVzYXIlMjBzYWxhZHxlbnwxfHx8fDE3NzAyNzc3MTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
        available: true,
    },
    {
        name: "Fruit Salad",
        description: "Seasonal fresh fruits bowl with honey drizzle",
        price: 149,
        category: "Salads",
        image: "https://images.unsplash.com/photo-1609090802574-612df35aaa04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZydWl0JTIwc2FsYWQlMjBib3lsfGVufDF8fHx8MTc3MDI2MjQ3MXww&ixlib=rb-4.1.0&q=80&w=1080",
        available: true,
    },
    {
        name: "Mango Lassi",
        description: "Refreshing yogurt-based drink with sweet mango pulp",
        price: 119,
        category: "Beverages",
        image: "https://images.unsplash.com/photo-1655074084308-901ea6b88fd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMGxhc3NpJTIwZHJpbmt8ZW58MXx8fHwxNzcwMTk4MDg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
        available: true,
    },
    {
        name: "Masala Chai",
        description: "Traditional spiced tea brewed with milk and aromatic spices",
        price: 49,
        category: "Beverages",
        image: "https://images.unsplash.com/photo-1628702774354-f09e4a167a8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNhbGElMjBjaGFpJTIwdGVhJTIwY3VwfGVufDF8fHx8MTc3MDI3MTc5NXww&ixlib=rb-4.1.0&q=80&w=1080",
        available: true,
    },
    {
        name: "Gulab Jamun",
        description: "Soft milk solids balls soaked in rose-flavored sugar syrup (2 pcs)",
        price: 89,
        category: "Desserts",
        image: "https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndWxhYiUyMGphbXVuJTIwZGVzc2VydHxlbnwxfHx8fDE3NzAyNjYzMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
        available: true,
    },
    {
        name: "Brownie with Ice Cream",
        description: "Warm chocolate walnut brownie served with vanilla ice cream",
        price: 169,
        category: "Desserts",
        image: "https://images.unsplash.com/photo-1639744093270-36e0cc2817ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93bmllJTIwd2l0aCUyMHZhbmlsbGElMjBpY2UlMjBjcmVhbXxlbnwxfHx8fDE3NzAyODEwMDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
        available: true,
    },
];

const seedData = async () => {
    try {
        await mongoose.connect('mongodb://gagana-966:Gagana123@ac-ldaqzmx-shard-00-01.ug25uwu.mongodb.net:27017,ac-ldaqzmx-shard-00-00.ug25uwu.mongodb.net:27017,ac-ldaqzmx-shard-00-02.ug25uwu.mongodb.net:27017/onlinefood?ssl=true&replicaSet=atlas-ozg3gh-shard-0&authSource=admin&retryWrites=true&w=majority&appName=food');
        console.log('MongoDB Connected for seeding');

        // Clear existing data
        await Order.deleteMany();
        await User.deleteMany();
        await FoodItem.deleteMany();
        console.log('Existing data cleared...');

        // Create Users
        // const restaurantUser = await User.create({
        //     name: 'Campus Canteen Admin',
        //     email: 'admin@canteen.edu',
        //     password: 'password123',
        //     role: 'restaurant',
        // });

        const secondRestaurantUser = await User.create({
            name: 'Shalini',
            email: 'shalushalu2599@gmail.com',
            password: 'Shalu@123',
            role: 'restaurant',
        });

        const thridRestaurantUser = await User.create({
            name: 'Swetha',
            email: 'yswetha753@gmail.com',
            password: 'Swethu@123',
            role: 'restaurant',
        });

        // Add customer users to restaurant side for OTP testing
        // const restaurantCustomerUser = await User.create({
        //     name: 'Nivedha (Restaurant)',
        //     email: 'nivedha.restaurant@canteen.edu',
        //     password: 'Nive@#123',
        //     role: 'restaurant'
        // });

        // const restaurantCustomerUser2 = await User.create({
        //     name: 'Gagana Shree(Restaurant)',
        //     email: 'gagana.restaurant@canteen.edu',
        //     password: 'Pramila@#123',
        //     role: 'restaurant'
        // });

        // const restaurantCustomerUser3 = await User.create({
        //     name: 'Arun (Restaurant)',
        //     email: 'arun.restaurant@canteen.edu',
        //     password: 'Arun@123',
        //     role: 'restaurant'
        // });

        // const customerUser = await User.create({
        //     name: 'Tarun (Student)',
        //     email: 'tarun@customer.edu',    // modified email slightly for semantic match with "to customer" message
        //     password: 'password123',
        //     role: 'customer'
        // });

        const secondCustomerUser = await User.create({
            name: 'Nivedha (Student)',
            email: 'sekarsekar37619@gmail.com',
            password: 'Nive@#123',
            role: 'customer'
        });

        const thirdCustomerUser = await User.create({
            name: 'Gagana Shree(Student)',
            email: 'gshree878@gmail.com',
            password: 'Pramila@#123',
            role: 'customer'
        });

        const fourthCustomerUser = await User.create({
            name: 'Arun (Student)',
            email: 'arunthalapathy88@gmail.com',
            password: 'Arun@123',
            role: 'customer'
        });

        // Add restaurant users to customer side for OTP testing
        // const customerRestaurantUser = await User.create({
        //     name: 'Shalini (Customer)',
        //     email: 'shalini.customer@canteen.edu',
        //     password: 'Shalu@123',
        //     role: 'customer'
        // });

        // const customerRestaurantUser2 = await User.create({
        //     name: 'Swetha (Customer)',
        //     email: 'swetha.customer@canteen.edu',
        //     password: 'Swethu@123',
        //     role: 'customer'
        // });


        console.log('Users created successfully!');

        // Attach Restaurant ID to all items
        const foodItemsWithOwner = INITIAL_FOOD_ITEMS.map(item => ({
            ...item,
            restaurantId: secondRestaurantUser._id
        }));

        const insertedItems = await FoodItem.insertMany(foodItemsWithOwner);
        console.log(`Successfully created ${insertedItems.length} Food Items!`);

        // Create Orders
        const sampleOrder1 = await Order.create({
            customerId: secondCustomerUser._id,
            customerName: secondCustomerUser.name,
            customerPhone: '9876543210',
            notes: 'Extra spicy',
            items: [
                {
                    name: insertedItems[0].name,
                    qty: 2,
                    image: insertedItems[0].image,
                    price: insertedItems[0].price,
                    foodItem: insertedItems[0]._id
                },
                {
                    name: insertedItems[1].name,
                    qty: 1,
                    image: insertedItems[1].image,
                    price: insertedItems[1].price,
                    foodItem: insertedItems[1]._id
                }
            ],
            totalAmount: (insertedItems[0].price * 2) + insertedItems[1].price,
            status: 'Pending'
        });

        const sampleOrder2 = await Order.create({
            customerId: thirdCustomerUser._id,
            customerName: thirdCustomerUser.name,
            customerPhone: '1234567890',
            notes: 'No onions',
            items: [
                {
                    name: insertedItems[2].name,
                    qty: 1,
                    image: insertedItems[2].image,
                    price: insertedItems[2].price,
                    foodItem: insertedItems[2]._id
                }
            ],
            totalAmount: insertedItems[2].price,
            status: 'Ready'
        });

        console.log('Orders created successfully!');

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
