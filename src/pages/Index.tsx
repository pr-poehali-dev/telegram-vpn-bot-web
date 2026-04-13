import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const LEADER_IMG = "https://cdn.poehali.dev/projects/c5530eba-c9a4-45d0-b3b8-b97285df77dc/bucket/772efb66-806a-4ffb-ad15-f2b69a0b5a91.jpg";

const FAQ_ITEMS = [
  { q: "Что входит в подписку за 199₽?", a: "Безопасный VPN, обход блокировок региона, обход замедления Telegram и приглашение в Яндекс Плюс Семья. Всё в одном за 199₽/мес." },
  { q: "Какой протокол шифрования используется?", a: "ChaCha20-Poly1305 — один из самых надёжных и быстрых алгоритмов шифрования. Особенно эффективен на мобильных устройствах." },
  { q: "Как получить приглашение в Яндекс Семью?", a: "После оплаты подписки вы получите ссылку-приглашение в Яндекс Плюс Семья. Ссылка действует ограниченное время, открывайте сразу. Если истекла — запросите новую у поддержки." },
  { q: "Есть ли логи активности?", a: "Нет. Мы не храним данные о ваших действиях, посещённых сайтах и IP-адресах." },
  { q: "Как продлить подписку?", a: "Через личный кабинет в нашем Telegram-боте или напрямую через поддержку @sbsmanager_bot." },
];

const NAV_ITEMS = [
  { id: "home", label: "ГЛАВНАЯ" },
  { id: "what", label: "ЧТО ВХОДИТ" },
  { id: "price", label: "ЦЕНА" },
  { id: "faq", label: "FAQ" },
  { id: "contacts", label: "КОНТАКТЫ" },
];

type AuthMode = "login" | "register";
type AuthMethod = "choose" | "telegram" | "email";
type TgStep = "instruction" | "code";

const TG_CODE_TTL = 300;

function TgCodeInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const digits = value.padEnd(6, "").split("").slice(0, 6);
  return (
    <div className="flex gap-2 justify-center">
      {digits.map((d, i) => (
        <div
          key={i}
          className={`w-10 h-12 rounded-lg border flex items-center justify-center font-orbitron text-xl font-bold transition-all ${
            d ? "border-neon-cyan bg-neon-cyan/10 text-neon-cyan" : "border-dark-border bg-dark-bg text-white/10"
          }`}
        >
          {d || "·"}
        </div>
      ))}
      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
        className="absolute opacity-0 w-0 h-0"
        autoFocus
      />
    </div>
  );
}

