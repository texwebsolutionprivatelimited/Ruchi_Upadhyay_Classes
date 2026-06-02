import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, ClipboardList, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useTests, useCreateTest, useUpdateTest, useDeleteTest } from '@/hooks/useAdmin';
import { categoryConfig } from '@/config/categoryConfig';

const AdminTests = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    duration_minutes: 30,
    total_marks: 100,
    reward_points: 100,
    price: 0,
    is_active: true,
    questions: [],
  });

  const { data: tests, isLoading } = useTests();
  const createTest = useCreateTest();
  const updateTest = useUpdateTest();
  const deleteTest = useDeleteTest();

  const filteredTests = tests?.filter(test =>
    test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDialog = (test) => {
    if (test) {
      setEditingTest(test);
      setFormData({
        title: test.title,
        description: test.description || '',
        category: test.category,
        duration_minutes: test.duration_minutes,
        total_marks: test.total_marks,
        reward_points: test.reward_points || test.total_marks,
        price: test.price || 0,
        is_active: test.is_active,
        questions: test.questions,
      });
    } else {
      setEditingTest(null);
      setFormData({
        title: '',
        description: '',
        category: '',
        duration_minutes: 30,
        total_marks: 100,
        reward_points: 100,
        price: 0,
        is_active: true,
        questions: [],
      });
    }
    setIsDialogOpen(true);
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      id: crypto.randomUUID(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      points: 10,
    };
    setFormData({ ...formData, questions: [...formData.questions, newQuestion] });
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingTest) {
      await updateTest.mutateAsync({ id: editingTest.id, ...formData });
    } else {
      await createTest.mutateAsync(formData);
    }
    setIsDialogOpen(false);
    setEditingTest(null);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this test?')) {
      await deleteTest.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search tests..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Test
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTest ? 'Edit Test' : 'Create New Test'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter test title" required />
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
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Enter test description" rows={2} />
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input id="duration" type="number" value={formData.duration_minutes} onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })} min={1} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marks">Total Marks</Label>
                  <Input id="marks" type="number" value={formData.total_marks} onChange={(e) => setFormData({ ...formData, total_marks: parseInt(e.target.value) })} min={1} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reward_points">Reward Points (XP)</Label>
                  <Input id="reward_points" type="number" value={formData.reward_points} onChange={(e) => setFormData({ ...formData, reward_points: parseInt(e.target.value) })} min={1} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })} min={0} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} />
                <Label>Active</Label>
              </div>

              {/* Questions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg">Questions ({formData.questions.length})</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddQuestion}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </Button>
                </div>

                {formData.questions.map((question, qIndex) => (
                  <div key={question.id} className="p-4 rounded-xl border border-border bg-secondary/20 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <Label>Question {qIndex + 1}</Label>
                        <Input value={question.question} onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)} placeholder="Enter question" required />
                      </div>
                      <Button type="button" variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => handleRemoveQuestion(qIndex)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-2">
                          <input type="radio" name={`correct-${question.id}`} checked={question.correctAnswer === oIndex} onChange={() => handleQuestionChange(qIndex, 'correctAnswer', oIndex)} className="w-4 h-4" />
                          <Input value={option} onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} placeholder={`Option ${String.fromCharCode(65 + oIndex)}`} required />
                        </div>
                      ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Explanation</Label>
                        <Textarea value={question.explanation} onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)} placeholder="Explain the correct answer" rows={2} />
                      </div>
                      <div className="space-y-2">
                        <Label>Points</Label>
                        <Input type="number" value={question.points} onChange={(e) => handleQuestionChange(qIndex, 'points', parseInt(e.target.value))} min={1} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="gradient" disabled={createTest.isPending || updateTest.isPending}>
                  {editingTest ? 'Update' : 'Create'} Test
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tests Table/Cards */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Test</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Category</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Questions</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Price</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    Loading tests...
                  </td>
                </tr>
              ) : filteredTests && filteredTests.length > 0 ? (
                filteredTests.map((test) => (
                  <motion.tr key={test.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <ClipboardList className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground line-clamp-1">{test.title}</p>
                          <p className="text-sm text-muted-foreground">{test.duration_minutes} mins • {test.total_marks} marks</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary">{test.category}</Badge>
                    </td>
                    <td className="px-6 py-4 text-card-foreground">
                      {test.questions?.length || 0}
                    </td>
                    <td className="px-6 py-4 text-card-foreground">
                      ₹{test.price || 0}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={test.is_active ? 'default' : 'secondary'}>
                        {test.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(test)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(test.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No tests found. Create your first test!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-border">
          {isLoading ? (
            <div className="p-6 text-center text-muted-foreground">Loading tests...</div>
          ) : filteredTests && filteredTests.length > 0 ? (
            filteredTests.map((test) => (
              <div key={test.id} className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <ClipboardList className="w-5 h-5 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-card-foreground truncate">{test.title}</p>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-0.5">{test.category}</p>
                    </div>
                  </div>
                  <Badge variant={test.is_active ? 'default' : 'secondary'} className="text-[10px]">
                    {test.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 border-y border-border/50 text-center">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Time</p>
                    <p className="text-sm font-semibold">{test.duration_minutes}m</p>
                  </div>
                  <div className="space-y-0.5 border-x border-border/50">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">XP</p>
                    <p className="text-sm font-semibold">{test.reward_points}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Price</p>
                    <p className="text-sm font-semibold">₹{test.price || '0'}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <div className="text-xs text-muted-foreground font-medium">
                    {test.questions?.length || 0} Questions
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={() => handleOpenDialog(test)} className="h-8 px-4 font-bold">
                      Edit
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 text-destructive border-destructive/20" onClick={() => handleDelete(test.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-muted-foreground">No tests found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTests;
