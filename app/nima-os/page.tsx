"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./NimaOS.module.css";

type Tab = "today" | "plan" | "projects" | "health" | "chat";
type Task = { id: number; title: string; meta: string; done: boolean };
type Project = { name: string; subtitle: string; progress: number; icon: string };
type Message = { role: "user" | "assistant"; content: string };
type ScheduleItem = { time: string; title: string; note: string };
type Approval = { id: number; title: string; note: string; status: "pending" | "approved" | "rejected" };
type StoredState = {
  tasks: Task[];
  projects: Project[];
  messages: Message[];
  schedule: ScheduleItem[];
  approvals: Approval[];
  health: { energy: number; sleep: number; water: number; weight: number; mood: number };
};

const STORAGE_KEY = "nima-os-state-v2";
const TOKEN_KEY = "nima-os-access-token";

const initialState: StoredState = {
  tasks: [
    { id: 1, title: "ارسال ایمیل به ریکروترهای هلند", meta: "کاریابی · امروز", done: false },
    { id: 2, title: "تصمیم‌گیری درباره مسیر محصول iQlinic", meta: "کار عمیق", done: false },
    { id: 3, title: "۴۵ دقیقه پیاده‌روی", meta: "سلامت · ساعت ۱۸:۳۰", done: false },
    { id: 4, title: "مرور یک درس Machine Learning", meta: "یادگیری · ۳۰ دقیقه", done: false },
  ],
  projects: [
    { name: "iQlinic", subtitle: "AI Product & Healthtech", progress: 72, icon: "iQ" },
    { name: "کاریابی بین‌المللی", subtitle: "Recruiter Outreach", progress: 34, icon: "NL" },
    { name: "برند شخصی نیما", subtitle: "محتوا و جایگاه حرفه‌ای", progress: 58, icon: "NS" },
  ],
  schedule: [
    { time: "09:30", title: "ایمیل و ارتباطات کاری", note: "بدون شبکه اجتماعی" },
    { time: "12:30", title: "ناهار و استراحت", note: "وعده پروتئینی" },
    { time: "15:30", title: "کار عمیق روی محصول", note: "فقط یک تصمیم اصلی" },
    { time: "18:30", title: "پیاده‌روی", note: "۴۵ دقیقه" },
  ],
  approvals: [
    { id: 1, title: "انتقال کار iQlinic به ساعت ۱۵:۳۰", note: "پیشنهاد Nima AI", status: "pending" },
    { id: 2, title: "ساخت یادآور پیاده‌روی عصر", note: "نیازمند تأیید تو", status: "pending" },
  ],
  messages: [
    {
      role: "assistant",
      content: "سلام نیما. من Nima AI هستم. می‌توانم با توجه به کارها، پروژه‌ها و انرژی امروزت کمک کنم تصمیم روشن‌تری بگیری.",
    },
  ],
  health: { energy: 64, sleep: 6.8, water: 5, weight: 105, mood: 62 },
};

function normalizeState(value: Partial<StoredState>): StoredState {
  return {
    ...initialState,
    ...value,
    tasks: Array.isArray(value.tasks) ? value.tasks : initialState.tasks,
    projects: Array.isArray(value.projects) ? value.projects : initialState.projects,
    messages: Array.isArray(value.messages) ? value.messages : initialState.messages,
    schedule: Array.isArray(value.schedule) ? value.schedule : initialState.schedule,
    approvals: Array.isArray(value.approvals) ? value.approvals : initialState.approvals,
    health: { ...initialState.health, ...(value.health || {}) },
  };
}

