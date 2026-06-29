import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { forgotPassword } = useAuth();
  const { showToast } = useToast();

  const validate = () => {
    if (!email) {
      setError('Email address is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);

    if (result.success) {
      setSubmitted(true);
      showToast('Reset email sent successfully!', 'success');
    } else {
      showToast(result.message, 'error');
    }
  };

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
          <div style={{ marginBottom: '1.5rem' }}>
            <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors mb-4 group" style={{ color: 'var(--primary-light)', textDecoration: 'underline' }}>
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Login
            </Link>
          </div>

          {!submitted ? (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-100">Forgot Password</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="auth-input-group">
                  <label className="auth-label">Email Address</label>
                  <div className="auth-input-wrapper">
                    <Mail className="auth-input-icon w-5 h-5" />
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="auth-input"
                      style={{ borderColor: error ? '#ef4444' : '' }}
                      placeholder="john@example.com"
                    />
                  </div>
                  {error && <span className="auth-error">{error}</span>}
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
                      Send Reset Link
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-100">Check Your Email</h2>
              <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                We've sent a password reset link to <strong className="text-slate-200">{email}</strong>. Please check your inbox and spam folder.
              </p>
              
              <div className="mt-8 border-t border-white/5 pt-6 text-xs text-slate-500" style={{ marginTop: '2rem' }}>
                Didn't receive the email?{' '}
                <button 
                  type="button" 
                  onClick={handleSubmit} 
                  className="text-indigo-400 hover:underline font-semibold"
                  style={{ color: 'var(--primary-light)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Resend Link
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
