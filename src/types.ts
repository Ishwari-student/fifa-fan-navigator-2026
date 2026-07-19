export type Zone = 'North' | 'East' | 'South' | 'West';

export type Gate = 'Gate A' | 'Gate B' | 'Gate C' | 'Gate D' | 'Gate E' | 'Gate F' | 'Gate G' | 'Gate H';

export type AmenityType = 'concessions' | 'restrooms' | 'first-aid' | 'souvenirs';

export interface Amenity {
  id: string;
  name: string;
  type: AmenityType;
  zone: Zone;
  level: string;
  description: string;
  coordinates: { x: number; y: number }; // Relative coordinates for SVG Map overlay
}

export interface TransitOption {
  id: string;
  name: string;
  type: 'shuttle' | 'metro' | 'rideshare';
  gate: string;
  walkingTime: string;
  safeRoute: string;
  safetyWarning: string;
  operatingHours: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  isEmergency?: boolean;
}
