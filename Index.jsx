import { useState, useEffect, useRef, useCallback } from "react";

// ═══ AUDIO ═══
const playSound = () => {
  try {
    const c = new (window.AudioContext || window.webkitAudioContext)();
    const o = c.createOscillator(), g = c.createGain();
    o.type = "sine"; o.frequency.setValueAtTime(880, c.currentTime);
    o.frequency.setValueAtTime(1318, c.currentTime + 0.08);
    g.gain.setValueAtTime(0.12, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.35);
    o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + 0.35);
    const o2 = c.createOscillator(), g2 = c.createGain();
    o2.type = "sine"; o2.frequency.setValueAtTime(1760, c.currentTime + 0.1);
    g2.gain.setValueAtTime(0.06, c.currentTime + 0.1);
    g2.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.45);
    o2.connect(g2); g2.connect(c.destination); o2.start(c.currentTime + 0.1); o2.stop(c.currentTime + 0.45);
    setTimeout(() => c.close(), 500);
  } catch (e) {}
};

// ═══ FIREWORKS ═══
const Fireworks = ({ trigger, x, y }) => {
  const ref = useRef(null), anim = useRef(null);
  useEffect(() => {
    if (!trigger || !ref.current) return;
    const cv = ref.current, ctx = cv.getContext("2d");
    cv.width = window.innerWidth; cv.height = window.innerHeight;
    const P = [], cols = ["#C8A97E","#E8D5B5","#FF6B6B","#FBBF24","#6BCB77","#A78BFA","#60A5FA","#F472B6"];
    const px = x || cv.width / 2, py = y || cv.height / 2;
    for (let i = 0; i < 28; i++) {
      const a = (Math.PI * 2 * i) / 28 + (Math.random() - 0.5) * 0.3, s = 3 + Math.random() * 4;
      P.push({ x: px, y: py, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, decay: 0.018 + Math.random() * 0.012, sz: 2 + Math.random() * 2, col: cols[~~(Math.random() * cols.length)], g: 0.05, tr: [] });
    }
    const run = () => {
      ctx.clearRect(0, 0, cv.width, cv.height); let alive = false;
      P.forEach(p => { if (p.life <= 0) return; alive = true; p.x += p.vx; p.y += p.vy; p.vy += p.g; p.vx *= 0.99; p.life -= p.decay;
        ctx.globalAlpha = p.life; ctx.beginPath(); ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2); ctx.fillStyle = p.col; ctx.fill(); ctx.globalAlpha = 1; });
      if (alive) anim.current = requestAnimationFrame(run);
    };
    anim.current = requestAnimationFrame(run);
    return () => { if (anim.current) cancelAnimationFrame(anim.current); };
  }, [trigger, x, y]);
  return <canvas ref={ref} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 9999 }} />;
};

