export interface Task {
  id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  user: { id: number; name: string };
}
