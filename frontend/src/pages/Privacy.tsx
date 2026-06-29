import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const Privacy: React.FC = () => {
  return (
    <div className="auth-page" style={{ overflowY: 'auto', padding: '2rem 1rem' }}>
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>
      
      <div className="w-full max-w-3xl bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl relative mx-auto my-8 z-10" style={{ background: '#0e1227bf' }}>
        <div className="mb-6">
          <Link to="/login" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition-all">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>

        <div className="flex items-center gap-3 border-b border-white/10 pb-6 mb-6">
          <div className="p-3 bg-purple-500/10 rounded-xl">
            <Shield className="text-purple-400 w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Privacy Policy</h1>
            <p className="text-sm text-slate-400 mt-1">Last updated: June 2026</p>
          </div>
        </div>

        <div className="space-y-6 text-slate-300 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-semibold text-slate-200 mb-2">1. Information We Collect</h2>
            <p>
              We collect the information you provide when creating an account (such as name and email address) and the files you upload (such as resumes, CVs, and related job description metadata) for ATS analysis.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-200 mb-2">2. How We Use Your Information</h2>
            <p>
              Your uploaded resumes are parsed and analyzed using AI technology (including Google Gemini API) to generate scores, feedback, and match recommendations. We do not use your resumes or personal data to train models or for advertising purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-200 mb-2">3. Data Retention and Deletion</h2>
            <p>
              You can delete your resume metadata and analysis history from the dashboard at any time. Deleted records are permanently removed from our active databases.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-200 mb-2">4. Third-Party Service Providers</h2>
            <p>
              We share data with trusted cloud providers and AI services (such as MongoDB Atlas and Google Gemini API) strictly to deliver the resume analysis features.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-200 mb-2">5. Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information and documents from unauthorized access, disclosure, or alteration.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
