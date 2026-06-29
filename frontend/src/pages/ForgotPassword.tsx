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
        <div className="mb-6">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors mb-4 group">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Login
          </Link>
        </div>

        {!submitted ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-100">Forgot Password</h2>
              <p className="text-sm text-slate-400 mt-1">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full bg-slate-950/60 border ${error ? 'border-rose-500/50' : 'border-white/10 hover:border-white/20'} rounded-xl py-3 pl-11 pr-4 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/80 transition-colors`}
                    placeholder="john@example.com"
                  />
                </div>
                {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 active:scale-[0.98] transition-all text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 group cursor-pointer shadow-lg shadow-indigo-500/20"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    Send Reset Link
                    <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
            
            <div className="mt-8 border-t border-white/5 pt-6 text-xs text-slate-500">
              Didn't receive the email?{' '}
              <button 
                type="button" 
                onClick={handleSubmit} 
                className="text-indigo-400 hover:underline font-semibold"
              >
                Resend Link
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
