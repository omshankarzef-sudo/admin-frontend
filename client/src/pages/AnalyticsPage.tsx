import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useStore } from "@/lib/store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Users, GraduationCap, ClipboardList, CheckCircle } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsPage() {
  const { teachers, students, classes } = useStore();
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  const selectedTeacher = teachers.find(t => t.id === selectedTeacherId);
  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const performanceData = classes.map(c => ({
    name: c.name,
    score: Math.floor(Math.random() * 20) + 75 // Mock class score
  }));

  const attendanceData = [
    { name: 'Mon', present: 95, absent: 5 },
    { name: 'Tue', present: 92, absent: 8 },
    { name: 'Wed', present: 98, absent: 2 },
    { name: 'Thu', present: 94, absent: 6 },
    { name: 'Fri', present: 90, absent: 10 },
  ];

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Insights & Analytics</h1>
          <p className="text-muted-foreground mt-2">Deep dive into performance and operational metrics.</p>
        </div>
        <Button variant="outline" onClick={handleExport} className="print:hidden">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Teacher Insights Section */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Teacher Insights
            </CardTitle>
            <CardDescription>Select a teacher to view their performance wall</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedTeacher ? (
              <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="text-xs text-muted-foreground mb-1">Attendance</div>
                  <div className="text-xl font-bold">98%</div>
                </div>
                <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                  <div className="text-xs text-muted-foreground mb-1">Quizzes Created</div>
                  <div className="text-xl font-bold">{selectedTeacher.totalQuizzes || 0}</div>
                </div>
                <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/10">
                  <div className="text-xs text-muted-foreground mb-1">Classes Taken</div>
                  <div className="text-xl font-bold">{selectedTeacher.classes.length}</div>
                </div>
                <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/10">
                  <div className="text-xs text-muted-foreground mb-1">Performance Rank</div>
                  <div className="text-xl font-bold">Top 10%</div>
                </div>
              </div>
            ) : (
              <div className="h-[148px] border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground text-sm">
                Select a teacher to see data
              </div>
            )}
          </CardContent>
        </Card>

        {/* Student Performance Wall */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Student Performance Wall
            </CardTitle>
            <CardDescription>Analyze individual student progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={selectedStudentId} 
                onValueChange={setSelectedStudentId}
                disabled={!selectedClassId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Student" />
                </SelectTrigger>
                <SelectContent>
                  {students
                    .filter(s => s.classId === selectedClassId)
                    .map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>

            {selectedStudent ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <div className="font-bold">{selectedStudent.name}</div>
                    <div className="text-xs text-muted-foreground">Roll No: {selectedStudent.rollNumber}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{selectedStudent.averageScore}%</div>
                    <div className="text-xs text-muted-foreground">Avg Score</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Attendance Rate</span>
                    <span>{selectedStudent.attendance}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${selectedStudent.attendance}%` }} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[148px] border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground text-sm">
                Select class and student to see data
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Class-wise Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>General Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="present" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: "hsl(var(--chart-2))" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
