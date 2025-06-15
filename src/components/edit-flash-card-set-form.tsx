import z from "zod";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import { EditFlashCardSetParamType } from "@/hooks/useMyFlashCardSet";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const requestSchema = z.object({
  id: z.number(), //
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

export default function EditFlashCardSetForm({
  trigger,
  onSubmit,
  defaultValues,
}: {
  trigger: React.ReactNode;
  defaultValues: z.infer<typeof requestSchema>;
  onSubmit: (data: EditFlashCardSetParamType) => Promise<boolean>;
}) {
  const [open, setOpen] = React.useState(false);

  const form = useForm<z.infer<typeof requestSchema>>({
    resolver: zodResolver(requestSchema),
    defaultValues,
  });

  const _onSubmit = async (data: z.infer<typeof requestSchema>) => {
    const updateData = {
      id: defaultValues.id,
      title: data.title,
      description: data.description,
    };

    if (await onSubmit({ data: updateData, form })) {
      form.reset();
      setOpen(false);
    }
  };

  const _onOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={_onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit flash card set</DialogTitle>
          <DialogDescription>
            Update the details of your flash card set. Make sure to save your
            changes.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(_onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          spellCheck={false}
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          spellCheck={false}
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save change</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
