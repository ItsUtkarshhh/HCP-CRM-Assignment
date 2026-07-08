import { Provider } from 'react-redux';
import { store } from './store';
import InteractionForm from './components/InteractionForm';
import AIAssistant from './components/AIAssistant';

export default function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm mb-6">
          <h1 className="text-xl font-bold text-slate-800">Log HCP Interaction</h1>
        </header>
        <main className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <InteractionForm />
          </div>
          <div className="lg:col-span-1">
            <AIAssistant />
          </div>
        </main>
      </div>
    </Provider>
  );
}