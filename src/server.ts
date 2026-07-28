import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import {
  SERVICE_ACCOUNT_CREDENTIALS,
  GMAIL_SCOPES,
  sendGmailMessage,
  fetchGmailMessages,
  generateGeminiEmailResponse,
} from "./lib/gmail-service";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);

    // Gmail API & Gemini Integration Endpoints
    if (url.pathname === "/api/gmail/status") {
      return new Response(
        JSON.stringify({
          connected: true,
          type: "service_account",
          clientEmail: SERVICE_ACCOUNT_CREDENTIALS.client_email,
          projectId: SERVICE_ACCOUNT_CREDENTIALS.project_id,
          allocatedSender: "techwizardsassociation@gmail.com",
          scopes: GMAIL_SCOPES,
          timestamp: new Date().toISOString(),
        }),
        { headers: { "Content-Type": "application/json" } },
      );
    }

    if (url.pathname === "/api/gmail/send" && request.method === "POST") {
      try {
        const body = await request.json();
        const result = await sendGmailMessage(body);
        return new Response(JSON.stringify(result), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (err: unknown) {
        const errObj = err instanceof Error ? err : new Error(String(err));
        return new Response(
          JSON.stringify({ success: false, error: errObj.message || "Failed to send email" }),
          { status: 500, headers: { "Content-Type": "application/json" } },
        );
      }
    }

    if (
      url.pathname === "/api/gmail/fetch-inbox" &&
      (request.method === "GET" || request.method === "POST")
    ) {
      try {
        const result = await fetchGmailMessages();
        return new Response(JSON.stringify(result), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (err: unknown) {
        const errObj = err instanceof Error ? err : new Error(String(err));
        return new Response(
          JSON.stringify({
            success: false,
            error: errObj.message || "Failed to fetch inbox",
            messages: [],
          }),
          { status: 500, headers: { "Content-Type": "application/json" } },
        );
      }
    }

    if (url.pathname === "/api/gmail/ai-auto-response" && request.method === "POST") {
      try {
        const body = await request.json();
        const response = await generateGeminiEmailResponse(body);
        return new Response(JSON.stringify(response), {
          headers: { "Content-Type": "application/json" },
        });
      } catch {
        return new Response(
          JSON.stringify({
            subject: `Re: Inquiry — Tech Wizard Association (SHASC)`,
            body: `Dear Student,\n\nThank you for reaching out to TWA!`,
          }),
          { headers: { "Content-Type": "application/json" } },
        );
      }
    }

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
