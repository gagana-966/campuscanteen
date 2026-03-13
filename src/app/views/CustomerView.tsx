import { useState } from "react";
import { ShoppingCart, UtensilsCrossed, Search, User } from "lucide-react";
import { FoodCard, FoodItem } from "../components/FoodCard";
import { Cart } from "../components/Cart";
import { OrderModal } from "../components/OrderModal";
import { OrderSuccess } from "../components/OrderSuccess";
import { Profile } from "../components/Profile";
import { Chatbot } from "../components/Chatbot";

const CATEGORIES = ["All", "Main Course", "Salads", "Beverages", "Desserts"];

interface CartItem {
  item: FoodItem;
  quantity: number;
}

interface CustomerViewProps {
  foodItems: FoodItem[];
  userEmail: string;
  onLogout: () => void;
}

export function CustomerView({ foodItems, userEmail, onLogout }: CustomerViewProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const filteredItems = foodItems.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getItemQuantity = (itemId: string) => {
    return cart.find((cartItem) => cartItem.item.id === itemId)?.quantity || 0;
  };

  const addToCart = (item: FoodItem) => {
    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.item.id === item.id);
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (item: FoodItem) => {
    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.item.id === item.id);
      if (existing && existing.quantity > 1) {
        return prev.map((cartItem) =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
      return prev.filter((cartItem) => cartItem.item.id !== item.id);
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((cartItem) =>
          cartItem.item.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity + delta }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0);
    });
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsOrderModalOpen(true);
  };

  const handleOrderConfirm = async (orderDetails: { name: string; phone: string; notes: string }) => {
    try {
      const token = localStorage.getItem('token');
      const orderData = {
        name: orderDetails.name,
        phone: orderDetails.phone,
        notes: orderDetails.notes,
        items: cart.map(c => ({
          name: c.item.name,
          qty: c.quantity,
          image: c.item.image,
          price: c.item.price,
          foodItem: c.item.id
        })),
        totalAmount
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await res.json();
      if (res.ok) {
        // use last 6 chars of id as order number or custom
        setOrderNumber(data._id ? data._id.substring(data._id.length - 6) : Math.floor(10000 + Math.random() * 90000).toString());
        setIsOrderModalOpen(false);
        setIsSuccessModalOpen(true);
        setCart([]);
      } else {
        alert(`Failed to place order: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error placing order');
    }
  };

  const totalItems = cart.reduce((sum, { quantity }) => sum + quantity, 0);
  const totalAmount = cart.reduce((sum, { item, quantity }) => sum + item.price * quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <UtensilsCrossed size={32} className="text-orange-500" />
              <div>
                <h1 className="text-2xl font-bold">Campus Canteen</h1>
                <p className="text-sm text-gray-600">Order your favorite meals</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsProfileOpen(true)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-full transition-colors"
              >
                <User size={24} />
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full transition-colors"
              >
                <ShoppingCart size={24} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search for food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${selectedCategory === category
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Food Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <FoodCard
              key={item.id}
              item={item}
              quantity={getItemQuantity(item.id)}
              onAdd={() => addToCart(item)}
              onRemove={() => removeFromCart(item)}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No items found matching your search.</p>
          </div>
        )}
      </main>

      {/* Cart Sidebar */}
      <Cart
        cartItems={cart}
        onUpdateQuantity={updateQuantity}
        onCheckout={handleCheckout}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        total={totalAmount}
        onConfirm={handleOrderConfirm}
      />

      {/* Success Modal */}
      <OrderSuccess
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        orderNumber={orderNumber}
      />

      {/* Profile Sidebar */}
      <Profile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userEmail={userEmail}
        onLogout={onLogout}
      />

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}