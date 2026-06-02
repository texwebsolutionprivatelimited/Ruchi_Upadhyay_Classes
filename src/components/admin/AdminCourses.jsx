import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useCoursesList, useCreateCourse, useUpdateCourse, useDeleteCourse } from '@/hooks/useAdmin';
import { categoryConfig } from '@/config/categoryConfig';

const AdminCourses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    instructor: 'Ruchi Upadhyay',
    price: 0,
    original_price: null,
    image_url: '',
    duration: '',
    lessons: 0,
    level: 'Beginner',
    xp_reward: 100,
    rating: 4.5,
    students: 0,
    language: 'English',
    start_date: null,
    end_date: null,
    batch_info: '',
    status: 'upcoming',
    target_audience: '',
    features: '',
    intro_video_url: '',
    is_active: true,
  });

  const { data: courses, isLoading } = useCoursesList();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();

  const filteredCourses = courses?.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDialog = (course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title,
        description: course.description || '',
        category: course.category,
        instructor: course.instructor,
        price: course.price,
        original_price: course.original_price,
        image_url: course.image_url || '',
        duration: course.duration || '',
        lessons: course.lessons,
        level: course.level,
        xp_reward: course.xp_reward,
        rating: course.rating || 4.5,
        students: course.students || 0,
        language: course.language || 'English',
        start_date: course.start_date,
        end_date: course.end_date,
        batch_info: course.batch_info || '',
        status: course.status || 'upcoming',
        target_audience: course.target_audience || '',
        features: (course.features || []).join('\n'),
        intro_video_url: course.intro_video_url || '',
        is_active: course.is_active,
      });
    } else {
      setEditingCourse(null);
      setFormData({
        title: '',
        description: '',
        category: '',
        instructor: 'Ruchi Upadhyay',
        price: 0,
        original_price: null,
        image_url: '',
        duration: '',
        lessons: 0,
        level: 'Beginner',
        xp_reward: 100,
        rating: 4.5,
        students: 0,
        language: 'English',
        start_date: null,
        end_date: null,
        batch_info: '',
        status: 'upcoming',
        target_audience: '',
        features: '',
        intro_video_url: '',
        is_active: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      features: formData.features.split('\n').filter(f => f.trim() !== '')
    };
    if (editingCourse) {
      await updateCourse.mutateAsync({ id: editingCourse.id, ...formattedData });
    } else {
      await createCourse.mutateAsync(formattedData);
    }
    setIsDialogOpen(false);
    setEditingCourse(null);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this course? This will permanently remove it, including all lessons and purchase history.')) {
      await deleteCourse.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search courses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCourse ? 'Edit Course' : 'Create New Course'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter course title" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(categoryConfig).map((catName) => (
                        <SelectItem key={catName} value={catName}>
                          {categoryConfig[catName].icon} {catName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Enter course description" rows={3} />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input id="instructor" value={formData.instructor} onChange={(e) => setFormData({ ...formData, instructor: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input id="duration" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g., 40 hours" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lessons">Lessons</Label>
                  <Input id="lessons" type="number" value={formData.lessons} onChange={(e) => setFormData({ ...formData, lessons: parseInt(e.target.value) || 0 })} min={0} />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })} min={0} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original Price (₹)</Label>
                  <Input id="originalPrice" type="number" value={formData.original_price || ''} onChange={(e) => setFormData({ ...formData, original_price: e.target.value ? parseInt(e.target.value) : null })} min={0} placeholder="Optional" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="xpReward">XP Reward</Label>
                  <Input id="xpReward" type="number" value={formData.xp_reward} onChange={(e) => setFormData({ ...formData, xp_reward: parseInt(e.target.value) || 0 })} min={0} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input id="imageUrl" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://..." />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (0-5)</Label>
                  <Input id="rating" type="number" step="0.1" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })} min={0} max={5} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="students">Students Count</Label>
                  <Input id="students" type="number" value={formData.students} onChange={(e) => setFormData({ ...formData, students: parseInt(e.target.value) || 0 })} min={0} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Hinglish">Hinglish</SelectItem>
                      <SelectItem value="Tamil">Tamil</SelectItem>
                      <SelectItem value="Telugu">Telugu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" value={formData.start_date || ''} onChange={(e) => setFormData({ ...formData, start_date: e.target.value || null })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" value={formData.end_date || ''} onChange={(e) => setFormData({ ...formData, end_date: e.target.value || null })} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batchInfo">Batch Info</Label>
                  <Input id="batchInfo" value={formData.batch_info} onChange={(e) => setFormData({ ...formData, batch_info: e.target.value })} placeholder="e.g., New Batch Plans included" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Input id="targetAudience" value={formData.target_audience} onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })} placeholder="e.g., For Class 11th Science Students" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Course Features</Label>
                <Textarea id="features" value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} placeholder="Enter features (one per line)" rows={4} />
                <p className="text-xs text-muted-foreground">Each line will be a separate feature bullet point</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="introVideo">Intro Video ID (Youtube)</Label>
                <Input id="introVideo" value={formData.intro_video_url} onChange={(e) => setFormData({ ...formData, intro_video_url: e.target.value })} placeholder="e.g., dQw4w9WgXcQ" />
              </div>

              <div className="flex items-center gap-3">
                <Switch checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} />
                <Label>Active</Label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="gradient" disabled={createCourse.isPending || updateCourse.isPending}>
                  {editingCourse ? 'Update' : 'Create'} Course
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Courses Table/Cards */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Course</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Category</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Price</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Loading courses...
                  </td>
                </tr>
              ) : filteredCourses && filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <motion.tr key={course.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground line-clamp-1">{course.title}</p>
                          <p className="text-sm text-muted-foreground">{course.lessons} lessons • {course.duration}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary">{course.category}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-card-foreground">₹{course.price}</span>
                        {course.original_price && (<span className="text-sm text-muted-foreground line-through">₹{course.original_price}</span>)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={course.is_active ? 'default' : 'secondary'}>
                        {course.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(course)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(course.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No courses found. Create your first course!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-border">
          {isLoading ? (
            <div className="p-6 text-center text-muted-foreground">Loading courses...</div>
          ) : filteredCourses && filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div key={course.id} className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-card-foreground line-clamp-2">{course.title}</p>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mt-0.5">{course.category}</p>
                    </div>
                  </div>
                  <Badge variant={course.is_active ? 'default' : 'secondary'} className="text-[10px]">
                    {course.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="space-y-0.5">
                    <p className="text-muted-foreground">Price</p>
                    <p className="font-bold">₹{course.price}</p>
                  </div>
                  <div className="space-y-0.5 text-right">
                    <p className="text-muted-foreground">Content</p>
                    <p className="font-medium">{course.lessons} Lessons</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button variant="secondary" size="sm" onClick={() => handleOpenDialog(course)} className="flex-1">
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive border-destructive/20" onClick={() => handleDelete(course.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-muted-foreground">No courses found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCourses;
