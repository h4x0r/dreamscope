export interface GroundedIn {
  jungian: string;
  cognitive: string;
  clinical: string;
}

export interface DreamSymbol {
  id: string;
  label: string;
  quote: string;
  interpretation: string;
  groundedIn: GroundedIn;
}

export interface SymbolConnection {
  from: string;
  to: string;
  relationship: string;
}

export interface OverallAssessment {
  dominantTheme: string;
  stressIndicators: string[];
  normalization: string;
  strengthsNote: string;
  gentleInquiry: string;
  clinicalNote: string;
}

export interface DreamAnalysis {
  title: string;
  symbols: DreamSymbol[];
  connections: SymbolConnection[];
  overallAssessment: OverallAssessment;
  summary: string;
}
