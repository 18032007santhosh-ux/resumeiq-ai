import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Navbar } from '../components/dashboard/Navbar';
import { getResumeById, parseResume } from '../services/resumeService';
import { 
  FileText, ArrowLeft, Calendar, HardDrive, CheckCircle2, 
  Clock, User, Mail, Phone, MapPin, Globe,
  Briefcase, GraduationCap, Award, Languages, Terminal, ChevronDown, ChevronUp
} from 'lucide-react';

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5 0-1.4-.5-2.5-1.5-3.4.1-.3.6-1.6-.1-3.3 0 0-1.2-.4-3.9 1.4a12.3 12.3 0 0 0-7 0C6.1 2.7 4.9 3.1 4.9 3.1c-.7 1.7-.2 3 .1 3.3-1 1-1.5 2-1.5 3.4 0 5 3 6.2 6 6.5-.4.4-.7 1-.8 2.1-.5.2-1.8.8-3-1-1.2-2-2-2.1-2-2.1-1.1-.1-.1.1-.1.1.8.1 1.2 1.3 1.2 1.3 1 1.7 2.6 1.1 3.2.8.1-1 .5-1.7 1-2.1-3-.3-6-1.5-6-6.5 0-1.4.5-2.5 1.5-3.4-.1-.3-.6-1.6.1-3.3 0 0 1.2.4 3.9-1.4a12.3 12.3 0 0 1 7 0c2.7-1.8 3.9-1.4 3.9-1.4.7 1.7.2 3-.1 3.3 1 .9 1.5 2 1.5 3.4 0 5-3 6.2-6 6.5.3.4.7 1 .8 2.1v4.4"/></svg>
);
import { useToast } from '../contexts/ToastContext';