export default function NimaOSPage() {
  const [state, setState] = useState<StoredState>(initialState);
  const [activeTab, setActiveTab] = useState<Tab>("today");
  const [accessToken, setAccessToken] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [newTask, setNewTask] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [apiStatus, setApiStatus] = useState("در حال بررسی");
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setState(normalizeState(JSON.parse(stored) as Partial<StoredState>));
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
    if (unlocked) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, unlocked]);

  useEffect(() => {
    if (!unlocked) return;
    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ping: true, accessToken }),
    })
      .then((response) => {
        if (response.ok) setApiStatus("OpenAI آماده");
        else if (response.status === 503) setApiStatus("کلید لازم است");
        else if (response.status === 401) setApiStatus("کد ورود نادرست");
        else setApiStatus("API آماده");
      })
      .catch(() => setApiStatus("اتصال نامشخص"));
  }, [unlocked, accessToken]);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
  }, [state.messages, sending, activeTab]);

  const openTasks = useMemo(() => state.tasks.filter((task) => !task.done), [state.tasks]);
  const pendingApprovals = useMemo(
    () => state.approvals.filter((approval) => approval.status === "pending"),
    [state.approvals],
  );
  const persianDate = useMemo(
    () => new Intl.DateTimeFormat("fa-IR", { weekday: "long", day: "numeric", month: "long" }).format(new Date()),
    [],
  );

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

  function addTask() {
    const title = newTask.trim();
    if (!title) return;
    setState((current) => ({
      ...current,
      tasks: [{ id: Date.now(), title, meta: "ثبت‌شده در Nima OS", done: false }, ...current.tasks],
    }));
    setNewTask("");
  }

  function updateApproval(id: number, status: "approved" | "rejected") {
    setState((current) => ({
      ...current,
      approvals: current.approvals.map((approval) => (approval.id === id ? { ...approval, status } : approval)),
    }));
  }

  function adjustHealth(field: "water" | "energy" | "mood", amount: number) {
    setState((current) => ({
      ...current,
      health: {
        ...current.health,
        [field]: Math.max(0, Math.min(field === "water" ? 20 : 100, current.health[field] + amount)),
      },
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
          context: { tasks: state.tasks, projects: state.projects, health: state.health },
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

  function TaskList({ limit }: { limit?: number }) {
    const items = typeof limit === "number" ? state.tasks.slice(0, limit) : state.tasks;
    return (
      <>
        {items.map((task) => (
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
      </>
    );
  }

  function ProjectList() {
    return (
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
    );
  }

  function TodayView() {
    return (
      <>
        <section className={styles.hero}>
          <small>{persianDate}</small>
          <h2>سلام نیما 👋</h2>
          <p>امروز لازم نیست همه‌چیز را حل کنی. یک تصمیم روشن، یک کار عمیق و کمی مراقبت از بدن کافی است.</p>
          <div className={styles.stats}>
            <div className={styles.stat}><span>انرژی</span><b>{state.health.energy}%</b></div>
            <div className={styles.stat}><span>خواب</span><b>{state.health.sleep}h</b></div>
            <div className={styles.stat}><span>آب</span><b>{state.health.water}</b></div>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.head}><h2>اولویت‌های امروز</h2><span>{openTasks.length} کار باز</span></div>
          <TaskList limit={3} />
        </section>

        <section className={`${styles.card} ${styles.aiCard}`}>
          <div className={styles.aiTop}>
            <div className={styles.orb} />
            <div className={styles.copy}><b>پیشنهاد Nima AI</b><small>براساس انرژی و برنامه امروز</small></div>
          </div>
          <p>ابتدا ارتباطات کاری را ببند. بعد از ناهار فقط روی یک تصمیم محصول تمرکز کن و پیاده‌روی عصر را حذف نکن.</p>
          <button className={styles.secondary} onClick={() => setActiveTab("chat")}>گفت‌وگو با دستیار</button>
        </section>

        <section className={styles.card}>
          <div className={styles.head}><h2>برنامه امروز</h2><span>{state.schedule.length} بازه</span></div>
          <div className={styles.timeline}>
            {state.schedule.map((item) => (
              <div className={styles.timelineItem} key={`${item.time}-${item.title}`}>
                <div className={styles.time}>{item.time}</div>
                <div className={styles.copy}><b>{item.title}</b><small>{item.note}</small></div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.head}><h2>نبض امروز</h2><span>وضعیت بدن</span></div>
          <div className={styles.grid2}>
            <div className={styles.metric}><span>وزن</span><b>{state.health.weight} kg</b><div className={styles.bar}><i style={{ width: "65%" }} /></div></div>
            <div className={styles.metric}><span>خلق</span><b>{state.health.mood}%</b><div className={styles.bar}><i style={{ width: `${state.health.mood}%` }} /></div></div>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.head}><h2>پروژه‌های فعال</h2><span>تمرکزهای اصلی</span></div>
          <ProjectList />
        </section>

        <section className={styles.card}>
          <div className={styles.head}><h2>منتظر تأیید</h2><span>{pendingApprovals.length} مورد</span></div>
          {pendingApprovals.length === 0 ? <div className={styles.empty}>موردی منتظر تأیید نیست.</div> : pendingApprovals.map((approval) => (
            <div className={styles.approval} key={approval.id}>
              <div className={styles.copy}><b>{approval.title}</b><small>{approval.note}</small></div>
              <span className={styles.badge}>تأیید؟</span>
              <button className={styles.secondary} onClick={() => updateApproval(approval.id, "rejected")}>رد</button>
              <button className={styles.primary} onClick={() => updateApproval(approval.id, "approved")}>بله</button>
            </div>
          ))}
        </section>
      </>
    );
  }

  function PlanView() {
    return (
      <>
        <div className={styles.pageTitle}><h1>برنامه و کارها</h1><span>{openTasks.length} کار باز</span></div>
        <section className={styles.card}>
          <div className={styles.head}><h2>افزودن سریع</h2><span>روی همین گوشی ذخیره می‌شود</span></div>
          <div className={styles.formRow}>
            <input
              className={styles.input}
              value={newTask}
              onChange={(event) => setNewTask(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && addTask()}
              placeholder="کار جدید را بنویس"
            />
            <button className={styles.primary} onClick={addTask}>افزودن</button>
          </div>
        </section>
        <section className={styles.card}>
          <div className={styles.head}><h2>همه وظایف</h2><span>{state.tasks.length} مورد</span></div>
          <TaskList />
        </section>
        <section className={styles.card}>
          <div className={styles.head}><h2>تقویم امروز</h2><span>برنامه پیشنهادی</span></div>
          <div className={styles.timeline}>
            {state.schedule.map((item) => (
              <div className={styles.timelineItem} key={`${item.time}-${item.title}`}>
                <div className={styles.time}>{item.time}</div>
                <div className={styles.copy}><b>{item.title}</b><small>{item.note}</small></div>
              </div>
            ))}
          </div>
        </section>
      </>
    );
  }

  function ProjectsView() {
    return (
      <>
        <div className={styles.pageTitle}><h1>پروژه‌ها</h1><span>سه مسیر فعال</span></div>
        <section className={styles.card}>
          <div className={styles.head}><h2>تمرکزهای اصلی</h2><span>پیشرفت تقریبی</span></div>
          <ProjectList />
        </section>
        <section className={`${styles.card} ${styles.aiCard}`}>
          <div className={styles.aiTop}><div className={styles.orb} /><div className={styles.copy}><b>جمع‌بندی هوشمند</b><small>پیشنهاد برای هفته جاری</small></div></div>
          <p>iQlinic به یک تصمیم محصول نیاز دارد، نه قابلیت تازه. کاریابی بین‌المللی به حجم ارتباطات منظم نیاز دارد. برند شخصی فعلاً باید نقش پشتیبان این دو مسیر را داشته باشد.</p>
        </section>
      </>
    );
  }

  function HealthView() {
    return (
      <>
        <div className={styles.pageTitle}><h1>سلامت و انرژی</h1><span>ثبت روزانه</span></div>
        <section className={styles.card}>
          <div className={styles.head}><h2>وضعیت امروز</h2><span>قابل تغییر</span></div>
          <div className={styles.grid2}>
            <div className={styles.metric}><span>انرژی</span><b>{state.health.energy}%</b><div className={styles.bar}><i style={{ width: `${state.health.energy}%` }} /></div></div>
            <div className={styles.metric}><span>خلق</span><b>{state.health.mood}%</b><div className={styles.bar}><i style={{ width: `${state.health.mood}%` }} /></div></div>
            <div className={styles.metric}><span>آب</span><b>{state.health.water}</b><div className={styles.bar}><i style={{ width: `${Math.min(100, state.health.water * 12)}%` }} /></div></div>
            <div className={styles.metric}><span>خواب</span><b>{state.health.sleep}h</b><div className={styles.bar}><i style={{ width: `${Math.min(100, state.health.sleep * 12)}%` }} /></div></div>
          </div>
          <div className={styles.healthActions}>
            <button onClick={() => adjustHealth("water", 1)}>＋ آب</button>
            <button onClick={() => adjustHealth("energy", 5)}>＋ انرژی</button>
            <button onClick={() => adjustHealth("mood", 5)}>＋ خلق</button>
          </div>
        </section>
        <section className={styles.card}>
          <div className={styles.head}><h2>هدف فعلی</h2><span>وزن</span></div>
          <div className={styles.metric}><span>از {state.health.weight} به ۸۵ کیلو</span><b>20 kg</b><div className={styles.bar}><i style={{ width: "18%" }} /></div></div>
        </section>
      </>
    );
  }

  function ChatView() {
    return (
      <section className={`${styles.card} ${styles.chat}`}>
        <div className={styles.head}><h2>Nima AI</h2><span>{apiStatus}</span></div>
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.messages} ref={messagesRef}>
          {state.messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`${styles.message} ${message.role === "user" ? styles.user : styles.assistant}`}>
              {message.content}
            </div>
          ))}
          {sending && <div className={styles.typing}>Nima AI در حال فکر کردن است...</div>}
        </div>
        <div className={styles.composer}>
          <textarea
            className={styles.textarea}
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
        <div className={styles.hint}>وظایف، پروژه‌ها و سلامت برای پاسخ بهتر ارسال می‌شوند. کلید OpenAI هرگز به گوشی فرستاده نمی‌شود.</div>
      </section>
    );
  }

  if (!unlocked) {
    return (
      <div className={styles.shell}>
        <main className={`${styles.app} ${styles.lock}`}>
          <section className={styles.lockBox}>
            <div className={styles.logo}>N</div>
            <h1>Nima OS</h1>
            <p>کد خصوصی Nima OS را وارد کن. این کد روی همین گوشی ذخیره می‌شود و کلید OpenAI در سرور باقی می‌ماند.</p>
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

  const views: Record<Tab, React.ReactNode> = {
    today: <TodayView />,
    plan: <PlanView />,
    projects: <ProjectsView />,
    health: <HealthView />,
    chat: <ChatView />,
  };

  const navigation: Array<{ id: Tab; icon: string; label: string }> = [
    { id: "today", icon: "⌂", label: "امروز" },
    { id: "plan", icon: "□", label: "برنامه" },
    { id: "projects", icon: "◇", label: "پروژه‌ها" },
    { id: "health", icon: "♡", label: "سلامت" },
    { id: "chat", icon: "✦", label: "دستیار" },
  ];

  return (
    <div className={styles.shell}>
      <main className={styles.app}>
        <header className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.logo}>N</div>
            <div><b>Nima OS</b><small>مرکز فرمان شخصی</small></div>
          </div>
          <div className={styles.status}>{apiStatus}</div>
        </header>
        {views[activeTab]}
      </main>
      <nav className={styles.nav} aria-label="منوی Nima OS">
        {navigation.map((item) => (
          <button key={item.id} className={activeTab === item.id ? styles.active : ""} onClick={() => setActiveTab(item.id)}>
            <b>{item.icon}</b><span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
