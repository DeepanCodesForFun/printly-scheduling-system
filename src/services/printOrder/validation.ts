import { z } from "zod";

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25 MB per file
const MAX_TOTAL_BYTES = 100 * 1024 * 1024; // 100 MB per order
const MAX_FILES = 20;

export const createOrderSchema = z.object({
  studentName: z.string().trim().min(1, "Name is required").max(120, "Name too long"),
  studentId: z
    .string()
    .trim()
    .min(1, "Student ID is required")
    .max(50, "Student ID too long")
    .regex(/^[A-Za-z0-9._\-\/]+$/, "Student ID has invalid characters"),
  additionalDetails: z.string().max(200, "Instructions are limited to 200 characters").optional(),
  amount: z.number().nonnegative("Amount must be positive").max(100000, "Amount too large"),
  config: z.object({
    color: z.enum(["bw", "color"]),
    sides: z.enum(["single", "double"]),
    copies: z.string().regex(/^\d+$/, "Copies must be a number"),
  }),
});

export const validateFiles = (files: File[]): string | null => {
  if (!files.length) return "Please upload at least one file.";
  if (files.length > MAX_FILES) return `You can upload at most ${MAX_FILES} files per order.`;
  let total = 0;
  for (const f of files) {
    if (f.size === 0) return `"${f.name}" is empty.`;
    if (f.size > MAX_FILE_BYTES) return `"${f.name}" exceeds 25 MB.`;
    if (f.type && !ALLOWED_TYPES.has(f.type)) {
      return `"${f.name}" has an unsupported file type.`;
    }
    total += f.size;
  }
  if (total > MAX_TOTAL_BYTES) return "Total upload size exceeds 100 MB.";
  return null;
};