"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./NimaOS.module.css";

type Task = { id: number; title: string; meta: string; done: boolean };
type Project = { name: string; subtitle: string; progress: number; icon: string };
type Message = { role: "user" | "assistant"; content: string };
type StoredState = {
  tasks: Task[];
  projects: Project[];
  messages: Message[];
  health: { energy: number; sleep: number; water: number };
};

const STORAGE_KEY = "nima-os-state-v1";
const TOKEN_KEY = "nima-os-access-token";

const initialState: StoredState = {
  tasks: [
    { id: 1, title: "ارسال ایمیل به ریکروترهای هلند", meta: "کاریابی · امروز", done: false },
    { id: 2, title: "تصمیم‌گیری درباره مسیر محصول iQlinic", meta: "کار عمیق", done: false },
    { id: 3, title: "۴۵ دقیقه پیاده‌روی", meta: "سلامت · ساعت ۱۸:۳۰", done: false },
  ],
  projects: [
    { name: "iQlinic", subtitle: "AI Product & Healthtech", progress: 72, icon: "iQ" },
    { name: "کاریابی هلند", subtitle: "Recruiter Outreach", progress: 34, icon: "NL" },
    { name: "برند شخصی نیما", subtitle: "محتوا و جایگاه حرفه‌ای", progress: 58, icon: "NS" },
  ],
  messages: [
    {
      role: "assistant",
      content: "سلام نیما. من Nima AI هستم. می‌توانم با توجه به کارها، پروژه‌ها و انرژی امروزت کمک کنم تصمیم روشن‌تری بگیری.",
    },
  ],
  health: { energy: 64, sleep: 6.8, water: 5 },
};