export const ResumeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [parsing, setParsing] = useState(false);
  const [parsingStep, setParsingStep] = useState(0);
  const { showToast } = useToast();

  const [expandedSections, setExpandedSections] = useState({
    experience: true,
    education: true,
    projects: true,
    skills: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    const fetchResume = async () => {
      try {
        if (!id) return;
        const res = await getResumeById(id);
        setResume(res.data);
        
        // Auto-trigger parsing if it hasn't been parsed yet
        if (res.data.parsingStatus === 'Uploaded') {
          triggerParsing(id);
        }
      } catch (error) {
        showToast('Failed to load resume details', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [id, showToast]);

  const triggerParsing = async (resumeId: string) => {
    setParsing(true);
    setParsingStep(1); // Reading Resume...
    
    setTimeout(() => setParsingStep(2), 1500); // Extracting Information...
    setTimeout(() => setParsingStep(3), 3000); // Analyzing Sections...

    try {
      const res = await parseResume(resumeId);
      setResume(res);
      showToast('Resume parsed successfully', 'success');
    } catch (error) {
      showToast('Failed to parse resume', 'error');
      // Re-fetch to get updated status (Parsing Failed)
      const res = await getResumeById(resumeId);
      setResume(res.data);
    } finally {
      setParsing(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderField = (label: string, value: any, icon: React.ReactNode, isLink: boolean = false) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return (
        <div className="flex items-start gap-3 text-slate-300">
          <div className="mt-0.5 text-slate-500">{icon}</div>
          <div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="font-medium text-slate-600 italic">Not detected</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-start gap-3 text-slate-300">
        <div className="mt-0.5 text-indigo-400">{icon}</div>
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          {isLink ? (
            <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noreferrer" className="font-medium text-indigo-400 hover:underline break-all">
              {value}
            </a>
          ) : (
            <p className="font-medium">{value}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#070913] text-slate-100 overflow-hidden font-sans selection:bg-indigo-500/30">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-950/50">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 z-10 custom-scrollbar">
          <div className="max-w-[1000px] mx-auto space-y-8 pb-16">
            
            <div>
              <Link to="/dashboard/resumes" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors mb-4">
                <ArrowLeft className="w-4 h-4" />
                Back to Resumes
              </Link>
              <h1 className="text-3xl font-bold text-white mb-2">Resume Details</h1>
              <p className="text-slate-400">View information about your uploaded resume.</p>
            </div>

            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-40 bg-slate-800/50 rounded-2xl"></div>
              </div>
            ) : resume ? (
              <>
                {/* File Info Card */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 lg:p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-4 rounded-xl bg-indigo-500/10 text-indigo-400">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-white mb-1">{resume.originalFileName}</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                        <div className="flex items-center gap-3 text-slate-300">
                          <Calendar className="w-5 h-5 text-slate-500" />
                          <div>
                            <p className="text-sm text-slate-500">Uploaded On</p>
                            <p className="font-medium">{formatDate(resume.uploadDate)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                          <HardDrive className="w-5 h-5 text-slate-500" />
                          <div>
                            <p className="text-sm text-slate-500">File Size</p>
                            <p className="font-medium">{formatFileSize(resume.fileSize)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                          {resume.parsingStatus === 'Parsed Successfully' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : resume.parsingStatus === 'Parsing Failed' ? (
                            <CheckCircle2 className="w-5 h-5 text-red-500" />
                          ) : (
                            <Clock className="w-5 h-5 text-amber-500" />
                          )}
                          <div>
                            <p className="text-sm text-slate-500">Parsing Status</p>
                            <p className={`font-medium ${
                              resume.parsingStatus === 'Parsed Successfully' ? 'text-emerald-400' :
                              resume.parsingStatus === 'Parsing Failed' ? 'text-red-400' :
                              'text-amber-400'
                            }`}>
                              {resume.parsingStatus || 'Uploaded'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Parsing State */}
                {parsing && (
                  <div className="bg-slate-900/50 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-8 flex flex-col items-center justify-center space-y-6">
                    <div className="relative w-20 h-20">
                      <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center text-indigo-400">
                        <FileText className="w-8 h-8 animate-pulse" />
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {parsingStep === 1 && "Reading Resume..."}
                        {parsingStep === 2 && "Extracting Information..."}
                        {parsingStep >= 3 && "Analyzing Sections..."}
                      </h3>
                      <p className="text-slate-400">This might take a few seconds.</p>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full max-w-md h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                        style={{ width: `${(parsingStep / 3) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Parsed Data Display */}
                {resume.parsingStatus === 'Parsed Successfully' && !parsing && resume.parsedData && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    
                    {/* Personal Information */}
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 lg:p-8">
                      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-indigo-400" />
                        Personal Information
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderField('Full Name', resume.parsedData.name, <User className="w-5 h-5" />)}
                        {renderField('Email', resume.parsedData.email, <Mail className="w-5 h-5" />)}
                        {renderField('Phone', resume.parsedData.phone, <Phone className="w-5 h-5" />)}
                        {renderField('Location', resume.parsedData.location, <MapPin className="w-5 h-5" />)}
                        {renderField('LinkedIn', resume.parsedData.linkedin, <LinkedinIcon className="w-5 h-5" />, true)}
                        {renderField('GitHub', resume.parsedData.github, <GithubIcon className="w-5 h-5" />, true)}
                        {renderField('Portfolio', resume.parsedData.portfolio, <Globe className="w-5 h-5" />, true)}
                      </div>

                      {resume.parsedData.summary && (
                        <div className="mt-6 pt-6 border-t border-slate-800/50">
                          <p className="text-sm text-slate-500 mb-2">Professional Summary</p>
                          <p className="text-slate-300 whitespace-pre-wrap">{resume.parsedData.summary}</p>
                        </div>
                      )}
                    </div>

                    {/* Collapsible Sections */}
                    
                    {/* Experience */}
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden">
                      <button 
                        onClick={() => toggleSection('experience')}
                        className="w-full flex items-center justify-between p-6 hover:bg-slate-800/30 transition-colors"
                      >
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <Briefcase className="w-5 h-5 text-indigo-400" />
                          Experience
                        </h3>
                        {expandedSections.experience ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                      </button>
                      
                      {expandedSections.experience && (
                        <div className="p-6 pt-0 border-t border-slate-800/50">
                          {resume.parsedData.experience && resume.parsedData.experience.length > 0 ? (
                            resume.parsedData.experience.map((exp: any, i: number) => (
                              <div key={i} className="mb-4 last:mb-0 text-slate-300 whitespace-pre-wrap">
                                {exp.description}
                              </div>
                            ))
                          ) : (
                            <p className="text-slate-500 italic">Not detected</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Education */}
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden">
                      <button 
                        onClick={() => toggleSection('education')}
                        className="w-full flex items-center justify-between p-6 hover:bg-slate-800/30 transition-colors"
                      >
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <GraduationCap className="w-5 h-5 text-indigo-400" />
                          Education
                        </h3>
                        {expandedSections.education ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                      </button>
                      
                      {expandedSections.education && (
                        <div className="p-6 pt-0 border-t border-slate-800/50">
                          {resume.parsedData.education && resume.parsedData.education.length > 0 ? (
                            resume.parsedData.education.map((edu: any, i: number) => (
                              <div key={i} className="mb-4 last:mb-0 text-slate-300 whitespace-pre-wrap">
                                {edu.description}
                              </div>
                            ))
                          ) : (
                            <p className="text-slate-500 italic">Not detected</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Projects */}
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden">
                      <button 
                        onClick={() => toggleSection('projects')}
                        className="w-full flex items-center justify-between p-6 hover:bg-slate-800/30 transition-colors"
                      >
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <Terminal className="w-5 h-5 text-indigo-400" />
                          Projects
                        </h3>
                        {expandedSections.projects ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                      </button>
                      
                      {expandedSections.projects && (
                        <div className="p-6 pt-0 border-t border-slate-800/50">
                          {resume.parsedData.projects && resume.parsedData.projects.length > 0 ? (
                            resume.parsedData.projects.map((proj: any, i: number) => (
                              <div key={i} className="mb-4 last:mb-0 text-slate-300 whitespace-pre-wrap">
                                {proj.description}
                              </div>
                            ))
                          ) : (
                            <p className="text-slate-500 italic">Not detected</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Skills & Others */}
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden">
                      <button 
                        onClick={() => toggleSection('skills')}
                        className="w-full flex items-center justify-between p-6 hover:bg-slate-800/30 transition-colors"
                      >
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <Award className="w-5 h-5 text-indigo-400" />
                          Skills, Certifications & Languages
                        </h3>
                        {expandedSections.skills ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                      </button>
                      
                      {expandedSections.skills && (
                        <div className="p-6 pt-0 border-t border-slate-800/50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          
                          <div>
                            <p className="text-sm text-slate-500 mb-3 flex items-center gap-2">
                              <Terminal className="w-4 h-4" /> Skills
                            </p>
                            {resume.parsedData.skills && resume.parsedData.skills.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {resume.parsedData.skills.map((skill: string, i: number) => (
                                  <span key={i} className="px-2 py-1 bg-indigo-500/10 text-indigo-300 rounded text-xs border border-indigo-500/20">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-slate-500 italic">Not detected</p>
                            )}
                          </div>

                          <div>
                            <p className="text-sm text-slate-500 mb-3 flex items-center gap-2">
                              <Award className="w-4 h-4" /> Certifications
                            </p>
                            {resume.parsedData.certifications && resume.parsedData.certifications.length > 0 ? (
                              <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                                {resume.parsedData.certifications.map((cert: string, i: number) => (
                                  <li key={i}>{cert}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-slate-500 italic">Not detected</p>
                            )}
                          </div>

                          <div>
                            <p className="text-sm text-slate-500 mb-3 flex items-center gap-2">
                              <Languages className="w-4 h-4" /> Languages
                            </p>
                            {resume.parsedData.languages && resume.parsedData.languages.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {resume.parsedData.languages.map((lang: string, i: number) => (
                                  <span key={i} className="px-2 py-1 bg-purple-500/10 text-purple-300 rounded text-xs border border-purple-500/20">
                                    {lang}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-slate-500 italic">Not detected</p>
                            )}
                          </div>

                        </div>
                      )}
                    </div>

                  </div>
                )}

              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400">Resume not found.</p>
              </div>
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
};
