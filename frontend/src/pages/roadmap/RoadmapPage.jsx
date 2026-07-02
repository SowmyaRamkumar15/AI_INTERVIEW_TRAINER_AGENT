import React, { useEffect, useState } from 'react';
import { roadmapService } from '../../services/roadmapService';
import { CheckCircle, Circle, Clock, ChevronRight, Loader2, Map } from 'lucide-react';
import { toast } from 'react-toastify';

const STATUS_OPTIONS = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'];
const STATUS_LABELS = { NOT_STARTED: 'Not Started', IN_PROGRESS: 'In Progress', COMPLETED: 'Completed' };
const STATUS_ICONS = {
  NOT_STARTED: <Circle className="w-5 h-5 text-slate-300" />,
  IN_PROGRESS: <Clock className="w-5 h-5 text-amber-500" />,
  COMPLETED: <CheckCircle className="w-5 h-5 text-emerald-500" />,
};
const STATUS_COLORS = {
  NOT_STARTED: 'bg-slate-100 text-slate-600',
  IN_PROGRESS: 'bg-amber-50 text-amber-700 border border-amber-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
};

const RoadmapPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    roadmapService.get()
      .then(setItems)
      .catch(() => toast.error('Failed to load roadmap.'))
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (id, status) => {
    setUpdating(id);
    try {
      await roadmapService.updateStatus(id, status);
      setItems((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    } catch {
      toast.error('Failed to update status.');
    } finally {
      setUpdating(null);
    }
  };

  const completed = items.filter((i) => i.status === 'COMPLETED').length;
  const pct = items.length ? Math.round((completed / items.length) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-indigo-50">
            <Map className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Learning Roadmap</h1>
            <p className="text-slate-500 text-sm">Track your interview preparation progress</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600 w-12 text-right">{pct}%</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">{completed} of {items.length} topics completed</p>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-100">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <Map className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="font-semibold text-slate-600">No roadmap items yet</p>
            <p className="text-sm text-slate-400 mt-1">Your personalized roadmap will appear here</p>
          </div>
        ) : items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
            <div className="shrink-0">{STATUS_ICONS[item.status] || STATUS_ICONS.NOT_STARTED}</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-800 truncate">{item.topic || item.title}</p>
              {item.description && <p className="text-sm text-slate-400 truncate">{item.description}</p>}
            </div>
            <select
              value={item.status}
              disabled={updating === item.id}
              onChange={(e) => handleStatus(item.id, e.target.value)}
              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border-0 cursor-pointer outline-none ${STATUS_COLORS[item.status]}`}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapPage;
