import React, { useState, useRef } from 'react';
import { Camera, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { analyzeCleaningImage, AnalysisResult } from '../services/geminiService';

interface AIInspectorProps {
  taskName: string;
  onVerified: (imageUrl: string, result: AnalysisResult) => void;
  onCancel: () => void;
}

const AIInspector: React.FC<AIInspectorProps> = ({ taskName, onVerified, onCancel }) => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImage(base64String);
      // Remove data:image/jpeg;base64, prefix for API if needed, but the service handles it by stripping or using inlineData directly if we pass pure base64. 
      // The API expects just the base64 data usually, let's strip the header in the service call or here.
      // For this implementation, I will pass the full string to the service and let it handle/strip or use strictly the data part.
      // Actually, for Gemini inlineData, we usually need just the base64 part.
      const base64Data = base64String.split(',')[1]; 
      runAnalysis(base64Data, base64String);
    };
    reader.readAsDataURL(file);
  };

  const runAnalysis = async (base64Data: string, fullUrl: string) => {
    setAnalyzing(true);
    try {
      const result = await analyzeCleaningImage(base64Data, taskName);
      onVerified(fullUrl, result);
    } catch (err) {
      console.error(err);
      alert("Verification failed. Please try again.");
      onCancel();
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl relative overflow-hidden">
        
        {analyzing ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-800">AI Inspector is checking...</h3>
              <p className="text-sm text-slate-500">Analyzing cleanliness and spotting debris.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-900">Verify Work</h3>
              <p className="text-sm text-slate-500 mt-1">Take a photo of the {taskName}</p>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-square bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
            >
              {image ? (
                <img src={image} alt="Preview" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <>
                  <Camera className="w-12 h-12 text-slate-400 mb-2" />
                  <span className="text-sm text-slate-500 font-medium">Tap to take photo</span>
                </>
              )}
            </div>

            <input 
              type="file" 
              accept="image/*" 
              capture="environment"
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileChange} 
            />

            <button 
              onClick={onCancel}
              className="w-full py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInspector;
