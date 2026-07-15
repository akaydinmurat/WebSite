"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  budgetRangeLabels,
  budgetRangeValues,
  contactFormSchema,
  projectTypeLabels,
  projectTypeValues,
  type ContactFormData,
} from "@/lib/contact/schema";

type SubmissionStatus =
  | { state: "idle" }
  | { state: "pending"; message: string }
  | { state: "success"; message: string }
  | { state: "error"; message: string };

interface FieldErrorMessageProps {
  id: string;
  message?: string;
}

const inputClassName =
  "min-h-12 w-full border border-stone-400 bg-transparent px-4 py-3 text-base text-stone-950 transition-colors outline-none placeholder:text-stone-500 hover:border-stone-700 focus-visible:border-stone-950 focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50";
const labelClassName = "text-sm font-medium text-stone-900";

function FieldErrorMessage({ id, message }: FieldErrorMessageProps) {
  if (message === undefined) {
    return null;
  }

  return (
    <p id={id} role="alert" className="text-sm text-red-800">
      {message}
    </p>
  );
}

function getResponseMessage(payload: unknown) {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "message" in payload &&
    typeof payload.message === "string"
  ) {
    return payload.message;
  }

  return undefined;
}

export function ContactForm() {
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>({ state: "idle" });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      approximateArea: "",
      message: "",
      consent: false,
      website: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = handleSubmit(async (data) => {
    setSubmissionStatus({
      state: "pending",
      message: "Görüşme talebiniz gönderiliyor…",
    });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const payload: unknown = await response.json().catch(() => null);
      const responseMessage = getResponseMessage(payload);

      if (!response.ok) {
        throw new Error(
          responseMessage ?? "Görüşme talebiniz gönderilemedi. Lütfen daha sonra yeniden deneyin.",
        );
      }

      reset();
      setSubmissionStatus({
        state: "success",
        message:
          responseMessage ??
          "Görüşme talebiniz alındı. Projenizin ilk adımı için sizinle iletişime geçeceğiz.",
      });
    } catch (error) {
      setSubmissionStatus({
        state: "error",
        message:
          error instanceof Error
            ? error.message
            : "Görüşme talebiniz gönderilemedi. Lütfen daha sonra yeniden deneyin.",
      });
    }
  });

  const isPending = isSubmitting || submissionStatus.state === "pending";

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      aria-labelledby="contact-form-title"
      className="grid gap-6"
    >
      <div className="grid gap-2">
        <h2 id="contact-form-title" className="text-2xl font-medium tracking-tight text-stone-950">
          Mekânınızın ilk brief’ini oluşturalım.
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-stone-600">
          Hayalinizi, mevcut mekânı ve ulaşmak istediğiniz hissi anlatın. Yıldızla işaretlenen
          alanlar zorunludur; bilgileriniz yalnızca talebinize dönüş yapmak için kullanılır.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="contact-name" className={labelClassName}>
            Ad soyad <span aria-hidden="true">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            aria-invalid={errors.name !== undefined}
            aria-describedby={errors.name === undefined ? undefined : "contact-name-error"}
            className={inputClassName}
            {...register("name")}
          />
          <FieldErrorMessage id="contact-name-error" message={errors.name?.message} />
        </div>

        <div className="grid gap-2">
          <label htmlFor="contact-email" className={labelClassName}>
            E-posta <span aria-hidden="true">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            aria-invalid={errors.email !== undefined}
            aria-describedby={errors.email === undefined ? undefined : "contact-email-error"}
            className={inputClassName}
            {...register("email")}
          />
          <FieldErrorMessage id="contact-email-error" message={errors.email?.message} />
        </div>

        <div className="grid gap-2">
          <label htmlFor="contact-phone" className={labelClassName}>
            Telefon <span className="font-normal text-stone-600">(isteğe bağlı)</span>
          </label>
          <input
            id="contact-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={errors.phone !== undefined}
            aria-describedby={errors.phone === undefined ? undefined : "contact-phone-error"}
            className={inputClassName}
            {...register("phone")}
          />
          <FieldErrorMessage id="contact-phone-error" message={errors.phone?.message} />
        </div>

        <div className="grid gap-2">
          <label htmlFor="contact-project-type" className={labelClassName}>
            Proje türü <span aria-hidden="true">*</span>
          </label>
          <select
            id="contact-project-type"
            defaultValue=""
            aria-invalid={errors.projectType !== undefined}
            aria-describedby={
              errors.projectType === undefined ? undefined : "contact-project-type-error"
            }
            className={inputClassName}
            {...register("projectType")}
          >
            <option value="" disabled>
              Seçiniz
            </option>
            {projectTypeValues.map((value) => (
              <option key={value} value={value}>
                {projectTypeLabels[value]}
              </option>
            ))}
          </select>
          <FieldErrorMessage
            id="contact-project-type-error"
            message={errors.projectType?.message}
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="contact-area" className={labelClassName}>
            Yaklaşık alan <span className="font-normal text-stone-600">(m², isteğe bağlı)</span>
          </label>
          <input
            id="contact-area"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Örn. 120"
            aria-invalid={errors.approximateArea !== undefined}
            aria-describedby={
              errors.approximateArea === undefined ? undefined : "contact-area-error"
            }
            className={inputClassName}
            {...register("approximateArea")}
          />
          <FieldErrorMessage id="contact-area-error" message={errors.approximateArea?.message} />
        </div>

        <div className="grid gap-2">
          <label htmlFor="contact-budget" className={labelClassName}>
            Bütçe aralığı <span aria-hidden="true">*</span>
          </label>
          <select
            id="contact-budget"
            defaultValue=""
            aria-invalid={errors.budgetRange !== undefined}
            aria-describedby={errors.budgetRange === undefined ? undefined : "contact-budget-error"}
            className={inputClassName}
            {...register("budgetRange")}
          >
            <option value="" disabled>
              Seçiniz
            </option>
            {budgetRangeValues.map((value) => (
              <option key={value} value={value}>
                {budgetRangeLabels[value]}
              </option>
            ))}
          </select>
          <FieldErrorMessage id="contact-budget-error" message={errors.budgetRange?.message} />
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor="contact-message" className={labelClassName}>
          Hayalinizdeki mekân <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={7}
          aria-invalid={errors.message !== undefined}
          aria-describedby={errors.message === undefined ? undefined : "contact-message-error"}
          className={inputClassName}
          {...register("message")}
        />
        <FieldErrorMessage id="contact-message-error" message={errors.message?.message} />
      </div>

      <div className="grid gap-2">
        <div className="flex items-start gap-3">
          <input
            id="contact-consent"
            type="checkbox"
            aria-invalid={errors.consent !== undefined}
            aria-describedby={
              errors.consent === undefined
                ? "contact-consent-description"
                : "contact-consent-description contact-consent-error"
            }
            className="mt-1 size-5 shrink-0 accent-stone-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
            {...register("consent")}
          />
          <label
            id="contact-consent-description"
            htmlFor="contact-consent"
            className="text-sm leading-6 text-stone-700"
          >
            İletişim bilgilerimin bu talebe dönüş yapılması amacıyla kullanılmasını kabul ediyorum.
            <span aria-hidden="true"> *</span>
          </label>
        </div>
        <FieldErrorMessage id="contact-consent-error" message={errors.consent?.message} />
      </div>

      <div aria-hidden="true" className="absolute top-auto -left-[10000px] size-px overflow-hidden">
        <label htmlFor="contact-website">Web sitesi</label>
        <input
          id="contact-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={isPending}
          aria-describedby="contact-form-status"
          className="inline-flex min-h-12 items-center justify-center bg-stone-950 px-6 py-3 text-sm font-medium text-stone-50 transition-colors hover:bg-stone-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-950 disabled:cursor-wait disabled:opacity-60"
        >
          {isPending ? "Görüşme talebi gönderiliyor…" : "Tasarım görüşmesini başlat"}
        </button>

        <div
          id="contact-form-status"
          aria-live="polite"
          aria-atomic="true"
          className="min-h-6 text-sm"
        >
          {submissionStatus.state !== "idle" ? (
            <p
              role={submissionStatus.state === "error" ? "alert" : "status"}
              className={submissionStatus.state === "error" ? "text-red-800" : "text-stone-700"}
            >
              {submissionStatus.message}
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
}
