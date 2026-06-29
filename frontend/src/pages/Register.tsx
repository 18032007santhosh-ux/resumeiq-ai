import React, { useState, useEffect } from 'react';
import { useNavigate as useNav, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Check, X, ShieldCheck } from 'lucide-react';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string; terms?: string }>({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNav();

  // Password Requirement Checks
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const getPasswordStrength = () => {
    let metCount = Object.values(requirements).filter(Boolean).length;
    if (metCount <= 2) return { score: 1, text: 'Weak', color: 'bg-rose-500' };
    if (metCount <= 4) return { score: 2, text: 'Medium', color: 'bg-amber-500' };
    return { score: 3, text: 'Strong', color: 'bg-emerald-500' };
  };

  const validate = () => {
    const tempErrors: typeof errors = {};
    if (!name) tempErrors.name = 'Full name is required';
    if (!email) {
      tempErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      tempErrors.password = 'Password is required';
    } else {
      const metCount = Object.values(requirements).filter(Boolean).length;
      if (metCount < 5) {
        tempErrors.password = 'Password must meet all complexity requirements';
      }
    }
    if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }
    if (!acceptTerms) {
      tempErrors.terms = 'You must accept the Terms of Service';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);

    if (result.success) {
      showToast('Registration successful! Welcome to ResumeIQ.', 'success');
      navigate('/dashboard');
    } else {
      showToast(result.message, 'error');
    }
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center text-slate-100 bg-[#070913] font-sans p-6 sm:p-12 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-15%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-20%] right-[-15%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10"
      >
        {/* Logo / Header */}
        <div className="text-center mb-6">
          <RouterLink to="/" className="inline-flex items-center gap-2 mb-2">
            <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">ResumeIQ AI</span>
          </RouterLink>
          <h2 className="text-2xl font-bold text-slate-100">Create Account</h2>
          <p className="text-sm text-slate-400 mt-1">Get started with professional ATS checks</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full bg-slate-950/60 border ${errors.name ? 'border-rose-500/50' : 'border-white/10 hover:border-white/20'} rounded-xl py-2.5 pl-11 pr-4 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/80 transition-colors`}
                placeholder="John Doe"
              />
            </div>
            {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-slate-950/60 border ${errors.email ? 'border-rose-500/50' : 'border-white/10 hover:border-white/20'} rounded-xl py-2.5 pl-11 pr-4 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/80 transition-colors`}
                placeholder="john@example.com"
              />
            </div>
            {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-slate-950/60 border ${errors.password ? 'border-rose-500/50' : 'border-white/10 hover:border-white/20'} rounded-xl py-2.5 pl-11 pr-11 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/80 transition-colors`}
                placeholder="••••••••"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password}</p>}

            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Password Strength:</span>
                  <span className="font-semibold text-slate-300">{strength.text}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: `${(strength.score / 3) * 100}%` }}></div>
                </div>

                {/* Checklist Requirements */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    {requirements.length ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-slate-600" />}
                    <span className={requirements.length ? 'text-emerald-400/80' : 'text-slate-500'}>Min 8 characters</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {requirements.uppercase ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-slate-600" />}
                    <span className={requirements.uppercase ? 'text-emerald-400/80' : 'text-slate-500'}>One uppercase</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {requirements.lowercase ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-slate-600" />}
                    <span className={requirements.lowercase ? 'text-emerald-400/80' : 'text-slate-500'}>One lowercase</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {requirements.number ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-slate-600" />}
                    <span className={requirements.number ? 'text-emerald-400/80' : 'text-slate-500'}>One number</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    {requirements.special ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-slate-600" />}
                    <span className={requirements.special ? 'text-emerald-400/80' : 'text-slate-500'}>One special character (!@#$ etc)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full bg-slate-950/60 border ${errors.confirmPassword ? 'border-rose-500/50' : 'border-white/10 hover:border-white/20'} rounded-xl py-2.5 pl-11 pr-11 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/80 transition-colors`}
                placeholder="••••••••"
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-rose-400 mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Accept Terms */}
          <div className="space-y-1">
            <div className="flex items-start">
              <input 
                id="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-white/10 bg-slate-950/60 text-indigo-500 focus:ring-indigo-500/30"
              />
              <label htmlFor="terms" className="ml-2 text-xs text-slate-300 select-none cursor-pointer">
                I agree to the{' '}
                <RouterLink to="/terms" className="text-indigo-400 hover:underline">Terms of Service</RouterLink>
                {' '}and{' '}
                <RouterLink to="/privacy" className="text-indigo-400 hover:underline">Privacy Policy</RouterLink>
              </label>
            </div>
            {errors.terms && <p className="text-xs text-rose-400">{errors.terms}</p>}
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 active:scale-[0.98] transition-all text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 group cursor-pointer shadow-lg shadow-indigo-500/20"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                Create Free Account
                <ShieldCheck className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <RouterLink to="/login" className="text-indigo-400 hover:underline font-semibold">Sign In</RouterLink>
        </div>
      </motion.div>
    </div>
  );
};
