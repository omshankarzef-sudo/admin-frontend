import { useStore, Notice } from "@/lib/store";
import { GenericTable } from "@/components/dashboard/GenericTable";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

export default function NoticesPage() {
  const { notices, addNotice } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<Notice, 'id' | 'date' | 'author'>>();

  const filteredNotices = notices.filter(notice => 
    notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (data: any) => {
    addNotice(data);
    toast({
      title: "Notice Posted",
      description: "Your notice has been published.",
    });
    setIsDialogOpen(false);
    reset();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Notices</h1>
          <p className="text-muted-foreground mt-2">Broadcast announcements to the school.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shrink-0">
              <Plus className="mr-2 h-4 w-4" />
              Create Notice
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Notice</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register("title", { required: true })} placeholder="Holiday Announcement" />
                {errors.title && <span className="text-xs text-destructive">Title is required</span>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" {...register("content", { required: true })} placeholder="Details about the announcement..." rows={4} />
                {errors.content && <span className="text-xs text-destructive">Content is required</span>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <Label htmlFor="priority">Priority</Label>
                   <select 
                    id="priority" 
                    {...register("priority", { required: true })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                   >
                     <option value="low">Low</option>
                     <option value="medium">Medium</option>
                     <option value="high">High</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <Label htmlFor="audience">Audience</Label>
                   <select 
                    id="audience" 
                    {...register("audience", { required: true })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                   >
                     <option value="all">Everyone</option>
                     <option value="teachers">Teachers Only</option>
                     <option value="students">Students Only</option>
                   </select>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button type="submit">Post Notice</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2 bg-card p-2 rounded-lg border shadow-sm max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground ml-2" />
        <Input 
          placeholder="Search notices..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-none shadow-none focus-visible:ring-0"
        />
      </div>

      <GenericTable 
        data={filteredNotices}
        columns={[
          { header: "Title", accessorKey: "title", className: "font-medium" },
          { header: "Date", accessorKey: "date" },
          { 
            header: "Priority", 
            cell: (notice) => (
              <Badge 
                variant={notice.priority === 'high' ? 'destructive' : notice.priority === 'medium' ? 'default' : 'secondary'} 
                className="capitalize"
              >
                {notice.priority}
              </Badge>
            )
          },
          { 
            header: "Audience", 
            cell: (notice) => <Badge variant="outline" className="capitalize">{notice.audience}</Badge>
          },
          { header: "Author", accessorKey: "author" }
        ]}
      />
    </div>
  );
}
