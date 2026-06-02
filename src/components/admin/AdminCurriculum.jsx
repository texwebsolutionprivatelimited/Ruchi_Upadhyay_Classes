import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Search, PlayCircle, ChevronDown, ChevronRight, GripVertical, Video, Eye, FileText, Link as LinkIcon, HelpCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useCoursesList, useLessons, useCreateLesson, useUpdateLesson, useDeleteLesson, useReorderLessons } from '@/hooks/useAdmin';
import StudentPreviewModal from './StudentPreviewModal';
const AdminCurriculum = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [expandedCourses, setExpandedCourses] = useState(new Set());
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState(null);
    const [draggedLesson, setDraggedLesson] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [previewCourse, setPreviewCourse] = useState(null);
    const [previewLessons, setPreviewLessons] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        youtube_video_id: '',
        duration: '',
        order_index: 0,
        is_free: false,
        content_type: 'video',
        file_url: '',
    });
    const { data: courses, isLoading: coursesLoading } = useCoursesList();
    const { data: lessons, isLoading: lessonsLoading } = useLessons(selectedCourse?.id);
    const createLesson = useCreateLesson();
    const updateLesson = useUpdateLesson();
    const deleteLesson = useDeleteLesson();
    const reorderLessons = useReorderLessons();
    const filteredCourses = courses?.filter(course => course.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const toggleCourse = (courseId) => {
        const course = courses?.find(c => c.id === courseId);
        if (course) {
            setSelectedCourse(course);
            const newExpanded = new Set(expandedCourses);
            if (newExpanded.has(courseId)) {
                newExpanded.delete(courseId);
            }
            else {
                newExpanded.add(courseId);
            }
            setExpandedCourses(newExpanded);
        }
    };
    const handleOpenDialog = (course, lesson) => {
        setSelectedCourse(course);
        if (lesson) {
            setEditingLesson(lesson);
            setFormData({
                title: lesson.title,
                description: lesson.description || '',
                youtube_video_id: lesson.youtube_video_id || '',
                duration: lesson.duration || '',
                order_index: lesson.order_index,
                is_free: lesson.is_free,
                content_type: lesson.content_type || 'video',
                file_url: lesson.file_url || '',
            });
        }
        else {
            setEditingLesson(null);
            const maxOrder = lessons?.reduce((max, l) => Math.max(max, l.order_index), -1) ?? -1;
            setFormData({
                title: '',
                description: '',
                youtube_video_id: '',
                duration: '',
                order_index: maxOrder + 1,
                is_free: false,
                content_type: 'video',
                file_url: '',
            });
        }
        setIsDialogOpen(true);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCourse)
            return;
        if (editingLesson) {
            await updateLesson.mutateAsync({
                id: editingLesson.id,
                ...formData,
                youtube_video_id: formData.youtube_video_id || null,
                description: formData.description || null,
                duration: formData.duration || null,
            });
        }
        else {
            await createLesson.mutateAsync({
                course_id: selectedCourse.id,
                ...formData,
                youtube_video_id: formData.youtube_video_id || null,
                description: formData.description || null,
                duration: formData.duration || null,
                content_type: formData.content_type,
                file_url: formData.file_url || null,
            });
        }
        setIsDialogOpen(false);
        setEditingLesson(null);
    };
    const handleDelete = async (lesson) => {
        if (confirm('Are you sure you want to delete this lesson?')) {
            await deleteLesson.mutateAsync({ id: lesson.id, courseId: lesson.course_id });
        }
    };
    const extractVideoId = (input) => {
        if (!input)
            return '';
        // YouTube
        const ytRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
        const ytMatch = input.match(ytRegex);
        if (ytMatch)
            return ytMatch[1];
        if (/^[a-zA-Z0-9_-]{11}$/.test(input))
            return input;
        // Vimeo
        const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;
        const vimeoMatch = input.match(vimeoRegex);
        if (vimeoMatch)
            return vimeoMatch[1];
        if (/^\d+$/.test(input))
            return input;
        return input;
    };
    // Drag and drop handlers
    const handleDragStart = (e, lesson) => {
        setDraggedLesson(lesson);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', lesson.id);
    };
    const handleDragOver = useCallback((e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverIndex(index);
    }, []);
    const handleDragLeave = () => {
        setDragOverIndex(null);
    };
    const handleDrop = useCallback(async (e, targetIndex) => {
        e.preventDefault();
        setDragOverIndex(null);
        if (!draggedLesson || !lessons || !selectedCourse)
            return;
        const sourceIndex = lessons.findIndex(l => l.id === draggedLesson.id);
        if (sourceIndex === targetIndex) {
            setDraggedLesson(null);
            return;
        }
        // Create new order
        const newLessons = [...lessons];
        const [removed] = newLessons.splice(sourceIndex, 1);
        newLessons.splice(targetIndex, 0, removed);
        // Update order indices
        const updates = newLessons.map((lesson, index) => ({
            id: lesson.id,
            order_index: index,
        }));
        await reorderLessons.mutateAsync({
            lessons: updates,
            courseId: selectedCourse.id,
        });
        setDraggedLesson(null);
    }, [draggedLesson, lessons, selectedCourse, reorderLessons]);
    const handleDragEnd = () => {
        setDraggedLesson(null);
        setDragOverIndex(null);
    };
    const handleOpenPreview = async (course) => {
        // Fetch lessons for this course
        const { data: courseLessons } = await supabase
            .from('lessons')
            .select('*')
            .eq('course_id', course.id)
            .order('order_index');
        const typedLessons = (courseLessons || []).map(l => ({
            ...l,
            content_type: l.content_type || 'video',
            file_url: l.file_url || null,
        }));
        setPreviewCourse(course);
        setPreviewLessons(typedLessons);
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
          <Input placeholder="Search courses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10"/>
        </div>
      </div>

      {/* Courses with Lessons */}
      <div className="space-y-4">
        {coursesLoading ? (<div className="bg-card rounded-2xl border border-border p-8 text-center text-muted-foreground">
            Loading courses...
          </div>) : filteredCourses && filteredCourses.length > 0 ? (filteredCourses.map((course) => (<motion.div key={course.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-2xl border border-border overflow-hidden">
              {/* Course Header */}
              <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/30 transition-colors" onClick={() => toggleCourse(course.id)}>
                <div className="flex items-center gap-3">
                  <button className="p-1">
                    {expandedCourses.has(course.id) ? (<ChevronDown className="w-5 h-5 text-muted-foreground"/>) : (<ChevronRight className="w-5 h-5 text-muted-foreground"/>)}
                  </button>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <PlayCircle className="w-5 h-5 text-primary"/>
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">{course.title}</p>
                    <p className="text-sm text-muted-foreground">{course.lessons} lessons • {course.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button size="sm" variant="outline" onClick={(e) => {
                e.stopPropagation();
                handleOpenPreview(course);
            }}>
                    <Eye className="w-4 h-4 mr-2"/>
                    Preview
                  </Button>
                  <Badge variant="secondary">{course.category}</Badge>
                  <Badge variant={course.is_active ? 'default' : 'secondary'}>
                    {course.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>

              {/* Lessons List */}
              {expandedCourses.has(course.id) && (<div className="border-t border-border">
                  <div className="p-4 bg-secondary/20">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium text-card-foreground">Curriculum</h3>
                        <p className="text-xs text-muted-foreground mt-1">Drag lessons to reorder</p>
                      </div>
                      <Button size="sm" variant="gradient" onClick={() => handleOpenDialog(course)}>
                        <Plus className="w-4 h-4 mr-2"/>
                        Add Lesson
                      </Button>
                    </div>

                    {selectedCourse?.id === course.id && lessonsLoading ? (<p className="text-center text-muted-foreground py-4">Loading lessons...</p>) : lessons && lessons.length > 0 ? (<div className="space-y-2">
                        {lessons.map((lesson, index) => (<div key={lesson.id} draggable onDragStart={(e) => handleDragStart(e, lesson)} onDragOver={(e) => handleDragOver(e, index)} onDragLeave={handleDragLeave} onDrop={(e) => handleDrop(e, index)} onDragEnd={handleDragEnd} className={`flex items-center gap-3 p-3 bg-card rounded-lg border group transition-all ${draggedLesson?.id === lesson.id
                            ? 'opacity-50 border-primary'
                            : dragOverIndex === index
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'}`}>
                            <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab active:cursor-grabbing"/>
                            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                              {index + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-card-foreground truncate">{lesson.title}</p>
                                {lesson.is_free && (<Badge variant="secondary" className="text-xs">Free</Badge>)}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                {lesson.youtube_video_id && (<span className="flex items-center gap-1">
                                    <Video className="w-3 h-3"/>
                                    {lesson.youtube_video_id}
                                  </span>)}
                                {lesson.duration && <span>• {lesson.duration}</span>}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(course, lesson)}>
                                <Edit className="w-4 h-4"/>
                              </Button>
                              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(lesson)}>
                                <Trash2 className="w-4 h-4"/>
                              </Button>
                            </div>
                          </div>))}
                      </div>) : (<p className="text-center text-muted-foreground py-4">
                        No lessons yet. Add your first lesson!
                      </p>)}
                  </div>
                </div>)}
            </motion.div>))) : (<div className="bg-card rounded-2xl border border-border p-8 text-center text-muted-foreground">
            No courses found. Create courses first to add lessons.
          </div>)}
      </div>

      {/* Add/Edit Lesson Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
              {selectedCourse && (<span className="text-muted-foreground font-normal"> - {selectedCourse.title}</span>)}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Lesson Title</Label>
              <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter lesson title" required/>
            </div>

            <div className="space-y-4">
              <Label>Content Type</Label>
              <Tabs defaultValue="video" value={formData.content_type} onValueChange={(val) => setFormData({ ...formData, content_type: val })} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="video" className="flex gap-2">
                    <Video className="w-4 h-4"/> Video
                  </TabsTrigger>
                  <TabsTrigger value="pdf" className="flex gap-2">
                    <FileText className="w-4 h-4"/> PDF/Doc
                  </TabsTrigger>
                  <TabsTrigger value="quiz" className="flex gap-2">
                    <HelpCircle className="w-4 h-4"/> Quiz/DPP
                  </TabsTrigger>
                  <TabsTrigger value="link" className="flex gap-2">
                    <LinkIcon className="w-4 h-4"/> Link
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Enter lesson description" rows={3}/>
            </div>

            {formData.content_type === 'video' && (<div className="space-y-2">
                <Label htmlFor="youtube_video_id">YouTube Video ID or URL</Label>
                <Input id="youtube_video_id" value={formData.youtube_video_id} onChange={(e) => setFormData({
                ...formData,
                youtube_video_id: extractVideoId(e.target.value)
            })} placeholder="e.g., YouTube ID, Vimeo ID or URL"/>
                <p className="text-xs text-muted-foreground">
                  Paste YouTube or Vimeo URL/ID
                </p>
              </div>)}

            {(formData.content_type === 'pdf' || formData.content_type === 'link') && (<div className="space-y-2">
                <Label htmlFor="file_url">
                  {formData.content_type === 'pdf' ? 'PDF URL' : 'Link URL'}
                </Label>
                <Input id="file_url" value={formData.file_url} onChange={(e) => setFormData({ ...formData, file_url: e.target.value })} placeholder={formData.content_type === 'pdf' ? "https://example.com/file.pdf" : "https://example.com"}/>
              </div>)}

            <div className="grid md:grid-cols-2 gap-4">

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g., 15:30"/>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order_index">Order</Label>
                <Input id="order_index" type="number" value={formData.order_index} onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })} min={0}/>
              </div>

              <div className="flex items-center gap-3 pt-6">
                <Switch checked={formData.is_free} onCheckedChange={(checked) => setFormData({ ...formData, is_free: checked })}/>
                <Label>Free Preview</Label>
              </div>
            </div>


            {formData.content_type === 'video' && formData.youtube_video_id && (<div className="space-y-2">
                <Label>Preview</Label>
                <div className="aspect-video rounded-lg overflow-hidden bg-secondary">
                  {(() => {
                const videoId = formData.youtube_video_id;
                const isVimeo = videoId.includes('vimeo') || /^\d+$/.test(videoId);
                const cleanId = videoId.replace(/https?:\/\/vimeo\.com\//, '').split('?')[0];
                if (isVimeo) {
                    return (<iframe src={`https://player.vimeo.com/video/${cleanId}`} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>);
                }
                return (<iframe src={`https://www.youtube.com/embed/${videoId}`} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>);
            })()}
                </div>
              </div>)}

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gradient" disabled={createLesson.isPending || updateLesson.isPending}>
                {editingLesson ? 'Update' : 'Add'} Lesson
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Student Preview Modal */}
      {previewCourse && (<StudentPreviewModal isOpen={!!previewCourse} onClose={() => setPreviewCourse(null)} course={previewCourse} lessons={previewLessons}/>)}
    </div>);
};
export default AdminCurriculum;
