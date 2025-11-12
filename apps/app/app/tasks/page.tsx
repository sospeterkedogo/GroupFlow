import React from 'react';
import { Plus, Search, Filter, ArrowUpDown, Check } from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';

// --- Data ---
const tasks = {
  overdue: [
    { id: 1, title: "Finalize research for Chapter 2", project: "History 101 Final Paper", projectColor: "accent", dueDate: "Due: Yesterday", isCompleted: false },
  ],
  today: [
    { id: 2, title: "Draft Chapter 3: Literature Review", project: "History 101 Final Paper", projectColor: "accent", dueDate: "Due: Today", isCompleted: false },
    { id: 3, title: "Create slide deck for presentation", project: "Marketing Campaign", projectColor: "secondary", dueDate: "Due: Today", isCompleted: false },
  ],
  thisWeek: [
    { id: 4, title: "Analyze titration results", project: "CHEM 221 Lab Report", projectColor: "info", dueDate: "Due: Tomorrow", isCompleted: false },
    { id: 5, title: "Implement user authentication flow", project: "CS Group Project", projectColor: "warning", dueDate: "Due: Oct 26", isCompleted: false },
  ],
  completed: [
    { id: 6, title: "Write introduction for lab report", project: "CHEM 221 Lab Report", projectColor: "info", dueDate: "", isCompleted: true },
  ],
};

interface Task {
  id: number;
  title: string;
  project: string;
  projectColor: string;
  dueDate: string;
  isCompleted: boolean;
}

// --- Task Item Component ---
const TaskItem = ({ task }: { task: Task }) => {
  const { title, project, projectColor, dueDate, isCompleted } = task;

  const dueDateClass =
    dueDate === "Due: Yesterday"
      ? "text-error"
      : "text-muted";

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg shadow-sm border ${
        isCompleted ? "opacity-70" : ""
      } bg-background border-border`}
    >
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={isCompleted}
          readOnly
          className="h-5 w-5 rounded focus:ring-2 accent-primary border-border"
        />
        <div>
          <p
            className={`font-medium ${
              isCompleted ? "text-muted line-through" : "text-foreground"
            }`}
          >
            {title}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={`h-2 w-2 rounded-full bg-${projectColor}`}
            ></span>
            <span className="text-sm text-muted">
              {project}
            </span>
          </div>
        </div>
      </div>

      {isCompleted ? (
        <span
          className="flex items-center gap-1.5 text-sm font-medium px-2 py-0.5 rounded-full text-success bg-border"
        >
          <Check className="w-4 h-4" />
          Done
        </span>
      ) : (
        <span
          className={`text-sm font-medium ${dueDateClass}`}
        >
          {dueDate}
        </span>
      )}
    </div>
  );
};

// --- Section Component ---
const Section = ({ title, tasks }: { title: string; tasks: Task[] }) => (
  <div>
    <h2
      className="text-xl font-semibold mb-4"
      style={{
        fontFamily: 'var(--font-heading)',
        color: 'var(--color-foreground)',
      }}
    >
      {title}
    </h2>
    <div className="space-y-3">
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  </div>
);

// --- Main Component ---
export default function App() {
  return (
    <DashboardLayout>
    <div
      className="min-h-screen p-4 sm:p-8"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-foreground)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <main className="w-full mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1
            className="text-2xl sm:text-3xl font-heading text-foreground font-extrabold ml-11"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-foreground)',
            }}
          >
            My Tasks
          </h1>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm transition-colors"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-background)',
            }}
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">New Task</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <div className="relative w-full sm:flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5" style={{ color: 'var(--color-muted)' }} />
            </div>
            <input
              type="text"
              placeholder="Search tasks by name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg shadow-sm border focus:outline-none focus:ring-2 focus:border-transparent"
              style={{
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-foreground)',
                borderColor: 'var(--color-border)',
                outlineColor: 'var(--color-primary)',
              }}
            />
          </div>

          <button
            className="flex w-full sm:w-auto justify-center items-center gap-2 px-4 py-2.5 rounded-lg shadow-sm border transition-colors"
            style={{
              backgroundColor: 'var(--color-background)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-foreground)',
            }}
          >
            <Filter className="w-5 h-5" style={{ color: 'var(--color-muted)' }} />
            <span className="font-medium">Filter</span>
          </button>

          <button
            className="flex w-full sm:w-auto justify-center items-center gap-2 px-4 py-2.5 rounded-lg shadow-sm border transition-colors"
            style={{
              backgroundColor: 'var(--color-background)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-foreground)',
            }}
          >
            <ArrowUpDown className="w-4 h-4" style={{ color: 'var(--color-muted)' }} />
            <span className="font-medium">
              Sort: <span style={{ color: 'var(--color-muted)' }}>Due Date</span>
            </span>
          </button>
        </div>

        <div className="space-y-8">
          <Section title="Overdue" tasks={tasks.overdue} />
          <Section title="Today" tasks={tasks.today} />
          <Section title="This Week" tasks={tasks.thisWeek} />
          <Section title="Completed" tasks={tasks.completed} />
        </div>
      </main>
    </div>
    </DashboardLayout>
  );
}