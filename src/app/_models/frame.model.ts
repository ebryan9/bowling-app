export interface Frame {
  roll1: number;
  roll2: number;
  roll3?: number;
  score?: number;
}

export interface FrameTotals {
  cumulativeFrameScores: number[];
  frameScores: number[];
}
