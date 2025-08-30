import { useState } from "react";
import { Bell, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export interface TaskAlarm {
  id: string;
  taskId: string;
  enabled: boolean;
  time: string; // HH:mm format
  minutesBefore: number;
  notificationGranted: boolean;
}

interface AlarmSettingsProps {
  taskId: string;
  taskText: string;
  alarm?: TaskAlarm;
  onAlarmUpdate: (alarm: TaskAlarm | null) => void;
}

export const AlarmSettings = ({ taskId, taskText, alarm, onAlarmUpdate }: AlarmSettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState(alarm?.time || "09:00");
  const [minutesBefore, setMinutesBefore] = useState(alarm?.minutesBefore || 15);
  const [enabled, setEnabled] = useState(alarm?.enabled || false);
  const { toast } = useToast();

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return false;
  };

  const scheduleNotification = (alarmData: TaskAlarm) => {
    if (!alarmData.enabled || !alarmData.notificationGranted) return;

    // Calculate notification time
    const [hours, minutes] = alarmData.time.split(':').map(Number);
    const notificationTime = new Date();
    notificationTime.setHours(hours, minutes - alarmData.minutesBefore, 0, 0);

    // If the time has already passed today, schedule for tomorrow
    if (notificationTime <= new Date()) {
      notificationTime.setDate(notificationTime.getDate() + 1);
    }

    const timeUntilNotification = notificationTime.getTime() - Date.now();

    if (timeUntilNotification > 0) {
      setTimeout(() => {
        new Notification(`Task Reminder: ${taskText}`, {
          body: `Scheduled for ${alarmData.time} - ${alarmData.minutesBefore} minutes before`,
          icon: "/favicon.ico",
          tag: `task-${taskId}`
        });
      }, timeUntilNotification);

      toast({
        title: "Alarm scheduled",
        description: `You'll be notified ${minutesBefore} minutes before ${time}`,
      });
    }
  };

  const handleSave = async () => {
    let notificationGranted = false;
    
    if (enabled) {
      notificationGranted = await requestNotificationPermission();
      if (!notificationGranted) {
        toast({
          title: "Notification permission denied",
          description: "Please enable notifications in your browser settings to receive task reminders.",
          variant: "destructive",
        });
        setEnabled(false);
        return;
      }
    }

    const alarmData: TaskAlarm = {
      id: alarm?.id || Date.now().toString(),
      taskId,
      enabled,
      time,
      minutesBefore,
      notificationGranted
    };

    onAlarmUpdate(enabled ? alarmData : null);
    
    if (enabled && notificationGranted) {
      scheduleNotification(alarmData);
    }

    setIsOpen(false);
    
    toast({
      title: enabled ? "Alarm set" : "Alarm disabled",
      description: enabled 
        ? `Task reminder set for ${time} (${minutesBefore} minutes before)`
        : "Task alarm has been disabled",
    });
  };

  const handleRemove = () => {
    onAlarmUpdate(null);
    setEnabled(false);
    setIsOpen(false);
    toast({
      title: "Alarm removed",
      description: "Task reminder has been removed",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className={`h-8 w-8 p-0 transition-all duration-smooth ${
            alarm?.enabled 
              ? "bg-primary-soft text-primary hover:bg-primary hover:text-primary-foreground" 
              : "hover:bg-primary-soft hover:text-primary"
          }`}
        >
          <Bell className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Task Reminder
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium">{taskText}</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Enable Reminder</Label>
              <p className="text-sm text-muted-foreground">Get notified before this task</p>
            </div>
            <Switch
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </div>

          {enabled && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time">Task Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="before">Notify Before</Label>
                  <Select value={minutesBefore.toString()} onValueChange={(value) => setMinutesBefore(Number(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-4 bg-primary-soft rounded-lg">
                <p className="text-sm text-primary">
                  <strong>Reminder:</strong> {time} - {minutesBefore} minutes = {
                    (() => {
                      const [hours, minutes] = time.split(':').map(Number);
                      const reminderTime = new Date();
                      reminderTime.setHours(hours, minutes - minutesBefore);
                      return reminderTime.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                      });
                    })()
                  }
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            {alarm && (
              <Button variant="destructive" onClick={handleRemove}>
                <X className="w-4 h-4 mr-2" />
                Remove Alarm
              </Button>
            )}
            <Button onClick={handleSave} className="bg-gradient-primary">
              {enabled ? "Set Reminder" : "Disable"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};