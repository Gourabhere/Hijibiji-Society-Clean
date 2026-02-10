import React from 'react';
import { TaskLog, StaffMember, TaskDefinition, Frequency, SupplyRequest } from '../types';
import { TASK_DEFINITIONS } from '../constants';
import { Check, X, MapPin, TrendingUp } from 'lucide-react';

interface DashboardProps {
  logs: TaskLog[];
  tasks: TaskDefinition[];
  supplyRequests: SupplyRequest[];
  onApproveSupply: (id: string) => void;
  staffMembers: StaffMember[];
}

const DonutChart: React.FC<{ percentage: number; size?: number; strokeWidth?: number }> = ({
  percentage, size = 160, strokeWidth = 14
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="progress-ring-container" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--neu-dark)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="url(#gradient)" strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
          <TrendingUp size={22} color="#3b82f6" />
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Live Feed</span>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ logs, tasks, supplyRequests, onApproveSupply, staffMembers }) => {
  const today = new Date().setHours(0, 0, 0, 0);
  const todaysLogs = logs.filter(l => l.timestamp >= today);

  const dailyTasksCount = tasks.filter(t => t.frequency === Frequency.DAILY).length;
  const completedDaily = todaysLogs.filter(l => {
    const taskDef = tasks.find(t => t.id === l.taskId);
    return taskDef?.frequency === Frequency.DAILY && l.status !== 'REJECTED';
  }).length;

  const progress = dailyTasksCount > 0 ? Math.round((completedDaily / dailyTasksCount) * 100) : 74;

  const garbageTasks = tasks.filter(t => t.type.includes('Garbage'));
  const garbageDone = todaysLogs.filter(l => garbageTasks.some(t => t.id === l.taskId)).length;
  const garbagePercent = garbageTasks.length > 0 ? Math.round((garbageDone / garbageTasks.length) * 100) : 82;

  const broomTasks = tasks.filter(t => t.type.includes('Brooming'));
  const broomDone = todaysLogs.filter(l => broomTasks.some(t => t.id === l.taskId)).length;
  const broomPercent = broomTasks.length > 0 ? Math.round((broomDone / broomTasks.length) * 100) : 66;

  const openRequests = supplyRequests.filter(r => r.status === 'OPEN');

  return (
    <div style={{ paddingBottom: 16 }}>

      {/* On-Duty Staff */}
      <div className="animate-in" style={{ marginBottom: 24 }}>
        <div className="section-header">
          <span className="section-title">On-Duty Staff</span>
          <button className="btn-ghost" style={{ fontSize: 13, fontWeight: 600, color: 'var(--blue)', padding: '4px 8px' }}>View All</button>
        </div>
        <div style={{ display: 'flex', gap: 20, overflowX: 'auto', paddingBottom: 4 }} className="no-scrollbar">
          {staffMembers.map(staff => (
            <div key={staff.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 72 }}>
              <img src={staff.avatar} alt={staff.name} className="avatar avatar-lg" style={{ width: 56, height: 56 }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center', lineHeight: 1.2 }}>
                {staff.name.split(' ')[0]} {staff.name.split(' ')[1]?.[0]}.
              </span>
              <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-muted)' }}>{staff.blockAssignment}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Progress */}
      <div className="neu-card-inset animate-in animate-in-delay-1" style={{ marginBottom: 24, textAlign: 'center', padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <span className="section-title">Daily Progress</span>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{progress}%</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Average</div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <DonutChart percentage={progress} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Garbage: {garbagePercent}%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--blue)' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Brooming: {broomPercent}%</span>
          </div>
        </div>
      </div>

      {/* Supplies Status */}
      <div className="animate-in animate-in-delay-2" style={{ marginBottom: 24 }}>
        <div className="section-header">
          <span className="section-title">Supplies Status</span>
          {openRequests.length > 0 && (
            <span className="badge badge-green">{openRequests.length} New Requests</span>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {openRequests.length === 0 && supplyRequests.length === 0 ? (
            <>
              <SupplyCard item="Cleaning Liquid (5L)" requester="Ravi" time="10m ago" onApprove={() => { }} onReject={() => { }} />
              <SupplyCard item="New Heavy Broom" requester="Anita" time="45m ago" onApprove={() => { }} onReject={() => { }} />
            </>
          ) : (
            openRequests.map(req => {
              const staff = staffMembers.find(s => s.id === req.requesterId);
              const ago = Math.round((Date.now() - req.timestamp) / 60000);
              return (
                <SupplyCard
                  key={req.id}
                  item={`${req.item} (${req.quantity})`}
                  requester={staff?.name.split(' ')[0] || 'Staff'}
                  time={`${ago}m ago`}
                  onApprove={() => onApproveSupply(req.id)}
                  onReject={() => { }}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Zone Monitoring */}
      <div className="animate-in animate-in-delay-3" style={{ marginBottom: 24 }}>
        <div className="section-header">
          <span className="section-title">Zone Monitoring</span>
        </div>
        <div className="neu-card" style={{ padding: 0, overflow: 'hidden', position: 'relative', height: 180 }}>
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, var(--blue-bg) 0%, var(--green-bg) 50%, var(--yellow-bg) 100%)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: 16,
            position: 'relative'
          }}>
            <div style={{ position: 'absolute', top: 40, left: '30%', width: 12, height: 12, borderRadius: '50%', background: 'var(--blue)', boxShadow: '0 0 0 4px rgba(59,130,246,0.2)' }} />
            <div style={{ position: 'absolute', top: 70, left: '50%', width: 12, height: 12, borderRadius: '50%', background: 'var(--coral)', boxShadow: '0 0 0 4px rgba(249,112,102,0.2)' }} />
            <div style={{ position: 'absolute', top: 55, left: '65%', width: 12, height: 12, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 0 4px rgba(16,185,129,0.2)' }} />
            <div style={{ position: 'absolute', top: 90, left: '40%', width: 12, height: 12, borderRadius: '50%', background: 'var(--yellow)', boxShadow: '0 0 0 4px rgba(245,158,11,0.2)' }} />
            <div style={{
              background: 'rgba(255,255,255,0.85)', borderRadius: 10, padding: '8px 14px',
              fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)',
              backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: 4,
              boxShadow: 'var(--neu-raised-sm)'
            }}>
              <MapPin size={12} /> Live Zone Coverage
            </div>
            <button style={{
              width: 46, height: 46, borderRadius: '50%', background: 'var(--blue)',
              color: 'white', border: 'none', cursor: 'pointer', fontSize: 22,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(59,130,246,0.4)'
            }}>+</button>
          </div>
        </div>
      </div>

      {/* Management Hub */}
      <div className="animate-in animate-in-delay-4" style={{ marginBottom: 20 }}>
        <div className="section-header">
          <span className="section-title">Management Hub</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <HubCard icon="👤" title="Manage Staff" desc="Add, edit profiles & schedules" color="var(--purple)" bgColor="var(--purple-light)" />
          <HubCard icon="📦" title="Inventory Management" desc="Restock alerts & tracking" color="var(--coral)" bgColor="var(--coral-light)" />
          <HubCard icon="📋" title="System Logs" desc="View all system activities" color="var(--green)" bgColor="var(--green-light)" />

          <button className="neu-card" style={{
            textAlign: 'center', padding: '18px 16px', cursor: 'pointer', width: '100%',
            fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit',
            borderRadius: 'var(--radius)', border: 'none'
          }}>
            Export Monthly Report
          </button>
        </div>
      </div>
    </div>
  );
};

const HubCard: React.FC<{ icon: string; title: string; desc: string; color: string; bgColor: string }> = ({ icon, title, desc, bgColor }) => (
  <div className="neu-card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 18px', cursor: 'pointer' }}>
    <div style={{
      width: 46, height: 46, borderRadius: 14, background: bgColor,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
    }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
    </div>
    <div>
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</div>
      <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>{desc}</div>
    </div>
  </div>
);

const SupplyCard: React.FC<{ item: string; requester: string; time: string; onApprove: () => void; onReject: () => void }> = ({
  item, requester, time, onApprove, onReject
}) => (
  <div className="neu-card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px' }}>
    <div style={{
      width: 42, height: 42, borderRadius: 14, background: 'var(--green-light)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
    }}>
      <span style={{ fontSize: 18 }}>📦</span>
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item}</div>
      <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)' }}>Requested by {requester} · {time}</div>
    </div>
    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
      <button onClick={onReject} className="btn-approve" style={{ background: 'var(--coral-light)', color: 'var(--coral)' }}>
        <X size={14} />
      </button>
      <button onClick={onApprove} className="btn-approve" style={{ background: 'var(--green-light)', color: 'var(--green)' }}>
        <Check size={14} />
      </button>
    </div>
  </div>
);

export default Dashboard;
