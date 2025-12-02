import React, { useEffect, useState } from 'react';
import { SystemData, SensorNode } from '../types';

interface MachineSVGProps {
  data: SystemData;
  onSensorHover: (sensorId: string | null) => void;
}

export const MachineSVG: React.FC<MachineSVGProps> = ({ data, onSensorHover }) => {
  const [drillY, setDrillY] = useState(200);

  // Map depth to Y position (2D view vertical)
  useEffect(() => {
    // Top: 200, Bottom: 450
    const minY = 200;
    const maxY = 450;
    const mappedY = minY + (data.depth / 20) * (maxY - minY);
    setDrillY(mappedY);
  }, [data.depth]);

  /**
   * Layout Strategy for Non-Overlapping Labels:
   * 
   * Left Label Column (X=120) - Evenly spaced vertically
   * 1. Depth Encoder (Y=150)
   * 2. Left Torque (Y=280)
   * 3. Platform Tilt (Y=410)
   * 
   * Right Label Column (X=680) - Evenly spaced vertically
   * 1. RTK GPS (Y=150)
   * 2. Right Torque (Y=280)
   * 3. Grout Flow (Y=410)
   * 
   * Connecting Lines will be drawn from these Fixed Labels to the Dynamic Machine Parts.
   */
  
  const sensors: SensorNode[] = [
    // Left Side Sensors
    { 
        id: 'depth', name: '深度编码器', 
        labelX: 120, labelY: 150, 
        targetX: 290, targetY: 150, // Fixed on frame
        value: data.depth.toFixed(1), unit: 'm', color: 'text-purple-400', side: 'left' 
    },
    { 
        id: 'torque1', name: '左桩扭矩 (AI)', 
        labelX: 120, labelY: 280, 
        targetX: 300, targetY: drillY, // Dynamic follow drill
        value: data.torque1.toFixed(1), unit: 'kNm', color: 'text-indigo-400', side: 'left' 
    },
    { 
        id: 'tilt', name: '平台倾角', 
        labelX: 120, labelY: 410, 
        targetX: 350, targetY: 460, // Fixed on pontoon
        value: data.tiltX.toFixed(1), unit: '°', color: 'text-orange-400', side: 'left' 
    },

    // Right Side Sensors
    { 
        id: 'rtk', name: 'RTK GPS', 
        labelX: 680, labelY: 150, 
        targetX: 400, targetY: 60, // Fixed on top
        value: 'FIXED', unit: '', color: 'text-blue-400', side: 'right' 
    },
    { 
        id: 'torque2', name: '右桩扭矩 (AI)', 
        labelX: 680, labelY: 280, 
        targetX: 500, targetY: drillY, // Dynamic follow drill
        value: data.torque2.toFixed(1), unit: 'kNm', color: 'text-indigo-400', side: 'right' 
    },
    { 
        id: 'flow', name: '注浆流量', 
        labelX: 680, labelY: 410, 
        targetX: 450, targetY: 480, // Fixed near water/pile interaction
        value: data.groutFlow.toFixed(0), unit: 'L/min', color: 'text-cyan-400', side: 'right' 
    },
  ];

  // Animation class selection based on state
  const getDrillAnimClass = () => {
    if (data.isGrouting) return "animate-drill-down"; // Reverse when coming up/grouting
    if (data.isDrilling) return "animate-drill-up";   // Normal drilling
    return "";
  };

  return (
    <svg viewBox="0 0 800 600" className="w-full h-full select-none bg-slate-900">
      <defs>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="50%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
         <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ca8a04" />
          <stop offset="50%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
        
        {/* Pattern for AI Brain connection */}
        <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
           <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(99, 102, 241, 0.1)" strokeWidth="1"/>
        </pattern>
        
        {/* Clip path for the drill shaft to keep scrolling blades contained */}
        <clipPath id="drillClip">
            <rect x="-30" y="0" width="60" height="250" />
        </clipPath>
      </defs>

      {/* Background */}
      <rect width="800" height="600" fill="url(#skyGradient)" />
      
      {/* Decorative AI Grid */}
      <rect width="800" height="600" fill="url(#gridPattern)" />

      {/* Water Level */}
      <rect x="0" y="480" width="800" height="120" fill="url(#waterGradient)" className="animate-pulse opacity-50" />
      <path d="M0,480 Q200,470 400,480 T800,480" fill="none" stroke="#38bdf8" strokeWidth="2" className="animate-wave" />

      {/* === MACHINE (FRONT ELEVATION VIEW) === */}
      {/* Centered at X=400 */}

      {/* 1. Pontoons (Left & Right) - Cross section/Front view */}
      <g transform="translate(0, 440)">
        {/* Left Pontoon */}
        <rect x="220" y="0" width="100" height="50" fill="#b45309" stroke="#78350f" strokeWidth="2" />
        <path d="M220,50 L220,70 L320,70 L320,50" fill="#334155" /> {/* Track bottom */}
        <rect x="230" y="55" width="80" height="10" fill="#1e293b" /> {/* Treads */}

        {/* Right Pontoon */}
        <rect x="480" y="0" width="100" height="50" fill="#b45309" stroke="#78350f" strokeWidth="2" />
        <path d="M480,50 L480,70 L580,70 L580,50" fill="#334155" />
        <rect x="490" y="55" width="80" height="10" fill="#1e293b" />
      </g>

      {/* 2. Main Platform Deck */}
      <g transform="translate(0, 440)">
        <rect x="220" y="-10" width="360" height="20" fill="url(#yellowGradient)" stroke="#b45309" />
      </g>

      {/* 3. Gantry Frame */}
      <g transform="translate(400, 440)">
        {/* Left Pillar */}
        <rect x="-120" y="-360" width="20" height="360" fill="url(#yellowGradient)" stroke="#ca8a04" />
        {/* Right Pillar */}
        <rect x="100" y="-360" width="20" height="360" fill="url(#yellowGradient)" stroke="#ca8a04" />
        {/* Top Beam */}
        <rect x="-130" y="-380" width="260" height="40" fill="url(#yellowGradient)" stroke="#ca8a04" />
        {/* Cross Bracing */}
        <line x1="-100" y1="-340" x2="100" y2="-280" stroke="#ca8a04" strokeWidth="4" />
        <line x1="-100" y1="-280" x2="100" y2="-340" stroke="#ca8a04" strokeWidth="4" />
        
        {/* GPS Receiver on Top */}
        <rect x="-10" y="-390" width="20" height="10" fill="#3b82f6" />
        <circle cx="0" cy="-395" r="2" fill="white" className="animate-ping" />
      </g>

      {/* 4. Drilling Mechanism (Dual Piles) */}
      <g>
         {/* Guide Rail / Connection Bar that moves up/down */}
         <rect x="290" y={drillY - 80} width="220" height="20" fill="#475569" rx="4" />
         
         {/* Torque Balance Indicator (Visual Connection) */}
         <path 
           d={`M330,${drillY - 70} L470,${drillY - 70}`} 
           stroke={Math.abs(data.torque1 - data.torque2) < 5 ? "#22c55e" : "#ef4444"} 
           strokeWidth="4" 
           strokeDasharray="4"
           className="animate-pulse"
         />
         <circle cx="400" cy={drillY - 70} r="8" fill="#0f172a" stroke="white" />
         <text x="400" y={drillY - 67} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">=</text>

         {/* Left Drill */}
         <g transform={`translate(300, ${drillY})`}>
            {/* Motor */}
            <rect x="-20" y="-60" width="40" height="50" fill="#dc2626" rx="4" />
            <text x="0" y="-35" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">L</text>
            
            {/* Shaft & Screw */}
            <rect x="-5" y="-10" width="10" height="260" fill="url(#metalGradient)" />
            
            {/* Thread Container with ClipPath */}
            <g clipPath="url(#drillClip)">
                <g className={getDrillAnimClass()}>
                     {/* Added extra blades for seamless scrolling */}
                     {Array.from({ length: 12 }).map((_, i) => (
                        <path 
                            key={i} 
                            d="M-20,0 Q0,10 20,0 L20,10 Q0,20 -20,10 Z" 
                            transform={`translate(0, ${i*25})`} 
                            fill="#cbd5e1" 
                            stroke="#475569" 
                            strokeWidth="0.5" 
                        />
                     ))}
                </g>
            </g>
            
            {/* Drill Tip */}
            <path d="M-5,250 L0,270 L5,250 Z" fill="#475569" />
         </g>

         {/* Right Drill */}
         <g transform={`translate(500, ${drillY})`}>
            {/* Motor */}
            <rect x="-20" y="-60" width="40" height="50" fill="#dc2626" rx="4" />
            <text x="0" y="-35" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">R</text>
            
            {/* Shaft & Screw */}
            <rect x="-5" y="-10" width="10" height="260" fill="url(#metalGradient)" />
            
             {/* Thread Container with ClipPath */}
            <g clipPath="url(#drillClip)">
                 <g className={getDrillAnimClass()}>
                     {Array.from({ length: 12 }).map((_, i) => (
                        <path 
                            key={i} 
                            d="M-20,0 Q0,10 20,0 L20,10 Q0,20 -20,10 Z" 
                            transform={`translate(0, ${i*25})`} 
                            fill="#cbd5e1" 
                            stroke="#475569" 
                            strokeWidth="0.5" 
                        />
                     ))}
                </g>
            </g>

            {/* Drill Tip */}
             <path d="M-5,250 L0,270 L5,250 Z" fill="#475569" />
         </g>
      </g>

      {/* 5. Cabin (Side Projection) */}
      <g transform="translate(600, 380)">
         <rect x="0" y="0" width="60" height="60" fill="url(#yellowGradient)" stroke="#b45309" />
         <rect x="10" y="10" width="40" height="30" fill="#1e293b" opacity="0.8" />
      </g>

      {/* 6. Grouting Effects */}
      {(data.isDrilling || data.isGrouting) && (
        <g>
           <circle cx="300" cy="480" r="20" fill="none" stroke="white" strokeWidth="2" opacity="0.5">
               <animate attributeName="r" from="10" to="40" dur="1.5s" repeatCount="indefinite" />
               <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
           </circle>
           <circle cx="500" cy="480" r="20" fill="none" stroke="white" strokeWidth="2" opacity="0.5">
               <animate attributeName="r" from="10" to="40" dur="1.5s" repeatCount="indefinite" />
               <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
           </circle>
        </g>
      )}

      {/* === LABELS (Fixed Position Grid System) === */}
      <g>
        {sensors.map((sensor) => {
            return (
              <g 
                key={sensor.id} 
                onMouseEnter={() => onSensorHover(sensor.id)}
                onMouseLeave={() => onSensorHover(null)}
                className="cursor-pointer group"
              >
                {/* 1. Connection Line (Dynamic) */}
                <path 
                    d={`M${sensor.labelX + (sensor.side === 'left' ? 60 : -60)},${sensor.labelY} L${sensor.targetX},${sensor.targetY}`} 
                    fill="none" 
                    stroke={sensor.color.replace('text-', 'stroke-').replace('-400', '-500')} 
                    strokeWidth="1.5" 
                    strokeDasharray="4"
                    opacity="0.6"
                    className="group-hover:opacity-100 group-hover:stroke-white transition-all"
                />
                
                {/* 2. Target Dot (Where line ends) */}
                <circle cx={sensor.targetX} cy={sensor.targetY} r="3" fill="white" className="animate-ping opacity-75" style={{animationDuration: '3s'}} />
                <circle cx={sensor.targetX} cy={sensor.targetY} r="3" fill={sensor.color.replace('text-', 'stroke-').replace('-400', '-500')} />

                {/* 3. Label Box (Fixed) */}
                <g transform={`translate(${sensor.labelX}, ${sensor.labelY})`}>
                    {/* Background Box */}
                    <rect 
                        x="-70" y="-20" width="140" height="40" 
                        fill="rgba(15, 23, 42, 0.95)" 
                        stroke={sensor.color.replace('text-', 'stroke-').replace('-400', '-600')} 
                        strokeWidth="1"
                        rx="6" 
                        className="shadow-xl group-hover:stroke-white transition-all"
                    />
                    
                    {/* Sensor Name */}
                    <text x="0" y="-2" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold" letterSpacing="0.5">
                        {sensor.name.toUpperCase()}
                    </text>
                    
                    {/* Sensor Value */}
                    <text x="0" y="12" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" className="font-mono">
                        {sensor.value} <tspan fontSize="10" fill="#64748b">{sensor.unit}</tspan>
                    </text>
                </g>
              </g>
            );
        })}
      </g>

    </svg>
  );
};