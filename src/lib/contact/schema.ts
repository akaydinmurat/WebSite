import { z } from "zod";

export const projectTypeValues = [
  "interior-architecture",
  "three-dimensional-visualization",
  "room-design",
  "kitchen-design",
  "online-consulting",
  "material-selection",
  "other",
] as const;

export type ProjectType = (typeof projectTypeValues)[number];

export const projectTypeLabels: Record<ProjectType, string> = {
  "interior-architecture": "İç mimari",
  "three-dimensional-visualization": "3D görselleştirme",
  "room-design": "Oda tasarımı",
  "kitchen-design": "Mutfak tasarımı",
  "online-consulting": "Online tasarım danışmanlığı",
  "material-selection": "Malzeme ve mobilya seçimi",
  other: "Diğer",
};

export const budgetRangeValues = [
  "under-250k",
  "250k-500k",
  "500k-1m",
  "over-1m",
  "undecided",
] as const;

export type BudgetRange = (typeof budgetRangeValues)[number];

export const budgetRangeLabels: Record<BudgetRange, string> = {
  "under-250k": "₺250.000 altı",
  "250k-500k": "₺250.000 – ₺500.000",
  "500k-1m": "₺500.000 – ₺1.000.000",
  "over-1m": "₺1.000.000 üzeri",
  undecided: "Henüz belirlemedim",
};

const optionalPhoneSchema = z
  .string()
  .trim()
  .max(30, "Telefon numarası en fazla 30 karakter olabilir.")
  .refine(
    (value) => value === "" || /^(?:\+?[\d\s().-]{7,30})$/.test(value),
    "Geçerli bir telefon numarası girin.",
  );

const optionalAreaSchema = z
  .string()
  .trim()
  .max(5, "Yaklaşık alan en fazla 5 basamak olabilir.")
  .refine(
    (value) => value === "" || /^[1-9]\d{0,4}$/.test(value),
    "Yaklaşık alanı pozitif bir tam sayı olarak girin.",
  );

export const contactFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Adınız en az 2 karakter olmalıdır.")
      .max(80, "Adınız en fazla 80 karakter olabilir."),
    email: z
      .string()
      .trim()
      .max(254, "E-posta adresi en fazla 254 karakter olabilir.")
      .email("Geçerli bir e-posta adresi girin."),
    phone: optionalPhoneSchema,
    projectType: z.enum(projectTypeValues, {
      error: "Bir proje türü seçin.",
    }),
    approximateArea: optionalAreaSchema,
    budgetRange: z.enum(budgetRangeValues, {
      error: "Bir bütçe aralığı seçin.",
    }),
    message: z
      .string()
      .trim()
      .min(20, "Mesajınız en az 20 karakter olmalıdır.")
      .max(2_000, "Mesajınız en fazla 2.000 karakter olabilir."),
    consent: z.boolean().refine((value) => value, {
      message: "İletişim kurulabilmesi için onay vermelisiniz.",
    }),
    website: z.string().trim().max(200, "Geçersiz form verisi."),
  })
  .strict();

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type ContactSubmission = Omit<ContactFormData, "website">;
