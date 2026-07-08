import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addChatMessage, autoPopulateForm, setAiLoading } from '../store/interactionSlice';
import { Send, Bot, Sparkles } from 'lucide-react';
import axios from 'axios';

export default function AIAssistant() {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const { chatHistory, isAiLoading } = useSelector((state) => state.interaction);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || isAiLoading) return;

    const userMessage = { id: Date.now(), sender: 'user', text: message };
    dispatch(addChatMessage(userMessage));
    setMessage('');
    dispatch(setAiLoading(true));

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/chat', { message: userMessage.text });
      dispatch(addChatMessage({ id: Date.now() + 1, sender: 'ai', text: '✨ Extracted!' }));
      dispatch(autoPopulateForm(res.data));
    } catch (err) {
      dispatch(addChatMessage({ id: Date.now() + 1, sender: 'ai', text: '❌ Error connecting to backend.' }));
    } finally {
      dispatch(setAiLoading(false));
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 p-4 rounded-xl shadow-lg border border-slate-800 flex flex-col h-[550px]">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
        <Bot className="text-blue-400 w-5 h-5" />
        <span className="font-semibold text-sm">AI Copilot</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 text-xs pr-1">
        {chatHistory.map((msg) => (
          <div key={msg.id} className={`p-2.5 rounded-lg max-w-[85%] ${msg.sender === 'user' ? 'bg-blue-600 ml-auto' : 'bg-slate-900 border border-slate-800 text-slate-300'}`}>
            {msg.text}
          </div>
        ))}
        {isAiLoading && <div className="text-slate-500 animate-pulse flex items-center gap-1"><Sparkles className="w-3 h-3" /> Processing...</div>}
      </div>
      <form onSubmit={handleSend} className="mt-4 flex gap-2 border-t border-slate-800 pt-3">
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} disabled={isAiLoading} placeholder="Type notes here..." className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 text-xs text-white outline-none" />
        <button type="submit" className="bg-blue-600 p-2 rounded text-white"><Send className="w-4 h-4" /></button>
      </form>
    </div>
  );
}