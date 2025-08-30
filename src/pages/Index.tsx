import { useState } from "react";
import { format } from "date-fns";
import { TaskItem, Task } from "@/components/TaskItem";
import { TaskInput } from "@/components/TaskInput";
import { DateSelector } from "@/components/DateSelector";
import { TaskStats } from "@/components/TaskStats";
import { TaskAlarm } from "@/components/AlarmSettings";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allTasks, setAllTasks] = useLocalStorage<Record<string, Task[]>>("daily-tasks", {});
  const { toast } = useToast();

  const dateKey = format(selectedDate, 'yyyy-MM-dd');
  const tasksForDate = allTasks[dateKey] || [];

  const addTask = (text: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date()
    };

    const updatedTasks = [...tasksForDate, newTask];
    setAllTasks(prev => ({
      ...prev,
      [dateKey]: updatedTasks
    }));

    toast({
      title: "Task added",
      description: "Your new task has been added successfully.",
    });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updatedTasks = tasksForDate.map(task =>
      task.id === id ? { ...task, ...updates } : task
    );
    
    setAllTasks(prev => ({
      ...prev,
      [dateKey]: updatedTasks
    }));

    if (updates.completed !== undefined) {
      toast({
        title: updates.completed ? "Task completed!" : "Task reopened",
        description: updates.completed ? "Great job finishing that task!" : "Task marked as incomplete.",
      });
    }
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasksForDate.filter(task => task.id !== id);
    setAllTasks(prev => ({
      ...prev,
      [dateKey]: updatedTasks
    }));

    toast({
      title: "Task deleted",
      description: "The task has been removed from your list.",
      variant: "destructive",
    });
  };

  const updateTaskAlarm = (id: string, alarm: TaskAlarm | null) => {
    const updatedTasks = tasksForDate.map(task =>
      task.id === id ? { ...task, alarm } : task
    );
    
    setAllTasks(prev => ({
      ...prev,
      [dateKey]: updatedTasks
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Daily Task Organizer
          </h1>
          <p className="text-lg text-muted-foreground">
            Plan your day, track your progress, achieve your goals
          </p>
        </div>

        {/* Date Navigation */}
        <div className="mb-8">
          <DateSelector
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>

        {/* Task Stats */}
        <div className="mb-8">
          <TaskStats tasks={tasksForDate} />
        </div>

        {/* Add Task Input */}
        <div className="mb-8">
          <TaskInput onAddTask={addTask} />
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {tasksForDate.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-primary-soft rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No tasks yet</h3>
              <p className="text-muted-foreground">
                Add your first task for {format(selectedDate, 'MMMM do')} to get started!
              </p>
            </div>
          ) : (
            <>
              {/* Incomplete tasks */}
              <div className="space-y-3">
                {tasksForDate
                  .filter(task => !task.completed)
                  .map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onUpdate={updateTask}
                      onDelete={deleteTask}
                      onAlarmUpdate={updateTaskAlarm}
                    />
                  ))}
              </div>

              {/* Completed tasks */}
              {tasksForDate.some(task => task.completed) && (
                <div className="pt-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                    <span className="w-4 h-4 bg-success rounded-full flex items-center justify-center">
                      <span className="text-xs text-success-foreground">✓</span>
                    </span>
                    Completed Tasks
                  </h3>
                  <div className="space-y-3">
                    {tasksForDate
                      .filter(task => task.completed)
                      .map(task => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onUpdate={updateTask}
                          onDelete={deleteTask}
                          onAlarmUpdate={updateTaskAlarm}
                        />
                      ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
