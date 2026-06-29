import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Check, X, CheckCircle2, ArrowRight } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { resetPassword } = useAuth();
  const { showToast } = useToast();

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
    if (!password) {
      tempErrors.password = 'Password is required';
    } else {
      const metCount = Object.values(requirements).filter(Boolean).length;
      if (metCount < 5) {
        tempErrors.password = 'Password does not meet the requirements';
      }
    }
    if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      showToast('Missing reset token. Please request a new link.', 'error');
      return;
    }
    if (!validate()) return;

    setLoading(true);
    const result = await resetPassword(password, token);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      showToast('Password updated successfully!', 'success');
    } else {
      showToast(result.message, 'error');
    }
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center text-slate-100 bg-[#070913] font-sans p-6 sm:p-12 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-15%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-20%] right-[-15%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10"
      >
        {!success ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-100">Reset Password</h2>
              <p className="text-sm text-slate-400 mt-1">Create a secure new password for your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full bg-slate-950/60 border ${errors.password ? 'border-rose-500/50' : 'border-white/10 hover:border-white/20'} rounded-xl py-3 pl-11 pr-11 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/80 transition-colors`}
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
                      <span className="text-slate-400">Strength:</span>
                      <span className="font-semibold text-slate-300">{strength.text}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: `${(strength.score / 3) * 100}%` }}></div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 text-[10px]">
                      <div className="flex items-center gap-1">
                        {requirements.length ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />}
                        <span className={requirements.length ? 'text-emerald-400/80' : 'text-slate-500'}>8+ characters</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {requirements.uppercase ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />}
                        <span className={requirements.uppercase ? 'text-emerald-400/80' : 'text-slate-500'}>One uppercase</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {requirements.lowercase ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />}
                        <span className={requirements.lowercase ? 'text-emerald-400/80' : 'text-slate-500'}>One lowercase</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {requirements.number ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />}
                        <span className={requirements.number ? 'text-emerald-400/80' : 'text-slate-500'}>One number</span>
                      </div>
                      <div className="flex items-center gap-1 col-span-2">
                        {requirements.special ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />}
                        <span className={requirements.special ? 'text-emerald-400/80' : 'text-slate-500'}>One special character</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full bg-slate-950/60 border ${errors.confirmPassword ? 'border-rose-500/50' : 'border-white/10 hover:border-white/20'} rounded-xl py-3 pl-11 pr-11 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/80 transition-colors`}
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

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 active:scale-[0.98] transition-all text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 group cursor-pointer shadow-lg shadow-indigo-500/20"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    Reset Password
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100">Success!</h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Your password has been successfully reset. You can now log in using your new credentials.
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="w-full mt-8 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 py-3 rounded-xl font-semibold transition-all cursor-pointer"
            >
              Go to Login
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
