import React, { useState, useEffect } from 'react';
import { MachineSVG } from './components/MachineSVG';
import { ControlPanel } from './components/ControlPanel';
import { SystemData } from './types';

// Initial dummy data
const initialData: SystemData = {
  depth: 0,
  tiltX: 0.1,
  tiltY: -0.2,
  torque1: 0,
  torque2: 0,
  current: 0,
  groutFlow: 0,
  groutPressure: 0,
  latitude: 31.230416,
  longitude: 121.473701,
  isDrilling: false,
  isGrouting: false,
  mlEfficiency: 85,
  mlAnomalyScore: 2,
  mlSuggestion: '系统待机中',
  mlActive: true,
  aiLatency: 0.05,
};

const App: React.FC = () => {
  const [data, setData] = useState<SystemData>(initialData);
  const [activeSensor, setActiveSensor] = useState<string | null>(null);
  const [simState, setSimState] = useState<'IDLE' | 'DRILLING' | 'GROUTING'>('IDLE');

  // Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = { ...prev };
        
        // Add some noise to sensors
        // Indicator 3: Pile Levelness/Verticality <= 1 degree
        // Keep simulation mostly within 0.8 range, occasionally spiking to show monitoring
        newData.tiltX = 0.1 + (Math.random() - 0.5) * 0.4;
        newData.tiltY = -0.1 + (Math.random() - 0.5) * 0.4;
        
        newData.latitude += (Math.random() - 0.5) * 0.000001;
        newData.longitude += (Math.random() - 0.5) * 0.000001;
        
        // Indicator 2: Latency <= 1s. Simulate fast processing.
        newData.aiLatency = 0.35 + (Math.random() - 0.5) * 0.2; // ~0.25s to 0.45s

        if (simState === 'IDLE') {
           newData.current = 10 + Math.random() * 5;
           newData.torque1 = 0;
           newData.torque2 = 0;
           newData.isDrilling = false;
           newData.isGrouting = false;
           newData.groutFlow = 0;
           newData.groutPressure = 0;
           newData.mlEfficiency = 98;
           newData.mlAnomalyScore = 1;
           newData.mlSuggestion = "设备状态良好，准备就绪";
           if (newData.depth > 0) newData.depth = Math.max(0, newData.depth - 0.1);
        } 
        else if (simState === 'DRILLING') {
           newData.isDrilling = true;
           newData.isGrouting = false;
           
           // Simulate Torque Balance System
           const baseTorque = 45;
           const noise = (Math.random() - 0.5) * 2;
           // The system tries to keep them equal
           newData.torque1 = baseTorque + noise + (Math.random() * 1);
           newData.torque2 = baseTorque + noise - (Math.random() * 1);
           
           newData.current = 150 + Math.random() * 20;
           newData.groutFlow = 0;
           newData.groutPressure = 0;
           
           // ML Simulation
           const torqueDiff = Math.abs(newData.torque1 - newData.torque2);
           newData.mlEfficiency = Math.max(70, 100 - torqueDiff * 2); // Efficiency drops if unbalanced
           newData.mlAnomalyScore = torqueDiff > 5 ? 45 : 2; 
           newData.mlSuggestion = torqueDiff > 3 ? "正在主动平衡双桩扭矩..." : "机理-数据双驱动模型运行中";

           if (newData.depth < 20) newData.depth += 0.05;
        } 
        else if (simState === 'GROUTING') {
           newData.isDrilling = true;
           newData.isGrouting = true;
           
           const baseTorque = 50;
           const noise = (Math.random() - 0.5) * 2;
           newData.torque1 = baseTorque + noise;
           newData.torque2 = baseTorque + noise;

           newData.current = 160 + Math.random() * 10;
           newData.groutFlow = 45 + Math.random() * 5; 
           newData.groutPressure = 2.5 + Math.random() * 0.2; 
           
           newData.mlEfficiency = 92 + (Math.random() - 0.5) * 5;
           newData.mlAnomalyScore = 3;
           newData.mlSuggestion = "注浆压力稳定，建议保持当前流速";

           if (newData.depth > 0) newData.depth -= 0.05;
        }

        return newData;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [simState]);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans">
      
      {/* Top Navigation / Branding */}
      <header className="flex-none h-16 bg-slate-900 border-b border-slate-800 flex items-center px-6 justify-between shadow-lg z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-lg shadow-blue-500/50 shadow-lg">P</div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white"><span className="text-blue-500">PLC</span>自平衡控制系统</h1>
            <p className="text-xs text-slate-400">基于耦合机器学习模型</p>
          </div>
        </div>
        
        {/* Simulation Controls */}
        <div className="flex gap-2">
            <button 
                onClick={() => setSimState('IDLE')}
                className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${simState === 'IDLE' ? 'bg-slate-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
                待机 (Idle)
            </button>
            <button 
                onClick={() => setSimState('DRILLING')}
                className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${simState === 'DRILLING' ? 'bg-orange-600 text-white animate-pulse shadow-orange-500/50 shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
                钻进 (Drilling)
            </button>
            <button 
                onClick={() => setSimState('GROUTING')}
                className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${simState === 'GROUTING' ? 'bg-cyan-600 text-white animate-pulse shadow-cyan-500/50 shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
                提钻注浆 (Grouting)
            </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Left: Visualization Scene */}
        <div className="flex-1 relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            {/* Overlay Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-5" 
                 style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
            </div>
            
            <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur px-3 py-1 rounded-full text-xs text-white border border-slate-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>AI 视觉监控激活</span>
            </div>

            <MachineSVG 
                data={data} 
                onSensorHover={setActiveSensor} 
            />
        </div>

        {/* Right: Control Dashboard */}
        <div className="w-96 flex-none bg-slate-900 border-l border-slate-800 z-10 shadow-2xl">
            <ControlPanel 
                data={data} 
                activeSensor={activeSensor} 
            />
        </div>

      </main>
    </div>
  );
};

export default App;