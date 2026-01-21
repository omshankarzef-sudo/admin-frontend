import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState } from "react";

const TIME_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM"
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

type ScheduleSlot = {
  subject: string;
  teacher: string;
  class: string;
};

type DaySchedule = {
  [time: string]: ScheduleSlot;
};

type Schedule = {
  [day: string]: DaySchedule;
};

// Mock schedule data
const INITIAL_SCHEDULE: Schedule = {
  "Monday": {
    "09:00 AM": { subject: "Math", teacher: "Sarah Wilson", class: "10-A" },
    "11:00 AM": { subject: "Physics", teacher: "Mike Brown", class: "10-A" },
  },
  "Tuesday": {
    "10:00 AM": { subject: "English", teacher: "Emily Clark", class: "10-A" },
  }
};

export default function TimetablePage() {
  const [selectedClass, setSelectedClass] = useState("10-A");

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Timetable</h1>
          <p className="text-muted-foreground mt-2">Manage weekly class schedules.</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10-A">Class 10-A</SelectItem>
              <SelectItem value="10-B">Class 10-B</SelectItem>
              <SelectItem value="11-A">Class 11-A</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Slot
          </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 border-b bg-muted/50 text-sm font-medium">
            <div className="p-4 border-r">Time / Day</div>
            {DAYS.map(day => (
              <div key={day} className="p-4 text-center border-r last:border-r-0">{day}</div>
            ))}
          </div>
          
          {TIME_SLOTS.map(time => (
            <div key={time} className="grid grid-cols-8 border-b last:border-b-0 text-sm">
              <div className="p-4 border-r font-medium text-muted-foreground bg-muted/20 flex items-center justify-center">
                {time}
              </div>
              {DAYS.map(day => {
                const daySchedule = INITIAL_SCHEDULE[day];
                const slot = daySchedule ? daySchedule[time] : undefined;
                
                return (
                  <div key={`${day}-${time}`} className="p-2 border-r last:border-r-0 min-h-[100px]">
                    {slot ? (
                      <Card className="h-full bg-primary/5 border-primary/20 p-2 flex flex-col justify-center gap-1 shadow-sm hover:shadow-md transition-all cursor-pointer">
                        <div className="font-bold text-primary">{slot.subject}</div>
                        <div className="text-xs text-muted-foreground">{slot.teacher}</div>
                      </Card>
                    ) : (
                      <div className="h-full w-full rounded-md border-2 border-dashed border-transparent hover:border-muted-foreground/20 flex items-center justify-center transition-all cursor-pointer group">
                        <Plus className="h-4 w-4 text-muted-foreground/0 group-hover:text-muted-foreground/50 transition-all" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
