import React, { useEffect, useState } from 'react';
import { FileText, Trash2, Download, Plus, Loader2 } from 'lucide-react';
import { resumeService } from '../../services/resumeService';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routePaths';
import { toast } from 'react-toastify';

const ResumeDetailsPage = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const data = await resumeService.getAll();
      setResumes(data);
    } catch {
      toast.error('Failed to load resumes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    try {
      await resumeService.deleteResume(id);
      toast.success('Resume deleted.');
      setResumes((prev) => prev.filter((r) => r.id !== id));
    } catch {
      toast.error('Delete failed.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Resumes</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your uploaded resumes</p>
        </div>
        <button
          onClick={() => navigate(ROUTES.RESUME_UPLOAD)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-all text-sm"
        >
          <Plus className="w-4 h-4" /> Upload New
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="font-semibold text-slate-600">No resumes uploaded yet</p>
            <p className="text-sm text-slate-400 mt-1">Upload your first resume to get started</p>
            <button
              onClick={() => navigate(ROUTES.RESUME_UPLOAD)}
              className="mt-4 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl transition-all text-sm"
            >
              <Plus className="w-4 h-4" /> Upload Resume
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {resumes.map((resume, index) => (
                <div key={resume.id || index} className="flex items-start justify-between py-5 first:pt-0 last:pb-0">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <p className="font-bold text-slate-800 text-lg">{resume.name || resume.fileName}</p>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${resume.atsScore >= 70 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          ATS Score: {resume.atsScore || 0}/100
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        {resume.email && resume.email !== 'Not found' && <span>📧 {resume.email}</span>}
                        {resume.phone && resume.phone !== 'Not found' && <span>📱 {resume.phone}</span>}
                      </div>
                      
                      <div className="mt-3 text-sm text-slate-600">
                        <p><span className="font-medium text-slate-700">Skills:</span> {resume.skills}</p>
                        <p><span className="font-medium text-slate-700">Education:</span> {resume.education}</p>
                        <p><span className="font-medium text-slate-700">Experience:</span> {resume.experience}</p>
                      </div>

                      <p className="text-xs text-slate-400 mt-2">
                        Uploaded on: {resume.uploadedAt ? new Date(resume.uploadedAt).toLocaleDateString() : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {resume.fileUrl && (
                      <a
                        href={resume.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <Download className="w-4 h-4" /> Download
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(resume.id)}
                      className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ResumeDetailsPage;
