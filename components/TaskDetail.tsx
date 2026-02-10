import React, { useState, useRef } from 'react';
import { TaskDefinition, TaskLog, StaffMember, SupplyRequest } from '../types';
import { getTaskIcon } from '../constants';
import { ArrowLeft, Play, Check, Camera, MapPin, Clock, Upload, Loader2 } from 'lucide-react';

import { uploadImageToCloudinary } from '../services/cloudinaryService';

interface TaskDetailProps {
    task: TaskDefinition;
    currentUser: number;
    logs: TaskLog[];
    onLogTask: (log: Omit<TaskLog, 'id'>) => void;
    onBack: () => void;
    supplyRequests: SupplyRequest[];
    onSupplyRequest: (req: Omit<SupplyRequest, 'id'>) => void;
    staffMembers: StaffMember[];
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task, currentUser, logs, onLogTask, onBack, supplyRequests, onSupplyRequest, staffMembers }) => {
    const [photos, setPhotos] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [supplyQty, setSupplyQty] = useState<Record<string, number>>({ 'Garbage Bags (L)': 0, 'Glass Detergent': 0 });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const requiredPhotos = 4;

    const todaysLogs = logs.filter(l => l.timestamp >= new Date().setHours(0, 0, 0, 0));
    const taskLog = todaysLogs.find(l => l.taskId === task.id);
    const isDone = !!taskLog;

    const handleAddPhoto = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result as string;
            let cloudinaryUrl = base64String;
            setUploading(true);
            try {
                const staffName = staffMembers.find(s => s.id === currentUser)?.name.replace(/\s+/g, '_') || 'unknown';
                const folder = `societyclean/proof-of-work/${staffName}`;
                const uploadResult = await uploadImageToCloudinary(base64String, folder);
                cloudinaryUrl = uploadResult.secure_url;
            } catch (err) {
                // Fallback to base64 preview
            } finally {
                setUploading(false);
            }

            setPhotos(prev => [...prev, cloudinaryUrl]);

            if (photos.length + 1 >= 2) {
                onLogTask({
                    taskId: task.id,
                    staffId: currentUser,
                    timestamp: Date.now(),
                    status: 'COMPLETED',
                    imageUrl: cloudinaryUrl
                });
            }
        };
        reader.readAsDataURL(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleComplete = () => {
        onLogTask({
            taskId: task.id,
            staffId: currentUser,
            timestamp: Date.now(),
            status: 'COMPLETED',
        });
    };

    const handleSubmitSupplies = () => {
        const entries: [string, number][] = Object.entries(supplyQty);
        entries.forEach(([item, qty]) => {
            if (qty > 0) {
                onSupplyRequest({
                    item,
                    quantity: String(qty),
                    urgency: 'MEDIUM',
                    status: 'OPEN',
                    requesterId: currentUser,
                    timestamp: Date.now(),
                });
            }
        });
        setSupplyQty({ 'Garbage Bags (L)': 0, 'Glass Detergent': 0 });
    };

    return (
        <div style={{ paddingBottom: 16 }}>

            {/* Header with Back */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0 16px', marginTop: -8 }}>
                <button onClick={onBack} className="btn-icon">
                    <ArrowLeft size={22} />
                </button>
                <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>Task Update</span>
                <div style={{ width: 42 }} />
            </div>

            {/* Task Info */}
            <div className="neu-card animate-in" style={{ marginBottom: 18, padding: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span className="badge badge-green">{isDone ? 'COMPLETED' : 'IN PROGRESS'}</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} /> Started 12m ago
                    </span>
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
                    {task.title}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }}>
                    <MapPin size={14} /> {task.area}
                </div>
            </div>

            {/* Action Buttons */}
            {!isDone && (
                <div className="animate-in animate-in-delay-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 22 }}>
                    <div className="neu-card" style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                        padding: 22, cursor: 'pointer', textAlign: 'center'
                    }}>
                        <div style={{
                            width: 54, height: 54, borderRadius: '50%', background: 'var(--blue)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                            boxShadow: '0 4px 14px rgba(59,130,246,0.3)'
                        }}>
                            <Play size={22} fill="white" />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Start Task</span>
                    </div>
                    <button
                        onClick={handleComplete}
                        className="neu-card"
                        style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                            padding: 22, cursor: 'pointer', textAlign: 'center', border: 'none', fontFamily: 'inherit'
                        }}
                    >
                        <div style={{
                            width: 54, height: 54, borderRadius: '50%', background: 'var(--green)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                            boxShadow: '0 4px 14px rgba(16,185,129,0.3)'
                        }}>
                            <Check size={22} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Complete</span>
                    </button>
                </div>
            )}

            {isDone && (
                <div className="neu-card animate-in animate-in-delay-1" style={{ marginBottom: 22, textAlign: 'center', padding: 24, background: 'var(--green-bg)' }}>
                    <Check size={32} color="#10b981" style={{ marginBottom: 8 }} />
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--green)' }}>Task Completed!</div>
                    {taskLog?.aiFeedback && (
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8, padding: '10px 14px', background: 'var(--bg-card)', borderRadius: 12, boxShadow: 'var(--neu-inset-sm)' }}>
                            🤖 {taskLog.aiFeedback}
                        </div>
                    )}
                </div>
            )}

            {/* Proof of Work */}
            <div className="animate-in animate-in-delay-2" style={{ marginBottom: 22 }}>
                <div className="section-header">
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Proof of Work</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--coral)' }}>{photos.length}/{requiredPhotos} Required</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {photos.map((photo, idx) => (
                        <div key={idx} className="neu-card" style={{
                            aspectRatio: '1', padding: 4, overflow: 'hidden'
                        }}>
                            <img src={photo} alt={`Proof ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 14 }} />
                        </div>
                    ))}
                    {photos.length < requiredPhotos && (
                        <button
                            onClick={handleAddPhoto}
                            className="neu-card-inset"
                            style={{
                                aspectRatio: '1', border: 'none',
                                cursor: 'pointer',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                gap: 6, color: 'var(--text-muted)', transition: 'all 0.2s', fontFamily: 'inherit'
                            }}
                        >
                            {uploading ? <Loader2 size={22} className="spin" /> : <Camera size={24} />}
                            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                {uploading ? 'Uploading...' : 'Add Photo'}
                            </span>
                        </button>
                    )}
                </div>
                <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
            </div>

            {/* Request Supplies */}
            <div className="neu-card animate-in animate-in-delay-3" style={{ padding: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 14, background: 'var(--coral)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0
                    }}>
                        📦
                    </div>
                    <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Request Supplies</div>
                        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>Items needed for this location</div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18 }}>
                    {Object.entries(supplyQty).map(([item, qty]) => (
                        <div key={item} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{item}</span>
                            <div className="stepper">
                                <button className="stepper-btn" onClick={() => setSupplyQty(prev => ({ ...prev, [item]: Math.max(0, prev[item] - 1) }))}>−</button>
                                <span className="stepper-value">{qty}</span>
                                <button className="stepper-btn" onClick={() => setSupplyQty(prev => ({ ...prev, [item]: prev[item] + 1 }))}>+</button>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleSubmitSupplies}
                    disabled={!(Object.values(supplyQty) as number[]).some(v => v > 0)}
                    className="btn btn-coral"
                    style={{
                        width: '100%', padding: '14px', fontSize: 14, fontWeight: 700, borderRadius: 14,
                        opacity: (Object.values(supplyQty) as number[]).some(v => v > 0) ? 1 : 0.5,
                    }}
                >
                    Submit Request
                </button>
            </div>
        </div>
    );
};

export default TaskDetail;
