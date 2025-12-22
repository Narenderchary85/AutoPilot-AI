// components/auth/Signup.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiCheck, FiEye, FiEyeOff, FiZap, FiAlertCircle } from 'react-icons/fi';
import { authService } from './utils/authApi';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (!agreedToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      const response = await authService.signup(userData);
      
      setSuccess('Account created successfully! Please check your email to verify your account.');
      
      // Auto login after successful signup
      setTimeout(async () => {
        try {
          const loginResponse = await authService.login(formData.email, formData.password);
          localStorage.setItem('token', loginResponse.access_token);
          localStorage.setItem('refreshToken', loginResponse.refresh_token);
          localStorage.setItem('user', JSON.stringify(loginResponse.user));
          navigate('/chat');
        } catch (loginErr) {
          navigate('/login');
        }
      }, 3000);

    } catch (err) {
      setError(
        err.response?.data?.detail || 
        err.response?.data?.message || 
        'Failed to create account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (password) => {
    if (!password) return { score: 0, color: 'bg-slate-200', text: 'Weak' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    const strengths = [
      { score: 0, color: 'bg-red-500', text: 'Very Weak' },
      { score: 1, color: 'bg-red-400', text: 'Weak' },
      { score: 2, color: 'bg-yellow-500', text: 'Fair' },
      { score: 3, color: 'bg-green-400', text: 'Good' },
      { score: 4, color: 'bg-green-600', text: 'Strong' }
    ];
    
    return strengths[Math.min(score, 4)];
  };

  const strength = passwordStrength(formData.password);

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
            Join AutoPilot
          </h2>
          <p className="text-slate-600 mt-2">Create your account to get started</p>
        </div>

        {/* Signup Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-xl p-8"
        >
          {/* Success Message */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 p-3 mb-6 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm"
              >
                <FiCheck className="flex-shrink-0" />
                <span>{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

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
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <FiUser size={14} />
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 pl-11 rounded-xl border border-slate-300 bg-white/50
                           focus:border-[#6264a7] focus:ring-2 focus:ring-[#6264a7]/20 outline-none
                           transition-all duration-200 placeholder:text-slate-400"
                  required
                />
                <FiUser className="absolute left-3 top-3.5 text-slate-400" />
              </div>
            </div>

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
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <FiLock size={14} />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
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
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">Password strength:</span>
                    <span className={`font-medium ${
                      strength.score <= 1 ? 'text-red-600' :
                      strength.score === 2 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {strength.text}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(strength.score / 4) * 100}%` }}
                      className={`h-full ${strength.color} rounded-full`}
                    />
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Use 8+ characters with uppercase, numbers & symbols
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <FiLock size={14} />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 pl-11 pr-11 rounded-xl border border-slate-300 bg-white/50
                           focus:border-[#6264a7] focus:ring-2 focus:ring-[#6264a7]/20 outline-none
                           transition-all duration-200 placeholder:text-slate-400"
                  required
                />
                <FiLock className="absolute left-3 top-3.5 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              
              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className={`flex items-center gap-1 text-xs ${
                  formData.password === formData.confirmPassword 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <FiCheck className="flex-shrink-0" />
                      <span>Passwords match</span>
                    </>
                  ) : (
                    <>
                      <FiAlertCircle className="flex-shrink-0" />
                      <span>Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="space-y-3">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="h-4 w-4 mt-1 rounded border-slate-300 text-[#6264a7] focus:ring-[#6264a7]/20"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-slate-600">
                  I agree to the{' '}
                  <a href="#" className="text-[#6264a7] hover:text-[#505ac9] font-medium">
                    Terms of Service
                  </a>
                  {' '}and{' '}
                  <a href="#" className="text-[#6264a7] hover:text-[#505ac9] font-medium">
                    Privacy Policy
                  </a>
                  <p className="text-xs text-slate-500 mt-1">
                    You'll receive product updates and can opt out at any time.
                  </p>
                </label>
              </div>
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <FiZap size={18} />
                  <span>Start Using AutoPilot</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="px-4 text-sm text-slate-500">or sign up with</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Social Signup */}
          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 
                             hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-medium text-slate-700">Google</span>
            </button>
            <button className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 
                             hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="#000000" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.31-2.33 1.05-3.11z"/>
              </svg>
              <span className="text-sm font-medium text-slate-700">Apple</span>
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link 
                to="/" 
                className="text-[#6264a7] hover:text-[#505ac9] font-semibold transition-colors"
              >
                Sign in here
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
          <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
          <p className="mt-1">© 2024 AutoPilot AI. All rights reserved.</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;