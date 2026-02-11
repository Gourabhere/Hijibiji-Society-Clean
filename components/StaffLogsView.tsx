"use client"
import React, { useMemo } from 'react';
import { TaskLog, StaffMember, TaskType } from '../types';
import { getTaskIcon } from '../constants';
import { Activity, Calendar, Award, Trash2, Wind, Sparkles } from 'lucide-react';

interface StaffLogsViewProps {
    currentUser: number;
    logs: TaskLog[];
    staffMembers: StaffMember[];
}

const StaffLogsView: React.FC<StaffLogsViewProps> = ({ currentUser, logs, staffMembers }) => {
    // Filter logs for current user
    const myLogs = useMemo(() => {
        return logs.filter(l => l.staffId === currentUser).sort((a, b) => b.timestamp - a.timestamp);
    }, [logs, currentUser]);

    const today = new Date().setHours(0, 0, 0, 0);
    const weekAgo = new Date().setDate(new Date().getDate() - 7);

    // Stats calculation
    const stats = useMemo(() => {
        const todayCount = myLogs.filter(l => l.timestamp >= today).length;
        const weekCount = myLogs.filter(l => l.timestamp >= weekAgo).length;

        // Breakdown
        const garbage = myLogs.filter(l => l.taskId.includes('garbage') || l.taskId.includes('trash')).length;
        const brooming = myLogs.filter(l => l.taskId.includes('broom') || l.taskId.includes('sweep')).length;
        const mopping = myLogs.filter(l => l.taskId.includes('mop')).length;
        const other = myLogs.length - garbage - brooming - mopping;

        return { todayCount, weekCount, breakdown: { garbage, brooming, mopping, other } };
    }, [myLogs, today, weekAgo]);

    // Group logs by date
    const groupedLogs = useMemo(() => {
        const groups: { [key: string]: TaskLog[] } = {};
        myLogs.forEach(log => {
            const date = new Date(log.timestamp).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
            });
            if (!groups[date]) groups[date] = [];
            groups[date].push(log);
        });
        return groups;
    }, [myLogs]);

    // Helper to determine task label from ID (simple heuristic since task definitions are dynamic now)
    const getTaskLabel = (taskId: string) => {
        if (taskId.includes('garbage')) return 'Garbage Collection';
        if (taskId.includes('broom')) return 'Brooming';
        if (taskId.includes('mop')) return 'Mopping';
        if (taskId.includes('glass')) return 'Glass Cleaning';
        if (taskId.includes('driveway')) return 'Driveway Cleaning';
        return 'Task Completed';
    };

    const getTaskType = (taskId: string): TaskType => {
        if (taskId.includes('garbage')) return TaskType.GARBAGE_COLLECTION;
        if (taskId.includes('broom')) return TaskType.BROOMING;
        if (taskId.includes('mop')) return TaskType.MOPPING;
        if (taskId.includes('glass')) return TaskType.GLASS_CLEANING;
        if (taskId.includes('driveway')) return TaskType.DRIVEWAY;
        return TaskType.GLASS_CLEANING; // Default fallback
    };

    return (
        <div className="animate-in">
            <div className="section-header">
                <span className="section-title">Performance Overview</span>
                <span className="section-label">LIVE STATS</span>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div className="neu-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '20px 16px' }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: '50%', background: 'var(--green-light)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
                        color: 'var(--green)'
                    }}>
                        <Activity size={24} />
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>{stats.todayCount}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 4 }}>Tasks Today</div>
                </div>

                <div className="neu-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '20px 16px' }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: '50%', background: 'var(--blue-light)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
                        color: 'var(--blue)'
                    }}>
                        <Calendar size={24} />
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>{stats.weekCount}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 4 }}>Tasks This Week</div>
                </div>
            </div>

            {/* Breakdown */}
            <div className="neu-card-inset" style={{ padding: 20, marginBottom: 24 }}>
                <div className="section-header" style={{ marginBottom: 16 }}>
                    <span className="section-label">WORK BREAKDOWN</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <StatItem icon={<Trash2 size={16} />} count={stats.breakdown.garbage} label="Garbage" color="var(--red)" />
                    <StatItem icon={<Wind size={16} />} count={stats.breakdown.brooming} label="Brooming" color="var(--orange)" />
                    <StatItem icon={<Sparkles size={16} />} count={stats.breakdown.mopping} label="Mopping" color="var(--blue)" />
                </div>
            </div>

            <div className="section-header">
                <span className="section-title">Activity History</span>
            </div>

            {/* History List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {Object.entries(groupedLogs).map(([date, dayLogs]) => (
                    <div key={date} className="animate-in">
                        <div style={{
                            fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase',
                            marginBottom: 12, letterSpacing: 0.5, paddingLeft: 4
                        }}>
                            {date === new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) ? 'Today' : date}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {dayLogs.map(log => (
                                <div key={log.id} className="neu-card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 16 }}>
                                    <div style={{ fontSize: 22 }}>
                                        {getTaskIcon(getTaskType(log.taskId))}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                                            {getTaskLabel(log.taskId)}
                                        </div>
                                        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', display: 'flex', gap: 6 }}>
                                            <span>
                                                {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                            </span>
                                            <span>·</span>
                                            <span>
                                                Block {log.block ? String.fromCharCode(64 + log.block) : '-'}
                                                {log.floor !== undefined ? `, Floor ${log.floor}` : ''}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{
                                        width: 24, height: 24, borderRadius: '50%', background: 'var(--green-light)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green)'
                                    }}>
                                        <Award size={14} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {myLogs.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: 40, marginBottom: 10 }}>📜</div>
                        <div style={{ fontWeight: 600 }}>No logs found</div>
                        <div style={{ fontSize: 12 }}>Get started by completing tasks!</div>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatItem: React.FC<{ icon: React.ReactNode; count: number; label: string; color: string }> = ({ icon, count, label, color }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div style={{
            width: 36, height: 36, borderRadius: 12, background: 'var(--bg-card)',
            boxShadow: 'var(--neu-raised-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: color
        }}>
            {icon}
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>{count}</div>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)' }}>{label}</div>
    </div>
);

export default StaffLogsView;
