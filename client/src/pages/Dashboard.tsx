import { useStore } from "@/lib/store";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { 
  Users, 
  GraduationCap, 
  School, 
  Bell, 
  Plus, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Calendar,
  Clock,
  ArrowRight
} from "lucide-react";
import { GenericTable } from "@/components/dashboard/GenericTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

export default function Dashboard() {
  const { students, teachers, classes, notices } = useStore();

  const stats = [
    {
      title: "Total Students",
      value: students.length,
      icon: GraduationCap,
      trend: "+12%",
      description: "from last month"
    },
    {
      title: "Total Teachers",
      value: teachers.length,
      icon: Users,
      trend: "+2",
      description: "newly joined"
    },
    {
      title: "Total Classes",
      value: classes.length,
      icon: School,
      description: "Active sessions"
    },
    {
      title: "Notices",
      value: notices.length,
      icon: Bell,
      description: "Posted this month"
    },
    {
      title: "Teacher Attendance",
      value: "94%",
      icon: CheckCircle,
      trend: "+3%",
      description: "Present today"
    },
    {
      title: "Avg Performance",
      value: "82%",
      icon: TrendingUp,
      trend: "+5%",
      description: "Class average"
    }
  ];

  const quickActions = [
    { name: "Add Student", icon: Plus, href: "/students", color: "bg-blue-500" },
    { name: "Add Teacher", icon: Plus, href: "/teachers", color: "bg-emerald-500" },
    { name: "Create Class", icon: School, href: "/classes", color: "bg-purple-500" },
    { name: "Timetable", icon: Calendar, href: "/timetable", color: "bg-amber-500" },
    { name: "New Notice", icon: Bell, href: "/notices", color: "bg-rose-500" },
  ];

  const activities = [
    { id: 1, type: "student", description: "New student Alice Johnson enrolled", time: "2 hours ago", icon: GraduationCap, color: "text-blue-500" },
    { id: 2, type: "teacher", description: "Mr. Smith marked leave for tomorrow", time: "4 hours ago", icon: Users, color: "text-amber-500" },
    { id: 3, type: "notice", description: "Exam schedule notice published", time: "5 hours ago", icon: Bell, color: "text-rose-500" },
    { id: 4, type: "timetable", description: "Class 10-A timetable updated", time: "1 day ago", icon: Calendar, color: "text-purple-500" },
  ];

  const performanceData = [
    { name: '10-A', score: 85 },
    { name: '10-B', score: 72 },
    { name: '11-A', score: 91 },
    { name: '11-B', score: 78 },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Professional school management overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1 bg-primary/5 text-primary border-primary/20 flex items-center gap-2">
            <Clock className="h-3 w-3" />
            Term 1 - 2026
          </Badge>
          <Badge variant="outline" className="px-3 py-1 bg-emerald-500/5 text-emerald-600 border-emerald-500/20">
            System Online
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} className="shadow-sm border-muted/50" />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Left Column - Main Content */}
        <div className="xl:col-span-3 space-y-8">
          
          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold font-display flex items-center gap-2">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {quickActions.map((action) => (
                <Link key={action.name} href={action.href}>
                  <Button variant="outline" className="w-full h-24 flex-col gap-2 glass-card hover:bg-primary/5 border-muted/50 group">
                    <div className={`p-2 rounded-lg ${action.color} text-white shadow-lg shadow-${action.color.split('-')[1]}-500/20 group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-semibold">{action.name}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Students & Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GenericTable 
              title="Recent Students"
              data={students.slice(0, 5)}
              columns={[
                { 
                  header: "Student", 
                  cell: (s) => (
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {s.name.charAt(0)}
                      </div>
                      <span className="font-medium text-sm">{s.name}</span>
                    </div>
                  )
                },
                { header: "Roll", accessorKey: "rollNumber" },
                { 
                  header: "Status", 
                  cell: (s) => (
                    <Badge variant={s.status === 'active' ? 'default' : 'secondary'} className="text-[10px] h-5">
                      {s.status}
                    </Badge>
                  )
                },
                {
                  header: "",
                  cell: () => (
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  )
                }
              ]}
            />

            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Performance Snapshot</CardTitle>
                <CardDescription>Class-wise average scores (%)</CardDescription>
              </CardHeader>
              <CardContent className="h-[240px] pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                    <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                      {performanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.score > 85 ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'} opacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Side Panels */}
        <div className="space-y-8">
          {/* Alerts & Warnings */}
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                Critical Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs p-2 rounded bg-white/50 dark:bg-black/20 border border-destructive/10">
                <p className="font-semibold">Teacher Absent Today</p>
                <p className="text-muted-foreground mt-1">Mr. Mike Brown (English)</p>
              </div>
              <div className="text-xs p-2 rounded bg-white/50 dark:bg-black/20 border border-amber-500/10">
                <p className="font-semibold text-amber-600">Timetable Conflict</p>
                <p className="text-muted-foreground mt-1">Class 10-A, Room 204</p>
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div className={`h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0 ${activity.color}`}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs leading-tight">{activity.description}</p>
                    <p className="text-[10px] text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-xs h-8 text-primary">View All Activity</Button>
            </CardContent>
          </Card>

          {/* Attendance Snapshot */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold">Attendance Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Teachers Present</span>
                <span className="font-bold text-emerald-600">24 / 28</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Teachers on Leave</span>
                <span className="font-bold text-rose-500">4</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Classes Conducted</span>
                <span className="font-bold">18 / 20</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '85%' }} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
