export const TaskStatus = {
    ToDo: 'ToDo',
    InProgress: 'InProgress',
    Testing: 'Testing',
    Completed: 'Completed',
  };
  
  export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];