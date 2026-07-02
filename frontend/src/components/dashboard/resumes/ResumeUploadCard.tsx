import React, { useState, useRef } from 'react';
import { UploadCloud, File, AlertCircle, CheckCircle } from 'lucide-react';
import { uploadResumeFile } from '../../../services/resumeService';
import { useToast } from '../../../contexts/ToastContext';

interface ResumeUploadCardProps {
  onUploadSuccess: () => void;
}

export const ResumeUploadCard: React.FC<ResumeUploadCardProps> = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateFile = (file: File) => {
    setError(null);
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!validTypes.includes(file.type)) {
      setError('Unsupported file type. Please upload a PDF or DOCX file.');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File exceeds size limit of 5MB.');
      return false;
    }
    return true;
  };

  const handleFile = async (file: File) => {
    if (!validateFile(file)) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate progress for UI
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      await uploadResumeFile(file);
      setUploadProgress(100);
      showToast('Resume uploaded successfully!', 'success');
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        onUploadSuccess();
      }, 500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload resume. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
    } finally {
      clearInterval(progressInterval);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <UploadCloud className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Upload Your Resume</h3>
            <p className="text-slate-400 text-sm">Supported formats: PDF, DOCX (Max 5MB)</p>
          </div>
        </div>

        <div
          className={`mt-4 border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all duration-300 ${
            isDragging
              ? 'border-indigo-400 bg-indigo-500/10'
              : 'border-slate-700 bg-slate-800/20 hover:border-indigo-500/50 hover:bg-slate-800/40'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <div className="w-full max-w-xs text-center">
              <div className="mb-4 text-indigo-400">
                <UploadCloud className="w-10 h-10 mx-auto animate-bounce" />
              </div>
              <p className="text-white font-medium mb-2">Uploading... {uploadProgress}%</p>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                <File className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-300 text-center mb-2 font-medium">
                Drag and drop your file here
              </p>
              <p className="text-slate-500 text-sm text-center mb-6">or</p>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors disabled:opacity-50"
              >
                Choose File
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleChange}
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
              />
            </>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};
