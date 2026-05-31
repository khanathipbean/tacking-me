import { LoginForm } from "@/features/auth";
import { siteConfig } from "@/lib/constants";
import { ClipboardCheck } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ClipboardCheck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">{siteConfig.name}</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to manage your projects and tasks
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
