import React, { useEffect, useState } from 'react';
import { skillService } from '../../services/skillService';
import { Plus, Trash2, Loader2, Zap } from 'lucide-react';
import { toast } from 'react-toastify';

const PROFICIENCIES = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];
const PROF_COLORS = {
  BEGINNER: 'bg-slate-100 text-slate-600',
  INTERMEDIATE: 'bg-blue-50 text-blue-700',
  ADVANCED: 'bg-indigo-50 text-indigo-700',
  EXPERT: 'bg-purple-50 text-purple-700',
};

const SkillListPage = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState('');
  const [proficiency, setProficiency] = useState('INTERMEDIATE');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    skillService.getAll()
      .then(setSkills)
      .catch(() => toast.error('Failed to load skills.'))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    setAdding(true);
    try {
      const skill = await skillService.addSkill(newSkill.trim(), proficiency);
      setSkills((prev) => [...prev, skill]);
      setNewSkill('');
      toast.success('Skill added!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add skill.');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await skillService.deleteSkill(id);
      setSkills((prev) => prev.filter((s) => s.id !== id));
      toast.success('Skill removed.');
    } catch {
      toast.error('Failed to remove skill.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2.5 rounded-xl bg-indigo-50">
            <Zap className="w-5 h-5 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">My Skills</h1>
        </div>
        <p className="text-slate-500 text-sm ml-14">Track and manage your technical skills</p>
      </div>

      {/* Add Skill Form */}
      <form onSubmit={handleAdd} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="font-semibold text-slate-700 mb-4">Add New Skill</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="e.g. React, Java, Machine Learning"
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm"
          />
          <select
            value={proficiency}
            onChange={(e) => setProficiency(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-400 outline-none text-sm bg-white"
          >
            {PROFICIENCIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <button
            type="submit"
            disabled={adding || !newSkill.trim()}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-4 py-2.5 rounded-xl transition-all text-sm"
          >
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add
          </button>
        </div>
      </form>

      {/* Skills List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-7 h-7 animate-spin text-indigo-500" />
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-12">
            <Zap className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No skills added yet</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 group">
                <span className="text-sm font-medium text-slate-700">{skill.skillName || skill.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PROF_COLORS[skill.proficiency] || PROF_COLORS.INTERMEDIATE}`}>
                  {skill.proficiency}
                </span>
                <button
                  onClick={() => handleDelete(skill.id)}
                  className="ml-1 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillListPage;
