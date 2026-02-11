import React, { useEffect, useState } from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { TaskStatus } from '../../types';

interface AnalysisProgressProps {
  taskId: string;
  keyword: string;
  onComplete: () => void;
}

const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ taskId, keyword, onComplete }) => {
  const [status, setStatus] = useState<TaskStatus | null>(null);
  const [mockCounter, setMockCounter] = useState(1);

  useEffect(() => {
    // Polling simulation
    const interval = setInterval(async () => {
      // In a real app, we wouldn't pass mockCounter, but here we drive the mock state
      const res = await api.analysis.getStatus(taskId, mockCounter);
      setStatus(res);
      
      if (res.status === 'completed') {
        clearInterval(interval);
        setTimeout(onComplete, 1000); // Small delay before switching
      } else {
         // Increment mock counter to simulate progress on next poll
         setMockCounter(prev => prev + 1);
      }
    }, 1500); // 1.5s per "step" for demo

    return () => clearInterval(interval);
  }, [taskId, mockCounter, onComplete]);

  if (!status) return (
     <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
     </div>
  );

  const progressPercent = Math.round((status.current_step / status.total_steps) * 100);

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            正在分析：<span className="text-indigo-600">{keyword}</span>
          </h2>
          <span className="text-2xl font-black text-slate-200">{progressPercent}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 mb-8 overflow-hidden">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {status.step_details.map((step) => (
            <div key={step.step} className="flex items-center gap-4">
              <div className="shrink-0">
                {step.status === 'completed' ? (
                  <CheckCircle2 className="text-green-500" size={24} />
                ) : step.status === 'processing' ? (
                  <Loader2 className="text-indigo-600 animate-spin" size={24} />
                ) : (
                  <Circle className="text-slate-300" size={24} />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className={`font-medium ${
                    step.status === 'completed' ? 'text-slate-800' :
                    step.status === 'processing' ? 'text-indigo-700' : 'text-slate-400'
                  }`}>
                    Step {step.step}: {step.name}
                  </span>
                  {step.progress && (
                    <span className="text-xs font-mono bg-indigo-50 text-indigo-600 px-2 py-1 rounded">
                      {step.progress}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisProgress;
