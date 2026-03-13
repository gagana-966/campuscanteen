import { useState, useEffect } from "react";
import { FoodItem } from "./components/FoodCard";
import { Login } from "./components/Login";
import { VerifyEmail } from "./components/VerifyEmail";
import { Toaster } from "./components/ui/sonner";
import { CustomerView } from "./views/CustomerView";
import { RestaurantView } from "./views/RestaurantView";

const INITIAL_FOOD_ITEMS: FoodItem[] = [
  {
    id: "1",
    name: "Classic Burger",
    description: "Juicy beef patty with fresh lettuce, tomato, and special sauce",
    price: 149,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1688246780164-00c01647e78c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBmb29kfGVufDF8fHx8MTc3MDI2Mzk1OXww&ixlib=rb-4.1.0&q=80&w=1080",
    available: true,
  },
  {
    id: "2",
    name: "Margherita Pizza",
    description: "Fresh mozzarella, tomato sauce, and basil on thin crust",
    price: 299,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1544982503-9f984c14501a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHNsaWNlfGVufDF8fHx8MTc3MDE4ODc4OXww&ixlib=rb-4.1.0&q=80&w=1080",
    available: true,
  },
  {
    id: "3",
    name: "Creamy Pasta",
    description: "Penne pasta in rich creamy alfredo sauce with herbs",
    price: 249,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGRpc2h8ZW58MXx8fHwxNzcwMTczMTUwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    available: true,
  },
  {
    id: "4",
    name: "Garden Fresh Salad",
    description: "Mixed greens, cherry tomatoes, cucumber with vinaigrette",
    price: 129,
    category: "Salads",
    image: "https://images.unsplash.com/photo-1624340209404-4f479dd59708?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxhZCUyMGJvd2wlMjBoZWFsdGh5fGVufDF8fHx8MTc3MDIzOTIxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    available: true,
  },
  {
    id: "5",
    name: "Club Sandwich",
    description: "Triple-decker with chicken, bacon, lettuce, and mayo",
    price: 199,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1763647814142-b1eb054d42f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW5kd2ljaCUyMGZyZXNofGVufDF8fHx8MTc3MDE5NDQ1NXww&ixlib=rb-4.1.0&q=80&w=1080",
    available: false,
  },
  {
    id: "6",
    name: "Cappuccino",
    description: "Rich espresso with steamed milk and foam",
    price: 99,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1592663527359-cf6642f54cff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBkcmlua3xlbnwxfHx8fDE3NzAyMzI1NzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    available: true,
  },
  {
    id: "7",
    name: "Fresh Lemonade",
    description: "Homemade lemonade with fresh mint",
    price: 79,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1716925539259-ce0115263d37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2RhJTIwYmV2ZXJhZ2V8ZW58MXx8fHwxNzcwMjcwODA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    available: true,
  },
  {
    id: "8",
    name: "Chocolate Cake",
    description: "Decadent chocolate layer cake with ganache",
    price: 159,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1679942262057-d5732f732841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwY2FrZXxlbnwxfHx8fDE3NzAxOTM3Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    available: true,
  },
  {
    id: "9",
    name: "Chicken Biryani",
    description: "Aromatic basmati rice cooked with tender chicken and traditional spices",
    price: 249,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1735233024815-7986206a18a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYmlyeWFuaSUyMGJvd2x8ZW58MXx8fHwxNzcwMTk5MTI0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    available: true,
  },
  {
    id: "10",
    name: "Vegetable Fried Rice",
    description: "Wok-tossed rice with fresh colorful vegetables and soy sauce",
    price: 189,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1581184953987-5668072c8420?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGUlMjBmcmllZCUyMHJpY2V8ZW58MXx8fHwxNzcwMjYzNjg0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    available: true,
  },
  {
    id: "11",
    name: "Paneer Tikka Masala",
    description: "Grilled cottage cheese cubes in spicy and creamy tomato gravy",
    price: 229,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGRpc2h8ZW58MXx8fHwxNzcwMTczMTUwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    available: true,
  },
  {
    id: "12",
    name: "Caesar Salad",
    description: "Crisp romaine lettuce with parmesan, croutons and caesar dressing",
    price: 179,
    category: "Salads",
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWVzYXIlMjBzYWxhZHxlbnwxfHx8fDE3NzAyNzc3MTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    available: true,
  },
  {
    id: "13",
    name: "Fruit Salad",
    description: "Seasonal fresh fruits bowl with honey drizzle",
    price: 149,
    category: "Salads",
    image: "https://images.unsplash.com/photo-1609090802574-612df35aaa04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZydWl0JTIwc2FsYWQlMjBib3lsfGVufDF8fHx8MTc3MDI2MjQ3MXww&ixlib=rb-4.1.0&q=80&w=1080",
    available: true,
  },
  {
    id: "14",
    name: "Mango Lassi",
    description: "Refreshing yogurt-based drink with sweet mango pulp",
    price: 119,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1655074084308-901ea6b88fd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMGxhc3NpJTIwZHJpbmt8ZW58MXx8fHwxNzcwMTk4MDg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    available: true,
  },
  {
    id: "15",
    name: "Masala Chai",
    description: "Traditional spiced tea brewed with milk and aromatic spices",
    price: 49,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1628702774354-f09e4a167a8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNhbGElMjBjaGFpJTIwdGVhJTIwY3VwfGVufDF8fHx8MTc3MDI3MTc5NXww&ixlib=rb-4.1.0&q=80&w=1080",
    available: true,
  },
  {
    id: "16",
    name: "Gulab Jamun",
    description: "Soft milk solids balls soaked in rose-flavored sugar syrup (2 pcs)",
    price: 89,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndWxhYiUyMGphbXVuJTIwZGVzc2VydHxlbnwxfHx8fDE3NzAyNjYzMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    available: true,
  },
  {
    id: "17",
    name: "Brownie with Ice Cream",
    description: "Warm chocolate walnut brownie served with vanilla ice cream",
    price: 169,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1639744093270-36e0cc2817ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93bmllJTIwd2l0aCUyMHZhbmlsbGElMjBpY2UlMjBjcmVhbXxlbnwxfHx8fDE3NzAyODEwMDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    available: true,
  },
];

