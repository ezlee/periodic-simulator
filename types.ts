export interface ElementData {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: number;
  category: string;
  group: number;
  period: number;
  block: 's' | 'p' | 'd' | 'f';
  electronConfiguration: string;
  shells: number[];
  summary: string;
}

export interface AIInsight {
  funFact: string;
  realWorldUse: string;
  bondingBehavior: string;
}

export enum ElementCategory {
  ALKALI_METAL = 'Alkali Metal',
  ALKALINE_EARTH_METAL = 'Alkaline Earth Metal',
  TRANSITION_METAL = 'Transition Metal',
  POST_TRANSITION_METAL = 'Post-transition Metal',
  METALLOID = 'Metalloid',
  REACTIVE_NONMETAL = 'Reactive Nonmetal',
  NOBLE_GAS = 'Noble Gas',
  LANTHANIDE = 'Lanthanide',
  ACTINIDE = 'Actinide',
  UNKNOWN = 'Unknown'
}