// components/auth/Login.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff, FiZap, FiAlertCircle } from 'react-icons/fi';
import { authService } from './utils/authApi';


const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.login(formData.email, formData.password);
      console.log(response)
      // Store tokens and user data
      localStorage.setItem('token', response.access_token);
      // Navigate to dashboard
      navigate('/chat');
      
    } catch (err) {
      setError(
        err.response?.data?.detail || 
        err.response?.data?.message || 
        'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Please enter your email to reset password');
      return;
    }

    try {
      await authService.forgotPassword(formData.email);
      alert('Password reset instructions sent to your email');
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white p-4">
      {/* Background Animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#f3f4ff] to-transparent rounded-full blur-3xl opacity-30"
        />
        <motion.div
          animate={{ 
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-l from-[#f3f4ff] to-transparent rounded-full blur-3xl opacity-20"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6264a7] to-[#505ac9] flex items-center justify-center shadow-lg">
              <FiZap className="text-white text-xl" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-slate-900">AutoPilot AI</h1>
              <p className="text-sm text-slate-600">Your Intelligent Assistant</p>
            </div>
          </motion.div>
          
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-[#6264a7] to-slate-900 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-slate-600 mt-2">Sign in to access your AI assistant</p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-xl p-8"
        >
          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 p-3 mb-6 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
              >
                <FiAlertCircle className="flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <FiMail size={14} />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 pl-11 rounded-xl border border-slate-300 bg-white/50
                           focus:border-[#6264a7] focus:ring-2 focus:ring-[#6264a7]/20 outline-none
                           transition-all duration-200 placeholder:text-slate-400"
                  required
                />
                <FiMail className="absolute left-3 top-3.5 text-slate-400" />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <FiLock size={14} />
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-[#6264a7] hover:text-[#505ac9] font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pl-11 pr-11 rounded-xl border border-slate-300 bg-white/50
                           focus:border-[#6264a7] focus:ring-2 focus:ring-[#6264a7]/20 outline-none
                           transition-all duration-200 placeholder:text-slate-400"
                  required
                />
                <FiLock className="absolute left-3 top-3.5 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#6264a7] focus:ring-[#6264a7]/20"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-slate-600">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`w-full py-3 px-4 rounded-xl text-white font-semibold
                        flex items-center justify-center gap-2 transition-all duration-200
                        ${loading 
                          ? 'bg-[#6264a7]/70 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-[#6264a7] to-[#505ac9] hover:shadow-lg hover:shadow-[#6264a7]/20'
                        }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <FiLogIn size={18} />
                  <span>Sign In to AutoPilot</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="px-4 text-sm text-slate-500">or continue with</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-[#6264a7] hover:text-[#505ac9] font-semibold transition-colors"
              >
                Create one now
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-xs text-slate-500"
        >
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
          <p className="mt-1">© 2024 AutoPilot AI. All rights reserved.</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;