const CATEGORIES = ["All", "Main Course", "Salads", "Beverages", "Desserts"];

type AuthStep = "login" | "verification" | "authenticated";
type UserRole = "customer" | "restaurant" | null;
type ViewMode = "customer" | "restaurant";

export default function App() {
  const [authStep, setAuthStep] = useState<AuthStep>("login");
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("customer");
  const [userEmail, setUserEmail] = useState("");
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);

  useEffect(() => {
    fetchFoodItems();
  }, [authStep]);

  const fetchFoodItems = async () => {
    try {
      const res = await fetch('/api/food');
      const data = await res.json();
      if (res.ok) {
        const mappedData = data.map((item: any) => ({ ...item, id: item._id }));
        setFoodItems(mappedData.length > 0 ? mappedData : INITIAL_FOOD_ITEMS); // Fallback to initial if db empty
      }
    } catch (error) {
      console.error('Error fetching food items:', error);
      setFoodItems(INITIAL_FOOD_ITEMS); // Fallback on error
    }
  };

  const handleLogin = (email: string, password: string, role: "customer" | "restaurant") => {
    setUserEmail(email);
    setUserRole(role);
    setAuthStep("verification");
  };

  const handleLogout = () => {
    setAuthStep("login");
    setUserRole(null);
    setUserEmail("");
    setViewMode("customer");
  };

  const handleAddItem = async (item: Omit<FoodItem, "id">) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(item),
      });
      const data = await res.json();
      if (res.ok) {
        const newItem: FoodItem = {
          ...data,
          id: data._id,
        };
        setFoodItems((prev) => [...prev, newItem]);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateItem = async (id: string, updates: Partial<FoodItem>) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/food/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (res.ok) {
        setFoodItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, ...data, id: data._id } : item))
        );
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/food/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        setFoodItems((prev) => prev.filter((item) => item.id !== id));
      } else {
        const data = await res.json();
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Show login screen
  if (authStep === "login") {
    return <Login onLogin={handleLogin} />;
  }

  // Show verification screen
  if (authStep === "verification") {
    return (
      <VerifyEmail
        email={userEmail}
        onBack={() => {
          setAuthStep("login");
        }}
        onVerified={() => {
          setAuthStep("authenticated");
          if (userRole === "restaurant") {
            setViewMode("restaurant");
          } else {
            setViewMode("customer");
          }
        }}
        userRole={userRole}
      />
    );
  }

  // Show main app after authentication
  return (
    <>
      {viewMode === "customer" ? (
        <CustomerView
          foodItems={foodItems}
          userEmail={userEmail}
          onLogout={handleLogout}
        />
      ) : (
        <RestaurantView
          foodItems={foodItems}
          onAddItem={handleAddItem}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
          onBack={() => setViewMode("customer")}
        />
      )}
      <Toaster position="top-center" />
    </>
  );
}