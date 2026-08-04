import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function safeText(value: unknown, maxLength = 5000): string {
  return typeof value === "string" ? value.slice(0, maxLength) : "";
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "کلید OpenAI روی Vercel تنظیم نشده است." },
        { status: 503 },
      );
    }

    const body = await request.json().catch(() => ({}));

    if (body?.ping === true) {
      return NextResponse.json({ ok: true, configured: true });
    }

    const requiredToken = process.env.NIMA_OS_APP_TOKEN;
    if (requiredToken && body?.accessToken !== requiredToken) {
      return NextResponse.json(
        { error: "کد دسترسی Nima OS صحیح نیست." },
        { status: 401 },
      );
    }

    const rawMessages = Array.isArray(body?.messages) ? body.messages : [];
    const messages: ChatMessage[] = rawMessages
      .slice(-12)
      .map((message: unknown) => {
        const item = message as Partial<ChatMessage>;
        return {
          role: item.role === "assistant" ? "assistant" : "user",
          content: safeText(item.content),
        };
      })
      .filter((message: ChatMessage) => message.content.trim().length > 0);

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "پیامی برای ارسال وجود ندارد." },
        { status: 400 },
      );
    }

    const context = {
      tasks: Array.isArray(body?.context?.tasks)
        ? body.context.tasks.slice(0, 20)
        : [],
      health: body?.context?.health ?? {},
      projects: Array.isArray(body?.context?.projects)
        ? body.context.projects.slice(0, 10)
        : [],
    };

    const transcript = messages
      .map((message) => `${message.role}: ${message.content}`)
      .join("\n");

    const client = new OpenAI({ apiKey });
    const response = await client.responses.create({
      model: "gpt-5-mini",
      store: false,
      max_output_tokens: 800,
      instructions:
        "تو Nima AI، دستیار شخصی نیما در اپ Nima OS هستی. همیشه فارسی روان، گرم، صریح و کاربردی پاسخ بده. پاسخ را تا حد ممکن کوتاه نگه دار، اما وقتی تصمیم مهم است دلیل روشن ارائه کن. از اطلاعات وظایف، پروژه‌ها و سلامت فقط برای کمک به برنامه‌ریزی و تصمیم‌گیری استفاده کن. هیچ اقدام حساس، ارسال ایمیل، حذف داده یا تغییر برنامه را بدون تأیید صریح کاربر انجام‌شده فرض نکن. هرگز کلید API، رمز یا اطلاعات امنیتی درخواست نکن.",
      input: `زمینه فعلی کاربر:\n${JSON.stringify(context).slice(0, 7000)}\n\nگفتگو:\n${transcript}`,
    });

    const reply = response.output_text?.trim();
    if (!reply) {
      return NextResponse.json(
        { error: "مدل پاسخی برنگرداند. دوباره تلاش کن." },
        { status: 502 },
      );
    }

    return NextResponse.json({ reply });
  } catch (error) {
    const status =
      typeof error === "object" && error && "status" in error
        ? Number((error as { status?: number }).status) || 500
        : 500;

    const message =
      status === 401
        ? "کلید OpenAI معتبر نیست یا لغو شده است."
        : status === 429
          ? "سقف مصرف یا موجودی API کافی نیست. بخش Billing را بررسی کن."
          : "ارتباط با OpenAI برقرار نشد. دوباره تلاش کن.";

    return NextResponse.json({ error: message }, { status });
  }
}
