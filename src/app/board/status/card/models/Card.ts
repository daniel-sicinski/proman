interface Task {
  task_name: string;
  completed: boolean;
}

interface Checklist {
  tasks: Task[];
  title: string;
}

export interface Card {
  title: string;
  description: string;
  order: number;
  id?: string;
  due_date: Date;
  checklist: Checklist;
}
