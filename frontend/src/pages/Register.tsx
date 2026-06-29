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
    <div className="auth-page">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-15%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-20%] right-[-15%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>

      <div className="auth-content-wrapper" style={{ width: '100%' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="auth-card"
          style={{ maxWidth: '500px' }}
        >
          {/* Logo / Header */}
          <div className="text-center" style={{ marginBottom: '1.5rem' }}>
            <RouterLink to="/" className="inline-flex items-center gap-2 mb-2">
              <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">ResumeIQ AI</span>
            </RouterLink>
            <h2 className="text-2xl font-bold text-slate-100">Create Account</h2>
            <p className="text-sm text-slate-400 mt-1">Get started with professional ATS checks</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="auth-input-group">
              <label className="auth-label">Full Name</label>
              <div className="auth-input-wrapper">
                <User className="auth-input-icon w-5 h-5" />
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="auth-input"
                  style={{ borderColor: errors.name ? '#ef4444' : '' }}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <span className="auth-error">{errors.name}</span>}
            </div>

            {/* Email */}
            <div className="auth-input-group">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrapper">
                <Mail className="auth-input-icon w-5 h-5" />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  style={{ borderColor: errors.email ? '#ef4444' : '' }}
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && <span className="auth-error">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="auth-input-group">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrapper">
                <Lock className="auth-input-icon w-5 h-5" />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  style={{ borderColor: errors.password ? '#ef4444' : '' }}
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-input-toggle"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <span className="auth-error">{errors.password}</span>}

              {/* Password Strength Indicator */}
              {password && (
                <div style={{ marginTop: '0.75rem' }}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Password Strength:</span>
                    <span className="font-semibold text-slate-300">{strength.text}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: `${(strength.score / 3) * 100}%` }}></div>
                  </div>

                  {/* Checklist Requirements */}
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 text-[10px]" style={{ fontSize: '0.65rem' }}>
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
            <div className="auth-input-group">
              <label className="auth-label">Confirm Password</label>
              <div className="auth-input-wrapper">
                <Lock className="auth-input-icon w-5 h-5" />
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="auth-input"
                  style={{ borderColor: errors.confirmPassword ? '#ef4444' : '' }}
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="auth-input-toggle"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <span className="auth-error">{errors.confirmPassword}</span>}
            </div>

            {/* Accept Terms */}
            <div className="auth-checkbox-group">
              <input 
                id="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="auth-checkbox"
                style={{ marginTop: '0px' }}
              />
              <label htmlFor="terms" className="auth-checkbox-label">
                I agree to the{' '}
                <RouterLink to="/terms" className="text-indigo-400 hover:underline" style={{ color: 'var(--primary-light)' }}>Terms of Service</RouterLink>
                {' '}and{' '}
                <RouterLink to="/privacy" className="text-indigo-400 hover:underline" style={{ color: 'var(--primary-light)' }}>Privacy Policy</RouterLink>
              </label>
              {errors.terms && <span className="auth-error" style={{ display: 'block', marginTop: '0.25rem' }}>{errors.terms}</span>}
            </div>

            {/* Submit */}
            <button 
              type="submit" 
              disabled={loading}
              className="auth-btn"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  Create Free Account
                  <ShieldCheck className="w-4.5 h-4.5" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-slate-400" style={{ marginTop: '1.5rem' }}>
            Already have an account?{' '}
            <RouterLink to="/login" className="text-indigo-400 hover:underline font-semibold" style={{ color: 'var(--primary-light)' }}>Sign In</RouterLink>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
