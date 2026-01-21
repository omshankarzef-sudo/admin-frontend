import { useStore } from "@/lib/store";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Users, GraduationCap, School, Bell, TrendingUp } from "lucide-react";
import { GenericTable } from "@/components/dashboard/GenericTable";
import { Badge } from "@/components/ui/badge";

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
    }
  ];

  const recentStudents = students.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      <div className="dashboard-grid">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <GenericTable 
            title="Recent Students"
            data={recentStudents}
            columns={[
              { header: "Name", accessorKey: "name", className: "font-medium" },
              { header: "Roll No", accessorKey: "rollNumber" },
              { header: "Class", accessorKey: "classId" },
              { 
                header: "Status", 
                cell: (student) => (
                  <Badge variant={student.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                    {student.status}
                  </Badge>
                )
              }
            ]}
          />
        </div>

        <div className="space-y-4">
           <h3 className="text-xl font-display font-bold">Latest Notices</h3>
           <div className="space-y-4">
             {notices.map((notice) => (
               <div key={notice.id} className="glass-card p-4 rounded-xl relative overflow-hidden group">
                 <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                   notice.priority === 'high' ? 'bg-destructive' : 
                   notice.priority === 'medium' ? 'bg-orange-500' : 'bg-blue-500'
                 }`} />
                 <div className="pl-3">
                   <div className="flex justify-between items-start mb-1">
                     <h4 className="font-semibold text-foreground">{notice.title}</h4>
                     <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{notice.date}</span>
                   </div>
                   <p className="text-sm text-muted-foreground line-clamp-2">{notice.content}</p>
                   <div className="mt-2 flex items-center gap-2">
                     <Badge variant="outline" className="text-xs">{notice.audience}</Badge>
                     {notice.priority === 'high' && <Badge variant="destructive" className="text-xs">High Priority</Badge>}
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
