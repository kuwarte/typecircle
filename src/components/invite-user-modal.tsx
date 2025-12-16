"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UserPlusIcon } from "lucide-react";
import { addUserToRoom } from "@/services/supabase/actions/rooms";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Controller, useForm } from "react-hook-form";
import { LoadingSwap } from "./ui/loading-swap";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  userId: z.string().min(1).trim(),
});

type FormData = z.infer<typeof formSchema>;

export function InviteUserModal({ roomId }: { roomId: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
    },
  });

  async function onSubmit(data: FormData) {
    const res = await addUserToRoom({ roomId, userId: data.userId });

    if (res.error) {
      toast.error(res.message);
    } else {
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <UserPlusIcon className="w-4 h-4" />
          Invite User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-background/98 backdrop-blur-xl border border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--typecircle-green)]/5 via-transparent to-blue-500/5 pointer-events-none rounded-lg" />
        <div className="relative z-10">
          <DialogHeader>
            <DialogTitle className="text-foreground">Invite User to Room</DialogTitle>
            <DialogDescription className="text-foreground/70 dark:text-muted-foreground">
              Enter the user ID of the person you want to invite to this chat
              room.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
            <Controller
              name="userId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="user-id">User ID</FieldLabel>
                  <Input
                    {...field}
                    id="user-id"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Field orientation="horizontal" className="w-full">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="grow"
              >
                <LoadingSwap isLoading={form.formState.isSubmitting}>
                  Invite User
                </LoadingSwap>
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            </Field>
            </FieldGroup>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
