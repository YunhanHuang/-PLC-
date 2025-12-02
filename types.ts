export interface SystemData {
  depth: number;       // Meters
  tiltX: number;       // Degrees
  tiltY: number;       // Degrees
  torque1: number;     // kNm (Left Motor)
  torque2: number;     // kNm (Right Motor)
  current: number;     // Amps (Total or Avg)
  groutFlow: number;   // L/min
  groutPressure: number; // MPa
  latitude: number;
  longitude: number;
  isDrilling: boolean;
  isGrouting: boolean;
  // ML Module Data
  mlEfficiency: number; // 0-100%
  mlAnomalyScore: number; // 0-100% (Low is good)
  mlSuggestion: string;
  mlActive: boolean;
  aiLatency: number;   // Seconds (Key Indicator 2)
}

export interface SensorNode {
  id: string;
  name: string;
  // Label Position (Fixed)
  labelX: number;
  labelY: number;
  // Target Position (Where the line points to - can be dynamic)
  targetX: number;
  targetY: number;
  
  value: string | number;
  unit: string;
  color: string;
  side: 'left' | 'right'; 
}