export default function NimaOSPage() {
  const [state, setState] = useState<StoredState>(initialState);
  const [activeTab, setActiveTab] = useState<"today" | "chat">("today");
  const [accessToken, setAccessToken] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [apiStatus, setApiStatus] = useState("در حال بررسی");
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setState(JSON.parse(stored) as StoredState);
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        setAccessToken(token);
        setUnlocked(true);
      }
    } catch {
      setState(initialState);
    }
  }, []);

  useEffect(() => {
    if (!unlocked) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, unlocked]);

  useEffect(() => {
    if (!unlocked) return;
    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ping: true }),
    })
      .then(async (response) => {
        if (response.ok) setApiStatus("OpenAI آماده");
        else if (response.status === 503) setApiStatus("کلید لازم است");
        else setApiStatus("API آماده");
      })
      .catch(() => setApiStatus("اتصال نامشخص"));
  }, [unlocked]);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
  }, [state.messages, sending, activeTab]);

  const openTasks = useMemo(() => state.tasks.filter((task) => !task.done), [state.tasks]);

  function unlock() {
    const token = accessToken.trim();
    if (token.length < 4) {
      setError("کد دسترسی باید حداقل ۴ کاراکتر باشد.");
      return;
    }
    localStorage.setItem(TOKEN_KEY, token);
    setUnlocked(true);
    setError("");
  }

  function toggleTask(id: number) {
    setState((current) => ({
      ...current,
      tasks: current.tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    }));
  }

  async function sendMessage() {
    const value = input.trim();
    if (!value || sending) return;

    const nextMessages: Message[] = [...state.messages, { role: "user", content: value }];
    setState((current) => ({ ...current, messages: nextMessages }));
    setInput("");
    setSending(true);
    setError("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken,
          messages: nextMessages.slice(-12),
          context: {
            tasks: state.tasks,
            projects: state.projects,
            health: state.health,
          },
        }),
      });

      const data = (await response.json()) as { reply?: string; error?: string };
      if (!response.ok || !data.reply) throw new Error(data.error || "پاسخی دریافت نشد.");

      setState((current) => ({
        ...current,
        messages: [...current.messages, { role: "assistant", content: data.reply! }],
      }));
      setApiStatus("OpenAI متصل");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "خطا در ارتباط با OpenAI");
    } finally {
      setSending(false);
    }
  }

  if (!unlocked) {
    return (
      <div className={styles.shell}>
        <main className={`${styles.app} ${styles.lock}`}>
          <section className={styles.lockBox}>
            <div className={styles.logo}>N</div>
            <h1>Nima OS</h1>
            <p>کد دسترسی‌ای را وارد کن که در متغیر محیطی <b>NIMA_OS_APP_TOKEN</b> روی Vercel ثبت کرده‌ای.</p>
            {error && <div className={styles.error}>{error}</div>}
            <input
              type="password"
              value={accessToken}
              onChange={(event) => setAccessToken(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && unlock()}
              placeholder="کد دسترسی"
              autoComplete="current-password"
            />
            <button className={styles.primary} onClick={unlock}>ورود به مرکز فرمان</button>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      <main className={styles.app}>
        <header className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.logo}>N</div>
            <div><b>Nima OS</b><small>دستیار شخصی و مرکز فرمان روزانه</small></div>
          </div>
          <div className={styles.status}>{apiStatus}</div>
        </header>

        {activeTab === "today" ? (
          <>
            <section className={styles.hero}>
              <small>امروز</small>
              <h1>سلام نیما 👋</h1>
              <p>یک تصمیم روشن، یک کار عمیق و کمی مراقبت از بدن برای امروز کافی است.</p>
              <div className={styles.stats}>
                <div className={styles.stat}><span>انرژی</span><b>{state.health.energy}%</b></div>
                <div className={styles.stat}><span>خواب</span><b>{state.health.sleep}h</b></div>
                <div className={styles.stat}><span>آب</span><b>{state.health.water}</b></div>
              </div>
            </section>

            <section className={styles.card}>
              <div className={styles.head}><h2>سه اولویت امروز</h2><span>{openTasks.length} کار باز</span></div>
              {state.tasks.map((task) => (
                <div className={styles.task} key={task.id}>
                  <button
                    className={`${styles.check} ${task.done ? styles.checkOn : ""}`}
                    onClick={() => toggleTask(task.id)}
                    aria-label={task.done ? "بازگرداندن کار" : "تکمیل کار"}
                  >✓</button>
                  <div className={styles.copy}>
                    <b className={task.done ? styles.done : ""}>{task.title}</b>
                    <small>{task.meta}</small>
                  </div>
                </div>
              ))}
            </section>

            <section className={styles.card}>
              <div className={styles.head}><h2>پروژه‌های فعال</h2><span>تمرکزهای اصلی</span></div>
              <div className={styles.projectList}>
                {state.projects.map((project) => (
                  <div className={styles.project} key={project.name}>
                    <div className={styles.projectTop}>
                      <div className={styles.projectIcon}>{project.icon}</div>
                      <div className={styles.copy}><b>{project.name}</b><small>{project.subtitle}</small></div>
                      <div className={styles.projectPct}>{project.progress}%</div>
                    </div>
                    <div className={styles.bar}><i style={{ width: `${project.progress}%` }} /></div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <section className={`${styles.card} ${styles.chat}`}>
            <div className={styles.head}><h2>Nima AI</h2><span>متصل به OpenAI</span></div>
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.messages} ref={messagesRef}>
              {state.messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`${styles.message} ${message.role === "user" ? styles.user : styles.assistant}`}
                >{message.content}</div>
              ))}
              {sending && <div className={styles.typing}>Nima AI در حال فکر کردن است...</div>}
            </div>
            <div className={styles.composer}>
              <textarea
                rows={1}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void sendMessage();
                  }
                }}
                placeholder="مثلاً امروز روی چه کاری تمرکز کنم؟"
              />
              <button className={styles.send} onClick={() => void sendMessage()} disabled={sending}>↑</button>
            </div>
            <div className={styles.hint}>وظایف، پروژه‌ها و وضعیت انرژی برای پاسخ بهتر به دستیار ارسال می‌شوند. کلید API هرگز به مرورگر فرستاده نمی‌شود.</div>
          </section>
        )}

        <nav className={styles.tabs}>
          <button className={activeTab === "today" ? styles.active : ""} onClick={() => setActiveTab("today")}>امروز من</button>
          <button className={activeTab === "chat" ? styles.active : ""} onClick={() => setActiveTab("chat")}>دستیار هوشمند</button>
        </nav>
      </main>
    </div>
  );
}
