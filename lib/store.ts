import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type ViewMode = 'list' | 'cards';

export interface Note {
  id: string;
  taskId: string;
  title: string;
  content: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TagOrStatus {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  tags: string[];
  status: string;
  priority: Priority;
  reminder?: Date;
  notes: Note[];
  history: TaskHistory[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskHistory {
  id: string;
  taskId: string;
  action: string;
  timestamp: Date;
  details: string;
  previousValue?: string;
  newValue?: string;
}

const NOTE_COLORS = [
  'bg-blue-600',
  'bg-purple-600',
  'bg-pink-600',
  'bg-indigo-600',
  'bg-teal-600',
  'bg-emerald-600',
  'bg-amber-600',
  'bg-rose-600',
];

interface TaskStore {
  tasks: Task[];
  tags: TagOrStatus[];
  statuses: TagOrStatus[];
  viewMode: ViewMode;
  addTask: (task: Omit<Task, 'id' | 'notes' | 'history' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addNote: (taskId: string, note: { title: string; content: string }) => void;
  updateNote: (taskId: string, noteId: string, note: { title: string; content: string }) => void;
  deleteNote: (taskId: string, noteId: string) => void;
  addTag: (name: string, color: string) => void;
  updateTag: (id: string, data: { name: string; color: string }) => void;
  deleteTag: (id: string) => void;
  addStatus: (name: string, color: string) => void;
  updateStatus: (id: string, data: { name: string; color: string }) => void;
  deleteStatus: (id: string) => void;
  setViewMode: (mode: ViewMode) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      tags: [
        { id: uuidv4(), name: 'work', color: 'bg-blue-500' },
        { id: uuidv4(), name: 'personal', color: 'bg-purple-500' },
        { id: uuidv4(), name: 'shopping', color: 'bg-pink-500' },
      ],
      statuses: [
        { id: uuidv4(), name: 'todo', color: 'bg-slate-500' },
        { id: uuidv4(), name: 'in-progress', color: 'bg-amber-500' },
        { id: uuidv4(), name: 'done', color: 'bg-green-500' },
      ],
      viewMode: 'list',

      addTask: (task) => {
        const taskId = uuidv4();
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: taskId,
              notes: [],
              history: [
                {
                  id: uuidv4(),
                  taskId,
                  action: 'created',
                  timestamp: new Date(),
                  details: 'Task created',
                },
              ],
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        }));
      },

      updateTask: (id, updatedTask) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  ...updatedTask,
                  updatedAt: new Date(),
                  history: [
                    ...task.history,
                    {
                      id: uuidv4(),
                      taskId: task.id,
                      action: 'updated',
                      timestamp: new Date(),
                      details: 'Task updated',
                      previousValue: JSON.stringify(task),
                      newValue: JSON.stringify({ ...task, ...updatedTask }),
                    },
                  ],
                }
              : task
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      addNote: (taskId, { title, content }) => {
        const noteId = uuidv4();
        const timestamp = new Date();
        
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  notes: [
                    ...(task.notes || []),
                    {
                      id: noteId,
                      taskId,
                      title,
                      content,
                      color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
                      createdAt: timestamp,
                      updatedAt: timestamp,
                    },
                  ],
                  history: [
                    ...task.history,
                    {
                      id: uuidv4(),
                      taskId,
                      action: 'note-added',
                      timestamp,
                      details: `Added note: ${title}`,
                    },
                  ],
                }
              : task
          ),
        }));
      },

      updateNote: (taskId, noteId, { title, content }) => {
        const timestamp = new Date();
        
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  notes: (task.notes || []).map((note) =>
                    note.id === noteId
                      ? {
                          ...note,
                          title,
                          content,
                          updatedAt: timestamp,
                        }
                      : note
                  ),
                  history: [
                    ...task.history,
                    {
                      id: uuidv4(),
                      taskId,
                      action: 'note-updated',
                      timestamp,
                      details: `Updated note: ${title}`,
                    },
                  ],
                }
              : task
          ),
        }));
      },

      deleteNote: (taskId, noteId) => {
        const timestamp = new Date();
        const state = get();
        const task = state.tasks.find(t => t.id === taskId);
        const note = task?.notes?.find(n => n.id === noteId);
        
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  notes: (task.notes || []).filter((note) => note.id !== noteId),
                  history: [
                    ...task.history,
                    {
                      id: uuidv4(),
                      taskId,
                      action: 'note-deleted',
                      timestamp,
                      details: `Deleted note: ${note?.title || 'Unknown'}`,
                    },
                  ],
                }
              : task
          ),
        }));
      },

      addTag: (name, color) =>
        set((state) => ({
          tags: [...state.tags, { id: uuidv4(), name, color }],
        })),

      updateTag: (id, data) =>
        set((state) => ({
          tags: state.tags.map((tag) =>
            tag.id === id ? { ...tag, ...data } : tag
          ),
        })),

      deleteTag: (id) =>
        set((state) => ({
          tags: state.tags.filter((tag) => tag.id !== id),
        })),

      addStatus: (name, color) =>
        set((state) => ({
          statuses: [...state.statuses, { id: uuidv4(), name, color }],
        })),

      updateStatus: (id, data) =>
        set((state) => ({
          statuses: state.statuses.map((status) =>
            status.id === id ? { ...status, ...data } : status
          ),
        })),

      deleteStatus: (id) =>
        set((state) => ({
          statuses: state.statuses.filter((status) => status.id !== id),
        })),

      setViewMode: (mode) =>
        set(() => ({
          viewMode: mode,
        })),
    }),
    {
      name: 'task-store',
    }
  )
);