import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, FileText, CheckCircle2, ChevronRight } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const tempErrors: { email?: string; password?: string } = {};
    if (!email) {
      tempErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      tempErrors.password = 'Password is required';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      showToast('Welcome back to ResumeIQ AI!', 'success');
      navigate('/dashboard');
    } else {
      showToast(result.message, 'error');
    }
  };

  return (
    <div className="min-h-screen flex text-slate-100 bg-[#070913] font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>

      {/* Left side: Premium Animated Graphics */}
      <div className="hidden lg:flex lg:w-1/2 justify-center items-center relative bg-gradient-to-br from-indigo-950/20 to-purple-950/20 border-r border-white/5 overflow-hidden p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.05),transparent_60%)]"></div>
        
        {/* Floating elements */}
        <div className="relative w-full max-w-md flex justify-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl relative"
          >
            {/* Top header bar */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <FileText className="text-indigo-400 w-6 h-6" />
                <span className="font-semibold text-slate-200">Santhosh_CV.pdf</span>
              </div>
              <span className="text-xs bg-indigo-500/10 text-indigo-300 px-2 py-1 rounded">1.4 MB</span>
            </div>

            {/* Simulated resume body content */}
            <div className="space-y-4">
              <div className="h-4 w-1/3 bg-slate-800 rounded"></div>
              <div className="h-3 w-3/4 bg-slate-800/60 rounded"></div>
              <div className="border-t border-white/5 my-4"></div>
              <div className="h-4 w-1/4 bg-slate-800 rounded"></div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-slate-800/40 rounded"></div>
                <div className="h-3 w-5/6 bg-slate-800/40 rounded"></div>
              </div>
            </div>
          </motion.div>

          {/* Floating ATS Score Card */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute top-[-30px] right-[-20px] bg-slate-900/80 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-xl flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full border-2 border-emerald-500 flex items-center justify-center font-bold text-emerald-400 text-sm">
              92%
            </div>
            <div>
              <p className="text-xs text-slate-400">ATS Match</p>
              <p className="text-sm font-semibold text-slate-200">Excellent Score</p>
            </div>
          </motion.div>

          {/* Floating Key Skills Badge Card */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
            className="absolute bottom-[-20px] left-[-30px] bg-slate-900/80 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-xl flex flex-col gap-2"
          >
            <span className="text-xs text-slate-400">Matched Skills</span>
            <div className="flex gap-1.5 flex-wrap max-w-[200px]">
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/20">Java</span>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/20">React</span>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/20">Node</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 z-10">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative"
        >
          {/* Logo / Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-2 group">
              <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">ResumeIQ AI</span>
            </Link>
            <h2 className="text-2xl font-bold text-slate-100">Welcome Back</h2>
            <p className="text-sm text-slate-400 mt-1">Sign in to optimize your career</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-slate-950/60 border ${errors.email ? 'border-rose-500/50' : 'border-white/10 hover:border-white/20'} rounded-xl py-3 pl-11 pr-4 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/80 transition-colors`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-rose-400 mt-1">{errors.email}</motion.p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" className="text-xs text-indigo-400 hover:underline">Forgot password?</Link>
              </div>
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
              {errors.password && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-rose-400 mt-1">{errors.password}</motion.p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input 
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-slate-950/60 text-indigo-500 focus:ring-indigo-500/30"
              />
              <label htmlFor="remember-me" className="ml-2 text-xs text-slate-300 select-none cursor-pointer">Remember me for 30 days</label>
            </div>

            {/* Submit button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 active:scale-[0.98] transition-all text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 group cursor-pointer shadow-lg shadow-indigo-500/20"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  Login to Account
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Socials Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900/80 px-3 text-slate-500">Or continue with</span></div>
          </div>

          {/* Mock Social Logins */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button" 
              onClick={() => showToast('Google login is simulated for UI demonstration', 'info')}
              className="bg-slate-950/40 border border-white/5 hover:border-white/10 hover:bg-slate-950/60 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" color="#4285F4"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" color="#34A853"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" color="#FBBC05"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" color="#EA4335"/></svg>
              Google
            </button>
            <button 
              type="button" 
              onClick={() => showToast('GitHub login is simulated for UI demonstration', 'info')}
              className="bg-slate-950/40 border border-white/5 hover:border-white/10 hover:bg-slate-950/60 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
              GitHub
            </button>
          </div>

          <div className="mt-8 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:underline font-semibold">Create Account</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
