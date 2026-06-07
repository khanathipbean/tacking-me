"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, UserPlus, Plus, Trash2, KeyRound, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

const addUserSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type AddUserFormValues = z.infer<typeof addUserSchema>;

const changePasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

type UserProfile = {
  id: string;
  email: string;
  created_at: string;
};

export function UserManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showAddPw, setShowAddPw] = useState(false);
  const [showAddConfirm, setShowAddConfirm] = useState(false);
  const [showChangePw, setShowChangePw] = useState(false);
  const [showChangeConfirm, setShowChangeConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const {
    register: registerPw,
    handleSubmit: handleSubmitPw,
    reset: resetPw,
    formState: { errors: errorsPw },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const res = await fetch("/api/users");
      const json = await res.json();
      if (!res.ok) {
        console.error("Failed to fetch users:", json.error);
        return;
      }
      setUsers(json.users ?? []);
    } catch (err) {
      console.error("Fetch users error:", err);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function onSubmit(data: AddUserFormValues) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error || "Failed to create user");
        return;
      }

      toast.success(`User ${data.email} created successfully`);
      reset();
      setDialogOpen(false);
      fetchUsers();
    } catch {
      toast.error("Failed to create user");
    } finally {
      setIsLoading(false);
    }
  }

  async function onDeleteUser(id: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Failed to delete user");
        return;
      }
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  }

  async function onChangePassword(data: ChangePasswordFormValues) {
    if (!selectedUser) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedUser.id, password: data.password }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Failed to update password");
        return;
      }
      toast.success(`Password updated for ${selectedUser.email}`);
      resetPw();
      setPasswordDialogOpen(false);
      setSelectedUser(null);
    } catch {
      toast.error("Failed to update password");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Header with Add button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {users.length} {users.length === 1 ? "user" : "users"} total
        </p>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={
              <Button size="sm">
                <Plus className="mr-1.5 h-4 w-4" />
                Add User
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new account for your team member.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="add-email" className="text-xs">Email</Label>
                <Input id="add-email" type="email" placeholder="user@example.com" {...register("email")} disabled={isLoading} />
                {errors.email && <p className="text-[11px] text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="add-password" className="text-xs">Password</Label>
                <div className="relative">
                  <Input id="add-password" type={showAddPw ? "text" : "password"} placeholder="Minimum 6 characters" {...register("password")} disabled={isLoading} className="pr-9" />
                  <button type="button" tabIndex={-1} onClick={() => setShowAddPw(!showAddPw)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showAddPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-[11px] text-destructive">{errors.password.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="add-confirm" className="text-xs">Confirm Password</Label>
                <div className="relative">
                  <Input id="add-confirm" type={showAddConfirm ? "text" : "password"} placeholder="Re-enter password" {...register("confirmPassword")} disabled={isLoading} className="pr-9" />
                  <button type="button" tabIndex={-1} onClick={() => setShowAddConfirm(!showAddConfirm)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showAddConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-[11px] text-destructive">{errors.confirmPassword.message}</p>}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setDialogOpen(false)} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <UserPlus className="mr-2 h-3.5 w-3.5" />}
                  {isLoading ? "Creating..." : "Create User"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Users Table */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/40">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">#</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">User</th>
                <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 md:table-cell">Email</th>
                <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 sm:table-cell">Joined</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Status</th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {loadingUsers ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3"><div className="h-4 w-6 animate-pulse rounded bg-muted" /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
                        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell"><div className="h-4 w-40 animate-pulse rounded bg-muted" /></td>
                    <td className="hidden px-4 py-3 sm:table-cell"><div className="h-4 w-20 animate-pulse rounded bg-muted" /></td>
                    <td className="px-4 py-3"><div className="h-5 w-14 animate-pulse rounded-full bg-muted" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-16 animate-pulse rounded bg-muted ml-auto" /></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    No users yet. Click &quot;Add User&quot; to create one.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 text-xs text-muted-foreground">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                        <span className="truncate font-medium">{user.email.split("@")[0]}</span>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <span className="text-muted-foreground">{user.email}</span>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span className="text-xs text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 ring-1 ring-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:ring-emerald-700">
                        Active
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setSelectedUser(user); resetPw(); setPasswordDialogOpen(true); }}
                          className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          title="Change password"
                        >
                          <KeyRound className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteUser(user.id)}
                          disabled={deletingId === user.id}
                          className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50"
                          title="Delete user"
                        >
                          {deletingId === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={(open) => { setPasswordDialogOpen(open); if (!open) { setSelectedUser(null); resetPw(); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Set a new password for {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitPw(onChangePassword)} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="pw-new" className="text-xs">New Password</Label>
              <div className="relative">
                <Input id="pw-new" type={showChangePw ? "text" : "password"} placeholder="Minimum 6 characters" {...registerPw("password")} disabled={isLoading} className="pr-9" />
                <button type="button" tabIndex={-1} onClick={() => setShowChangePw(!showChangePw)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showChangePw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errorsPw.password && <p className="text-[11px] text-destructive">{errorsPw.password.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pw-confirm" className="text-xs">Confirm Password</Label>
              <div className="relative">
                <Input id="pw-confirm" type={showChangeConfirm ? "text" : "password"} placeholder="Re-enter password" {...registerPw("confirmPassword")} disabled={isLoading} className="pr-9" />
                <button type="button" tabIndex={-1} onClick={() => setShowChangeConfirm(!showChangeConfirm)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showChangeConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errorsPw.confirmPassword && <p className="text-[11px] text-destructive">{errorsPw.confirmPassword.message}</p>}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => { setPasswordDialogOpen(false); setSelectedUser(null); resetPw(); }} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <KeyRound className="mr-2 h-3.5 w-3.5" />}
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
