import { useState } from "react";
import { Check, X, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AlarmSettings, TaskAlarm } from "./AlarmSettings";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  alarm?: TaskAlarm;
}

interface TaskItemProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onAlarmUpdate: (id: string, alarm: TaskAlarm | null) => void;
}

export const TaskItem = ({ task, onUpdate, onDelete, onAlarmUpdate }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleToggleComplete = () => {
    onUpdate(task.id, { completed: !task.completed });
  };

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onUpdate(task.id, { text: editText.trim() });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditText(task.text);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className={cn(
      "group flex items-center gap-3 p-4 rounded-lg border bg-gradient-card transition-all duration-smooth hover:shadow-soft",
      task.completed ? "bg-success-soft border-success/20" : "bg-card border-border"
    )}>
      {/* Checkbox */}
      <button
        onClick={handleToggleComplete}
        className={cn(
          "w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-smooth hover:scale-110",
          task.completed 
            ? "bg-gradient-success border-success text-success-foreground shadow-glow" 
            : "border-border hover:border-primary"
        )}
      >
        {task.completed && <Check className="w-3 h-3" />}
      </button>

      {/* Task content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleSaveEdit}
            className="border-primary ring-primary-glow"
            autoFocus
          />
        ) : (
          <span
            className={cn(
              "block text-sm font-medium cursor-pointer transition-all duration-smooth",
              task.completed 
                ? "text-muted-foreground line-through" 
                : "text-foreground hover:text-primary"
            )}
            onClick={() => setIsEditing(true)}
          >
            {task.text}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-smooth">
        {isEditing ? (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSaveEdit}
              className="h-8 w-8 p-0 hover:bg-success-soft hover:text-success"
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancelEdit}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <>
            <AlarmSettings
              taskId={task.id}
              taskText={task.text}
              alarm={task.alarm}
              onAlarmUpdate={(alarm) => onAlarmUpdate(task.id, alarm)}
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0 hover:bg-primary-soft hover:text-primary"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(task.id)}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export type { Task };