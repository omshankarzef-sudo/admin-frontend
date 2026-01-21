import { useStore, Student } from "@/lib/store";
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

export default function StudentsPage() {
  const { students, classes, addStudent } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<Student, 'id' | 'role' | 'attendance' | 'averageScore'>>();

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (data: any) => {
    addStudent({
      ...data,
      status: 'active'
    });
    toast({
      title: "Student Created",
      description: `${data.name} has been added to the system.`,
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
          <h1 className="text-3xl font-display font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground mt-2">Manage student records and performance.</p>
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
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" {...register("name", { required: true })} placeholder="John Doe" />
                  {errors.name && <span className="text-xs text-destructive">Name is required</span>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email", { required: true })} placeholder="john@example.com" />
                  {errors.email && <span className="text-xs text-destructive">Email is required</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Login Password</Label>
                  <Input id="password" type="password" {...register("password", { required: true })} placeholder="••••••••" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rollNumber">Roll Number</Label>
                    <Input id="rollNumber" {...register("rollNumber", { required: true })} placeholder="A001" />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="classId">Class</Label>
                     <select 
                      id="classId" 
                      {...register("classId", { required: true })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                     >
                       <option value="">Select Class</option>
                       {classes.map(cls => (
                         <option key={cls.id} value={cls.id}>{cls.name}</option>
                       ))}
                     </select>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button type="submit">Create Student</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center space-x-2 bg-card p-2 rounded-lg border shadow-sm max-w-sm print:hidden">
        <Search className="h-4 w-4 text-muted-foreground ml-2" />
        <Input 
          placeholder="Search students..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-none shadow-none focus-visible:ring-0"
        />
      </div>

      <GenericTable 
        data={filteredStudents}
        columns={[
          { 
            header: "Name", 
            accessorKey: "name", 
            className: "font-medium",
            cell: (student) => (
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                  {student.name.charAt(0)}
                </div>
                <span>{student.name}</span>
              </div>
            )
          },
          { header: "Email", accessorKey: "email" },
          { header: "Password", cell: (student) => <code className="text-xs bg-muted px-1 rounded">{student.password || '••••••'}</code> },
          { header: "Roll No", accessorKey: "rollNumber" },
          { 
            header: "Class", 
            cell: (student) => {
              const cls = classes.find(c => c.id === student.classId);
              return cls ? cls.name : student.classId;
            }
          },
          { 
            header: "Performance", 
            cell: (student) => (
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${student.averageScore >= 80 ? 'bg-emerald-500' : student.averageScore >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} 
                    style={{ width: `${student.averageScore}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{student.averageScore}%</span>
              </div>
            )
          },
          { 
            header: "Status", 
            cell: (student) => (
              <Badge variant={student.status === 'active' ? 'outline' : 'secondary'} className="capitalize">
                {student.status}
              </Badge>
            )
          }
        ]}
      />
    </div>
  );
}
