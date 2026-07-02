import React, { useState, useRef } from 'react';
import { Upload, FileText, Trash2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { resumeService } from '../../services/resumeService';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routePaths';
import { toast } from 'react-toastify';

const UploadResumePage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);
  const navigate = useNavigate();

  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== 'application/pdf') {
      toast.error('Only PDF files are accepted.');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error('File must be under 5 MB.');
      return;
    }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      await resumeService.upload(file);
      toast.success('Resume uploaded successfully!');
      navigate(ROUTES.RESUME_DETAILS);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Upload Resume</h1>
        <p className="text-slate-500 text-sm">Upload your PDF resume to get AI-powered feedback and questions.</p>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`bg-white rounded-2xl border-2 border-dashed p-12 flex flex-col items-center gap-4 cursor-pointer transition-all
          ${dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}
      >
        <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
        {file ? (
          <>
            <CheckCircle className="w-12 h-12 text-emerald-500" />
            <div className="text-center">
              <p className="font-semibold text-slate-800">{file.name}</p>
              <p className="text-sm text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              className="flex items-center gap-1.5 text-rose-500 hover:text-rose-600 text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" /> Remove
            </button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <Upload className="w-8 h-8 text-indigo-500" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-slate-700">Drag & drop or click to upload</p>
              <p className="text-sm text-slate-400 mt-1">PDF only · Max 5 MB</p>
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-all"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
          {uploading ? 'Uploading…' : 'Upload Resume'}
        </button>
        <button
          onClick={() => navigate(ROUTES.RESUME_DETAILS)}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold px-6 py-3 rounded-xl transition-all"
        >
          View All Resumes
        </button>
      </div>

      {/* Info */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700">
          Your resume is used to generate tailored interview questions and skill gap analysis. Only PDF format is supported.
        </p>
      </div>
    </div>
  );
};

export default UploadResumePage;
