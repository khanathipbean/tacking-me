"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import type { Note } from "@/types";
import { noteService } from "@/services/note-service";

type NoteEditorProps = {
  note: Note;
  onUpdate: (note: Note) => void;
};

export function NoteEditor({ note, onUpdate }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const titleRef = useRef(title);
  const contentRef = useRef(content);

  titleRef.current = title;
  contentRef.current = content;

  const save = useCallback(async () => {
    try {
      setSaving(true);
      const updated = await noteService.update(note.id, {
        title: titleRef.current,
        content: contentRef.current,
      });
      onUpdate(updated);
      setLastSaved(new Date());
    } catch {
      toast.error("Failed to save note");
    } finally {
      setSaving(false);
    }
  }, [note.id, onUpdate]);

  // Auto-save after 2 seconds of inactivity
  const scheduleAutoSave = useCallback(() => {
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }
    autoSaveTimer.current = setTimeout(() => {
      save();
    }, 2000);
  }, [save]);

  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, []);

  function handleTitleChange(value: string) {
    setTitle(value);
    scheduleAutoSave();
  }

  function handleContentChange(value: string) {
    setContent(value);
    scheduleAutoSave();
  }

  return (
    <div className="flex h-[calc(100vh-220px)] flex-col rounded-lg border bg-card shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-3">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {saving ? (
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
              Saving...
            </span>
          ) : lastSaved ? (
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          ) : null}
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
        >
          <Save className="h-3.5 w-3.5" />
          Save
        </button>
      </div>

      {/* Title */}
      <div className="border-b px-6 py-4">
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Note title..."
          className="w-full bg-transparent text-2xl font-bold text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Start writing your note..."
          className="h-full w-full resize-none bg-transparent px-6 py-4 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
        />
      </div>
    </div>
  );
}
