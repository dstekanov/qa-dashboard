export interface Feature {
  type: string;
  test_cases_count: string;
  status: 'passed' | 'failed';
}

export interface TestResult {
  datetime: string;
  features: Feature[];
}

export interface ResultsData {
  [date: string]: Feature[];
} 