import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Folder,
  FolderPlus,
  ClipboardList,
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  ChevronRight,
  ArrowLeft,
  DollarSign,
  Check,
  Clock,
  Award,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { FolderCategoryIcon } from '@/components/ui/FolderCategoryIcon';
import { useToast } from '@/hooks/use-toast';
import {
  useTests,
  useCreateTest,
  useUpdateTest,
  useDeleteTest,
  useUpdateFolderPrice,
} from '@/hooks/useAdmin';
import {
  getAllFolders,
  saveCustomFolder,
  deleteCustomFolder,
  getFolderPrice,
  sortChapters,
} from '@/utils/folderPricing';

const AdminTests = () => {
  // Navigation / Active View
  const [selectedFolder, setSelectedFolder] = useState(null); // folder object or null
  const [searchQuery, setSearchQuery] = useState('');

  // Dialogs
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false);

  // Editing state
  const [editingTest, setEditingTest] = useState(null);
  const [priceFolderTarget, setPriceFolderTarget] = useState(null);
  const [newPriceValue, setNewPriceValue] = useState(0);
  const [isFreeToggle, setIsFreeToggle] = useState(false);

  // Test Form Data
  const [testForm, setTestForm] = useState({
    title: '',
    description: '',
    duration_minutes: 30,
    total_marks: 100,
    reward_points: 100,
    is_active: true,
    questions: [],
  });

  // New Folder Form Data
  const [folderForm, setFolderForm] = useState({
    name: '',
    icon: '📝',
    price: 0,
    description: '',
  });

  // Queries & Mutations
  const { toast } = useToast();
  const { data: tests, isLoading } = useTests();
  const createTest = useCreateTest();
  const updateTest = useUpdateTest();
  const deleteTest = useDeleteTest();
  const updateFolderPrice = useUpdateFolderPrice();

  // All folders unified for tests
  const folders = useMemo(() => {
    return getAllFolders('tests', tests || []);
  }, [tests]);

  // Chapters / Tests for selected folder (sorted Chapter 1, 2, 3...)
  const currentFolderTests = useMemo(() => {
    if (!selectedFolder) return [];
    const matched = (tests || []).filter((t) => t.category === selectedFolder.name);
    return sortChapters(matched);
  }, [tests, selectedFolder]);

  // Filtered lists
  const filteredFolders = useMemo(() => {
    if (!searchQuery) return folders;
    return folders.filter(
      (f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [folders, searchQuery]);

  const filteredTests = useMemo(() => {
    if (!searchQuery) return currentFolderTests;
    return currentFolderTests.filter(
      (t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentFolderTests, searchQuery]);

  // Current folder's price
  const activeFolderPrice = selectedFolder
    ? getFolderPrice(selectedFolder.name, 'tests', tests)
    : 0;

  // --- Handlers for Test Chapters ---
  const handleOpenTestDialog = (test = null) => {
    if (test) {
      setEditingTest(test);
      setTestForm({
        title: test.title,
        description: test.description || '',
        duration_minutes: test.duration_minutes || 30,
        total_marks: test.total_marks || 100,
        reward_points: test.reward_points || test.total_marks || 100,
        is_active: test.is_active !== false,
        questions: test.questions || [],
      });
    } else {
      setEditingTest(null);
      const nextIndex = currentFolderTests.length + 1;
      setTestForm({
        title: `Chapter ${nextIndex} Test: `,
        description: '',
        duration_minutes: 30,
        total_marks: 50,
        reward_points: 50,
        is_active: true,
        questions: [],
      });
    }
    setIsTestDialogOpen(true);
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      points: 10,
    };
    setTestForm({ ...testForm, questions: [...testForm.questions, newQuestion] });
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = testForm.questions.filter((_, i) => i !== index);
    setTestForm({ ...testForm, questions: newQuestions });
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...testForm.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setTestForm({ ...testForm, questions: newQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...testForm.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setTestForm({ ...testForm, questions: newQuestions });
  };

  const handleSaveTest = async (e) => {
    e.preventDefault();
    if (!selectedFolder) return;

    const payload = {
      title: testForm.title,
      description: testForm.description,
      category: selectedFolder.name,
      price: activeFolderPrice, // Inherit folder's price
      duration_minutes: Number(testForm.duration_minutes),
      total_marks: Number(testForm.total_marks),
      reward_points: Number(testForm.reward_points),
      is_active: testForm.is_active,
      questions: testForm.questions,
    };

    if (editingTest) {
      await updateTest.mutateAsync({ id: editingTest.id, ...payload });
    } else {
      await createTest.mutateAsync(payload);
    }

    setIsTestDialogOpen(false);
    setEditingTest(null);
  };

  const handleDeleteTest = async (id) => {
    if (confirm('Are you sure you want to delete this test?')) {
      await deleteTest.mutateAsync(id);
    }
  };

  // --- Handlers for Folders ---
  const handleOpenPriceDialog = (folder) => {
    setPriceFolderTarget(folder);
    const currPrice = getFolderPrice(folder.name, 'tests', tests);
    setNewPriceValue(currPrice);
    setIsFreeToggle(currPrice === 0);
    setIsPriceDialogOpen(true);
  };

  const handleSavePrice = async (e) => {
    e.preventDefault();
    if (!priceFolderTarget) return;

    const finalPrice = isFreeToggle ? 0 : Math.max(0, Number(newPriceValue) || 0);

    await updateFolderPrice.mutateAsync({
      category: priceFolderTarget.name,
      type: 'tests',
      price: finalPrice,
    });

    toast({
      title: finalPrice === 0 ? '🎉 Test Series is now FREE!' : '✅ Price Updated!',
      description:
        finalPrice === 0
          ? `${priceFolderTarget.name} tests are now 100% free for all students.`
          : `${priceFolderTarget.name} price set to ₹${finalPrice}.`,
    });

    setIsPriceDialogOpen(false);
    setPriceFolderTarget(null);
  };

  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (!folderForm.name.trim()) return;

    saveCustomFolder('tests', {
      name: folderForm.name.trim(),
      icon: folderForm.icon || '📝',
      price: Number(folderForm.price) || 0,
      description: folderForm.description || '',
    });

    updateFolderPrice.mutateAsync({
      category: folderForm.name.trim(),
      type: 'tests',
      price: Number(folderForm.price) || 0,
    });

    setIsFolderDialogOpen(false);
    setFolderForm({ name: '', icon: '📝', price: 0, description: '' });
  };

  const handleDeleteFolder = (folder) => {
    if (
      confirm(
        `Are you sure you want to delete test series folder "${folder.name}"?`
      )
    ) {
      deleteCustomFolder('tests', folder.name);
      if (selectedFolder?.name === folder.name) {
        setSelectedFolder(null);
      }
    }
  };

  const isSaving =
    createTest.isPending ||
    updateTest.isPending ||
    deleteTest.isPending ||
    updateFolderPrice.isPending;

  return (
    <div className="space-y-6">
      {/* Top Header / Breadcrumb */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          {selectedFolder ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedFolder(null);
                  setSearchQuery('');
                }}
                className="gap-1.5 rounded-xl border-border/80 text-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/10 transition-all shadow-sm group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                All Test Folders
              </Button>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <div className="flex items-center gap-2.5">
                <FolderCategoryIcon
                  category={selectedFolder.name}
                  iconHint={selectedFolder.icon}
                  variant="accent"
                  className="w-10 h-10 rounded-xl"
                  iconClassName="w-5 h-5"
                />
                <div>
                  <h2 className="text-xl font-bold font-heading text-foreground flex items-center gap-2">
                    {selectedFolder.name}
                    <Badge variant="outline" className="text-xs font-semibold">
                      {currentFolderTests.length} Tests
                    </Badge>
                  </h2>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold font-heading text-foreground flex items-center gap-2">
                <ClipboardList className="w-7 h-7 text-accent" />
                Test Series Category Folders
              </h2>
              <p className="text-sm text-muted-foreground">
                Set price on each test series folder. Students buy the folder to unlock all chapter tests inside.
              </p>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {selectedFolder ? (
            <>
              {/* Folder Price Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenPriceDialog(selectedFolder)}
                className="gap-1.5 rounded-xl border-accent/40 text-accent hover:bg-accent/5"
              >
                <DollarSign className="w-4 h-4" />
                Folder Price: {activeFolderPrice > 0 ? `₹${activeFolderPrice}` : 'FREE'}
              </Button>

              {/* Add Test Chapter Button */}
              <Button
                variant="gradient"
                size="sm"
                onClick={() => handleOpenTestDialog()}
                className="gap-1.5 rounded-xl shadow-md"
              >
                <Plus className="w-4 h-4" />
                Add Test / Chapter
              </Button>
            </>
          ) : (
            <>
              {/* Create New Folder */}
              <Dialog open={isFolderDialogOpen} onOpenChange={setIsFolderDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="gradient" className="gap-2 rounded-xl shadow-md">
                    <FolderPlus className="w-4 h-4" />
                    New Test Folder
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Test Category Folder</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateFolder} className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="tfolder-name">Folder / Subject Name</Label>
                      <Input
                        id="tfolder-name"
                        value={folderForm.name}
                        onChange={(e) => setFolderForm({ ...folderForm, name: e.target.value })}
                        placeholder="e.g. Engineering Chemistry Tests, JEE/NEET, etc."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="tfolder-icon">Category Icon</Label>
                        <Input
                          id="tfolder-icon"
                          value={folderForm.icon}
                          onChange={(e) => setFolderForm({ ...folderForm, icon: e.target.value })}
                          placeholder="e.g. Target, ClipboardList, Cpu"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tfolder-price">Folder Price (₹)</Label>
                        <Input
                          id="tfolder-price"
                          type="number"
                          min={0}
                          value={folderForm.price}
                          onChange={(e) =>
                            setFolderForm({ ...folderForm, price: Number(e.target.value) })
                          }
                          placeholder="0 for Free"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tfolder-desc">Description</Label>
                      <Textarea
                        id="tfolder-desc"
                        rows={3}
                        value={folderForm.description}
                        onChange={(e) =>
                          setFolderForm({ ...folderForm, description: e.target.value })
                        }
                        placeholder="Description of tests inside this folder..."
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsFolderDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" variant="gradient">
                        Create Test Folder
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={selectedFolder ? 'Search tests in this folder...' : 'Search test folders...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 rounded-xl"
        />
      </div>

      {/* VIEW 1: All Test Folders Grid */}
      {!selectedFolder && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFolders.map((folder) => {
            const folderPrice = getFolderPrice(folder.name, 'tests', tests);
            const folderTests = (tests || []).filter((t) => t.category === folder.name);
            const totalQuestions = folderTests.reduce(
              (acc, t) => acc + (t.questions?.length || 0),
              0
            );

            return (
              <motion.div
                key={folder.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative bg-card rounded-2xl border border-border/80 hover:border-accent/40 transition-all duration-300 hover:shadow-xl p-5 flex flex-col justify-between overflow-hidden"
              >
                {/* Glow */}
                <div
                  className={`absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-br ${folder.gradient || 'from-accent/20 to-primary/20'} rounded-full blur-2xl opacity-40 group-hover:opacity-80 transition-opacity`}
                />

                <div className="space-y-4">
                  {/* Top row: Icon + Price Badge */}
                  <div className="flex items-start justify-between">
                    <FolderCategoryIcon
                      category={folder.name}
                      iconHint={folder.icon}
                      variant="accent"
                      className="w-12 h-12 rounded-xl"
                      iconClassName="w-6 h-6"
                    />

                    <div className="text-right flex flex-col items-end">
                      <Badge
                        variant={folderPrice > 0 ? 'default' : 'secondary'}
                        className={`text-xs px-2.5 py-1 font-bold ${
                          folderPrice > 0
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        }`}
                      >
                        {folderPrice > 0 ? `₹${folderPrice}` : 'FREE'}
                      </Badge>

                      {/* Quick Free Toggle for Admin */}
                      <div className="flex items-center gap-1.5 mt-2 bg-secondary/60 px-2 py-1 rounded-lg border border-border/70">
                        <span className="text-[10px] font-bold text-muted-foreground">Free:</span>
                        <Switch
                          checked={folderPrice === 0}
                          onCheckedChange={async (isFree) => {
                            const targetPrice = isFree ? 0 : 299;
                            await updateFolderPrice.mutateAsync({
                              category: folder.name,
                              type: 'tests',
                              price: targetPrice,
                            });
                            toast({
                              title: isFree ? '🎉 Test Series is now FREE' : '💰 Test Series is now PAID',
                              description: isFree
                                ? `${folder.name} can now be attempted by students for free.`
                                : `${folder.name} price set to ₹${targetPrice}. Click 'Set Price' to customize.`,
                            });
                          }}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenPriceDialog(folder);
                        }}
                        className="text-[11px] text-muted-foreground hover:text-accent mt-1.5 underline"
                      >
                        Set Price
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-lg font-bold font-heading text-card-foreground group-hover:text-accent transition-colors">
                      {folder.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {folder.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/60">
                    <span className="flex items-center gap-1 font-medium">
                      <ClipboardList className="w-3.5 h-3.5 text-accent" />
                      {folderTests.length} Tests
                    </span>
                    <span className="flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-primary" />
                      {totalQuestions} Questions
                    </span>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 flex items-center justify-between gap-2">
                  <Button
                    variant="gradient"
                    size="sm"
                    onClick={() => {
                      setSelectedFolder(folder);
                      setSearchQuery('');
                    }}
                    className="flex-1 rounded-xl text-xs gap-1.5 shadow-sm"
                  >
                    Open Test Series
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>

                  {folder.isCustom && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteFolder(folder)}
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg"
                      title="Delete folder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: Inside Active Test Folder */}
      {selectedFolder && (
        <div className="space-y-4">
          {/* Folder Details Banner */}
          <div className="bg-secondary/40 rounded-2xl border border-border/60 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedFolder.icon}</span>
              <div>
                <p className="text-xs font-semibold text-accent uppercase tracking-wider">
                  Test Series Folder
                </p>
                <h3 className="text-lg font-bold text-foreground">{selectedFolder.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedFolder.description || 'All tests & assessments inside this folder'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-border/40 flex-wrap">
              {/* Quick Free Access Switch */}
              <div className="flex items-center gap-2 bg-background/80 px-3 py-1.5 rounded-xl border border-border shadow-xs">
                <div className="text-left">
                  <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider block">
                    Free Access
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    {activeFolderPrice === 0 ? 'Enabled (FREE)' : 'Disabled (Paid)'}
                  </span>
                </div>
                <Switch
                  checked={activeFolderPrice === 0}
                  onCheckedChange={async (isFree) => {
                    const targetPrice = isFree ? 0 : 299;
                    await updateFolderPrice.mutateAsync({
                      category: selectedFolder.name,
                      type: 'tests',
                      price: targetPrice,
                    });
                    toast({
                      title: isFree ? '🎉 Test Series is now FREE' : '💰 Test Series is now PAID',
                      description: isFree
                        ? `${selectedFolder.name} is now free for all students.`
                        : `${selectedFolder.name} price set to ₹${targetPrice}.`,
                    });
                  }}
                />
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">
                  Folder Price
                </span>
                <span className="text-xl font-black text-accent">
                  {activeFolderPrice > 0 ? `₹${activeFolderPrice}` : 'FREE'}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenPriceDialog(selectedFolder)}
                className="gap-1 rounded-xl text-xs font-semibold"
              >
                <Edit className="w-3.5 h-3.5" />
                Change Price
              </Button>
            </div>
          </div>

          {/* Tests List */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading tests...</div>
            ) : filteredTests && filteredTests.length > 0 ? (
              <div className="divide-y divide-border">
                {filteredTests.map((test, index) => (
                  <motion.div
                    key={test.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 sm:p-5 hover:bg-secondary/30 transition-colors flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                  >
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-card-foreground text-base">
                            {test.title}
                          </h4>
                          <Badge
                            variant={test.is_active ? 'default' : 'secondary'}
                            className="text-[10px]"
                          >
                            {test.is_active ? 'Active' : 'Draft'}
                          </Badge>
                        </div>

                        {test.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {test.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            {test.duration_minutes} mins
                          </span>
                          <span className="flex items-center gap-1 font-medium">
                            <Award className="w-3.5 h-3.5" />
                            {test.total_marks} marks
                          </span>
                          <span className="flex items-center gap-1 font-medium">
                            <HelpCircle className="w-3.5 h-3.5" />
                            {test.questions?.length || 0} questions
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-border/30">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleOpenTestDialog(test)}
                        className="h-8 px-3 text-xs gap-1 font-semibold rounded-lg"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit Questions
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteTest(test.id)}
                        className="h-8 w-8 text-destructive border-destructive/20 hover:bg-destructive/10 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center space-y-3">
                <ClipboardList className="w-12 h-12 mx-auto text-muted-foreground/40" />
                <h4 className="text-base font-bold text-foreground">No tests in this folder yet</h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Click "Add Test / Chapter" above to create chapter mock tests and questions.
                </p>
                <Button
                  variant="gradient"
                  size="sm"
                  onClick={() => handleOpenTestDialog()}
                  className="gap-1.5 rounded-xl"
                >
                  <Plus className="w-4 h-4" />
                  Add First Test
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DIALOG: Set Folder Price */}
      <Dialog open={isPriceDialogOpen} onOpenChange={setIsPriceDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Set Test Series Folder Price</DialogTitle>
          </DialogHeader>
          {priceFolderTarget && (
            <form onSubmit={handleSavePrice} className="space-y-4 pt-2">
              <p className="text-xs text-muted-foreground">
                Configure pricing and free access for <strong>{priceFolderTarget.name}</strong> test series.
              </p>

              {/* Free Toggle Switch for Admin */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-secondary/30">
                <div className="space-y-0.5 pr-2">
                  <Label htmlFor="free-toggle" className="text-sm font-bold flex items-center gap-1.5 cursor-pointer">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    Make Test Series Free
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    When enabled, all students can take chapter tests in this folder without paying.
                  </p>
                </div>
                <Switch
                  id="free-toggle"
                  checked={isFreeToggle}
                  onCheckedChange={(checked) => {
                    setIsFreeToggle(checked);
                    if (checked) {
                      setNewPriceValue(0);
                    } else if (newPriceValue === 0) {
                      setNewPriceValue(199);
                    }
                  }}
                />
              </div>

              {!isFreeToggle && (
                <div className="space-y-2">
                  <Label htmlFor="tprice-input">Folder Price (₹)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                      ₹
                    </span>
                    <Input
                      id="tprice-input"
                      type="number"
                      min={1}
                      value={newPriceValue}
                      onChange={(e) => setNewPriceValue(e.target.value)}
                      className="pl-8 text-lg font-bold"
                      placeholder="e.g. 199, 299, 449"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Students will pay this one-time fee to unlock the full test series folder.
                  </p>
                </div>
              )}

              {isFreeToggle && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>This test series will be 100% FREE for all registered students.</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsPriceDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="gradient" disabled={updateFolderPrice.isPending}>
                  {updateFolderPrice.isPending ? 'Updating...' : 'Save Pricing'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* DIALOG: Add / Edit Test Chapter */}
      <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTest ? 'Edit Test' : `Add Test to ${selectedFolder?.name || 'Folder'}`}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveTest} className="space-y-5 pt-2">
            <div className="space-y-2">
              <Label htmlFor="ttitle">Test / Chapter Title</Label>
              <Input
                id="ttitle"
                value={testForm.title}
                onChange={(e) => setTestForm({ ...testForm, title: e.target.value })}
                placeholder="e.g. Chapter 1 Mock Test: Polymers & Chemistry"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tdesc">Description</Label>
              <Textarea
                id="tdesc"
                rows={2}
                value={testForm.description}
                onChange={(e) => setTestForm({ ...testForm, description: e.target.value })}
                placeholder="Instructions or topics covered in this test..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tduration">Duration (Minutes)</Label>
                <Input
                  id="tduration"
                  type="number"
                  min={5}
                  value={testForm.duration_minutes}
                  onChange={(e) =>
                    setTestForm({ ...testForm, duration_minutes: Number(e.target.value) })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tmarks">Total Marks</Label>
                <Input
                  id="tmarks"
                  type="number"
                  min={1}
                  value={testForm.total_marks}
                  onChange={(e) =>
                    setTestForm({ ...testForm, total_marks: Number(e.target.value) })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="treward">Reward Points</Label>
                <Input
                  id="treward"
                  type="number"
                  min={0}
                  value={testForm.reward_points}
                  onChange={(e) =>
                    setTestForm({ ...testForm, reward_points: Number(e.target.value) })
                  }
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <Switch
                id="tactive"
                checked={testForm.is_active}
                onCheckedChange={(checked) => setTestForm({ ...testForm, is_active: checked })}
              />
              <Label htmlFor="tactive" className="cursor-pointer">
                Publish test immediately (Active for students)
              </Label>
            </div>

            {/* Questions Builder Section */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-foreground">Questions ({testForm.questions.length})</h4>
                  <p className="text-xs text-muted-foreground">Add multiple choice questions for this test.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddQuestion}
                  className="gap-1 rounded-xl text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Question
                </Button>
              </div>

              {testForm.questions.length === 0 ? (
                <div className="border border-dashed border-border rounded-xl p-6 text-center text-xs text-muted-foreground">
                  No questions added yet. Click "+ Add Question" to start building your quiz.
                </div>
              ) : (
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                  {testForm.questions.map((q, qIndex) => (
                    <div
                      key={q.id || qIndex}
                      className="p-4 bg-secondary/30 rounded-xl border border-border/80 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-accent">Question #{qIndex + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemoveQuestion(qIndex)}
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>

                      <Input
                        value={q.question}
                        onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                        placeholder="Enter the question text..."
                        required
                      />

                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={q.correctAnswer === oIndex}
                              onChange={() => handleQuestionChange(qIndex, 'correctAnswer', oIndex)}
                              className="accent-primary"
                              title="Mark as correct answer"
                            />
                            <Input
                              value={opt}
                              onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                              placeholder={`Option ${oIndex + 1}`}
                              className={`text-xs h-9 ${q.correctAnswer === oIndex ? 'border-primary ring-1 ring-primary/40' : ''}`}
                              required
                            />
                          </div>
                        ))}
                      </div>

                      <Input
                        value={q.explanation || ''}
                        onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                        placeholder="Explanation for the correct answer (optional)..."
                        className="text-xs h-8"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsTestDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="gradient" disabled={isSaving}>
                {isSaving ? 'Saving...' : editingTest ? 'Update Test' : 'Save Test'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========== PRICE SET/UPDATE DIALOG ========== */}
      <Dialog open={isPriceDialogOpen} onOpenChange={setIsPriceDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="w-5 h-5 text-accent" />
              Set Test Series Price
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSavePrice} className="space-y-5 pt-2">
            {priceFolderTarget && (
              <div className="p-3 rounded-xl bg-secondary/50 border border-border/60">
                <p className="text-xs text-muted-foreground font-semibold">Folder</p>
                <p className="text-base font-bold text-foreground">{priceFolderTarget.name}</p>
              </div>
            )}

            {/* Free Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
              <div>
                <p className="text-sm font-bold text-foreground">Make FREE for all students</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Students can access all tests without payment
                </p>
              </div>
              <Switch
                checked={isFreeToggle}
                onCheckedChange={(checked) => {
                  setIsFreeToggle(checked);
                  if (checked) setNewPriceValue(0);
                  else setNewPriceValue(299);
                }}
              />
            </div>

            {/* Price Input */}
            {!isFreeToggle && (
              <div className="space-y-2">
                <Label htmlFor="test-folder-price" className="text-sm font-bold">
                  Price (₹)
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="test-folder-price"
                    type="number"
                    min={1}
                    step={1}
                    value={newPriceValue}
                    onChange={(e) => setNewPriceValue(e.target.value)}
                    className="pl-9 h-11 text-lg font-bold"
                    placeholder="e.g. 299"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  This price applies to the entire test series folder. Students pay once to unlock all chapter tests.
                </p>
              </div>
            )}

            {/* Preview */}
            <div className="p-3 rounded-xl bg-accent/5 border border-accent/20 text-center">
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Student will see</p>
              <p className="text-2xl font-black text-accent mt-1">
                {isFreeToggle ? 'FREE' : `₹${Number(newPriceValue) || 0}`}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPriceDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="gradient" className="gap-1.5 font-bold">
                <Check className="w-4 h-4" />
                Save Price
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTests;
