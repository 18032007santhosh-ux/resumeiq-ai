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
    <div className="auth-page">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-15%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-20%] right-[-15%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>

      <div className="auth-content-wrapper" style={{ width: '100%' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="auth-card"
        >
          {!success ? (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-100">Reset Password</h2>
                <p className="text-sm text-slate-400 mt-1">Create a secure new password for your account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
                <div className="auth-input-group">
                  <label className="auth-label">New Password</label>
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
                        <span className="text-slate-400">Strength:</span>
                        <span className="font-semibold text-slate-300">{strength.text}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: `${(strength.score / 3) * 100}%` }}></div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 text-[10px]" style={{ fontSize: '0.65rem' }}>
                        <div className="flex items-center gap-1">
                          {requirements.length ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />}
                          <span className={requirements.length ? 'text-emerald-400/80' : 'text-slate-500'}>8+ characters</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {requirements.uppercase ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />}
                          <span className={requirements.uppercase ? 'text-emerald-400/80' : 'text-slate-500'}>One uppercase</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {requirements.lowercase ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-slate-600" />}
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

                <button 
                  type="submit" 
                  disabled={loading}
                  className="auth-btn"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight className="w-4 h-4" />
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
                className="auth-btn"
                style={{ marginTop: '2rem' }}
              >
                Go to Login
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
