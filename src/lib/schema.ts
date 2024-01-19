import { attendanceType } from "@/server/db/schema";
import * as z from "zod";

export const signupSchema = z.object({
  username: z
    .string()
    .min(2, "Minimum 6 characters required")
    .max(16, "Maximum 16 characters required"),
  name: z.string().min(1, "Name is required"),
  contactNumber: z
    .string()
    .regex(new RegExp("^(09)[0-9]{9}$"), "Invalid mobile number"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(8, "Minimum 8 characters required"),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required safasfasf"),
  password: z.string().min(1, "Password is required"),
});

export const newPrSchema = z.object({
  prControl: z.string().min(1, "PR Control is required"),
  inventoryId: z.string().min(1, "Supply is required"),
});

export const newAttendanceSchema = z.object({
  employeeName: z.string().min(1, "Employee Name is required"),
  type: z
    .enum(attendanceType)
    .refine((v) => !!v, { message: "Attendance type is required" }),
});
