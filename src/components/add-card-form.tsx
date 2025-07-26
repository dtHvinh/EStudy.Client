import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { UseFormReturn, useForm } from "react-hook-form";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const requestSchema = z.object({
  term: z.string().min(1, "Term is required"),
  definition: z.string().min(1, "Definition is required"),
  partOfSpeech: z.string().optional(),
  example: z.string().optional(),
  note: z.string().optional(),
  image: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, "Image must be less than 3MB")
    .refine((file) => {
      return !file || ACCEPTED_IMAGE_TYPES.includes(file.type);
    }, "Only .jpg, .jpeg, .png and .webp formats are supported."),
});

export default function AddCardForm({
  trigger,
  onSubmit,
  initialTerm = "",

  opened,
  onOpenChange,

  modal = true,
}: {
  trigger: React.ReactNode;
  initialTerm?: string;
  opened?: boolean;
  modal?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit: (
    data: z.infer<typeof requestSchema>,
    form: UseFormReturn<typeof data>,
  ) => Promise<boolean>;
}) {
  const [open, setOpen] = React.useState(false);

  const form = useForm<z.infer<typeof requestSchema>>({
    resolver: zodResolver(requestSchema),
    values: {
      term: initialTerm || "",
      definition: "",
      example: "",
      partOfSpeech: "",
      note: "",
      image: undefined,
    },
  });

  const _onSubmit = async (data: z.infer<typeof requestSchema>) => {
    if (await onSubmit(data, form)) {
      form.reset();
      setOpen(false);
    }
  };

  const _onOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset();
    }
  };

  if (opened && onOpenChange) {
    return (
      <Dialog open={opened} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a new flash card</DialogTitle>
            <DialogDescription>Create a new flash card.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(_onSubmit)}>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="term"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Term</FormLabel>
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
                    name="definition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Definition</FormLabel>
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
                    name="partOfSpeech"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Part of speech</FormLabel>
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
                    name="example"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Example: (Line separate examples)</FormLabel>
                        <FormControl>
                          <Textarea
                            autoComplete="off"
                            spellCheck={false}
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
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Note</FormLabel>
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
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files && e.target.files[0];
                              field.onChange(file);
                            }}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            clearable={true}
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
                <Button type="submit">Create</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog modal={modal} open={open} onOpenChange={_onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new flash card</DialogTitle>
          <DialogDescription>Create a new flash card.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(_onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="term"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Term</FormLabel>
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
                  name="definition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Definition</FormLabel>
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
                  name="partOfSpeech"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Part of speech</FormLabel>
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
                  name="example"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Example: (Line separate examples)</FormLabel>
                      <FormControl>
                        <Textarea
                          autoComplete="off"
                          spellCheck={false}
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
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note</FormLabel>
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
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files && e.target.files[0];
                            field.onChange(file);
                          }}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          clearable={true}
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
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
