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
import type { AttendanceType, Inventory, User } from "@/server/db/schema";

import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { newAttendanceSchema, newPrSchema } from "@/lib/schema";
import { api } from "@/trpc/react";
import { useState } from "react";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
import { format } from "date-fns";

export default function NewAttendee() {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const utils = api.useUtils();

  const { mutate, isLoading } = api.attendance.new.useMutation({
    onSuccess: async (e) => {
      setSuccess(e.message);
      form.resetField("employeeName");
      await utils.invalidate();
    },
    onError(error) {
      setError(error.message);
    },
  });

  const form = useForm<z.infer<typeof newAttendanceSchema>>({
    resolver: zodResolver(newAttendanceSchema),
    defaultValues: {
      employeeName: "",
    },
  });

  function onSubmit(values: z.infer<typeof newAttendanceSchema>) {
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
          <DialogTitle>
            {format(new Date(), "MM/dd/yyy")} Attendance
          </DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select attendance type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="travel_order">
                            Travel Order
                          </SelectItem>
                          <SelectItem value="official_business">
                            Official Business
                          </SelectItem>
                          <SelectItem value="on_leave">On Leave</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employeeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee Name</FormLabel>
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
