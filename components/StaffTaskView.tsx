import React, { useState } from 'react';
import { TaskDefinition, TaskLog, STAFF_MEMBERS, TaskType, Frequency } from '../types';
import { TASK_DEFINITIONS, getTaskIcon } from '../constants';
import { Check, Camera, MapPin, ChevronRight, Calendar } from 'lucide-react';
import AIInspector from './AIInspector';
import { AnalysisResult } from '../services/geminiService';

interface StaffTaskViewProps {
  currentUser: number;
  logs: TaskLog[];
  onLogTask: (log: Omit<TaskLog, 'id'>) => void;
}

const StaffTaskView: React.FC<StaffTaskViewProps> = ({ currentUser, logs, onLogTask }) => {
  const [selectedBlock, setSelectedBlock] = useState<number | 'ALL'>('ALL');
  const [verifyingTask, setVerifyingTask] = useState<TaskDefinition | null>(null);

  // Filter tasks based on view
  const todaysLogs = logs.filter(l => l.timestamp >= new Date().setHours(0,0,0,0));
  
  const isTaskDone = (taskId: string) => todaysLogs.some(l => l.taskId === taskId);

  const filteredTasks = TASK_DEFINITIONS.filter(t => {
    if (selectedBlock === 'ALL') return true;
    if (t.block === selectedBlock) return true;
    if (!t.block) return true; // Common tasks like Driveway show everywhere or can be filtered separately. Let's show common only in ALL or specific "Common" filter.
    // Actually, let's keep common tasks visible only in ALL for simplicity or add a "Common" tab.
    return false;
  }).sort((a, b) => {
    // Sort completed to bottom
    const aDone = isTaskDone(a.id);
    const bDone = isTaskDone(b.id);
    return aDone === bDone ? 0 : aDone ? 1 : -1;
  });

  const handleTaskClick = (task: TaskDefinition) => {
    if (isTaskDone(task.id)) return; // Already done
    setVerifyingTask(task);
  };

  const handleVerificationComplete = (imageUrl: string, result: AnalysisResult) => {
    if (!verifyingTask) return;

    onLogTask({
      taskId: verifyingTask.id,
      staffId: currentUser,
      timestamp: Date.now(),
      status: 'VERIFIED',
      imageUrl: imageUrl,
      aiFeedback: result.feedback,
      aiRating: result.rating
    });
    setVerifyingTask(null);
  };

  return (
    <div className="pb-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">My Tasks</h2>
          <p className="text-slate-500 text-sm">
            {STAFF_MEMBERS.find(s => s.id === currentUser)?.name}
          </p>
        </div>
        <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* Block Filter */}
      <div className="flex overflow-x-auto gap-2 pb-4 no-scrollbar mb-2">
        <button
          onClick={() => setSelectedBlock('ALL')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedBlock === 'ALL' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          All Areas
        </button>
        {[1, 2, 3, 4, 5, 6].map(block => (
          <button
            key={block}
            onClick={() => setSelectedBlock(block)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedBlock === block 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Block {block}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map(task => {
          const done = isTaskDone(task.id);
          const isWeekly = task.frequency === Frequency.WEEKLY;
          
          return (
            <button
              key={task.id}
              onClick={() => handleTaskClick(task)}
              disabled={done}
              className={`w-full text-left p-4 rounded-xl border transition-all relative overflow-hidden group ${
                done 
                  ? 'bg-slate-50 border-slate-100 opacity-70' 
                  : 'bg-white border-slate-100 shadow-sm hover:border-teal-200 active:scale-[0.99]'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  done ? 'bg-slate-200 text-slate-400' : 'bg-teal-50'
                }`}>
                  {done ? <Check className="w-5 h-5" /> : getTaskIcon(task.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold ${done ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                      {task.title}
                    </h3>
                    {isWeekly && !done && (
                      <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        WEEKLY
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center text-xs text-slate-500 mt-1 gap-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {task.area}
                    </span>
                    {!done && (
                      <span className="flex items-center gap-1 text-teal-600 font-medium">
                        <Camera className="w-3 h-3" /> Verify
                      </span>
                    )}
                  </div>
                </div>

                {!done && (
                  <div className="self-center">
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-teal-500 transition-colors" />
                  </div>
                )}
              </div>
              
              {/* Progress Bar for "Weekly" visual hint if needed, keeping simple for now */}
            </button>
          );
        })}
      </div>

      {verifyingTask && (
        <AIInspector 
          taskName={verifyingTask.title}
          onVerified={handleVerificationComplete}
          onCancel={() => setVerifyingTask(null)}
        />
      )}
    </div>
  );
};

export default StaffTaskView;
