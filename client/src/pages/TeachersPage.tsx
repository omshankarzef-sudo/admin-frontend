import { useStore, Teacher } from "@/lib/store";
import { GenericTable } from "@/components/dashboard/GenericTable";
import { Button } from "@/components/ui/button";
import { Plus, Search, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

export default function TeachersPage() {
  const { teachers, subjects, addTeacher } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<Teacher, 'id' | 'role'>>();

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (data: any) => {
    // Transform subjects string array if needed (mock simplifcation)
    const subjectsArray = Array.isArray(data.subjects) ? data.subjects : [data.subjects];
    
    addTeacher({
      ...data,
      subjects: subjectsArray,
      classes: [], // Init empty
      status: 'active'
    });
    
    toast({
      title: "Teacher Added",
      description: `${data.name} has been added to the faculty.`,
    });
    setIsDialogOpen(false);
    reset();
  };

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Teachers</h1>
          <p className="text-muted-foreground mt-2">Manage faculty members and assignments.</p>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0">
                <Plus className="mr-2 h-4 w-4" />
                Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Teacher</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" {...register("name", { required: true })} placeholder="Sarah Wilson" />
                  {errors.name && <span className="text-xs text-destructive">Name is required</span>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email", { required: true })} placeholder="sarah@example.com" />
                  {errors.email && <span className="text-xs text-destructive">Email is required</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Login Password</Label>
                  <Input id="password" type="password" {...register("password", { required: true })} placeholder="••••••••" />
                </div>
                
                <div className="space-y-2">
                   <Label htmlFor="subjects">Primary Subject</Label>
                   <select 
                    id="subjects" 
                    {...register("subjects", { required: true })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                   >
                     <option value="">Select Subject</option>
                     {subjects.map(sub => (
                       <option key={sub.id} value={sub.name}>{sub.name}</option>
                     ))}
                   </select>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button type="submit">Create Teacher</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center space-x-2 bg-card p-2 rounded-lg border shadow-sm max-w-sm print:hidden">
        <Search className="h-4 w-4 text-muted-foreground ml-2" />
        <Input 
          placeholder="Search teachers..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-none shadow-none focus-visible:ring-0"
        />
      </div>

      <GenericTable 
        data={filteredTeachers}
        columns={[
          { 
            header: "Name", 
            accessorKey: "name", 
            className: "font-medium",
            cell: (teacher) => (
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-xs">
                  {teacher.name.charAt(0)}
                </div>
                <span>{teacher.name}</span>
              </div>
            )
          },
          { header: "Email", accessorKey: "email" },
          { header: "Password", cell: (teacher) => <code className="text-xs bg-muted px-1 rounded">{teacher.password || '••••••'}</code> },
          { 
            header: "Subjects", 
            cell: (teacher) => (
              <div className="flex gap-1 flex-wrap">
                {teacher.subjects.map((sub, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{sub}</Badge>
                ))}
              </div>
            )
          },
          { 
            header: "Status", 
            cell: (teacher) => (
              <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                {teacher.status}
              </Badge>
            )
          }
        ]}
      />
    </div>
  );
}
