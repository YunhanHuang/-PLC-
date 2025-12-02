import React from 'react';
import { SystemData } from '../types';
import { InfoCard } from './InfoCard';
import { Anchor, Brain, CheckCircle2, Cpu, Database, Droplets, Gauge, MapPin, Scale, Send, Sparkles, Wifi, Zap } from 'lucide-react';

interface ControlPanelProps {
  data: SystemData;
  activeSensor: string | null;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ data, activeSensor }) => {
  const getHighlightClass = (id: string) => {
    return activeSensor === id ? 'ring-2 ring-yellow-400 scale-105 transition-transform' : 'opacity-90';
  };

  const torqueDiff = Math.abs(data.torque1 - data.torque2);
  const isBalanced = torqueDiff < 5;
  
  // Indicator 3: Calculation (Max absolute tilt)
  const maxTilt = Math.max(Math.abs(data.tiltX), Math.abs(data.tiltY));
  const isLevelQualified = maxTilt <= 1.0;

  // Indicator 2: Latency Check
  const isLatencyQualified = data.aiLatency <= 1.0;

  return (
    <div className="h-full flex flex-col gap-4 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
      
      {/* 1. AI Machine Learning Core Module (Indicator 2 Highlight) */}
      <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-xl p-4 border border-indigo-500/30 shadow-lg relative overflow-hidden group">
         {/* Background Effect */}
         <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all"></div>
         
         <div className="flex items-center gap-2 mb-3 border-b border-indigo-500/30 pb-2">
            <Brain className="text-indigo-400 animate-pulse" size={20} />
            <h2 className="text-lg font-bold text-white tracking-wide">AI 决策核心</h2>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full ml-auto border border-indigo-500/30">
                MODEL V2.4
            </span>
         </div>

         <div className="space-y-4">
            {/* Indicator 2: Mechanism-Data Dual-Driven Latency */}
            <div className="bg-indigo-950/40 rounded p-2 border border-indigo-500/10">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-indigo-300 uppercase font-bold">机理-数据双驱动响应时差</span>
                    <div className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border ${isLatencyQualified ? 'bg-green-500/20 border-green-500/40 text-green-400' : 'bg-red-500/20 border-red-500/40 text-red-400'}`}>
                        {isLatencyQualified ? <CheckCircle2 size={10}/> : null}
                        {isLatencyQualified ? '指标2 合规' : '超标'}
                    </div>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-mono font-bold text-white">{data.aiLatency.toFixed(3)}</span>
                    <span className="text-xs text-slate-400">秒 (≤ 1s)</span>
                </div>
            </div>

            {/* Smart Suggestion */}
            <div className="flex gap-3 items-start bg-indigo-950/50 p-2 rounded border border-indigo-500/20">
                <Sparkles className="text-yellow-400 shrink-0 mt-0.5" size={14} />
                <div>
                    <div className="text-[10px] text-indigo-300 uppercase font-bold mb-0.5">AI 优化建议</div>
                    <div className="text-xs text-white leading-tight">{data.mlSuggestion}</div>
                </div>
            </div>
         </div>
      </div>

      {/* 2. Dynamic Water Self-Balancing System (Indicator 3 Highlight) */}
      <div className="relative bg-slate-900/50 rounded-xl p-4 border border-slate-700 flex-1 flex flex-col gap-4">
        
         <div className="flex items-center gap-2 mb-1">
            <Scale className="text-blue-400" size={18} />
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wide">动态水域自平衡系统</h2>
         </div>

        {/* Dual Torque Balance Section */}
        <div className="bg-slate-800/50 rounded p-3 border border-slate-700">
           <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>双桩扭矩平衡</span>
              {data.isDrilling && (
                <span className={`text-[10px] px-2 py-0.5 rounded border ${isBalanced ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {isBalanced ? 'BALANCED' : 'SYNCING...'}
                </span>
              )}
           </h3>
           <div className="flex gap-2">
                <div className={`flex-1 ${getHighlightClass('torque1')}`}>
                     <InfoCard title="左桩扭矩" value={data.torque1.toFixed(1)} unit="kNm" color="border-blue-500" icon={<Zap size={14}/>} />
                </div>
                <div className={`flex-1 ${getHighlightClass('torque2')}`}>
                     <InfoCard title="右桩扭矩" value={data.torque2.toFixed(1)} unit="kNm" color="border-blue-500" icon={<Zap size={14}/>} />
                </div>
           </div>
        </div>

        {/* Indicator 3: Levelness/Verticality */}
        <div className={`bg-slate-800/50 rounded p-3 border ${isLevelQualified ? 'border-slate-700' : 'border-red-500/50'} ${getHighlightClass('tilt')}`}>
             <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">自平衡施工水平度</span>
                <div className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border ${isLevelQualified ? 'bg-green-500/20 border-green-500/40 text-green-400' : 'bg-red-500/20 border-red-500/40 text-red-400'}`}>
                     {isLevelQualified ? <CheckCircle2 size={10}/> : null}
                     {isLevelQualified ? '指标3 合规' : '偏差过大'}
                </div>
             </div>
             
             <div className="flex gap-2">
                 <div className="flex-1 bg-slate-900/50 p-2 rounded border border-slate-700/50">
                    <div className="text-[10px] text-slate-500">最大偏差</div>
                    <div className={`text-xl font-mono font-bold ${isLevelQualified ? 'text-white' : 'text-red-400'}`}>
                        {maxTilt.toFixed(2)}°
                    </div>
                 </div>
                 <div className="flex-1 space-y-1">
                     <div className="flex justify-between text-[10px] text-slate-400 border-b border-slate-700/50 pb-1">
                        <span>X轴倾角</span>
                        <span className="font-mono text-white">{data.tiltX.toFixed(2)}°</span>
                     </div>
                     <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Y轴倾角</span>
                        <span className="font-mono text-white">{data.tiltY.toFixed(2)}°</span>
                     </div>
                 </div>
             </div>
             <div className="text-[10px] text-slate-500 mt-2 text-right">要求: ≤ 1° (动态双向)</div>
        </div>

        {/* Other Sensors */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
           <div className={`grid grid-cols-2 gap-2 ${getHighlightClass('flow')}`}>
            <InfoCard 
                title="注浆流量" 
                value={data.groutFlow.toFixed(1)} 
                unit="L/min" 
                color="border-cyan-500" 
                icon={<Droplets size={16} />}
            />
            <InfoCard 
                title="深度" 
                value={data.depth.toFixed(2)} 
                unit="m" 
                color="border-purple-500"
                icon={<Anchor size={16} />} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};