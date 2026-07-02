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
            {resumes.map((resume) => (
              <li key={resume.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{resume.fileName || 'Resume'}</p>
                    <p className="text-xs text-slate-400">
                      {resume.uploadedAt ? new Date(resume.uploadedAt).toLocaleDateString() : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {resume.fileUrl && (
                    <a
                      href={resume.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(resume.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ResumeDetailsPage;
