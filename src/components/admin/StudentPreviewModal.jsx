import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, CheckCircle, Lock, Clock, ChevronDown, ChevronRight, X } from 'lucide-react';
const StudentPreviewModal = ({ isOpen, onClose, course, lessons }) => {
    const [selectedLesson, setSelectedLesson] = useState(lessons[0] || null);
    const [completedLessons, setCompletedLessons] = useState(new Set());
    const [expandedSections, setExpandedSections] = useState(new Set(['section-0']));
    const toggleSection = (sectionId) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(sectionId)) {
            newExpanded.delete(sectionId);
        }
        else {
            newExpanded.add(sectionId);
        }
        setExpandedSections(newExpanded);
    };
    const toggleComplete = (lessonId) => {
        const newCompleted = new Set(completedLessons);
        if (newCompleted.has(lessonId)) {
            newCompleted.delete(lessonId);
        }
        else {
            newCompleted.add(lessonId);
        }
        setCompletedLessons(newCompleted);
    };
    const progress = lessons.length > 0
        ? Math.round((completedLessons.size / lessons.length) * 100)
        : 0;
    return (<Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-6xl w-full h-full sm:h-[90vh] p-0 overflow-hidden sm:rounded-2xl border-none sm:border border-border">
        <div className="flex flex-col h-full bg-background">
          {/* Header */}
          <DialogHeader className="p-4 border-b border-border flex-shrink-0 bg-card">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="secondary" className="mb-2">Student Preview Mode</Badge>
                <DialogTitle className="text-xl">{course.title}</DialogTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5"/>
              </Button>
            </div>
          </DialogHeader>

          <div className="flex flex-1 flex-col sm:flex-row overflow-hidden">
            {/* Video Player Area */}
            <div className="flex-[2] flex flex-col bg-background">
              {/* Video Container */}
              <div className="relative flex-1 group min-h-[40vh] sm:min-h-0">
                {/* Protective Overlays */}
                <div className="absolute top-0 left-0 w-full h-16 sm:h-24 z-20"/>
                <div className="absolute bottom-0 right-12 w-24 h-12 z-20"/>

                {selectedLesson?.youtube_video_id ? ((() => {
            const videoId = selectedLesson.youtube_video_id;
            const isVimeo = videoId.includes('vimeo') || /^\d+$/.test(videoId);
            const cleanId = videoId.replace(/https?:\/\/vimeo\.com\//, '').split('?')[0];
            if (isVimeo) {
                return (<iframe src={`https://player.vimeo.com/video/${cleanId}?autoplay=1&badge=0&autopause=0&player_id=0&app_id=58479`} className="w-full h-full relative z-10" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen/>);
            }
            return (<iframe src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&controls=1&showinfo=0&disablekb=1&iv_load_policy=3&enablejsapi=1`} className="w-full h-full relative z-10" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>);
        })()) : (<div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Play className="w-16 h-16 mx-auto mb-3 opacity-50"/>
                      <p>No video available</p>
                    </div>
                  </div>)}
              </div>

              {/* Lesson Info - Only show more info on wide screens or if space allows */}
              <div className="p-4 sm:p-6 flex-shrink-0 overflow-auto border-t border-border sm:border-t-0">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {selectedLesson?.title || 'Select a lesson'}
                    </h2>
                    <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                      {selectedLesson?.duration && (<span className="flex items-center gap-1">
                          <Clock className="w-4 h-4"/>
                          {selectedLesson.duration}
                        </span>)}
                      {selectedLesson?.is_free && (<Badge variant="secondary">Free Preview</Badge>)}
                    </div>
                  </div>
                  {selectedLesson && (<Button variant={completedLessons.has(selectedLesson.id) ? "secondary" : "gradient"} onClick={() => toggleComplete(selectedLesson.id)}>
                      <CheckCircle className="w-4 h-4 mr-2"/>
                      {completedLessons.has(selectedLesson.id) ? 'Completed' : 'Mark Complete'}
                    </Button>)}
                </div>
                {selectedLesson?.description && (<p className="text-muted-foreground">{selectedLesson.description}</p>)}
              </div>
            </div>

            {/* Sidebar - Curriculum */}
            <div className="w-80 border-l border-border flex flex-col bg-card">
              {/* Progress */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Course Progress</span>
                  <span className="text-sm text-muted-foreground">{progress}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }}/>
                </div>
              </div>

              {/* Lessons List */}
              <ScrollArea className="flex-1">
                <div className="p-4">
                  <div className="space-y-1">
                    <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors" onClick={() => toggleSection('section-0')}>
                      <span className="font-medium text-sm">Course Content</span>
                      {expandedSections.has('section-0') ? (<ChevronDown className="w-4 h-4"/>) : (<ChevronRight className="w-4 h-4"/>)}
                    </button>

                    {expandedSections.has('section-0') && (<div className="space-y-1 pt-1">
                        {lessons.map((lesson, index) => {
                const isCompleted = completedLessons.has(lesson.id);
                const isSelected = selectedLesson?.id === lesson.id;
                const isLocked = !lesson.is_free && index > 0;
                return (<button key={lesson.id} onClick={() => setSelectedLesson(lesson)} className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${isSelected
                        ? 'bg-primary/10 border border-primary/30'
                        : 'hover:bg-secondary/50'}`}>
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted
                        ? 'bg-success text-success-foreground'
                        : isLocked
                            ? 'bg-secondary text-muted-foreground'
                            : 'bg-primary/10 text-primary'}`}>
                                {isCompleted ? (<CheckCircle className="w-4 h-4"/>) : isLocked ? (<Lock className="w-3 h-3"/>) : (<Play className="w-3 h-3"/>)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                                  {index + 1}. {lesson.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {lesson.duration || 'Duration not set'}
                                </p>
                              </div>
                              {lesson.is_free && (<Badge variant="secondary" className="text-xs flex-shrink-0">
                                  Free
                                </Badge>)}
                            </button>);
            })}
                      </div>)}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>);
};
export default StudentPreviewModal;
