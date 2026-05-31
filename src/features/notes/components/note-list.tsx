"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Plus, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Project, Note } from "@/types";
import { projectService } from "@/services/project-service";
import { noteService } from "@/services/note-service";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/shared/search-input";
import { NoteEditor } from "./note-editor";

type ViewState =
  | { level: "projects" }
  | { level: "notes"; project: Project }
  | { level: "editor"; project: Project; note: Note };

export function NoteList() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewState>({ level: "projects" });
  const [projectSearch, setProjectSearch] = useState("");

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await projectService.getAll();
      setProjects(data);
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  async function fetchNotes(projectId: string) {
    try {
      setLoading(true);
      const data = await noteService.getByProject(projectId);
      setNotes(data);
    } catch {
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  }

  function selectProject(project: Project) {
    setView({ level: "notes", project });
    fetchNotes(project.id);
  }

  function selectNote(note: Note) {
    if (view.level === "notes") {
      setView({ level: "editor", project: view.project, note });
    }
  }

  async function createNote() {
    if (view.level !== "notes" || !user) return;
    try {
      const note = await noteService.create({
        user_id: user.id,
        project_id: view.project.id,
        title: "Untitled Note",
        content: "",
      });
      setNotes((prev) => [note, ...prev]);
      setView({ level: "editor", project: view.project, note });
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? JSON.stringify(err);
      console.error("Failed to create note:", msg, err);
      toast.error(msg || "Failed to create note");
    }
  }

  async function deleteNote(noteId: string) {
    try {
      await noteService.delete(noteId);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      if (view.level === "editor" && view.note.id === noteId) {
        setView({ level: "notes", project: view.project });
      }
      toast.success("Note deleted");
    } catch {
      toast.error("Failed to delete note");
    }
  }

  function handleNoteUpdate(updatedNote: Note) {
    setNotes((prev) => prev.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
  }

  const filteredProjects = projectSearch
    ? projects.filter(
        (p) =>
          p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
          p.description?.toLowerCase().includes(projectSearch.toLowerCase())
      )
    : projects;

  if (loading && view.level === "projects" && projects.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg border bg-muted/30" />
        ))}
      </div>
    );
  }

  // Editor view
  if (view.level === "editor") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setView({ level: "notes", project: view.project });
              fetchNotes(view.project.id);
            }}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Notes
          </Button>
          <span className="text-sm text-muted-foreground">
            {view.project.name}
          </span>
        </div>
        <NoteEditor
          note={view.note}
          onUpdate={handleNoteUpdate}
        />
      </div>
    );
  }

  // Notes list view
  if (view.level === "notes") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView({ level: "projects" })}
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Projects
            </Button>
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: view.project.color }}
              />
              <span className="font-medium">{view.project.name}</span>
            </div>
          </div>
          <Button size="sm" onClick={createNote}>
            <Plus className="mr-1 h-4 w-4" />
            New Note
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg border bg-muted/30" />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="flex h-60 flex-col items-center justify-center rounded-lg border bg-card text-center shadow-sm">
            <FileText className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-medium text-muted-foreground">No notes yet</p>
            <p className="mt-1 text-xs text-muted-foreground/60">Create your first note to get started</p>
            <Button size="sm" className="mt-4" onClick={createNote}>
              <Plus className="mr-1 h-4 w-4" />
              New Note
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {notes.map((note) => (
              <button
                key={note.id}
                onClick={() => selectNote(note)}
                className="group flex w-full items-center justify-between rounded-lg border bg-card p-4 text-left shadow-sm transition-colors hover:bg-muted/30"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-medium">{note.title}</h3>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {note.content
                      ? note.content.slice(0, 100) + (note.content.length > 100 ? "..." : "")
                      : "Empty note"}
                  </p>
                  <p className="mt-1.5 text-[11px] text-muted-foreground/60">
                    Updated {new Date(note.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Projects view
  return (
    <div className="space-y-4">
      <div className="w-[200px]">
        <SearchInput
          value={projectSearch}
          onChange={setProjectSearch}
          placeholder="Find projects..."
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <button
            key={project.id}
            onClick={() => selectProject(project)}
            className="group rounded-lg border bg-card p-5 text-left shadow-sm transition-all hover:border-ring hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div
                className="h-4 w-4 rounded-full ring-2 ring-offset-2 ring-offset-background"
                style={{ backgroundColor: project.color, boxShadow: `0 0 8px ${project.color}40` }}
              />
              <h3 className="font-semibold">{project.name}</h3>
            </div>
            {project.description && (
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {project.description}
              </p>
            )}
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground/60">
              <FileText className="h-3 w-3" />
              <span>Click to view notes</span>
            </div>
          </button>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="flex h-40 items-center justify-center rounded-lg border bg-card text-sm text-muted-foreground shadow-sm">
          No projects found
        </div>
      )}
    </div>
  );
}
