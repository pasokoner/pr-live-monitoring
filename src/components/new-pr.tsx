"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { Inventory, User } from "@/server/db/schema";

import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { newPrSchema } from "@/lib/schema";
import { api } from "@/trpc/react";
import { useState } from "react";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";

type NewPrProps = {
  inventories: (Inventory & { focal: User })[];
};

export default function NewPr({ inventories }: NewPrProps) {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const utils = api.useUtils();

  const { mutate, isLoading } = api.supply.new.useMutation({
    onSuccess: async (e) => {
      setSuccess(e.message);
      form.resetField("prControl");
      await utils.invalidate();
    },
    onError(error) {
      setError(error.message);
    },
  });

  const form = useForm<z.infer<typeof newPrSchema>>({
    resolver: zodResolver(newPrSchema),
    defaultValues: {
      prControl: "",
      inventoryId: "",
    },
  });

  function onSubmit(values: z.infer<typeof newPrSchema>) {
    setSuccess("");
    setError("");
    mutate(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New PR</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="text-left">
          <DialogTitle>Create New PR</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="inventoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select supply</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a supply" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {inventories.map(({ id, name }) => (
                            <SelectItem key={id} value={id}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="prControl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PR Control</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormSuccess message={success} />
                <FormError message={error} />

                <Button disabled={isLoading} type="submit">
                  Submit
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