export default function Index() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authMethod, setAuthMethod] = useState<AuthMethod>("choose");
  const [tgStep, setTgStep] = useState<TgStep>("instruction");
  const [tgCode, setTgCode] = useState("");
  const [tgTimer, setTgTimer] = useState(TG_CODE_TTL);
  const [tgError, setTgError] = useState(false);

  useEffect(() => {
    if (authMethod !== "telegram" || tgStep !== "code") return;
    if (tgTimer <= 0) return;
    const t = setInterval(() => setTgTimer((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, [authMethod, tgStep, tgTimer]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
    setMenuOpen(false);
  };

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthMethod("choose");
    setTgStep("instruction");
    setTgCode("");
    setTgTimer(TG_CODE_TTL);
    setTgError(false);
    setAuthOpen(true);
  };

  const closeAuth = () => {
    setAuthOpen(false);
    setAuthMethod("choose");
    setTgStep("instruction");
    setTgCode("");
  };

  const handleTgCodeSubmit = () => {
    if (tgCode === "123456") {
      navigate("/dashboard");
      closeAuth();
    } else {
      setTgError(true);
      setTimeout(() => setTgError(false), 1500);
    }
  };

  const formatTimer = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-dark-bg text-white font-ibm relative overflow-x-hidden">
      {/* Grid background */}
      <div className="fixed inset-0 pointer-events-none z-0 grid-bg opacity-30" />

      {/* AUTH MODAL */}
      {authOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-bg/85 backdrop-blur-sm" onClick={closeAuth} />
          <div className="relative w-full max-w-sm cyber-card rounded-xl p-8 animate-scale-in">
            <button onClick={closeAuth} className="absolute top-4 right-4 text-white/30 hover:text-neon-cyan transition-colors">
              <Icon name="X" size={18} />
            </button>

            {/* Back button */}
            {authMethod !== "choose" && (
              <button
                onClick={() => { setAuthMethod("choose"); setTgStep("instruction"); setTgCode(""); }}
                className="absolute top-4 left-4 text-white/30 hover:text-neon-cyan transition-colors flex items-center gap-1 font-mono-ibm text-xs"
              >
                <Icon name="ChevronLeft" size={14} />
              </button>
            )}

            {/* Header */}
            <div className="flex flex-col items-center mb-6">
              <img
                src={LEADER_IMG}
                alt="SBS"
                className="w-16 h-16 rounded-full object-cover border-2 border-neon-cyan mb-3"
                style={{ boxShadow: "0 0 16px rgba(0,255,255,0.4)" }}
              />
              <span className="font-orbitron text-sm font-bold neon-text-cyan tracking-widest">SBS CONNECT</span>
            </div>

            {/* ── STEP: CHOOSE METHOD ── */}
            {authMethod === "choose" && (
              <div className="space-y-3">
                <div className="flex mb-5 border-b border-dark-border">
                  {(["login", "register"] as AuthMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setAuthMode(mode)}
                      className={`flex-1 pb-3 font-orbitron text-xs tracking-widest transition-all duration-200 ${
                        authMode === mode ? "text-neon-cyan border-b-2 border-neon-cyan -mb-px" : "text-white/30 hover:text-white/60"
                      }`}
                    >
                      {mode === "login" ? "ВХОД" : "РЕГИСТРАЦИЯ"}
                    </button>
                  ))}
                </div>

                {/* TG button */}
                <button
                  onClick={() => setAuthMethod("telegram")}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border border-neon-cyan/30 bg-neon-cyan/5 hover:border-neon-cyan/60 hover:bg-neon-cyan/10 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg border border-neon-cyan/30 bg-neon-cyan/10 flex items-center justify-center flex-shrink-0">
                    <Icon name="Send" size={14} className="text-neon-cyan" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-orbitron text-xs text-white tracking-widest">ЧЕРЕЗ TELEGRAM</div>
                    <div className="font-mono-ibm text-xs text-white/30 mt-0.5">Полный доступ — VPN, Семья, Рефералы</div>
                  </div>
                  <Icon name="ChevronRight" size={14} className="text-white/20 group-hover:text-neon-cyan transition-colors" />
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 py-1">
                  <div className="flex-1 h-px bg-dark-border" />
                  <span className="font-mono-ibm text-xs text-white/20">или</span>
                  <div className="flex-1 h-px bg-dark-border" />
                </div>

                {/* Email button */}
                <button
                  onClick={() => setAuthMethod("email")}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border border-dark-border bg-dark-bg hover:border-white/20 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg border border-dark-border bg-dark-card flex items-center justify-center flex-shrink-0">
                    <Icon name="Mail" size={14} className="text-white/40" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-orbitron text-xs text-white/60 tracking-widest">ЧЕРЕЗ EMAIL</div>
                    <div className="font-mono-ibm text-xs text-white/20 mt-0.5">Базовый доступ — без TG-функций</div>
                  </div>
                  <Icon name="ChevronRight" size={14} className="text-white/20 group-hover:text-white/40 transition-colors" />
                </button>
              </div>
            )}

            {/* ── STEP: TELEGRAM — INSTRUCTION ── */}
            {authMethod === "telegram" && tgStep === "instruction" && (
              <div className="space-y-5">
                <div className="text-center mb-2">
                  <div className="font-orbitron text-xs text-neon-cyan tracking-widest mb-1">ВХОД ЧЕРЕЗ TELEGRAM</div>
                  <div className="font-ibm text-xs text-white/40">Одноразовый код для подтверждения</div>
                </div>

                <div className="space-y-3">
                  {[
                    { num: "1", text: "Открой бот", sub: "@sbsmanager_bot" },
                    { num: "2", text: "Отправь команду", sub: "/start" },
                    { num: "3", text: "Получи 6-значный код", sub: "Бот пришлёт его в ответ" },
                  ].map((step) => (
                    <div key={step.num} className="flex items-center gap-3 p-3 rounded-xl border border-dark-border bg-dark-bg/50">
                      <div className="w-6 h-6 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 flex items-center justify-center flex-shrink-0 font-orbitron text-xs text-neon-cyan">
                        {step.num}
                      </div>
                      <div>
                        <div className="font-ibm text-sm text-white">{step.text}</div>
                        <div className="font-mono-ibm text-xs text-neon-cyan/60">{step.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <a
                  href="https://t.me/sbsmanager_bot?start=login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full cyber-btn-primary py-3.5 text-xs rounded-xl font-orbitron tracking-widest"
                >
                  <Icon name="Send" size={13} />
                  ОТКРЫТЬ @SBSMANAGER_BOT
                </a>

                <button
                  onClick={() => { setTgStep("code"); setTgTimer(TG_CODE_TTL); }}
                  className="w-full py-3 text-xs font-orbitron tracking-widest text-white/40 border border-dark-border rounded-xl hover:border-neon-cyan/30 hover:text-white/70 transition-all"
                >
                  УЖЕ ПОЛУЧИЛ КОД →
                </button>
              </div>
            )}

            {/* ── STEP: TELEGRAM — CODE INPUT ── */}
            {authMethod === "telegram" && tgStep === "code" && (
              <div className="space-y-5">
                <div className="text-center">
                  <div className="font-orbitron text-xs text-neon-cyan tracking-widest mb-1">ВВЕДИ КОД ИЗ TELEGRAM</div>
                  <div className="font-ibm text-xs text-white/40">Бот @sbsmanager_bot прислал 6-значный код</div>
                </div>

                <div
                  className={`relative cursor-text transition-all ${tgError ? "animate-pulse" : ""}`}
                  onClick={() => (document.querySelector("input[type='text']") as HTMLElement)?.focus()}
                >
                  <TgCodeInput value={tgCode} onChange={setTgCode} />
                  {tgError && (
                    <div className="text-center mt-3 font-mono-ibm text-xs text-red-400">
                      Неверный код. Попробуй ещё раз.
                    </div>
                  )}
                </div>

                {/* Timer */}
                <div className="flex items-center justify-between">
                  <span className="font-mono-ibm text-xs text-white/30">
                    {tgTimer > 0 ? `Код действует ${formatTimer(tgTimer)}` : "Код истёк"}
                  </span>
                  {tgTimer <= 0 && (
                    <button
                      onClick={() => { setTgStep("instruction"); setTgCode(""); setTgTimer(TG_CODE_TTL); }}
                      className="font-mono-ibm text-xs text-neon-cyan hover:underline"
                    >
                      Получить новый
                    </button>
                  )}
                </div>

                <button
                  onClick={handleTgCodeSubmit}
                  disabled={tgCode.length < 6}
                  className={`w-full py-3.5 text-xs rounded-xl font-orbitron tracking-widest transition-all ${
                    tgCode.length === 6
                      ? "cyber-btn-primary"
                      : "border border-dark-border text-white/20 cursor-not-allowed"
                  }`}
                >
                  ПОДТВЕРДИТЬ →
                </button>

                <p className="font-mono-ibm text-xs text-white/20 text-center">
                  Демо: введи 123456 для входа
                </p>
              </div>
            )}

            {/* ── STEP: EMAIL ── */}
            {authMethod === "email" && (
              <div className="space-y-4">
                <div className="text-center mb-2">
                  <div className="font-orbitron text-xs text-white/60 tracking-widest mb-1">
                    {authMode === "login" ? "ВХОД ПО EMAIL" : "РЕГИСТРАЦИЯ"}
                  </div>
                </div>

                {authMode === "register" && (
                  <div>
                    <label className="font-mono-ibm text-xs text-white/40 tracking-widest mb-1.5 block">ИМЯ</label>
                    <input type="text" placeholder="Ваше имя" className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-neon-cyan transition-colors placeholder:text-white/20 font-ibm" />
                  </div>
                )}
                <div>
                  <label className="font-mono-ibm text-xs text-white/40 tracking-widest mb-1.5 block">EMAIL</label>
                  <input type="email" placeholder="your@email.com" className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-neon-cyan transition-colors placeholder:text-white/20 font-ibm" />
                </div>
                <div>
                  <label className="font-mono-ibm text-xs text-white/40 tracking-widest mb-1.5 block">ПАРОЛЬ</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-neon-cyan transition-colors placeholder:text-white/20 font-ibm" />
                </div>

                {authMode === "login" && (
                  <div className="text-right">
                    <button className="font-mono-ibm text-xs text-white/30 hover:text-neon-cyan transition-colors">Забыли пароль?</button>
                  </div>
                )}

                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full cyber-btn-primary py-3.5 text-xs rounded-lg font-orbitron tracking-widest mt-2"
                >
                  {authMode === "login" ? "ВОЙТИ →" : "СОЗДАТЬ АККАУНТ →"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-dark-bg/90 backdrop-blur-md border-b border-dark-border">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => scrollTo("home")} className="flex items-center gap-3">
            <img
              src={LEADER_IMG}
              alt="SBS"
              className="w-8 h-8 rounded-full object-cover border border-neon-cyan/60"
            />
            <span className="font-orbitron text-sm font-bold neon-text-cyan tracking-widest">
              SBS <span className="text-white/60">CONNECT</span>
            </span>
          </button>

          <div className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`font-orbitron text-xs tracking-widest transition-all duration-200 ${
                  activeSection === item.id ? "text-neon-cyan" : "text-white/40 hover:text-white/80"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => openAuth("login")}
              className="font-orbitron text-xs tracking-widest text-white/50 hover:text-neon-cyan transition-colors px-3 py-2"
            >
              ВОЙТИ
            </button>
            <button
              onClick={() => openAuth("register")}
              className="cyber-btn-primary px-4 py-2 text-xs rounded-lg"
            >
              ПОДКЛЮЧИТЬСЯ
            </button>
          </div>

          <button className="md:hidden text-neon-cyan" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-dark-card border-t border-dark-border py-4 px-6 flex flex-col gap-3 animate-fade-in">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-left font-orbitron text-xs tracking-widest text-white/60 hover:text-neon-cyan transition-colors py-1"
              >
                {item.label}
              </button>
            ))}
            <div className="flex gap-3 pt-2 border-t border-dark-border">
              <button onClick={() => { openAuth("login"); setMenuOpen(false); }} className="flex-1 py-2 font-orbitron text-xs text-white/50 border border-dark-border rounded-lg hover:border-neon-cyan hover:text-neon-cyan transition-colors">
                ВОЙТИ
              </button>
              <button onClick={() => { openAuth("register"); setMenuOpen(false); }} className="flex-1 cyber-btn-primary py-2 text-xs rounded-lg">
                ПОДКЛЮЧИТЬСЯ
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ═══ HERO ═══ */}
      <section id="home" className="relative min-h-screen flex items-center pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/40 via-transparent to-dark-bg" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-neon-cyan/30 bg-neon-cyan/5 rounded-lg font-mono-ibm text-xs text-neon-cyan/80">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-neon-pulse" />
              SBS | Secure Connection Service
            </div>

            <h1 className="font-orbitron font-black leading-none">
              <span className="block text-5xl md:text-7xl neon-text-cyan animate-flicker">SBS</span>
              <span className="block text-5xl md:text-7xl text-white">CONNECT</span>
              <span className="block text-lg md:text-xl text-white/30 font-light tracking-[0.2em] mt-3">SECURE CONNECTION SERVICE</span>
            </h1>

            <p className="text-white/55 text-base leading-relaxed font-ibm">
              Безопасный VPN · Обход блокировок · Обход замедления Telegram · Яндекс Плюс Семья
            </p>

            <div className="flex flex-wrap gap-3">
              <button onClick={() => openAuth("register")} className="cyber-btn-primary px-8 py-4 text-xs rounded-lg">
                ПОДКЛЮЧИТЬСЯ →
              </button>
              <button onClick={() => scrollTo("what")} className="px-8 py-4 text-xs font-orbitron tracking-widest text-white/40 border border-dark-border rounded-lg hover:border-neon-cyan/40 hover:text-white/70 transition-all">
                ЧТО ВХОДИТ
              </button>
            </div>

            {/* Price pill */}
            <div className="inline-flex items-baseline gap-2 px-4 py-3 bg-neon-cyan/8 border border-neon-cyan/20 rounded-xl">
              <span className="font-orbitron text-4xl font-black neon-text-cyan">199</span>
              <span className="font-orbitron text-base text-white/40">₽/мес</span>
              <span className="font-ibm text-sm text-white/30 ml-1">· всё включено</span>
            </div>
          </div>

          {/* Leader character */}
          <div className="flex items-center justify-center animate-float">
            <div className="relative">
              {/* Glow rings */}
              <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle, rgba(0,255,255,0.15) 0%, transparent 70%)", transform: "scale(1.4)" }} />
              <div className="absolute inset-0 rounded-full border border-neon-cyan/20 animate-neon-pulse" style={{ transform: "scale(1.2)" }} />

              <img
                src={LEADER_IMG}
                alt="SBS Connect"
                className="relative z-10 w-64 h-64 md:w-80 md:h-80 rounded-full object-cover border-2 border-neon-cyan/50"
                style={{ boxShadow: "0 0 40px rgba(0,255,255,0.25), 0 0 80px rgba(0,255,255,0.08)" }}
              />

              {/* Floating badge */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 bg-dark-card border border-neon-cyan/40 rounded-full font-mono-ibm text-xs text-neon-cyan whitespace-nowrap animate-neon-pulse">
                ChaCha20-Poly1305
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-dark-bg to-transparent" />
      </section>

      {/* ═══ WELCOME MESSAGE (из бота) ═══ */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="cyber-card rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
            <img
              src={LEADER_IMG}
              alt="SBS"
              className="w-20 h-20 rounded-full object-cover border-2 border-neon-cyan flex-shrink-0"
              style={{ boxShadow: "0 0 20px rgba(0,255,255,0.3)" }}
            />
            <div>
              <div className="font-orbitron text-xs text-neon-cyan/60 tracking-widest mb-3">// ПРИВЕТСТВИЕ</div>
              <p className="font-ibm text-white/80 leading-relaxed text-base mb-4">
                <span className="text-white font-medium">Добро пожаловать 👋</span><br />
                Это ваш центр управления сервисами:
              </p>
              <ul className="space-y-2 font-ibm text-white/60 text-sm">
                {["Безопасный VPN", "Обход глушилок региона", "Обход замедления Telegram", "Яндекс Плюс Семья"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-neon-cyan" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-4 font-orbitron text-sm text-white">
                Всего <span className="neon-text-cyan text-xl font-black">199 ₽</span> в месяц
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ЧТО ВХОДИТ ═══ */}
      <section id="what" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <div className="font-mono-ibm text-xs text-neon-cyan/60 tracking-widest mb-3">// СЕРВИСЫ</div>
            <h2 className="font-orbitron text-4xl font-bold text-white">
              ЧТО <span className="neon-text-cyan">ВХОДИТ</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: "Shield",
                title: "Безопасный VPN",
                desc: "Шифрование ChaCha20-Poly1305. Весь трафик проходит через защищённый туннель.",
                tag: "ChaCha20-Poly1305",
              },
              {
                icon: "Globe",
                title: "Обход блокировок",
                desc: "Доступ к любым сайтам и сервисам независимо от региона и провайдера.",
                tag: "Без ограничений",
              },
              {
                icon: "Zap",
                title: "Антилаг Telegram",
                desc: "Обход замедления Telegram, стабильная скорость в мессенджере.",
                tag: "LTE-Обход",
              },
              {
                icon: "Star",
                title: "Яндекс Плюс Семья",
                desc: "Приглашение в Яндекс Плюс Семью — музыка, фильмы, кешбэк и многое другое.",
                tag: "Yandex Plus",
              },
            ].map((item) => (
              <div key={item.title} className="cyber-card rounded-xl p-6 flex gap-5 hover:-translate-y-1 transition-all duration-200">
                <div className="w-11 h-11 rounded-lg border border-neon-cyan/25 bg-neon-cyan/8 flex items-center justify-center flex-shrink-0">
                  <Icon name={item.icon} fallback="Shield" size={18} className="text-neon-cyan" />
                </div>
                <div className="flex-1">
                  <div className="font-orbitron text-sm font-bold text-white mb-1">{item.title}</div>
                  <div className="font-ibm text-sm text-white/50 leading-relaxed mb-3">{item.desc}</div>
                  <div className="inline-block px-2 py-0.5 border border-neon-cyan/25 bg-neon-cyan/5 rounded font-mono-ibm text-xs text-neon-cyan/70">
                    {item.tag}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ЦЕНА ═══ */}
      <section id="price" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <div className="font-mono-ibm text-xs text-neon-cyan/60 tracking-widest mb-3">// ПОДПИСКА</div>
            <h2 className="font-orbitron text-4xl font-bold text-white">
              ОДНА <span className="neon-text-cyan">ЦЕНА</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Price card */}
            <div className="cyber-card rounded-2xl p-8 neon-glow-cyan border-neon-cyan/40">
              <div className="font-mono-ibm text-xs text-neon-cyan/60 tracking-widest mb-6">// SBS CONNECT</div>

              <div className="flex items-baseline gap-3 mb-8">
                <span className="font-orbitron text-7xl font-black neon-text-cyan">199</span>
                <div>
                  <span className="font-orbitron text-xl text-white/40">₽</span>
                  <div className="font-mono-ibm text-xs text-white/30">в месяц</div>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  "✅ Безопасный VPN",
                  "✅ Обход блокировок региона",
                  "✅ Антилаг Telegram (LTE)",
                  "🌟 Яндекс Плюс Семья",
                  "🔐 ChaCha20-Poly1305",
                  "📵 Zero Logs",
                ].map((f) => (
                  <li key={f} className="font-ibm text-sm text-white/70">{f}</li>
                ))}
              </ul>

              <button onClick={() => openAuth("register")} className="w-full cyber-btn-primary py-4 text-xs rounded-xl font-orbitron tracking-widest">
                ПОДКЛЮЧИТЬСЯ →
              </button>

              <p className="font-mono-ibm text-xs text-white/25 text-center mt-4">
                По вопросам сотрудничества: @sbsmanager_bot
              </p>
            </div>

            {/* Leader + info */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <img
                  src={LEADER_IMG}
                  alt="SBS"
                  className="w-14 h-14 rounded-full object-cover border border-neon-cyan/40"
                />
                <div>
                  <div className="font-orbitron text-sm font-bold text-white">SBS CONNECT</div>
                  <div className="font-ibm text-xs text-white/40">Secure Connection Service</div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { icon: "Users", text: "Работает на всех устройствах" },
                  { icon: "RefreshCw", text: "Автоматическое продление подписки" },
                  { icon: "MessageCircle", text: "Поддержка через Telegram-бот 24/7" },
                  { icon: "Gift", text: "Приглашение в Яндекс Семью включено" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg border border-neon-cyan/20 bg-neon-cyan/5 flex items-center justify-center flex-shrink-0">
                      <Icon name={item.icon} fallback="Shield" size={13} className="text-neon-cyan" />
                    </div>
                    <span className="font-ibm text-sm text-white/60">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 border border-neon-cyan/15 bg-neon-cyan/5 rounded-xl">
                <div className="font-mono-ibm text-xs text-white/40 mb-1">ЛИЧНЫЙ КАБИНЕТ</div>
                <div className="font-ibm text-sm text-white/60">
                  После оплаты вы получите доступ к личному кабинету с управлением подпиской, реферальной программой и историей платежей.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-14">
            <div className="font-mono-ibm text-xs text-neon-cyan/60 tracking-widest mb-3">// ВОПРОСЫ</div>
            <h2 className="font-orbitron text-4xl font-bold text-white">FAQ</h2>
          </div>

          <div className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className={`rounded-xl border overflow-hidden transition-all duration-200 ${
                  openFaq === i ? "border-neon-cyan/40 bg-neon-cyan/3" : "border-dark-border bg-dark-card hover:border-neon-cyan/20"
                }`}
              >
                <button
                  className="w-full p-5 flex items-center justify-between gap-4 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono-ibm text-xs text-neon-cyan/40 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-ibm text-sm text-white">{item.q}</span>
                  </div>
                  <Icon
                    name={openFaq === i ? "Minus" : "Plus"}
                    size={14}
                    className={`flex-shrink-0 transition-colors ${openFaq === i ? "text-neon-cyan" : "text-white/20"}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 border-t border-neon-cyan/10 animate-fade-in">
                    <p className="font-ibm text-sm text-white/50 leading-relaxed pt-4 pl-8">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CONTACTS ═══ */}
      <section id="contacts" className="py-24 px-6 border-t border-dark-border">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <div className="font-mono-ibm text-xs text-neon-cyan/60 tracking-widest mb-3">// КОНТАКТЫ</div>
            <h2 className="font-orbitron text-4xl font-bold text-white mb-8">СВЯЗАТЬСЯ</h2>

            <div className="space-y-4 mb-8">
              {[
                { icon: "MessageCircle", value: "@sbsmanager_bot", sub: "Telegram — основной канал" },
                { icon: "Users", value: "Поддержка | SBS", sub: "Telegram-чат поддержки" },
                { icon: "Clock", value: "24/7", sub: "Работаем без выходных" },
              ].map((c) => (
                <div key={c.value} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg border border-neon-cyan/20 bg-neon-cyan/5 flex items-center justify-center flex-shrink-0">
                    <Icon name={c.icon} fallback="Shield" size={15} className="text-neon-cyan" />
                  </div>
                  <div>
                    <div className="font-ibm text-sm text-white">{c.value}</div>
                    <div className="font-mono-ibm text-xs text-white/30">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 p-5 cyber-card rounded-xl">
              <img src={LEADER_IMG} alt="SBS" className="w-12 h-12 rounded-full object-cover border border-neon-cyan/40 flex-shrink-0" />
              <div>
                <div className="font-orbitron text-xs text-neon-cyan mb-1">SBS CONNECT BOT</div>
                <div className="font-ibm text-xs text-white/40">Управление подпиской через Telegram-бота</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Имя"
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white text-sm font-ibm focus:outline-none focus:border-neon-cyan transition-colors placeholder:text-white/20"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white text-sm font-ibm focus:outline-none focus:border-neon-cyan transition-colors placeholder:text-white/20"
            />
            <textarea
              placeholder="Сообщение"
              rows={4}
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white text-sm font-ibm focus:outline-none focus:border-neon-cyan transition-colors placeholder:text-white/20 resize-none"
            />
            <button className="w-full cyber-btn-primary py-3.5 text-xs rounded-xl font-orbitron tracking-widest">
              ОТПРАВИТЬ →
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-dark-border py-6 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src={LEADER_IMG} alt="SBS" className="w-6 h-6 rounded-full object-cover border border-neon-cyan/40" />
            <span className="font-orbitron text-xs neon-text-cyan tracking-widest">SBS CONNECT</span>
          </div>
          <div className="font-mono-ibm text-xs text-white/20">
            © 2026 SBS | Secure Connection Service · 199₽/мес · ChaCha20-Poly1305
          </div>
          <button onClick={() => openAuth("login")} className="font-mono-ibm text-xs text-white/30 hover:text-neon-cyan transition-colors">
            ВОЙТИ В КАБИНЕТ →
          </button>
        </div>
      </footer>
    </div>
  );
}