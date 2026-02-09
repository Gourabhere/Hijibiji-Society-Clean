import React, { useState } from 'react';
import { SupplyRequest, STAFF_MEMBERS } from '../types';
import { Package, Send, AlertCircle, Clock } from 'lucide-react';

interface SupplyRequestViewProps {
  currentUser: number;
  requests: SupplyRequest[];
  onRequest: (req: Omit<SupplyRequest, 'id'>) => void;
}

const SupplyRequestView: React.FC<SupplyRequestViewProps> = ({ currentUser, requests, onRequest }) => {
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [urgency, setUrgency] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !quantity) return;

    onRequest({
      item,
      quantity,
      urgency,
      status: 'OPEN',
      requesterId: currentUser,
      timestamp: Date.now()
    });

    setItem('');
    setQuantity('');
    setUrgency('LOW');
  };

  return (
    <div className="pb-24 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Supplies</h2>
        <p className="text-sm text-slate-500">Request detergents, brooms, and tools.</p>
      </div>

      {/* Request Form */}
      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <Package className="w-5 h-5 text-teal-600" />
          New Request
        </h3>
        
        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Item Name</label>
          <input 
            type="text" 
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="e.g. Floor Cleaner Liquid"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Quantity</label>
            <input 
              type="text" 
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 5 Liters"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>
          <div className="w-1/3">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Urgency</label>
            <select 
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Med</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>

        <button 
          type="submit"
          disabled={!item || !quantity}
          className="w-full bg-slate-900 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          Submit Request
        </button>
      </form>

      {/* History List */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">Recent Requests</h3>
        <div className="space-y-3">
          {requests.slice().reverse().map(req => (
            <div key={req.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-900">{req.item}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span>{req.quantity}</span>
                  <span>•</span>
                  <span className={`${
                    req.urgency === 'HIGH' ? 'text-red-600 font-bold' : 
                    req.urgency === 'MEDIUM' ? 'text-orange-600' : 'text-slate-500'
                  }`}>
                    {req.urgency} Priority
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Requested by {STAFF_MEMBERS.find(s => s.id === req.requesterId)?.name}
                </div>
              </div>
              <div className="text-right">
                 {req.status === 'FULFILLED' ? (
                   <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                     Done
                   </span>
                 ) : (
                   <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                     <Clock className="w-3 h-3" /> Open
                   </span>
                 )}
              </div>
            </div>
          ))}
          {requests.length === 0 && (
            <div className="text-center py-6 text-slate-400 text-sm">No supply requests yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplyRequestView;
