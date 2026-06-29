import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const Terms: React.FC = () => {
  return (
    <div className="auth-page" style={{ overflowY: 'auto', padding: '2rem 1rem' }}>
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>
      
      <div className="w-full max-w-3xl bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl relative mx-auto my-8 z-10" style={{ background: '#0e1227bf' }}>
        <div className="mb-6">
          <Link to="/login" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition-all">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>

        <div className="flex items-center gap-3 border-b border-white/10 pb-6 mb-6">
          <div className="p-3 bg-indigo-500/10 rounded-xl">
            <FileText className="text-indigo-400 w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Terms of Service</h1>
            <p className="text-sm text-slate-400 mt-1">Last updated: June 2026</p>
          </div>
        </div>

        <div className="space-y-6 text-slate-300 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-semibold text-slate-200 mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing and using ResumeIQ AI, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-200 mb-2">2. Description of Service</h2>
            <p>
              ResumeIQ AI provides web-based tools to analyze resumes against applicant tracking systems (ATS) and offer AI-driven career feedback. We reserve the right to modify, suspend, or discontinue any aspect of the service at any time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-200 mb-2">3. User Accounts</h2>
            <p>
              To access certain features of the service, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-200 mb-2">4. Data Ownership & Privacy</h2>
            <p>
              You retain all ownership rights to the resumes and personal information you upload to our platform. Our use of your data is governed by our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-200 mb-2">5. Limitation of Liability</h2>
            <p>
              ResumeIQ AI is provided "as is" without any warranties. We do not guarantee that our analysis will secure employment or interview callbacks. In no event shall we be liable for any indirect, incidental, or consequential damages.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
