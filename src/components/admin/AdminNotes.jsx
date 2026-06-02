import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, FileText, Upload, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useCreateNote, useUpdateNote, useDeleteNote, useUploadNoteFile, useDeleteNoteFile } from '@/hooks/useAdmin';
import { useNotes } from '@/hooks/useNotes';
import { categoryConfig } from '@/config/categoryConfig';

const AdminNotes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    price: 0,
    file_url: null,
  });
  const fileInputRef = useRef(null);

  const { data: notes, isLoading } = useNotes();
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();
  const uploadFile = useUploadNoteFile();
  const deleteFile = useDeleteNoteFile();

  const filteredNotes = notes?.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDialog = (note) => {
    if (note) {
      setEditingNote(note);
      setFormData({
        title: note.title,
        content: note.content,
        category: note.category,
        price: note.price,
        file_url: note.file_url,
      });
    } else {
      setEditingNote(null);
      setFormData({ title: '', content: '', category: '', price: 0, file_url: null });
    }
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  const handleFileSelect = (file) => {
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }
    setSelectedFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleRemoveFile = async () => {
    if (formData.file_url) {
      await deleteFile.mutateAsync(formData.file_url);
    }
    setFormData({ ...formData, file_url: null });
    setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let fileUrl = formData.file_url;
    if (selectedFile) {
      fileUrl = await uploadFile.mutateAsync(selectedFile);
    }
    const noteData = {
      title: formData.title,
      content: formData.content,
      category: formData.category,
      price: formData.price,
      file_url: fileUrl,
    };
    if (editingNote) {
      await updateNote.mutateAsync({ id: editingNote.id, ...noteData });
    } else {
      await createNote.mutateAsync(noteData);
    }
    setIsDialogOpen(false);
    setFormData({ title: '', content: '', category: '', price: 0, file_url: null });
    setSelectedFile(null);
    setEditingNote(null);
  };

  const handleDelete = async (note) => {
    if (confirm('Are you sure you want to delete this note?')) {
      if (note.file_url) {
        await deleteFile.mutateAsync(note.file_url);
      }
      await deleteNote.mutateAsync(note.id);
    }
  };

  const isPending = createNote.isPending || updateNote.isPending || uploadFile.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search notes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingNote ? 'Edit Note' : 'Create New Note'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter note title" required />
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

              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} placeholder="Enter price (0 for free)" min={0} required />
              </div>

              {/* PDF Upload */}
              <div className="space-y-2">
                <Label>PDF Document (Optional)</Label>
                {(selectedFile || formData.file_url) ? (
                  <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg border border-border">
                    <FileText className="w-8 h-8 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-card-foreground truncate">
                        {selectedFile?.name || 'Uploaded PDF'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedFile
                          ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                          : 'Click to view'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {formData.file_url && !selectedFile && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => window.open(formData.file_url, '_blank')}>
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                      <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={handleRemoveFile}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                      }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Drag & drop a PDF file here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Maximum file size: 10MB
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
                <Label htmlFor="content">Content / Description</Label>
                <Textarea id="content" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Enter note content or description" rows={6} required />
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="gradient" disabled={isPending}>
                  {isPending ? 'Saving...' : editingNote ? 'Update' : 'Create'} Note
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Notes Table/Cards */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Title</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Category</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Price</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">File</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Created</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    Loading notes...
                  </td>
                </tr>
              ) : filteredNotes && filteredNotes.length > 0 ? (
                filteredNotes.map((note) => (
                  <motion.tr key={note.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground line-clamp-1">{note.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{note.content?.substring(0, 50)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary">{note.category}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-primary">₹{note.price}</span>
                    </td>
                    <td className="px-6 py-4">
                      {note.file_url ? (
                        <Button variant="ghost" size="sm" onClick={() => window.open(note.file_url, '_blank')} className="text-primary">
                          <FileText className="w-4 h-4 mr-1" />
                          View PDF
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">No file</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {note.created_at ? new Date(note.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(note)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(note)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No notes found. Create your first note!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-border">
          {isLoading ? (
            <div className="p-6 text-center text-muted-foreground">Loading notes...</div>
          ) : filteredNotes && filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <div key={note.id} className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-card-foreground truncate">{note.title}</p>
                      <Badge variant="secondary" className="text-[10px] mt-1">{note.category}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-tight">Price</p>
                    <p className="font-black text-primary">₹{note.price}</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 italic">
                  {note.content}
                </p>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <div className="flex-1">
                    {note.file_url && (
                      <Button variant="ghost" size="sm" onClick={() => window.open(note.file_url, '_blank')} className="h-8 px-2 text-primary font-bold text-[10px] uppercase">
                        <FileText className="w-3.5 h-3.5 mr-1.5" /> View PDF
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={() => handleOpenDialog(note)} className="h-8 px-4 font-bold">
                      Edit
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 text-destructive border-destructive/20" onClick={() => handleDelete(note)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-muted-foreground">No notes found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotes;
