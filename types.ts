
export type Operation = '+' | '-' | '*' | '/' | '%' | '^' | null;

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export interface CalculatorState {
  display: string;
  previousValue: string | null;
  operation: Operation;
  shouldResetDisplay: boolean;
  history: HistoryItem[];
}
