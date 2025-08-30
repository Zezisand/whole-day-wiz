import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TaskInputProps {
  onAddTask: (text: string) => void;
}

export const TaskInput = ({ onAddTask }: TaskInputProps) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTask(text.trim());
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1 border-border focus:border-primary focus:ring-primary-glow transition-all duration-smooth"
      />
      <Button 
        type="submit"
        size="lg"
        className="bg-gradient-primary hover:shadow-glow transition-all duration-smooth hover:scale-105"
      >
        <Plus className="w-5 h-5" />
      </Button>
    </form>
  );
};