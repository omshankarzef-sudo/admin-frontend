import { useStore, Class } from "@/lib/store";
import { GenericTable } from "@/components/dashboard/GenericTable";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
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

export default function ClassesPage() {
  const { classes, teachers, addClass } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<Class, 'id'>>();

  const filteredClasses = classes.filter(cls => 
    cls.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (data: any) => {
    addClass({
      ...data,
      capacity: parseInt(data.capacity)
    });
    
    toast({
      title: "Class Created",
      description: `${data.name} has been added.`,
    });
    setIsDialogOpen(false);
    reset();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Classes</h1>
          <p className="text-muted-foreground mt-2">Manage classes and teacher assignments.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shrink-0">
              <Plus className="mr-2 h-4 w-4" />
              Add Class
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Class</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Class Name</Label>
                <Input id="name" {...register("name", { required: true })} placeholder="Class 10-C" />
                {errors.name && <span className="text-xs text-destructive">Class name is required</span>}
              </div>
              
              <div className="space-y-2">
                 <Label htmlFor="teacherId">Class Teacher</Label>
                 <select 
                  id="teacherId" 
                  {...register("teacherId", { required: true })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                 >
                   <option value="">Select Teacher</option>
                   {teachers.map(t => (
                     <option key={t.id} value={t.id}>{t.name}</option>
                   ))}
                 </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input id="capacity" type="number" {...register("capacity", { required: true, min: 1 })} placeholder="30" />
              </div>
              
              <div className="flex justify-end pt-4">
                <Button type="submit">Create Class</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2 bg-card p-2 rounded-lg border shadow-sm max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground ml-2" />
        <Input 
          placeholder="Search classes..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-none shadow-none focus-visible:ring-0"
        />
      </div>

      <GenericTable 
        data={filteredClasses}
        columns={[
          { header: "Class Name", accessorKey: "name", className: "font-medium" },
          { 
            header: "Class Teacher", 
            cell: (cls) => {
              const teacher = teachers.find(t => t.id === cls.teacherId);
              return teacher ? (
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
                    {teacher.name.charAt(0)}
                  </div>
                  {teacher.name}
                </div>
              ) : <span className="text-muted-foreground italic">Unassigned</span>;
            }
          },
          { header: "Capacity", accessorKey: "capacity" },
          { 
            header: "Students", 
            cell: () => <span className="text-muted-foreground">0 enrolled</span> // Placeholder logic
          }
        ]}
      />
    </div>
  );
}