// ═══ HELPERS ═══
const gid = () => Math.random().toString(36).slice(2, 9);
const tk = () => new Date().toISOString().split("T")[0];
const greeting = () => { const h = new Date().getHours(); return h < 6 ? "God natt" : h < 12 ? "God morgon" : h < 18 ? "God eftermiddag" : "God kväll"; };
const fmtDateLong = d => new Date(d + "T00:00:00").toLocaleDateString("sv-SE", { weekday: "long", day: "numeric", month: "long" });
const MONTHS = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"];
const WDAYS = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];
const WDAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const getWeekDays = () => {
  const t = new Date(), dow = t.getDay(), mon = new Date(t); mon.setDate(t.getDate() - ((dow + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => { const d = new Date(mon); d.setDate(mon.getDate() + i); return { name: WDAYS[i], date: d.getDate(), isToday: d.toDateString() === t.toDateString(), dk: d.toISOString().split("T")[0], wdayIdx: i }; });
};

const getMonthGrid = (y, m) => {
  const first = new Date(y, m, 1), start = (first.getDay() + 6) % 7, days = new Date(y, m + 1, 0).getDate();
  const grid = []; for (let i = 0; i < start; i++) grid.push(null);
  for (let d = 1; d <= days; d++) { const dt = new Date(y, m, d); grid.push({ date: d, dk: dt.toISOString().split("T")[0], isToday: dt.toDateString() === new Date().toDateString(), wdayIdx: (dt.getDay() + 6) % 7 }); }
  return grid;
};

const getDayWdayIdx = dk => { const d = new Date(dk + "T00:00:00"); return (d.getDay() + 6) % 7; };

// ═══ THEME ═══
const G = "#C8A97E", GL = "#E8D5B5", GD = "rgba(200,169,126,0.12)", BG = "#0B0B0F", CARD = "rgba(255,255,255,0.022)", BD = "rgba(200,169,126,0.1)";

const COLORS = [
  { bg: "linear-gradient(135deg,#7C3AED,#A78BFA)", solid: "#7C3AED", name: "Lila" },
  { bg: "linear-gradient(135deg,#2563EB,#60A5FA)", solid: "#2563EB", name: "Blå" },
  { bg: "linear-gradient(135deg,#059669,#34D399)", solid: "#059669", name: "Grön" },
  { bg: "linear-gradient(135deg,#DC2626,#F87171)", solid: "#DC2626", name: "Röd" },
  { bg: "linear-gradient(135deg,#D97706,#FBBF24)", solid: "#D97706", name: "Orange" },
  { bg: "linear-gradient(135deg,#DB2777,#F472B6)", solid: "#DB2777", name: "Rosa" },
  { bg: "linear-gradient(135deg,#0891B2,#22D3EE)", solid: "#0891B2", name: "Turkos" },
  { bg: "linear-gradient(135deg,#4F46E5,#818CF8)", solid: "#4F46E5", name: "Indigo" },
];

// ═══ DEFAULT DATA ═══
const defaults = () => ({
  tasks: [
    { id: gid(), text: "Planera veckans mål", done: false, priority: "high" },
    { id: gid(), text: "Handla mat", done: false, priority: "medium" },
    { id: gid(), text: "Ringa tandläkaren", done: false, priority: "low" },
  ],
  habits: [
    { id: gid(), name: "Meditation", icon: "🧘", ci: 0, streak: 5, freq: "Varje dag", target: "15 min", comp: {}, perDay: 1, weekdays: [0, 1, 2, 3, 4, 5, 6] },
    { id: gid(), name: "Träning", icon: "💪", ci: 1, streak: 3, freq: "Varje dag", target: "30 min", comp: {}, perDay: 1, weekdays: [0, 1, 2, 3, 4] },
    { id: gid(), name: "Läsa", icon: "📖", ci: 2, streak: 12, freq: "Varje dag", target: "20 sidor", comp: {}, perDay: 1, weekdays: [0, 1, 2, 3, 4, 5, 6] },
    { id: gid(), name: "Drick vatten", icon: "💧", ci: 6, streak: 4, freq: "Varje dag", target: "8 glas", comp: {}, perDay: 8, weekdays: [0, 1, 2, 3, 4, 5, 6] },
  ],
  goals: [
    { id: gid(), title: "Springa halvmaraton", progress: 35, deadline: "2026-06-01" },
    { id: gid(), title: "Läsa 24 böcker", progress: 58, deadline: "2026-12-31" },
  ],
  events: [],
  subs: [
    { id: gid(), name: "Spotify", cost: 119, cycle: "Månadsvis", color: "#1DB954" },
    { id: gid(), name: "Netflix", cost: 169, cycle: "Månadsvis", color: "#E50914" },
    { id: gid(), name: "Notion", cost: 89, cycle: "Månadsvis", color: "#FFFFFF" },
    { id: gid(), name: "iCloud", cost: 29, cycle: "Månadsvis", color: "#3693F5" },
  ],
});

// ═══ BOTTOM SHEET ═══
const BottomSheet = ({ open, onClose, children, title }) => {
  const [anim, setAnim] = useState(false);
  useEffect(() => { if (open) { requestAnimationFrame(() => setAnim(true)); } else { setAnim(false); } }, [open]);
  if (!open && !anim) return null;
  return (
    <>
      <div onClick={() => { setAnim(false); setTimeout(onClose, 300); }}
        style={{ position: "fixed", inset: 0, background: `rgba(0,0,0,${anim ? 0.55 : 0})`, zIndex: 200, transition: "background 0.3s ease" }} />
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: 480, margin: "0 auto",
        background: "#141418", borderTop: `1px solid ${BD}`, borderRadius: "24px 24px 0 0",
        padding: "0 20px 36px", zIndex: 210, minHeight: "33vh", maxHeight: "80vh", overflowY: "auto",
        transform: anim ? "translateY(0)" : "translateY(100%)", transition: "transform 0.35s cubic-bezier(0.32,0.72,0,1)",
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 6px" }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.1)" }} />
        </div>
        {title && <div style={{ fontSize: 16, fontWeight: 700, color: "#F5F0EB", padding: "8px 0 16px" }}>{title}</div>}
        {children}
      </div>
    </>
  );
};

// ═══ UNDO TOAST ═══
const UndoToast = ({ msg, onUndo, onDismiss }) => {
  useEffect(() => { const t = setTimeout(onDismiss, 4000); return () => clearTimeout(t); }, [onDismiss]);
  return (
    <div style={{ position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", background: "#1A1A20", border: `1px solid ${BD}`, borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, zIndex: 300, boxShadow: "0 8px 32px rgba(0,0,0,0.5)", animation: "slideUp 0.3s ease", maxWidth: 340, width: "calc(100% - 48px)" }}>
      <span style={{ flex: 1, fontSize: 13, color: "#E8E4DF" }}>{msg}</span>
      <button onClick={onUndo} style={{ background: G, color: BG, border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Ångra</button>
    </div>
  );
};

// ═══ SECTION HEAD ═══
const SH = ({ icon, title, count }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, marginTop: 4 }}>
    <span style={{ fontSize: 14 }}>{icon}</span>
    <span style={{ fontSize: 11, fontWeight: 700, color: G, letterSpacing: "0.08em", textTransform: "uppercase" }}>{title}</span>
    {count !== undefined && <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(200,169,126,0.35)", marginLeft: "auto" }}>{count}</span>}
    <div style={{ flex: 1, height: 1, background: BD, marginLeft: count !== undefined ? 0 : 8 }} />
  </div>
);

// ═══ DAY RING ═══
const DayRing = ({ day, progress, hasEvents }) => {
  const sz = 42, st = 3, r = (sz - st) / 2 - 1, ci = 2 * Math.PI * r, off = ci - (Math.min(progress, 1) * ci);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
      <span style={{ fontSize: 10, fontWeight: day.isToday ? 700 : 400, color: day.isToday ? G : "rgba(255,255,255,0.25)" }}>{day.name}</span>
      <div style={{ position: "relative", width: sz, height: sz }}>
        <svg width={sz} height={sz} style={{ transform: "rotate(-90deg)", position: "absolute" }}>
          <circle cx={sz / 2} cy={sz / 2} r={r} fill="none" stroke="rgba(200,169,126,0.07)" strokeWidth={st} />
          {progress > 0 && <circle cx={sz / 2} cy={sz / 2} r={r} fill="none" stroke={progress >= 1 ? "#6BCB77" : G} strokeWidth={st} strokeDasharray={ci} strokeDashoffset={off} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.6s ease" }} />}
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: day.isToday ? 700 : 500, color: day.isToday ? GL : "rgba(255,255,255,0.4)", background: day.isToday ? "rgba(200,169,126,0.06)" : "transparent", borderRadius: "50%", margin: st }}>{day.date}</div>
        {hasEvents && <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: G }} />}
      </div>
    </div>
  );
};

