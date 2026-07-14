import React, { useState, useEffect } from 'react';
import { Copy, Save, FileDown, FileEdit, RefreshCw, Check } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface CoverLetterEditorProps {
  initialText: string;
  onSave: (text: string) => Promise<void>;
  onRegenerate: () => void;
  saving: boolean;
  regenerating: boolean;
  companyName: string;
  positionName: string;
}

export const CoverLetterEditor: React.FC<CoverLetterEditorProps> = ({
  initialText,
  onSave,
  onRegenerate,
  saving,
  regenerating,
  companyName,
  positionName,
}) => {
  const [text, setText] = useState(initialText);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast('Cover letter copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showToast('Failed to copy text', 'error');
    }
  };

  const handleDownloadPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('Pop-up blocked. Please allow pop-ups to print/download PDF.', 'error');
      return;
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>${companyName} - Cover Letter</title>
          <style>
            body {
              font-family: 'Times New Roman', Times, serif;
              line-height: 1.5;
              margin: 40px;
              color: #111;
              font-size: 11pt;
              white-space: pre-wrap;
            }
          </style>
        </head>
        <body>${text}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    // Delay slightly to ensure formatting is rendered
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const handleDownloadDocx = () => {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset="utf-8">
          <title>${companyName} - Cover Letter</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.5;
              font-size: 11pt;
            }
            p {
              margin: 0 0 12pt 0;
            }
          </style>
        </head>
        <body>
          ${text.split('\n').map(line => `<p>${line || '&nbsp;'}</p>`).join('')}
        </body>
      </html>
    `;
    const blob = new Blob(['\ufeff' + htmlContent], {
      type: 'application/msword'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${companyName.replace(/\s+/g, '_')}_${positionName.replace(/\s+/g, '_')}_Cover_Letter.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('DOCX file download initiated!', 'success');
  };

  return (
    <div className="space-y-4">
      {/* Editor Header / Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-t-2xl border-t border-x border-slate-800">
        <span className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
          <FileEdit className="w-4 h-4 text-indigo-400" />
          Edit & Refine Cover Letter
        </span>

        <div className="flex flex-wrap items-center gap-2">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold rounded-xl border border-slate-750 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>

          {/* Save Button */}
          <button
            onClick={() => onSave(text)}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white text-xs font-semibold rounded-xl transition"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          {/* Download PDF */}
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold rounded-xl border border-slate-750 transition"
          >
            <FileDown className="w-3.5 h-3.5" />
            PDF
          </button>

          {/* Download DOCX */}
          <button
            onClick={handleDownloadDocx}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold rounded-xl border border-slate-750 transition"
          >
            <FileDown className="w-3.5 h-3.5" />
            DOCX
          </button>

          {/* Regenerate */}
          <button
            onClick={onRegenerate}
            disabled={regenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-semibold rounded-xl border border-purple-500/20 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${regenerating ? 'animate-spin' : ''}`} />
            Regenerate
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={18}
        className="w-full bg-slate-950/40 border border-slate-800 rounded-b-2xl p-6 text-slate-200 font-serif leading-relaxed text-sm md:text-base focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-y min-h-[300px] border-t-0"
      />
    </div>
  );
};
