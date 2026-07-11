import { NextResponse } from "next/server";
import { z } from "zod";

import { getContactProvider } from "@/lib/contact/provider";
import { contactFormSchema } from "@/lib/contact/schema";

const MAX_CONTACT_REQUEST_BYTES = 16 * 1024;
const JSON_CONTENT_TYPE = "application/json";

function jsonResponse(body: object, status: number) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

function hasOversizedContentLength(request: Request) {
  const contentLength = request.headers.get("content-length");

  if (contentLength === null) {
    return false;
  }

  const parsedLength = Number(contentLength);

  return Number.isFinite(parsedLength) && parsedLength > MAX_CONTACT_REQUEST_BYTES;
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();

  if (contentType !== JSON_CONTENT_TYPE) {
    return jsonResponse(
      {
        ok: false,
        message: "İstek JSON biçiminde gönderilmelidir.",
      },
      415,
    );
  }

  if (hasOversizedContentLength(request)) {
    return jsonResponse(
      {
        ok: false,
        message: "Form verisi izin verilen boyutu aşıyor.",
      },
      413,
    );
  }

  let rawBody: string;

  try {
    rawBody = await request.text();
  } catch {
    return jsonResponse(
      {
        ok: false,
        message: "Form verisi okunamadı.",
      },
      400,
    );
  }

  if (new TextEncoder().encode(rawBody).byteLength > MAX_CONTACT_REQUEST_BYTES) {
    return jsonResponse(
      {
        ok: false,
        message: "Form verisi izin verilen boyutu aşıyor.",
      },
      413,
    );
  }

  let payload: unknown;

  try {
    payload = JSON.parse(rawBody) as unknown;
  } catch {
    return jsonResponse(
      {
        ok: false,
        message: "Geçerli bir JSON gövdesi gönderin.",
      },
      400,
    );
  }

  const validationResult = contactFormSchema.safeParse(payload);

  if (!validationResult.success) {
    return jsonResponse(
      {
        ok: false,
        message: "Formdaki eksik veya hatalı alanları kontrol edin.",
        errors: z.flattenError(validationResult.error).fieldErrors,
      },
      422,
    );
  }

  const { website, ...submission } = validationResult.data;

  if (website !== "") {
    // Deliberately acknowledge automated submissions without forwarding them. Returning the
    // same generic success shape prevents the honeypot from becoming an adaptation signal.
    return jsonResponse(
      {
        ok: true,
        message: "Talebiniz alındı.",
      },
      202,
    );
  }

  // TODO(production): Apply a distributed, IP-aware rate limit before enabling delivery.
  const provider = getContactProvider();

  if (provider === null) {
    return jsonResponse(
      {
        ok: false,
        message: "İletişim hizmeti henüz üretim ortamı için yapılandırılmadı.",
      },
      503,
    );
  }

  try {
    const delivery = await provider.send(submission);

    return jsonResponse(
      {
        ok: true,
        mode: delivery.mode,
        delivered: delivery.delivered,
        message: "Form doğrulandı. Geliştirme modunda e-posta gönderilmedi.",
      },
      200,
    );
  } catch {
    return jsonResponse(
      {
        ok: false,
        message: "Talebiniz şu anda işlenemiyor. Lütfen daha sonra yeniden deneyin.",
      },
      500,
    );
  }
}
