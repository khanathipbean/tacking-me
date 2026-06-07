import { PageHeader } from "@/components/shared/page-header";
import { AddUserForm } from "@/features/users";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        heading="Users"
        description="Create and manage user accounts"
      />
      <div className="max-w-md">
        <AddUserForm />
      </div>
    </div>
  );
}
