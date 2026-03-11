import { useState, useRef, useEffect } from "react";
import { UtensilsCrossed, ArrowLeft, Mail } from "lucide-react";

interface VerifyEmailProps {
  email: string;
  onBack: () => void;
  onVerified?: () => void;
  userRole?: "customer" | "restaurant" | null;
}

export function VerifyEmail({ email, onBack, onVerified, userRole }: VerifyEmailProps) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Dynamic colors based on role
  const isRestaurant = userRole === "restaurant";
  const primaryColor = isRestaurant ? "blue" : "orange";
  const gradientFrom = isRestaurant ? "from-blue-400" : "from-orange-400";
  const gradientVia = isRestaurant ? "via-blue-500" : "via-orange-500";
  const gradientTo = isRestaurant ? "to-blue-600" : "to-orange-600";
  const iconColor = isRestaurant ? "text-blue-500" : "text-orange-500";
  const iconBgColor = isRestaurant ? "bg-blue-100" : "bg-orange-100";
  const textColor = isRestaurant ? "text-blue-600" : "text-orange-600";
  const buttonBg = isRestaurant ? "bg-blue-500" : "bg-orange-500";
  const buttonHover = isRestaurant ? "hover:bg-blue-600" : "hover:bg-orange-600";
  const ringColor = isRestaurant ? "focus:ring-blue-500" : "focus:ring-orange-500";
  const borderColor = isRestaurant ? "focus:border-blue-500" : "focus:border-orange-500";

  useEffect(() => {
    // Auto-focus the input on mount
    inputRef.current?.focus();
  }, []);

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role: userRole, otp }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data));
        onVerified?.();
      } else {
        setError(data.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Network error during OTP verification:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradientFrom} ${gradientVia} ${gradientTo} flex items-center justify-center p-4`}>
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-4 rounded-full shadow-lg">
              <UtensilsCrossed size={48} className={iconColor} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Campus Canteen</h1>
        </div>

        {/* Verification Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className={`${iconBgColor} p-3 rounded-full`}>
                <Mail className={iconColor} size={32} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h2>
            <p className="text-gray-600 text-sm">
              We've sent a 6-digit verification code to
            </p>
            <p className={`${textColor} font-semibold mt-1`}>{email}</p>
          </div>

          {/* OTP Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              Enter Verification Code
            </label>
            <input
              ref={inputRef}
              type="text"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtp(value);
                setError("");
              }}
              onKeyPress={handleKeyPress}
              className={`w-full text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${ringColor} ${borderColor} px-4 py-3 tracking-widest ${error ? 'border-red-500' : ''}`}
              placeholder="000000"
              maxLength={6}
            />
            {error && (
              <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
            )}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={isLoading || otp.length !== 6}
            className={`w-full ${buttonBg} ${buttonHover} disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg mb-4`}
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>

          {/* Resend Section */}
          <div className="text-center mb-6">
            <p className="text-gray-600 text-sm">
              Didn't receive the code?{" "}
              <button
                className={`${textColor} hover:text-opacity-80 font-semibold`}
              >
                Resend Code
              </button>
            </p>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              OTP is valid for 5 minutes. Check your spam folder if you don't see the email.
            </p>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 text-white text-sm text-center">
          <p className="mb-1">Having trouble?</p>
          <p className="text-white text-opacity-80">Contact support at support@canteen.local</p>
        </div>


      </div>
    </div>
  );
}
