export type User = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  level?: string;
  userIconId: number;
  createdAt: string;
  updatedAt: string;
};

export type Member = {
  user: User;
  permission: string;
};

export type TableType = {
  columns: ColumnType[];
  title: string;
  users: User[];
  __v: number;
  _id: string;
};

export type ColumnType = {
  _id: string;
  title: string;
  pendingTasks: TaskType[];
  completedTasks: TaskType[];
  showCompletedTasks: boolean;
};

export type TaskType = {
  _id: string;
  title: string;
  completed: boolean;
  column: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  responsibleUsers: User[];
  isEstimated: boolean;
  difficulty: number;
  startDate: Date;
  endDate: Date | null;
};
