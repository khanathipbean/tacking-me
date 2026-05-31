import { PageHeader } from "@/components/shared/page-header";
import { NoteList } from "@/features/notes";

export default function NotesPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        heading="Notes"
        description="Select a project and write your notes"
      />
      <NoteList />
    </div>
  );
}
