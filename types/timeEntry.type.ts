export interface TimeEntry {
  _id: string;
  author: string;
  task: string;
  description?: string;
  difficulty: number;
  startTime: string;
  endTime?: string;
  duration?: number;
}