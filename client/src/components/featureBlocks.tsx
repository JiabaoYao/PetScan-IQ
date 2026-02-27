import React, { useState } from "react";

const FeatureBlocks: React.FC = () => {
    const [loading, setLoading] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);

    const features = [
    {
      id: 'HEALTH',
      title: 'AI Pet Doctor',
      description: 'Dignosed your pet\'s symptoms? Our AI doctor provides insights and care tips.',
      icon: '🩺',
      color: 'bg-indigo-50 border-indigo-100 text-indigo-700 hover:bg-indigo-100',
      action: async () => {
        const prompt = window.prompt("What symptoms would you like to diagnose? (e.g., Lethargy, Loss of appetite, Vomiting)");
        if (!prompt) return;
        setLoading('HEALTH');
        try {
          const response = await fetch("http://127.0.0.1:8000/api/diagnose", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: prompt }),
          })
          const data = await response.json();
          setResult({ type: 'text', content: data.answer, title: 'AI Diagnosis' });
        } catch (e) {
          alert('Error generating diagnosis');
        } finally {
          setLoading(null);
        }
      }
    },
    {
      id: 'ANALYST',
      title: 'Mood Tracker',
      description: 'Upload a photo to understand your pet\'s current mood and wellbeing.',
      icon: '🤪',
      color: 'bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100',
      action: async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e: any) => {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onload = async () => {
            const base64 = (reader.result as string).split(',')[1];
            setLoading('ANALYST');
            try {
                const response = await fetch("http://127.0.0.1:8000/api/analyze-mood", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ image_url: base64 }),
                });
                const data = await response.json();
                setResult({ type: 'text', content: data.answer, title: 'Mood Analysis' });
            } catch (e) {
              alert('Error analyzing mood');
            } finally {
              setLoading(null);
            }
          };
          reader.readAsDataURL(file);
        };
        input.click();
      }
    },
    {
      id: 'BREED',
      title: 'Breed Scout',
      description: 'Curious about a breed? Our AI identifies and shares fun facts.',
      icon: '🐶',
      color: 'bg-amber-50 border-amber-100 text-amber-700 hover:bg-amber-100',
      action: async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e: any) => {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onload = async () => {
            const base64 = (reader.result as string).split(',')[1];
            setLoading('BREED');
            try {
              const response = await fetch("http://127.0.0.1:8000/api/identify-breed", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ image_url: base64 }),
              });
              const data = await response.json();
              setResult({ type: 'text', content: data.answer, title: 'Breed Identification' });
            } catch (e) {
              alert('Error identifying breed');
            } finally {
              setLoading(null);
            }
          };
          reader.readAsDataURL(file);
        };
        input.click();
      }
    }
  ];
    
  return (
    <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 gap-6">
        { features.map((f) => (
            <button 
                key={f.id}
                onClick={f.action}
                className={`w-full flex items-start gap-6 p-6 rounded-3xl border transition-all text-left group ${f.color} ${loading === f.id ? 'opacity-70 scale-[0.98]' : 'hover:scale-[1.01] hover:shadow-lg'}`}
                disabled={!!loading}
            >
                <span className="text-4xl">{f.icon}</span>
                <div className="flex-1">
                    <h3 className="text-xl font-brand font-bold mb-1">{f.title}</h3>
                    <p className="text-sm opacity-80 leading-relaxed">{f.description}</p>
                    {loading === f.id && (
                        <div className="mt-3 flex items-center gap-2 text-xs font-bold animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-current" />
                        AI is thinking...
                        </div>
                    )}
                </div>
                <div className="bg-white/50 rounded-full p-2 group-hover:bg-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </div>
            </button>
        )) }
        </div>    
      
        {result && result.type === 'text' && (
            <div className="mt-12 bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h4 className="font-brand font-bold text-slate-700">{result.title}</h4>
                    <button onClick={() => setResult(null)} className="text-slate-400 hover:text-slate-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-8">
                    <div className="prose prose-slate max-w-none">
                        <p className="text-slate-600 leading-relaxed text-lg italic">"{result.content}"</p>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}

export default FeatureBlocks;