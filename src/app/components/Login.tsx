import { useState } from "react";
import { UtensilsCrossed, Mail, Lock, Eye, EyeOff, ShoppingBag, Store, Building2 } from "lucide-react";

interface LoginProps {
  onLogin: (email: string, password: string, role: "customer" | "restaurant") => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [loginMode, setLoginMode] = useState<"customer" | "restaurant">("customer");
  const [restaurantName, setRestaurantName] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // removed testOtp state; OTP only handled through verification step

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isForgotPassword) {
        // Handle forgot password
        const res = await fetch('http://localhost:5000/api/auth/forgotpassword', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (res.ok) {
          alert('Password reset link sent to your email!');
          setIsForgotPassword(false);
        } else {
          alert(`Error: ${data.message}`);
        }
      } else if (isSignUp) {
        // Handle registration
        const res = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            password,
            role: loginMode,
            restaurantName: loginMode === 'restaurant' ? restaurantName : undefined,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userInfo', JSON.stringify(data));
          onLogin(email, password, loginMode);
        } else {
          alert(`Registration failed: ${data.message}`);
        }
      } else {
        // Handle login
        const res = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, role: loginMode }),
        });
        const data = await res.json();
        if (res.ok) {
          if (data.otpRequired) {
            // OTP sent, proceed to verification
            onLogin(email, password, loginMode);
          } else {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userInfo', JSON.stringify(data));
            onLogin(email, password, loginMode);
          }
        } else {
          alert(`Login failed: ${data.message}`);
        }
      }
    } catch (error) {
      console.error(error);
      alert('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const isRestaurantMode = loginMode === "restaurant";
  const bgGradient = isRestaurantMode
    ? "from-blue-500 via-blue-600 to-indigo-700"
    : "from-orange-400 via-orange-500 to-orange-600";
  const accentColor = isRestaurantMode ? "blue" : "orange";

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} flex items-center justify-center p-4 transition-all duration-500`}>
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-4 rounded-full shadow-lg">
              {isRestaurantMode ? (
                <Store size={48} className="text-blue-600" />
              ) : (
                <UtensilsCrossed size={48} className="text-orange-500" />
              )}
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Campus Canteen</h1>
          <p className={`${isRestaurantMode ? 'text-blue-100' : 'text-orange-100'}`}>
            {isRestaurantMode ? 'Manage your business with ease' : 'Your favorite meals, just a tap away'}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setLoginMode("customer")}
              className={`flex-1 py-2.5 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${loginMode === "customer"
                ? "bg-orange-500 text-white shadow-md"
                : "text-gray-600 hover:text-gray-800"
                }`}
            >
              <ShoppingBag size={18} />
              Customer
            </button>
            <button
              type="button"
              onClick={() => setLoginMode("restaurant")}
              className={`flex-1 py-2.5 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${loginMode === "restaurant"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-800"
                }`}
            >
              <Store size={18} />
              Partner
            </button>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isSignUp
                ? isRestaurantMode
                  ? "Partner Registration"
                  : "Create Account"
                : isRestaurantMode
                  ? "Partner Login"
                  : "Welcome Back"}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {isSignUp
                ? isRestaurantMode
                  ? "Register your restaurant"
                  : "Sign up to start ordering"
                : isRestaurantMode
                  ? "Access your dashboard"
                  : "Sign in to continue"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isForgotPassword ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-${accentColor}-500 focus:border-transparent`}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className={`w-full ${isRestaurantMode
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-orange-500 hover:bg-orange-600"
                    } text-white py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg`}
                >
                  Send Reset Link
                </button>
              </>
            ) : (
              <>
                {isSignUp && (
                  <>
                    {isRestaurantMode && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Restaurant Name
                        </label>
                        <div className="relative">
                          <Building2
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={20}
                          />
                          <input
                            type="text"
                            value={restaurantName}
                            onChange={(e) => setRestaurantName(e.target.value)}
                            required={isSignUp && isRestaurantMode}
                            className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-${accentColor}-500 focus:border-transparent`}
                            placeholder="Your Restaurant Name"
                          />
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isRestaurantMode ? "Owner/Manager Name" : "Full Name"}
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={isSignUp}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-${accentColor}-500 focus:border-transparent`}
                        placeholder="Enter your name"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isRestaurantMode ? "Business Email" : "Email Address"}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-${accentColor}-500 focus:border-transparent`}
                      placeholder={isRestaurantMode ? "restaurant@business.com" : "you@example.com"}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className={`w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-${accentColor}-500 focus:border-transparent`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {!isSignUp && (
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2 rounded" />
                      <span className="text-gray-600">Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className={`text-${accentColor}-${isRestaurantMode ? '600' : '500'} hover:text-${accentColor}-${isRestaurantMode ? '700' : '600'} font-medium`}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full ${isRestaurantMode
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-orange-500 hover:bg-orange-600"
                    } text-white py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg disabled:opacity-70`}
                >
                  {isLoading ? 'Processing...' : (
                    isSignUp
                      ? isRestaurantMode
                        ? "Register as Partner"
                        : "Sign Up"
                      : isRestaurantMode
                        ? "Login to Dashboard"
                        : "Sign In"
                  )}
                </button>
              </>
            )}
          </form>

          <div className="mt-6 text-center">
            {isForgotPassword ? (
              <p className="text-gray-600 text-sm">
                Remember your password?{" "}
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className={`text-${accentColor}-${isRestaurantMode ? '600' : '500'} hover:text-${accentColor}-${isRestaurantMode ? '700' : '600'} font-semibold`}
                >
                  Back to Login
                </button>
              </p>
            ) : (
              <p className="text-gray-600 text-sm">
                {isSignUp
                  ? isRestaurantMode
                    ? "Already a partner?"
                    : "Already have an account?"
                  : isRestaurantMode
                    ? "New to Campus Canteen?"
                    : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className={`text-${accentColor}-${isRestaurantMode ? '600' : '500'} hover:text-${accentColor}-${isRestaurantMode ? '700' : '600'} font-semibold`}
                >
                  {isSignUp ? (isRestaurantMode ? "Login" : "Sign In") : (isRestaurantMode ? "Register Now" : "Sign Up")}
                </button>
              </p>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className={`mt-6 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 text-white text-sm`}>
          <p className="font-semibold mb-2">
            {isRestaurantMode ? "Demo Partner Credentials:" : "Demo Credentials:"}
          </p>
          <p>Email: {isRestaurantMode ? "partner@restaurant.com" : "demo@campus.edu"}</p>
          <p>Password: {isRestaurantMode ? "partner123" : "demo123"}</p>
        </div>
      </div>
    </div>
  );
}