// ═══ HABIT CARD ═══
const HabitCard = ({ habit, isDone, doneCount, onToggle }) => {
  const [pr, setPr] = useState(false), [pop, setPop] = useState(false);
  const bg = COLORS[habit.ci % COLORS.length].bg;
  const full = doneCount >= habit.perDay;
  return (
    <div onClick={e => { const r = e.currentTarget.getBoundingClientRect(); if (!full) { setPop(true); setTimeout(() => setPop(false), 300); } onToggle(habit.id, r.left + r.width / 2, r.top + r.height * 0.3); }}
      onPointerDown={() => setPr(true)} onPointerUp={() => setPr(false)} onPointerLeave={() => setPr(false)}
      style={{ background: full ? "rgba(255,255,255,0.02)" : bg, borderRadius: 16, padding: "14px 16px", marginBottom: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, transform: pr ? "scale(0.97)" : pop ? "scale(1.03)" : "", opacity: full ? 0.4 : 1, transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)", border: full ? "1px solid rgba(107,203,119,0.12)" : "none", minHeight: 56 }}>
      <div style={{ fontSize: 20, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: full ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.15)", borderRadius: 10, flexShrink: 0 }}>{habit.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: full ? "rgba(255,255,255,0.35)" : "#FFF", textDecoration: full ? "line-through" : "none" }}>{habit.name}</div>
        <div style={{ fontSize: 11, color: full ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.55)", marginTop: 1 }}>
          {habit.perDay > 1 ? `${doneCount}/${habit.perDay} idag` : habit.target || habit.freq}
        </div>
      </div>
      {habit.streak > 0 && <div style={{ fontSize: 10, fontWeight: 700, color: full ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.8)", background: full ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.2)", borderRadius: 8, padding: "2px 7px", display: "flex", alignItems: "center", gap: 2 }}>🔥{habit.streak}</div>}
      <div style={{ width: 34, height: 34, borderRadius: 11, background: full ? "#6BCB77" : "rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {full ? <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#FFF" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
          : habit.perDay > 1 ? <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>{doneCount}</span>
            : <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>}
      </div>
    </div>
  );
};

// ═══ TASK ITEM ═══
const TaskItem = ({ task, onToggle, onDelete, onChangePri }) => {
  const [pr, setPr] = useState(false);
  const pc = { high: "#FF6B6B", medium: "#FBBF24", low: "#6BCB77" };
  const nextPri = { high: "medium", medium: "low", low: "high" };
  return (
    <div onPointerDown={() => setPr(true)} onPointerUp={() => setPr(false)} onPointerLeave={() => setPr(false)}
      style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", background: task.done ? "rgba(107,203,119,0.03)" : CARD, border: `1px solid ${task.done ? "rgba(107,203,119,0.1)" : BD}`, borderRadius: 14, marginBottom: 8, opacity: task.done ? 0.45 : 1, transform: pr ? "scale(0.98)" : "", transition: "all 0.15s ease" }}>
      <div onClick={e => { const r = e.currentTarget.getBoundingClientRect(); onToggle(task.id, r.left + r.width / 2, r.top); }}
        style={{ width: 24, height: 24, borderRadius: 8, border: task.done ? "none" : "2px solid rgba(200,169,126,0.25)", background: task.done ? "#6BCB77" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
        {task.done && <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#0B0B0F" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>}
      </div>
      <span onClick={() => !task.done && onChangePri(task.id)} style={{ width: 10, height: 10, borderRadius: "50%", background: pc[task.priority], flexShrink: 0, cursor: "pointer", transition: "background 0.2s" }} title="Ändra prioritet" />
      <span style={{ flex: 1, fontSize: 15, color: task.done ? "rgba(255,255,255,0.25)" : "#F5F0EB", textDecoration: task.done ? "line-through" : "none" }}>{task.text}</span>
      <button onClick={() => onDelete(task.id)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.1)", cursor: "pointer", padding: 4, display: "flex" }}>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
      </button>
    </div>
  );
};

// ═══ EVENT ITEM ═══
const EvItem = ({ ev, onDelete }) => {
  const pc = { high: "#FF6B6B", medium: G, low: "#6BCB77" };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "rgba(200,169,126,0.04)", border: `1px solid ${BD}`, borderRadius: 14, marginBottom: 8 }}>
      <div style={{ width: 4, height: 32, borderRadius: 2, background: pc[ev.priority] || G, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "#F5F0EB" }}>{ev.title}</div>
        {ev.time && <div style={{ fontSize: 11, color: "rgba(200,169,126,0.5)", marginTop: 1 }}>⏰ {ev.time}</div>}
      </div>
      <button onClick={() => onDelete(ev.id)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.1)", cursor: "pointer", padding: 4, display: "flex" }}>
        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
};

// ═══ MAIN APP ═══
export default function App() {
  const [data, setData] = useState(defaults);
  const [tab, setTab] = useState("today");
  const [fw, setFw] = useState({ t: 0, x: 0, y: 0 });
  const [undo, setUndo] = useState(null);

  // Add sheet
  const [showAdd, setShowAdd] = useState(false);
  const [addType, setAddType] = useState("task"); // "task" | "habit"
  const [newText, setNewText] = useState("");
  const [newPri, setNewPri] = useState("medium");
  const [newIcon, setNewIcon] = useState("✨");
  const [newColor, setNewColor] = useState(0);
  const [newPerDay, setNewPerDay] = useState(1);
  const [newWdays, setNewWdays] = useState([0, 1, 2, 3, 4, 5, 6]);

  // Calendar
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calDay, setCalDay] = useState(null);
  const [showDaySheet, setShowDaySheet] = useState(false);
  const [showEvForm, setShowEvForm] = useState(false);
  const [evTitle, setEvTitle] = useState("");
  const [evTime, setEvTime] = useState("");
  const [evPri, setEvPri] = useState("medium");
  const [yearView, setYearView] = useState(false);

  // Sub
  const [showSubForm, setShowSubForm] = useState(false);
  const [subName, setSubName] = useState("");
  const [subCost, setSubCost] = useState("");
  const [subColor, setSubColor] = useState("#C8A97E");

  const inputRef = useRef(null);
  const today = tk();

  useEffect(() => { (async () => { try { const r = await window.storage.get("lp-v4"); if (r?.value) setData(JSON.parse(r.value)); } catch (e) {} })(); }, []);
  const save = useCallback(d => { setData(d); try { window.storage.set("lp-v4", JSON.stringify(d)); } catch (e) {} }, []);

  // Habit helpers
  const getHabitDoneCount = (h, dk) => h.comp[dk] || 0;
  const isHabitActiveToday = h => h.weekdays.includes(getDayWdayIdx(today));
  const activeHabits = data.habits.filter(isHabitActiveToday);

  const getDayProg = dk => {
    if (dk !== today) return 0;
    const ah = data.habits.filter(h => h.weekdays.includes(getDayWdayIdx(dk)));
    const total = ah.length + data.tasks.length;
    if (total === 0) return 0;
    const done = ah.filter(h => getHabitDoneCount(h, dk) >= h.perDay).length + data.tasks.filter(t => t.done).length;
    return done / total;
  };

  // Toggle task
  const toggleTask = (id, tx, ty) => {
    const t = data.tasks.find(t => t.id === id); if (!t) return;
    if (!t.done) { playSound(); setFw({ t: Date.now(), x: tx, y: ty }); }
    const nd = { ...data, tasks: data.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t) }; save(nd);
    if (!t.done) setUndo({ msg: `"${t.text}" klar`, action: () => { save({ ...nd, tasks: nd.tasks.map(t => t.id === id ? { ...t, done: false } : t) }); setUndo(null); } });
  };

  const changePri = id => {
    const next = { high: "medium", medium: "low", low: "high" };
    save({ ...data, tasks: data.tasks.map(t => t.id === id ? { ...t, priority: next[t.priority] } : t) });
  };

  // Toggle habit (increment count)
  const toggleHabit = (id, tx, ty) => {
    const h = data.habits.find(h => h.id === id); if (!h) return;
    const cur = getHabitDoneCount(h, today);
    if (cur >= h.perDay) return; // already full
    const newCount = cur + 1;
    playSound(); setFw({ t: Date.now(), x: tx, y: ty });
    const habits = data.habits.map(h => h.id !== id ? h : { ...h, comp: { ...h.comp, [today]: newCount }, streak: newCount >= h.perDay ? h.streak + 1 : h.streak });
    const nd = { ...data, habits }; save(nd);
    setUndo({
      msg: `"${h.name}" +1`, action: () => {
        const uh = nd.habits.map(h => h.id !== id ? h : { ...h, comp: { ...h.comp, [today]: cur }, streak: newCount >= h.perDay ? h.streak - 1 : h.streak });
        save({ ...nd, habits: uh }); setUndo(null);
      }
    });
  };

  const deleteTask = id => save({ ...data, tasks: data.tasks.filter(t => t.id !== id) });

  // Add task/habit
  const handleAdd = () => {
    if (!newText.trim()) return;
    if (addType === "task") {
      save({ ...data, tasks: [{ id: gid(), text: newText.trim(), done: false, priority: newPri }, ...data.tasks] });
    } else {
      save({
        ...data, habits: [...data.habits, {
          id: gid(), name: newText.trim(), icon: newIcon, ci: newColor, streak: 0,
          freq: newWdays.length === 7 ? "Varje dag" : `${newWdays.length} dagar/vecka`,
          target: newPerDay > 1 ? `${newPerDay}x/dag` : "", comp: {}, perDay: newPerDay, weekdays: newWdays,
        }]
      });
    }
    setNewText(""); setShowAdd(false); setAddType("task"); setNewPerDay(1); setNewWdays([0, 1, 2, 3, 4, 5, 6]); setNewIcon("✨"); setNewColor(0);
  };

  // Events
  const addEvent = () => {
    if (!evTitle.trim() || !calDay) return;
    save({ ...data, events: [...data.events, { id: gid(), title: evTitle.trim(), time: evTime, priority: evPri, date: calDay }] });
    setEvTitle(""); setEvTime(""); setEvPri("medium"); setShowEvForm(false);
  };
  const deleteEvent = id => save({ ...data, events: data.events.filter(e => e.id !== id) });

  // Subs
  const addSub = () => {
    if (!subName.trim() || !subCost) return;
    save({ ...data, subs: [...data.subs, { id: gid(), name: subName.trim(), cost: parseFloat(subCost), cycle: "Månadsvis", color: subColor }] });
    setSubName(""); setSubCost(""); setShowSubForm(false);
  };
  const deleteSub = id => save({ ...data, subs: data.subs.filter(s => s.id !== id) });

  useEffect(() => { if (showAdd && inputRef.current) setTimeout(() => inputRef.current.focus(), 350); }, [showAdd]);

  const stats = (() => { const t = activeHabits.length + data.tasks.length; const d = activeHabits.filter(h => getHabitDoneCount(h, today) >= h.perDay).length + data.tasks.filter(t => t.done).length; return { total: t, done: d }; })();
  const todayEvents = data.events.filter(e => e.date === today);
  const weekDays = getWeekDays();
  const calGrid = getMonthGrid(calYear, calMonth);
  const calDayEvents = calDay ? data.events.filter(e => e.date === calDay) : [];
  const totalSubs = data.subs.reduce((s, x) => s + x.cost, 0);

  const ICONS = ["✨", "🧘", "💪", "📖", "✍️", "💧", "🚶", "🏃", "🎯", "💤", "🥗", "💊", "🧹", "📱", "🎵", "🧠"];
  const tabs = [{ id: "today", icon: "☀️", label: "Idag" }, { id: "calendar", icon: "📅", label: "Kalender" }, { id: "subs", icon: "💳", label: "Abonnemang" }, { id: "goals", icon: "🎯", label: "Mål" }];

  const btnStyle = (active, col) => ({ padding: "7px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600, background: active ? col : "rgba(255,255,255,0.03)", color: active ? BG : "rgba(255,255,255,0.3)", border: `1px solid ${active ? col : "rgba(255,255,255,0.06)"}`, cursor: "pointer", transition: "all 0.15s ease" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
        ::-webkit-scrollbar{display:none}body{background:${BG};margin:0;overscroll-behavior:none}
        input::placeholder{color:rgba(200,169,126,0.3)}select{color-scheme:dark}
        @keyframes slideUp{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
      `}</style>
      <Fireworks trigger={fw.t} x={fw.x} y={fw.y} />
      {undo && <UndoToast msg={undo.msg} onUndo={undo.action} onDismiss={() => setUndo(null)} />}

      <div style={{ minHeight: "100vh", background: BG, color: "#E8E4DF", fontFamily: "'DM Sans',-apple-system,sans-serif", maxWidth: 480, margin: "0 auto", paddingBottom: 100 }}>

        {/* HEADER */}
        <div style={{ padding: "44px 24px 14px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: G, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>{greeting()}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#F5F0EB", textTransform: "capitalize" }}>{fmtDateLong(today)}</div>
        </div>

        {/* WEEK STRIP */}
        {tab === "today" && (
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 20px 16px" }}>
            {weekDays.map(d => <DayRing key={d.dk} day={d} progress={getDayProg(d.dk)} hasEvents={data.events.some(e => e.date === d.dk)} />)}
          </div>
        )}

        {/* STAT */}
        {tab === "today" && (
          <div style={{ padding: "0 24px 16px" }}>
            <div style={{ background: GD, border: `1px solid ${BD}`, borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "rgba(200,169,126,0.5)" }}>Klara idag</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: G }}>{stats.done} / {stats.total}</span>
            </div>
          </div>
        )}

        {/* TABS */}
        <div style={{ display: "flex", padding: "0 20px", gap: 6, marginBottom: 22, overflowX: "auto" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); if (t.id === "calendar") { setCalDay(null); setShowDaySheet(false); } }}
              style={{ padding: "9px 16px", fontSize: 13, fontWeight: tab === t.id ? 700 : 400, color: tab === t.id ? BG : "rgba(200,169,126,0.35)", background: tab === t.id ? G : "transparent", border: tab === t.id ? "none" : `1px solid ${BD}`, borderRadius: 12, cursor: "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s ease" }}>
              <span style={{ fontSize: 14 }}>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        <div style={{ padding: "0 24px" }}>

          {/* ═══ TODAY ═══ */}
          {tab === "today" && (
            <>
              {todayEvents.length > 0 && (<><SH icon="📌" title="Planerat idag" count={todayEvents.length} />{todayEvents.map(ev => <EvItem key={ev.id} ev={ev} onDelete={deleteEvent} />)}<div style={{ height: 16 }} /></>)}
              <SH icon="✅" title="Att göra" count={`${data.tasks.filter(t => t.done).length}/${data.tasks.length}`} />
              {data.tasks.sort((a, b) => a.done - b.done).map(t => <TaskItem key={t.id} task={t} onToggle={toggleTask} onDelete={deleteTask} onChangePri={changePri} />)}
              {data.tasks.length === 0 && <div style={{ textAlign: "center", padding: 28, color: "rgba(255,255,255,0.1)", fontSize: 13 }}>Inga uppgifter</div>}
              <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${BD},transparent)`, margin: "22px 0" }} />
              <SH icon="🔄" title="Vanor" count={`${activeHabits.filter(h => getHabitDoneCount(h, today) >= h.perDay).length}/${activeHabits.length}`} />
              {activeHabits.map(h => <HabitCard key={h.id} habit={h} isDone={getHabitDoneCount(h, today) >= h.perDay} doneCount={getHabitDoneCount(h, today)} onToggle={toggleHabit} />)}
              {activeHabits.length === 0 && <div style={{ textAlign: "center", padding: 28, color: "rgba(255,255,255,0.1)", fontSize: 13 }}>Inga vanor idag</div>}
            </>
          )}

          {/* ═══ CALENDAR ═══ */}
          {tab === "calendar" && (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); setCalDay(null); }} style={{ background: "none", border: "none", color: G, fontSize: 22, cursor: "pointer", padding: "4px 10px" }}>‹</button>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#F5F0EB" }}>{MONTHS[calMonth]} {calYear}</div>
                  <button onClick={() => setYearView(!yearView)} style={{ background: "none", border: "none", color: G, fontSize: 11, cursor: "pointer", marginTop: 2, textDecoration: "underline", textUnderlineOffset: 3 }}>{yearView ? "Stäng" : "Hela året"}</button>
                </div>
                <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); setCalDay(null); }} style={{ background: "none", border: "none", color: G, fontSize: 22, cursor: "pointer", padding: "4px 10px" }}>›</button>
              </div>

              {yearView ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 20 }}>
                  {MONTHS.map((m, i) => (
                    <button key={i} onClick={() => { setCalMonth(i); setYearView(false); setCalDay(null); }}
                      style={{ padding: "12px 8px", borderRadius: 12, fontSize: 13, fontWeight: i === calMonth ? 700 : 400, background: i === calMonth ? GD : CARD, border: `1px solid ${i === calMonth ? BD : "rgba(255,255,255,0.03)"}`, color: i === calMonth ? G : "rgba(255,255,255,0.35)", cursor: "pointer" }}>
                      {m.slice(0, 3)}
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 6 }}>
                    {WDAYS.map(d => <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 600, color: "rgba(200,169,126,0.3)", padding: "6px 0" }}>{d}</div>)}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
                    {calGrid.map((d, i) => {
                      if (!d) return <div key={`e${i}`} />;
                      const sel = calDay === d.dk, hasEv = data.events.some(e => e.date === d.dk);
                      return (
                        <button key={d.dk} onClick={() => { setCalDay(d.dk); setShowDaySheet(true); setShowEvForm(false); }}
                          style={{ position: "relative", width: "100%", aspectRatio: "1", borderRadius: 12, fontSize: 14, fontWeight: d.isToday ? 800 : sel ? 600 : 400, color: d.isToday ? BG : sel ? BG : "rgba(255,255,255,0.45)", background: d.isToday ? G : sel ? GL : "rgba(255,255,255,0.02)", border: d.isToday || sel ? "none" : "1px solid rgba(200,169,126,0.05)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {d.date}
                          {hasEv && !d.isToday && !sel && <div style={{ position: "absolute", bottom: 3, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: G }} />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}

          {/* ═══ SUBSCRIPTIONS ═══ */}
          {tab === "subs" && (
            <>
              <div style={{ background: GD, border: `1px solid ${BD}`, borderRadius: 14, padding: "16px", textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: G }}>{totalSubs} kr</div>
                <div style={{ fontSize: 12, color: "rgba(200,169,126,0.4)", marginTop: 2 }}>Per månad totalt</div>
              </div>
              <SH icon="💳" title="Aktiva abonnemang" count={data.subs.length} />
              {data.subs.map(s => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: CARD, border: `1px solid ${BD}`, borderRadius: 14, marginBottom: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, boxShadow: `0 0 8px ${s.color}30`, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 500, color: "#F5F0EB" }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(200,169,126,0.35)", marginTop: 1 }}>{s.cycle}</div>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#F5F0EB" }}>{s.cost} kr</div>
                  <button onClick={() => deleteSub(s.id)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.1)", cursor: "pointer", padding: 4, display: "flex" }}>
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
              <button onClick={() => setShowSubForm(true)} style={{ width: "100%", padding: "14px", borderRadius: 14, background: "rgba(200,169,126,0.06)", border: `1px dashed ${BD}`, color: G, fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 8 }}>+ Lägg till abonnemang</button>
            </>
          )}

          {/* ═══ GOALS ═══ */}
          {tab === "goals" && (
            <>
              <SH icon="🎯" title="Mål & framsteg" />
              {data.goals.map(g => {
                const dl = Math.ceil((new Date(g.deadline) - new Date()) / 86400000);
                const r2 = 17, ci2 = 2 * Math.PI * r2, off2 = ci2 - (g.progress / 100) * ci2;
                const col2 = g.progress >= 75 ? "#6BCB77" : g.progress >= 40 ? G : "#60A5FA";
                return (
                  <div key={g.id} style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 14, padding: "16px 18px", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ position: "relative", width: 44, height: 44, flexShrink: 0 }}>
                        <svg width={44} height={44} style={{ transform: "rotate(-90deg)" }}><circle cx={22} cy={22} r={r2} fill="none" stroke="rgba(200,169,126,0.08)" strokeWidth={3.5} /><circle cx={22} cy={22} r={r2} fill="none" stroke={col2} strokeWidth={3.5} strokeDasharray={ci2} strokeDashoffset={off2} strokeLinecap="round" style={{ transition: "all 0.5s ease" }} /></svg>
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>{g.progress}%</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 500, color: "#F5F0EB" }}>{g.title}</div>
                        <div style={{ height: 4, borderRadius: 2, background: "rgba(200,169,126,0.08)", marginTop: 8, overflow: "hidden" }}><div style={{ height: "100%", borderRadius: 2, width: `${g.progress}%`, background: col2, transition: "width 0.6s ease" }} /></div>
                        <div style={{ fontSize: 11, color: "rgba(200,169,126,0.3)", marginTop: 6 }}>{dl} dagar kvar</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* ═══ FAB ═══ */}
        {tab === "today" && (
          <button onClick={() => { setShowAdd(true); setAddType("task"); }} style={{ position: "fixed", bottom: 28, right: "calc(50% - 210px)", width: 54, height: 54, borderRadius: 16, background: `linear-gradient(135deg,${G},${GL})`, color: BG, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 8px 32px rgba(200,169,126,0.3)", zIndex: 50 }}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
          </button>
        )}

        {/* ═══ ADD BOTTOM SHEET ═══ */}
        <BottomSheet open={showAdd} onClose={() => setShowAdd(false)} title="Lägg till">
          {/* Type toggle */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[{ k: "task", l: "✅ Att göra" }, { k: "habit", l: "🔄 Vana" }].map(t => (
              <button key={t.k} onClick={() => setAddType(t.k)} style={{ flex: 1, padding: "10px", borderRadius: 12, fontSize: 14, fontWeight: addType === t.k ? 700 : 400, background: addType === t.k ? GD : "rgba(255,255,255,0.02)", border: `1px solid ${addType === t.k ? BD : "rgba(255,255,255,0.04)"}`, color: addType === t.k ? G : "rgba(255,255,255,0.3)", cursor: "pointer", transition: "all 0.2s ease" }}>{t.l}</button>
            ))}
          </div>

          {/* Name input */}
          <input ref={inputRef} value={newText} onChange={e => setNewText(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdd()}
            placeholder={addType === "task" ? "Ny uppgift..." : "Namn på vana..."}
            style={{ width: "100%", padding: "13px 16px", background: "rgba(255,255,255,0.04)", border: `1px solid ${BD}`, borderRadius: 12, color: "#F5F0EB", fontSize: 15, outline: "none", fontFamily: "inherit", boxSizing: "border-box", marginBottom: 12 }} />

          {/* TASK options */}
          {addType === "task" && (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {[{ k: "high", l: "Hög", c: "#FF6B6B" }, { k: "medium", l: "Medium", c: G }, { k: "low", l: "Låg", c: "#6BCB77" }].map(p => (
                <button key={p.k} onClick={() => setNewPri(p.k)} style={btnStyle(newPri === p.k, p.c)}>{p.l}</button>
              ))}
              <button onClick={handleAdd} style={{ marginLeft: "auto", padding: "8px 22px", borderRadius: 10, background: G, color: BG, border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Lägg till</button>
            </div>
          )}

          {/* HABIT options */}
          {addType === "habit" && (
            <>
              {/* Icon picker */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(200,169,126,0.4)", marginBottom: 8, letterSpacing: "0.05em" }}>IKON</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {ICONS.map(ic => (
                    <button key={ic} onClick={() => setNewIcon(ic)} style={{ width: 38, height: 38, borderRadius: 10, fontSize: 18, background: newIcon === ic ? GD : "rgba(255,255,255,0.02)", border: `1px solid ${newIcon === ic ? BD : "rgba(255,255,255,0.04)"}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{ic}</button>
                  ))}
                </div>
              </div>

              {/* Color picker */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(200,169,126,0.4)", marginBottom: 8, letterSpacing: "0.05em" }}>FÄRG</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {COLORS.map((c, i) => (
                    <button key={i} onClick={() => setNewColor(i)} style={{ width: 32, height: 32, borderRadius: 10, background: c.bg, border: newColor === i ? "2px solid #FFF" : "2px solid transparent", cursor: "pointer", transition: "border 0.15s ease" }} />
                  ))}
                </div>
              </div>

              {/* Per day */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(200,169,126,0.4)", marginBottom: 8, letterSpacing: "0.05em" }}>ANTAL PER DAG</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {[1, 2, 3, 4, 5, 8, 10].map(n => (
                    <button key={n} onClick={() => setNewPerDay(n)} style={{ width: 38, height: 34, borderRadius: 10, fontSize: 13, fontWeight: 600, background: newPerDay === n ? G : "rgba(255,255,255,0.02)", color: newPerDay === n ? BG : "rgba(255,255,255,0.3)", border: `1px solid ${newPerDay === n ? G : "rgba(255,255,255,0.05)"}`, cursor: "pointer" }}>{n}</button>
                  ))}
                </div>
              </div>

              {/* Weekdays */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(200,169,126,0.4)", marginBottom: 8, letterSpacing: "0.05em" }}>DAGAR</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {WDAYS.map((d, i) => {
                    const active = newWdays.includes(i);
                    return (
                      <button key={i} onClick={() => setNewWdays(active ? newWdays.filter(x => x !== i) : [...newWdays, i])}
                        style={{ flex: 1, padding: "8px 0", borderRadius: 10, fontSize: 12, fontWeight: 600, background: active ? G : "rgba(255,255,255,0.02)", color: active ? BG : "rgba(255,255,255,0.25)", border: `1px solid ${active ? G : "rgba(255,255,255,0.05)"}`, cursor: "pointer", transition: "all 0.15s ease" }}>{d}</button>
                    );
                  })}
                </div>
              </div>

              <button onClick={handleAdd} style={{ width: "100%", padding: "13px", borderRadius: 12, background: G, color: BG, border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Skapa vana</button>
            </>
          )}
        </BottomSheet>

        {/* ═══ CALENDAR DAY SHEET ═══ */}
        <BottomSheet open={showDaySheet && tab === "calendar"} onClose={() => { setShowDaySheet(false); setShowEvForm(false); }} title={calDay ? fmtDateLong(calDay) : ""}>
          {calDayEvents.length > 0 ? calDayEvents.map(ev => <EvItem key={ev.id} ev={ev} onDelete={deleteEvent} />) : !showEvForm && <div style={{ textAlign: "center", padding: "20px 0", color: "rgba(200,169,126,0.2)", fontSize: 13 }}>Inget planerat den här dagen</div>}

          {!showEvForm ? (
            <button onClick={() => setShowEvForm(true)} style={{ width: "100%", padding: "13px", borderRadius: 12, background: GD, border: `1px dashed ${BD}`, color: G, fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 8 }}>+ Ny händelse</button>
          ) : (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${BD}` }}>
              <input autoFocus value={evTitle} onChange={e => setEvTitle(e.target.value)} onKeyDown={e => e.key === "Enter" && addEvent()}
                placeholder="Vad ska hända?"
                style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.04)", border: `1px solid ${BD}`, borderRadius: 12, color: "#F5F0EB", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box", marginBottom: 10 }} />
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <input type="time" value={evTime} onChange={e => setEvTime(e.target.value)}
                  style={{ padding: "8px 12px", background: "rgba(255,255,255,0.04)", border: `1px solid ${BD}`, borderRadius: 10, color: "#F5F0EB", fontSize: 13, outline: "none", fontFamily: "inherit" }} />
                {[{ k: "high", l: "Hög", c: "#FF6B6B" }, { k: "medium", l: "Med", c: G }, { k: "low", l: "Låg", c: "#6BCB77" }].map(p => (
                  <button key={p.k} onClick={() => setEvPri(p.k)} style={btnStyle(evPri === p.k, p.c)}>{p.l}</button>
                ))}
                <button onClick={addEvent} style={{ marginLeft: "auto", padding: "8px 18px", borderRadius: 10, background: G, color: BG, border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Spara</button>
              </div>
            </div>
          )}
        </BottomSheet>

        {/* ═══ SUB FORM SHEET ═══ */}
        <BottomSheet open={showSubForm} onClose={() => setShowSubForm(false)} title="Nytt abonnemang">
          <input autoFocus value={subName} onChange={e => setSubName(e.target.value)} placeholder="Namn (ex. Spotify)"
            style={{ width: "100%", padding: "13px 16px", background: "rgba(255,255,255,0.04)", border: `1px solid ${BD}`, borderRadius: 12, color: "#F5F0EB", fontSize: 15, outline: "none", fontFamily: "inherit", boxSizing: "border-box", marginBottom: 10 }} />
          <input type="number" value={subCost} onChange={e => setSubCost(e.target.value)} placeholder="Kostnad per månad (kr)"
            style={{ width: "100%", padding: "13px 16px", background: "rgba(255,255,255,0.04)", border: `1px solid ${BD}`, borderRadius: 12, color: "#F5F0EB", fontSize: 15, outline: "none", fontFamily: "inherit", boxSizing: "border-box", marginBottom: 12 }} />
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {["#1DB954", "#E50914", "#FF9F43", "#3693F5", "#A78BFA", "#F472B6", "#FFFFFF", G].map(c => (
              <button key={c} onClick={() => setSubColor(c)} style={{ width: 32, height: 32, borderRadius: 10, background: c, border: subColor === c ? "2px solid #FFF" : "2px solid transparent", cursor: "pointer" }} />
            ))}
          </div>
          <button onClick={addSub} style={{ width: "100%", padding: "13px", borderRadius: 12, background: G, color: BG, border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Lägg till</button>
        </BottomSheet>
      </div>
    </>
  );
}
