import { useSelector, useDispatch } from 'react-redux';
import { updateField } from '../store/interactionSlice';
import axios from 'axios';

export default function InteractionForm() {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.interaction.formData);

  const handleChange = (field, value) => {
    dispatch(updateField({ field, value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/interactions', formData);
      alert(`🎉 Saved! Record ID: ${response.data.id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to save record.");
    }
  };

  return (
  <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-5">
    <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Interaction Details</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1">HCP Name</label>
        <input type="text" value={formData.hcp_name} onChange={(e) => handleChange('hcp_name', e.target.value)} className="w-full border border-slate-300 rounded p-2 text-sm outline-none" required />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1">Type</label>
        <select value={formData.interaction_type} onChange={(e) => handleChange('interaction_type', e.target.value)} className="w-full border border-slate-300 rounded p-2 text-sm outline-none">
          <option>Meeting</option>
          <option>Webinar</option>
          <option>Email Follow-up</option>
        </select>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1">Date</label>
        <input type="date" value={formData.date} onChange={(e) => handleChange('date', e.target.value)} className="w-full border border-slate-300 rounded p-2 text-sm" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1">Time</label>
        <input type="time" value={formData.time} onChange={(e) => handleChange('time', e.target.value)} className="w-full border border-slate-300 rounded p-2 text-sm" />
      </div>
    </div>

    {/* 👇 Added Attendees Field 👇 */}
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1">Attendees</label>
      <input type="text" value={formData.attendees || ''} onChange={(e) => handleChange('attendees', e.target.value)} className="w-full border border-slate-300 rounded p-2 text-sm outline-none" placeholder="e.g. Dr. Smith, Rep John" />
    </div>

    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1">Topics Discussed</label>
      <textarea value={formData.topics_discussed} onChange={(e) => handleChange('topics_discussed', e.target.value)} rows={3} className="w-full border border-slate-300 rounded p-2 text-sm" placeholder="Discussion details..."></textarea>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1">Materials Shared</label>
        <input type="text" value={formData.materials_shared} onChange={(e) => handleChange('materials_shared', e.target.value)} className="w-full bg-white border border-slate-300 rounded p-2 text-sm" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1">Samples Distributed</label>
        <input type="text" value={formData.samples_distributed} onChange={(e) => handleChange('samples_distributed', e.target.value)} className="w-full bg-white border border-slate-300 rounded p-2 text-sm" />
      </div>
    </div>

    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-2">Sentiment</label>
      <div className="flex gap-4">
        {['Positive', 'Neutral', 'Negative'].map((s) => (
          <label key={s} className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
            <input type="radio" name="sentiment" checked={formData.sentiment === s} onChange={() => handleChange('sentiment', s)} />
            {s}
          </label>
        ))}
      </div>
    </div>

    {/* 👇 Added Outcomes Field 👇 */}
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1">Outcomes</label>
      <textarea value={formData.outcomes || ''} onChange={(e) => handleChange('outcomes', e.target.value)} rows={2} className="w-full border border-slate-300 rounded p-2 text-sm" placeholder="Key outcomes or agreements..."></textarea>
    </div>

    {/* 👇 Added Follow-up Actions Field 👇 */}
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1">Follow-up Actions</label>
      <textarea value={formData.follow_up_actions || ''} onChange={(e) => handleChange('follow_up_actions', e.target.value)} rows={2} className="w-full border border-slate-300 rounded p-2 text-sm" placeholder="Next steps or tasks..."></textarea>
    </div>

    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition-all shadow-sm">Save Log</button>
  </form>
);
}