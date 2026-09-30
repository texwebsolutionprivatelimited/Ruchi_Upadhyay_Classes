import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Folder,
  FolderPlus,
  FileText,
  Plus,
  Edit,
  Trash2,
  Search,
  Upload,
  X,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  DollarSign,
  Check,
  BookOpen,
  Sparkles
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
  useCreateNote,
  useUpdateNote,
  useDeleteNote,
  useUploadNoteFile,
  useDeleteNoteFile,
  useUpdateFolderPrice,
} from '@/hooks/useAdmin';
import { useNotes } from '@/hooks/useNotes';
import {
  getAllFolders,
  saveCustomFolder,
  deleteCustomFolder,
  getFolderPrice,
  sortChapters,
} from '@/utils/folderPricing';

const AdminNotes = () => {
  // Navigation / Active View
  const [selectedFolder, setSelectedFolder] = useState(null); // folder object or null for all folders
  const [searchQuery, setSearchQuery] = useState('');

  // Dialogs
  const [isChapterDialogOpen, setIsChapterDialogOpen] = useState(false);
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false);

  // Editing state
  const [editingChapter, setEditingChapter] = useState(null);
  const [priceFolderTarget, setPriceFolderTarget] = useState(null);
  const [newPriceValue, setNewPriceValue] = useState(0);
  const [isFreeToggle, setIsFreeToggle] = useState(false);

  // Drag & drop file upload
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Chapter Form Data
  const [chapterForm, setChapterForm] = useState({
    title: '',
    content: '',
    file_url: null,
  });

  // New Folder Form Data
  const [folderForm, setFolderForm] = useState({
    name: '',
    icon: '📁',
    price: 0,
    description: '',
  });

  // Queries & Mutations
  const { toast } = useToast();
  const { data: notes, isLoading } = useNotes();
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();
  const uploadFile = useUploadNoteFile();
  const deleteFile = useDeleteNoteFile();
  const updateFolderPrice = useUpdateFolderPrice();

  // All folders unified (categoryConfig + custom + DB categories)
  const folders = useMemo(() => {
    return getAllFolders('notes', notes || []);
  }, [notes]);

  // If a folder is selected, get chapters for this folder (sorted Chapter 1, 2, 3...)
  const currentFolderChapters = useMemo(() => {
    if (!selectedFolder) return [];
    const matched = (notes || []).filter((n) => n.category === selectedFolder.name);
    return sortChapters(matched);
  }, [notes, selectedFolder]);

  // Filtered lists based on search
  const filteredFolders = useMemo(() => {
    if (!searchQuery) return folders;
    return folders.filter((f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [folders, searchQuery]);

  const filteredChapters = useMemo(() => {
    if (!searchQuery) return currentFolderChapters;
    return currentFolderChapters.filter(
      (c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentFolderChapters, searchQuery]);

  // Current folder's price
  const activeFolderPrice = selectedFolder
    ? getFolderPrice(selectedFolder.name, 'notes', notes)
    : 0;

  // --- Handlers for Chapters ---
  const handleOpenChapterDialog = (chapter = null) => {
    if (chapter) {
      setEditingChapter(chapter);
      setChapterForm({
        title: chapter.title,
        content: chapter.content || '',
        file_url: chapter.file_url || null,
      });
    } else {
      setEditingChapter(null);
      const nextIndex = currentFolderChapters.length + 1;
      setChapterForm({
        title: `Chapter ${nextIndex}: `,
        content: '',
        file_url: null,
      });
    }
    setSelectedFile(null);
    setIsChapterDialogOpen(true);
  };

  const handleFileSelect = (file) => {
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      alert('File size must be less than 25MB');
      return;
    }
    setSelectedFile(file);
  };

  const handleRemoveFile = async () => {
    if (chapterForm.file_url) {
      try {
        await deleteFile.mutateAsync(chapterForm.file_url);
      } catch (err) {
        console.error(err);
      }
    }
    setChapterForm({ ...chapterForm, file_url: null });
    setSelectedFile(null);
  };

  const handleSaveChapter = async (e) => {
    e.preventDefault();
    if (!selectedFolder) return;

    let fileUrl = chapterForm.file_url;
    if (selectedFile) {
      fileUrl = await uploadFile.mutateAsync(selectedFile);
    }

    const payload = {
      title: chapterForm.title,
      content: chapterForm.content || chapterForm.title,
      category: selectedFolder.name,
      price: activeFolderPrice, // Inherit folder's price
      file_url: fileUrl,
    };

    if (editingChapter) {
      await updateNote.mutateAsync({ id: editingChapter.id, ...payload });
    } else {
      await createNote.mutateAsync(payload);
    }

    setIsChapterDialogOpen(false);
    setChapterForm({ title: '', content: '', file_url: null });
    setSelectedFile(null);
    setEditingChapter(null);
  };

  const handleDeleteChapter = async (chapter) => {
    if (confirm(`Are you sure you want to delete "${chapter.title}"?`)) {
      if (chapter.file_url) {
        try {
          await deleteFile.mutateAsync(chapter.file_url);
        } catch (err) {
          console.error(err);
        }
      }
      await deleteNote.mutateAsync(chapter.id);
    }
  };

  // --- Handlers for Folders ---
  const handleOpenPriceDialog = (folder) => {
    setPriceFolderTarget(folder);
    const currPrice = getFolderPrice(folder.name, 'notes', notes);
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
      type: 'notes',
      price: finalPrice,
    });

    toast({
      title: finalPrice === 0 ? '🎉 Notes Folder is now FREE!' : '✅ Price Updated!',
      description:
        finalPrice === 0
          ? `${priceFolderTarget.name} notes are now 100% free for all students.`
          : `${priceFolderTarget.name} price set to ₹${finalPrice}.`,
    });

    setIsPriceDialogOpen(false);
    setPriceFolderTarget(null);
  };

  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (!folderForm.name.trim()) return;

    saveCustomFolder('notes', {
      name: folderForm.name.trim(),
      icon: folderForm.icon || '📁',
      price: Number(folderForm.price) || 0,
      description: folderForm.description || '',
    });

    // Also update price state
    updateFolderPrice.mutateAsync({
      category: folderForm.name.trim(),
      type: 'notes',
      price: Number(folderForm.price) || 0,
    });

    setIsFolderDialogOpen(false);
    setFolderForm({ name: '', icon: '📁', price: 0, description: '' });
  };

  const handleDeleteFolder = (folder) => {
    if (
      confirm(
        `Are you sure you want to delete the folder "${folder.name}"? (Any existing notes in this folder will remain in database unless deleted).`
      )
    ) {
      deleteCustomFolder('notes', folder.name);
      if (selectedFolder?.name === folder.name) {
        setSelectedFolder(null);
      }
    }
  };

  const isSaving =
    createNote.isPending ||
    updateNote.isPending ||
    uploadFile.isPending ||
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
                All Folders
              </Button>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <div className="flex items-center gap-2.5">
                <FolderCategoryIcon
                  category={selectedFolder.name}
                  iconHint={selectedFolder.icon}
                  className="w-10 h-10 rounded-xl"
                  iconClassName="w-5 h-5"
                />
                <div>
                  <h2 className="text-xl font-bold font-heading text-foreground flex items-center gap-2">
                    {selectedFolder.name}
                    <Badge variant="outline" className="text-xs font-semibold">
                      {currentFolderChapters.length} Chapters
                    </Badge>
                  </h2>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold font-heading text-foreground flex items-center gap-2">
                <Folder className="w-7 h-7 text-primary" />
                Notes Category Folders
              </h2>
              <p className="text-sm text-muted-foreground">
                Set price on each folder. Students buy the folder to unlock all chapters inside.
              </p>
            </div>
          )}
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {selectedFolder ? (
            <>
              {/* Change Folder Price Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenPriceDialog(selectedFolder)}
                className="gap-1.5 rounded-xl border-primary/30 text-primary hover:bg-primary/5"
              >
                <DollarSign className="w-4 h-4" />
                Folder Price: {activeFolderPrice > 0 ? `₹${activeFolderPrice}` : 'FREE'}
              </Button>

              {/* Add Chapter Button */}
              <Button
                variant="gradient"
                size="sm"
                onClick={() => handleOpenChapterDialog()}
                className="gap-1.5 rounded-xl shadow-md"
              >
                <Plus className="w-4 h-4" />
                Add Chapter
              </Button>
            </>
          ) : (
            <>
              {/* Create New Folder Button */}
              <Dialog open={isFolderDialogOpen} onOpenChange={setIsFolderDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="gradient" className="gap-2 rounded-xl shadow-md">
                    <FolderPlus className="w-4 h-4" />
                    New Category Folder
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Category Folder</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateFolder} className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="folder-name">Folder Name / Subject</Label>
                      <Input
                        id="folder-name"
                        value={folderForm.name}
                        onChange={(e) => setFolderForm({ ...folderForm, name: e.target.value })}
                        placeholder="e.g. Engineering Chemistry, Civil Engg, etc."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="folder-icon">Category Icon</Label>
                        <Input
                          id="folder-icon"
                          value={folderForm.icon}
                          onChange={(e) => setFolderForm({ ...folderForm, icon: e.target.value })}
                          placeholder="e.g. Cpu, BookOpen, GraduationCap"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="folder-price">Folder Price (₹)</Label>
                        <Input
                          id="folder-price"
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
                      <Label htmlFor="folder-desc">Description</Label>
                      <Textarea
                        id="folder-desc"
                        rows={3}
                        value={folderForm.description}
                        onChange={(e) =>
                          setFolderForm({ ...folderForm, description: e.target.value })
                        }
                        placeholder="Brief summary of what this folder contains..."
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
                        Create Folder
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
          placeholder={selectedFolder ? 'Search chapters in this folder...' : 'Search folders...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 rounded-xl"
        />
      </div>

      {/* VIEW 1: All Folders Grid */}
      {!selectedFolder && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFolders.map((folder) => {
            const folderPrice = getFolderPrice(folder.name, 'notes', notes);
            const folderNotes = (notes || []).filter((n) => n.category === folder.name);

            return (
              <motion.div
                key={folder.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative bg-card rounded-2xl border border-border/80 hover:border-primary/40 transition-all duration-300 hover:shadow-xl p-5 flex flex-col justify-between overflow-hidden"
              >
                {/* Decorative header glow */}
                <div
                  className={`absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-br ${folder.gradient || 'from-primary/20 to-accent/20'} rounded-full blur-2xl opacity-40 group-hover:opacity-80 transition-opacity`}
                />

                <div className="space-y-4">
                  {/* Top row: Icon + Price Badge */}
                  <div className="flex items-start justify-between">
                    <FolderCategoryIcon
                      category={folder.name}
                      iconHint={folder.icon}
                      className="w-12 h-12 rounded-xl"
                      iconClassName="w-6 h-6"
                    />

                    <div className="text-right">
                      <Badge
                        variant={folderPrice > 0 ? 'default' : 'secondary'}
                        className={`text-xs px-2.5 py-1 font-bold ${
                          folderPrice > 0
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        }`}
                      >
                        {folderPrice > 0 ? `₹${folderPrice}` : 'FREE'}
                      </Badge>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenPriceDialog(folder);
                        }}
                        className="block text-[11px] text-muted-foreground hover:text-primary mt-1 underline ml-auto"
                      >
                        Set Price
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-lg font-bold font-heading text-card-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                      {folder.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {folder.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/60">
                    <span className="flex items-center gap-1 font-medium">
                      <BookOpen className="w-3.5 h-3.5 text-primary" />
                      {folderNotes.length} Chapters
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-accent" />
                      {folderNotes.filter((n) => n.file_url).length} PDFs
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
                    Open Folder
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

      {/* VIEW 2: Inside Active Folder (Chapters View) */}
      {selectedFolder && (
        <div className="space-y-4">
          {/* Folder Details Banner */}
          <div className="bg-secondary/40 rounded-2xl border border-border/60 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedFolder.icon}</span>
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Category Folder
                </p>
                <h3 className="text-lg font-bold text-foreground">{selectedFolder.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedFolder.description || 'All chapters inside this folder'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-border/40">
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">
                  Folder Price
                </span>
                <span className="text-xl font-black text-primary">
                  {activeFolderPrice > 0 ? `₹${activeFolderPrice}` : 'FREE'}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenPriceDialog(selectedFolder)}
                className="gap-1 rounded-xl text-xs"
              >
                <Edit className="w-3.5 h-3.5" />
                Change Price
              </Button>
            </div>
          </div>

          {/* Chapters List / Table */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading chapters...</div>
            ) : filteredChapters && filteredChapters.length > 0 ? (
              <div className="divide-y divide-border">
                {filteredChapters.map((chapter, index) => (
                  <motion.div
                    key={chapter.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 sm:p-5 hover:bg-secondary/30 transition-colors flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                  >
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-card-foreground text-base">
                            {chapter.title}
                          </h4>
                          {chapter.file_url && (
                            <Badge
                              variant="outline"
                              className="text-[10px] bg-primary/5 text-primary border-primary/20 gap-1"
                            >
                              <FileText className="w-3 h-3" />
                              PDF Attached
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1">
                          <span>
                            Added:{' '}
                            {chapter.created_at
                              ? new Date(chapter.created_at).toLocaleDateString()
                              : 'Recently'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Chapter Actions */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-border/30">
                      {chapter.file_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(chapter.file_url, '_blank')}
                          className="h-8 px-2.5 text-xs text-primary gap-1 font-semibold"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View PDF
                        </Button>
                      )}

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleOpenChapterDialog(chapter)}
                        className="h-8 px-3 text-xs gap-1 font-semibold rounded-lg"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteChapter(chapter)}
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
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/40" />
                <h4 className="text-base font-bold text-foreground">No chapters in this folder yet</h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Click "Add Chapter" above to add the first chapter notes and PDF to this folder.
                </p>
                <Button
                  variant="gradient"
                  size="sm"
                  onClick={() => handleOpenChapterDialog()}
                  className="gap-1.5 rounded-xl"
                >
                  <Plus className="w-4 h-4" />
                  Add Chapter Now
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DIALOG: Set Folder Price */}
      <Dialog open={isPriceDialogOpen} onOpenChange={setIsPriceDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Set Folder Price</DialogTitle>
          </DialogHeader>
          {priceFolderTarget && (
            <form onSubmit={handleSavePrice} className="space-y-4 pt-2">
              <p className="text-xs text-muted-foreground">
                Set the purchase price for <strong>{priceFolderTarget.name}</strong>. Students who
                pay this price will get access to all chapters in this folder.
              </p>

              <div className="space-y-2">
                <Label htmlFor="price-input">Folder Price (₹)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                    ₹
                  </span>
                  <Input
                    id="price-input"
                    type="number"
                    min={0}
                    value={newPriceValue}
                    onChange={(e) => setNewPriceValue(e.target.value)}
                    className="pl-8 text-lg font-bold"
                    placeholder="0 for Free"
                    required
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Set to 0 if this folder should be completely Free for all students.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsPriceDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="gradient" disabled={isSaving}>
                  {isSaving ? 'Updating...' : 'Save Price'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* DIALOG: Add / Edit Chapter */}
      <Dialog open={isChapterDialogOpen} onOpenChange={setIsChapterDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingChapter ? 'Edit Chapter' : `Add Chapter to ${selectedFolder?.name || 'Folder'}`}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveChapter} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="chapter-title">Chapter Title</Label>
              <Input
                id="chapter-title"
                value={chapterForm.title}
                onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })}
                placeholder="e.g. Chapter 1: Polymers - ONE SHOT"
                required
              />
            </div>

            {/* PDF Upload */}
            <div className="space-y-2">
              <Label>Chapter Study Material (PDF)</Label>
              {selectedFile || chapterForm.file_url ? (
                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl border border-border">
                  <FileText className="w-8 h-8 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-card-foreground truncate">
                      {selectedFile?.name || 'Uploaded PDF Document'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedFile
                        ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                        : 'Ready in storage'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {chapterForm.file_url && !selectedFile && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(chapterForm.file_url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={handleRemoveFile}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
                    isDragging
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files[0];
                    if (file) handleFileSelect(file);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-xs font-semibold text-card-foreground">
                    Click to browse or drag & drop PDF
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Supported: .pdf (Max size: 25MB)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="chapter-content">Notes Summary / Key Concepts (Optional)</Label>
              <Textarea
                id="chapter-content"
                value={chapterForm.content}
                onChange={(e) => setChapterForm({ ...chapterForm, content: e.target.value })}
                placeholder="Optional brief notes or summary..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsChapterDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="gradient" disabled={isSaving}>
                {isSaving ? 'Saving...' : editingChapter ? 'Update Chapter' : 'Save Chapter'}
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
              <DollarSign className="w-5 h-5 text-primary" />
              Set Notes Folder Price
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
                  Students can access all notes without payment
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
                <Label htmlFor="notes-folder-price" className="text-sm font-bold">
                  Price (₹)
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="notes-folder-price"
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
                  This price applies to the entire notes folder. Students pay once to unlock all chapters.
                </p>
              </div>
            )}

            {/* Preview */}
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-center">
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Student will see</p>
              <p className="text-2xl font-black text-primary mt-1">
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

export default AdminNotes;
