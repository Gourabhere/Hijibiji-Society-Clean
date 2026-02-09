import React, { useState } from 'react';
import { LayoutDashboard, CheckSquare, PackagePlus, Users, Menu } from 'lucide-react';
import Dashboard from './components/Dashboard';
import StaffTaskView from './components/StaffTaskView';
import SupplyRequestView from './components/SupplyRequest.tsx'; // Fixed import extension
import { TaskLog, SupplyRequest, UserRole, STAFF_MEMBERS } from './types';
import { TASK_DEFINITIONS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'TASKS' | 'SUPPLIES'>('DASHBOARD');
  const [userRole, setUserRole] = useState<UserRole>(UserRole.MANAGER);
  const [currentUser, setCurrentUser] = useState<number>(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // App State (In a real app, this would be in a DB/Context)
  const [logs, setLogs] = useState<TaskLog[]>([]);
  const [supplyRequests, setSupplyRequests] = useState<SupplyRequest[]>([]);

  const handleLogTask = (log: Omit<TaskLog, 'id'>) => {
    const newLog: TaskLog = {
      ...log,
      id: Math.random().toString(36).substr(2, 9)
    };
    setLogs(prev => [...prev, newLog]);
  };

  const handleSupplyRequest = (req: Omit<SupplyRequest, 'id'>) => {
    const newReq: SupplyRequest = {
      ...req,
      id: Math.random().toString(36).substr(2, 9)
    };
    setSupplyRequests(prev => [...prev, newReq]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'DASHBOARD':
        return <Dashboard logs={logs} tasks={TASK_DEFINITIONS} />;
      case 'TASKS':
        return <StaffTaskView currentUser={currentUser} logs={logs} onLogTask={handleLogTask} />;
      case 'SUPPLIES':
        return <SupplyRequestView currentUser={currentUser} requests={supplyRequests} onRequest={handleSupplyRequest} />;
      default:
        return <Dashboard logs={logs} tasks={TASK_DEFINITIONS} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Navigation / Header */}
      <div className="bg-white sticky top-0 z-40 border-b border-slate-100 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            S
          </div>
          <h1 className="font-bold text-slate-900 tracking-tight">Society<span className="text-teal-600">Clean</span></h1>
        </div>
        
        {/* User Switcher (For Simulation) */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors relative"
        >
          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userRole === UserRole.MANAGER ? 'Manager' : STAFF_MEMBERS.find(s => s.id === currentUser)?.name}`} alt="Avatar" />
          </div>
          {isMenuOpen && (
             <div className="absolute top-12 right-0 bg-white shadow-xl border border-slate-100 rounded-xl p-2 w-48 flex flex-col gap-1">
               <div className="text-xs font-bold text-slate-400 px-2 py-1">SWITCH USER</div>
               <button 
                onClick={() => { setUserRole(UserRole.MANAGER); setIsMenuOpen(false); setActiveTab('DASHBOARD'); }}
                className={`text-left px-3 py-2 rounded-lg text-sm ${userRole === UserRole.MANAGER ? 'bg-teal-50 text-teal-700' : 'hover:bg-slate-50'}`}
               >
                 Manager (Admin)
               </button>
               {STAFF_MEMBERS.map(staff => (
                 <button
                   key={staff.id}
                   onClick={() => { 
                     setUserRole(UserRole.STAFF); 
                     setCurrentUser(staff.id); 
                     setIsMenuOpen(false); 
                     setActiveTab('TASKS');
                    }}
                   className={`text-left px-3 py-2 rounded-lg text-sm ${userRole === UserRole.STAFF && currentUser === staff.id ? 'bg-teal-50 text-teal-700' : 'hover:bg-slate-50'}`}
                 >
                   {staff.name}
                 </button>
               ))}
             </div>
          )}
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 max-w-md mx-auto w-full">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe pt-2 px-6 flex justify-between items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <NavButton 
          active={activeTab === 'DASHBOARD'} 
          onClick={() => setActiveTab('DASHBOARD')}
          icon={<LayoutDashboard size={24} />}
          label="Overview"
        />
        <NavButton 
          active={activeTab === 'TASKS'} 
          onClick={() => setActiveTab('TASKS')}
          icon={<CheckSquare size={24} />}
          label="Tasks"
        />
        <NavButton 
          active={activeTab === 'SUPPLIES'} 
          onClick={() => setActiveTab('SUPPLIES')}
          icon={<PackagePlus size={24} />}
          label="Supplies"
        />
      </div>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 ${
      active ? 'text-teal-600 -translate-y-1' : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    <div className={`${active ? 'bg-teal-50 rounded-xl p-1' : ''}`}>
      {icon}
    </div>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default App;
