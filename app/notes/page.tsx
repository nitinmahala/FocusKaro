"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Bold, Italic, Underline, Save, Plus, Trash, Search } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Note {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [activeNote, setActiveNote] = useState<Note | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const editorRef = useRef<HTMLTextAreaElement>(null)

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("focusflow-notes")
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes)
      setNotes(parsedNotes)

      // Set the most recent note as active if it exists
      if (parsedNotes.length > 0) {
        const sortedNotes = [...parsedNotes].sort((a, b) => b.updatedAt - a.updatedAt)
        setActiveNote(sortedNotes[0])
        setTitle(sortedNotes[0].title)
        setContent(sortedNotes[0].content)
      }
    }
  }, [])

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("focusflow-notes", JSON.stringify(notes))
  }, [notes])

  // Auto-save active note when title or content changes
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (activeNote && (title !== activeNote.title || content !== activeNote.content)) {
        saveNote()
      }
    }, 1000)

    return () => clearTimeout(saveTimeout)
  }, [title, content, activeNote])

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    setNotes([newNote, ...notes])
    setActiveNote(newNote)
    setTitle(newNote.title)
    setContent(newNote.content)
    toast.success("New note created")

    // Focus the title input
    setTimeout(() => {
      const titleInput = document.getElementById("note-title") as HTMLInputElement
      if (titleInput) {
        titleInput.focus()
        titleInput.select()
      }
    }, 100)
  }

  const saveNote = () => {
    if (!activeNote) return

    const updatedNotes = notes.map((note) =>
      note.id === activeNote.id ? { ...note, title, content, updatedAt: Date.now() } : note,
    )

    setNotes(updatedNotes)
    setActiveNote({ ...activeNote, title, content, updatedAt: Date.now() })
    toast.success("Note saved")
  }

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id)
    setNotes(updatedNotes)

    if (activeNote && activeNote.id === id) {
      if (updatedNotes.length > 0) {
        setActiveNote(updatedNotes[0])
        setTitle(updatedNotes[0].title)
        setContent(updatedNotes[0].content)
      } else {
        setActiveNote(null)
        setTitle("")
        setContent("")
      }
    }

    toast.success("Note deleted")
  }

  const selectNote = (note: Note) => {
    setActiveNote(note)
    setTitle(note.title)
    setContent(note.content)
  }

  const formatText = (format: string) => {
    if (!editorRef.current) return

    const textarea = editorRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    let formattedText = ""

    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`
        break
      case "italic":
        formattedText = `*${selectedText}*`
        break
      case "underline":
        formattedText = `_${selectedText}_`
        break
      default:
        return
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end)
    setContent(newContent)

    // Focus back on textarea and set cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + 2, start + 2 + selectedText.length)
    }, 0)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Notes</h1>
          <Button onClick={createNewNote}>
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-4">
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                prefix={<Search className="h-4 w-4 mr-2 text-muted-foreground" />}
              />
            </div>
            <div className="rounded-lg border border-border/40 bg-card/30 backdrop-blur-sm shadow-sm">
              <div className="p-4 font-medium border-b border-border/40">Your Notes</div>
              <div className="max-h-[60vh] overflow-y-auto">
                {filteredNotes.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    {notes.length === 0 ? "No notes yet. Create one to get started!" : "No notes match your search."}
                  </div>
                ) : (
                  filteredNotes
                    .sort((a, b) => b.updatedAt - a.updatedAt)
                    .map((note) => (
                      <div
                        key={note.id}
                        className={`p-4 border-b border-border/40 cursor-pointer hover:bg-card/50 transition-colors ${
                          activeNote?.id === note.id ? "bg-card/70" : ""
                        }`}
                        onClick={() => selectNote(note)}
                      >
                        <div className="font-medium truncate">{note.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">{formatDate(note.updatedAt)}</div>
                        <div className="text-sm text-muted-foreground mt-1 truncate">
                          {note.content.substring(0, 50)}
                          {note.content.length > 50 ? "..." : ""}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            {activeNote ? (
              <div className="rounded-lg border border-border/40 bg-card/30 backdrop-blur-sm shadow-sm">
                <div className="flex items-center justify-between p-4 border-b border-border/40">
                  <input
                    id="note-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Note title"
                    className="text-lg font-medium bg-transparent border-none outline-none w-full"
                  />
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => formatText("bold")} title="Bold">
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => formatText("italic")} title="Italic">
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => formatText("underline")} title="Underline">
                      <Underline className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={saveNote} title="Save">
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Tabs defaultValue="edit">
                  <div className="px-4 border-b border-border/40">
                    <TabsList className="w-full justify-start">
                      <TabsTrigger value="edit">Edit</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="edit" className="p-0">
                    <textarea
                      ref={editorRef}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Start typing your note..."
                      className="w-full h-[60vh] p-4 bg-transparent border-none outline-none resize-none"
                    />
                  </TabsContent>
                  <TabsContent
                    value="preview"
                    className="p-4 prose dark:prose-invert max-w-none h-[60vh] overflow-auto"
                  >
                    {content ? (
                      <div dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }} />
                    ) : (
                      <p className="text-muted-foreground">No content to preview</p>
                    )}
                  </TabsContent>
                </Tabs>
                <div className="p-4 border-t border-border/40 flex justify-between">
                  <span className="text-xs text-muted-foreground">Last edited: {formatDate(activeNote.updatedAt)}</span>
                  <Button variant="destructive" size="sm" onClick={() => deleteNote(activeNote.id)}>
                    <Trash className="h-4 w-4 mr-2" />
                    Delete Note
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-border/40 bg-card/30 backdrop-blur-sm shadow-sm p-12 text-center">
                <h3 className="text-lg font-medium mb-2">No Note Selected</h3>
                <p className="text-muted-foreground mb-6">
                  Select a note from the sidebar or create a new one to get started.
                </p>
                <Button onClick={createNewNote}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Note
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Simple markdown formatter
function formatMarkdown(text: string): string {
  // Bold
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

  // Italic
  text = text.replace(/\*(.*?)\*/g, "<em>$1</em>")

  // Underline
  text = text.replace(/_(.*?)_/g, "<u>$1</u>")

  // Paragraphs
  text = text
    .split("\n\n")
    .map((p) => `<p>${p}</p>`)
    .join("")

  return text
}

