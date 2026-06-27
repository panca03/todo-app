export interface Notification {
  id: number;
  type: 'due_date_reminder' | 'task_completed';
  title: string;
  message: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}
