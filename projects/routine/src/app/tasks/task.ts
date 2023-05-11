export interface Task {
  id: string;
  createdAt: Date;
  title: string;
  content: string;
  dueDate?: Date;
  completedDate?: Date;
  children: Task[];
}