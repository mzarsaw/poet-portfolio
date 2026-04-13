import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  password: z.string().min(1, "Şifre gereklidir"),
});

export const poemSchema = z.object({
  titleTr: z.string().min(1, "Türkçe başlık gereklidir"),
  titleEn: z.string().optional().default(""),
  contentTr: z.string().min(1, "Türkçe içerik gereklidir"),
  contentEn: z.string().optional().default(""),
  category: z.string().optional().default(""),
  audioFilePath: z.string().optional().default(""),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(false),
});

export const audioWorkSchema = z.object({
  titleTr: z.string().min(1, "Türkçe başlık gereklidir"),
  titleEn: z.string().optional().default(""),
  descriptionTr: z.string().optional().default(""),
  descriptionEn: z.string().optional().default(""),
  filePath: z.string().min(1, "Ses dosyası gereklidir"),
  category: z.enum(["commercial", "audiobook", "poetry"]).default("poetry"),
  duration: z.number().int().min(0).default(0),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(false),
});

export const testimonialSchema = z.object({
  name: z.string().min(1, "İsim gereklidir"),
  role: z.string().optional().default(""),
  quoteTr: z.string().min(1, "Türkçe alıntı gereklidir"),
  quoteEn: z.string().optional().default(""),
  published: z.boolean().optional().default(false),
  sortOrder: z.number().int().optional().default(0),
});

export const pageSchema = z.object({
  titleTr: z.string().min(1, "Türkçe başlık gereklidir"),
  titleEn: z.string().optional().default(""),
  contentTr: z.string().optional().default(""),
  contentEn: z.string().optional().default(""),
  metaTitleTr: z.string().optional().default(""),
  metaTitleEn: z.string().optional().default(""),
  metaDescriptionTr: z.string().optional().default(""),
  metaDescriptionEn: z.string().optional().default(""),
});

export const contactSchema = z.object({
  name: z.string().min(1, "İsim gereklidir / Name is required"),
  email: z.string().email("Geçerli bir e-posta adresi girin / Enter a valid email"),
  subject: z.string().optional().default(""),
  message: z.string().min(1, "Mesaj gereklidir / Message is required"),
  honeypot: z.string().max(0).optional(), // spam protection
});

export const newsletterSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin / Enter a valid email"),
});

export const settingsSchema = z.record(z.string(), z.string());

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Mevcut şifre gereklidir"),
  newPassword: z.string().min(8, "Yeni şifre en az 8 karakter olmalıdır"),
  confirmPassword: z.string().min(1, "Şifre tekrarı gereklidir"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"],
});
