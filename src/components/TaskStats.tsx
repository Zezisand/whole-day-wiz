import { CheckCircle, Circle, Target } from "lucide-react";
import { Task } from "./TaskItem";

interface TaskStatsProps {
  tasks: Task[];
}

export const TaskStats = ({ tasks }: TaskStatsProps) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="flex items-center gap-3 p-4 bg-gradient-card rounded-lg border shadow-soft">
        <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center">
          <Circle className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{totalTasks}</p>
          <p className="text-sm text-muted-foreground">Total Tasks</p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-gradient-card rounded-lg border shadow-soft">
        <div className="w-10 h-10 rounded-full bg-success-soft flex items-center justify-center">
          <CheckCircle className="w-5 h-5 text-success" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{completedTasks}</p>
          <p className="text-sm text-muted-foreground">Completed</p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-gradient-card rounded-lg border shadow-soft">
        <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center">
          <Target className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{completionRate}%</p>
          <p className="text-sm text-muted-foreground">Complete</p>
        </div>
      </div>
    </div>
  );
};