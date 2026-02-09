import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { TaskLog, STAFF_MEMBERS, TaskDefinition, Frequency } from '../types';
import { TASK_DEFINITIONS } from '../constants';

interface DashboardProps {
  logs: TaskLog[];
  tasks: TaskDefinition[];
}

const Dashboard: React.FC<DashboardProps> = ({ logs, tasks }) => {
  // Calculate completion stats for today
  const today = new Date().setHours(0, 0, 0, 0);
  const todaysLogs = logs.filter(l => l.timestamp >= today);

  const dailyTasksCount = tasks.filter(t => t.frequency === Frequency.DAILY).length;
  const completedDaily = todaysLogs.filter(l => {
    const taskDef = tasks.find(t => t.id === l.taskId);
    return taskDef?.frequency === Frequency.DAILY && l.status !== 'REJECTED';
  }).length;

  const progress = dailyTasksCount > 0 ? Math.round((completedDaily / dailyTasksCount) * 100) : 0;

  // Chart Data
  const data = [
    { name: 'Completed', value: completedDaily },
    { name: 'Pending', value: dailyTasksCount - completedDaily },
  ];
  const COLORS = ['#10b981', '#e2e8f0'];

  // Staff Performance
  const staffPerformance = STAFF_MEMBERS.map(staff => {
    const count = todaysLogs.filter(l => l.staffId === staff.id).length;
    return { name: staff.name.split(' ')[0], tasks: count };
  });

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      <header className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Society Overview</h2>
          <p className="text-slate-500 text-sm">Real-time housekeeping insights</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-teal-600">{progress}%</div>
          <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Daily Goal</div>
        </div>
      </header>

      {/* Main Status Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <span className="text-slate-500 text-sm font-medium">Tasks Done</span>
          <div className="flex items-end space-x-2 mt-2">
            <span className="text-2xl font-bold text-slate-800">{completedDaily}</span>
            <span className="text-sm text-slate-400 mb-1">/ {dailyTasksCount}</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <span className="text-slate-500 text-sm font-medium">Issues</span>
          <div className="flex items-end space-x-2 mt-2">
            <span className="text-2xl font-bold text-red-500">
              {todaysLogs.filter(l => l.aiRating && l.aiRating < 6).length}
            </span>
            <span className="text-sm text-slate-400 mb-1">detected</span>
          </div>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="font-semibold text-slate-800 mb-4">Staff Activity (Today)</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={staffPerformance}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
              <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Bar dataKey="tasks" fill="#0f766e" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div>
        <h3 className="font-semibold text-slate-800 mb-4 px-1">Live Feed</h3>
        <div className="space-y-3">
          {todaysLogs.length === 0 ? (
            <div className="text-center py-8 text-slate-400 italic">No activity recorded today yet.</div>
          ) : (
            todaysLogs.slice().reverse().map(log => {
              const task = tasks.find(t => t.id === log.taskId);
              const staff = STAFF_MEMBERS.find(s => s.id === log.staffId);
              
              return (
                <div key={log.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex gap-4">
                  {log.imageUrl && (
                    <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-100">
                      <img src={log.imageUrl} alt="Proof" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-slate-900 truncate">{task?.title || 'Unknown Task'}</h4>
                      {log.aiRating && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          log.aiRating >= 8 ? 'bg-green-100 text-green-700' : 
                          log.aiRating >= 5 ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-red-100 text-red-700'
                        }`}>
                          Score: {log.aiRating}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {staff?.name} • {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                    {log.aiFeedback && (
                      <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded border border-slate-100">
                        🤖 {log.aiFeedback}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
