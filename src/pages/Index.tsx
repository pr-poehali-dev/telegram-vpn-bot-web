import { useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/c5530eba-c9a4-45d0-b3b8-b97285df77dc/files/7ce7ef9f-4712-4898-b8ee-4c3a344835df.jpg";

const SERVERS = [
  { id: 1, city: "Франкфурт", flag: "🇩🇪", x: 48.5, y: 32 },
  { id: 2, city: "Нью-Йорк", flag: "🇺🇸", x: 22, y: 36 },
  { id: 3, city: "Лос-Анджелес", flag: "🇺🇸", x: 12, y: 40 },
  { id: 4, city: "Амстердам", flag: "🇳🇱", x: 47, y: 29 },
  { id: 5, city: "Токио", flag: "🇯🇵", x: 80, y: 36 },
  { id: 6, city: "Лондон", flag: "🇬🇧", x: 45, y: 28 },
  { id: 7, city: "Сингапур", flag: "🇸🇬", x: 74, y: 55 },
  { id: 8, city: "Торонто", flag: "🇨🇦", x: 19, y: 30 },
  { id: 9, city: "Сидней", flag: "🇦🇺", x: 82, y: 72 },
  { id: 10, city: "Цюрих", flag: "🇨🇭", x: 49.5, y: 31 },
  { id: 11, city: "Париж", flag: "🇫🇷", x: 46.5, y: 31 },
  { id: 12, city: "Сан-Паулу", flag: "🇧🇷", x: 30, y: 65 },
];

const PLANS = [
  {
    name: "BASIC",
    price: "299",
    features: ["5 устройств", "10 стран", "100 Мбит/с"],
    popular: false,
  },
  {
    name: "PRO",
    price: "599",
    features: ["Безлимит устройств", "50+ стран", "1 Гбит/с", "Выделенный IP"],
    popular: true,
  },
  {
    name: "ULTRA",
    price: "1199",
    features: ["Безлимит устройств", "Все страны", "10 Гбит/с", "Персональный менеджер"],
    popular: false,
  },
];

const FAQ_ITEMS = [
  { q: "Есть ли логи активности?", a: "Нет. Политика нулевого логирования — ваши данные и IP-адрес не хранятся." },
  { q: "Какие протоколы поддерживаются?", a: "OpenVPN, WireGuard, IKEv2 и собственный протокол NeoTunnel с двойным шифрованием." },
  { q: "Есть ли пробный период?", a: "Да, 7 дней бесплатно на любом тарифе. Только почта — карта не нужна." },
  { q: "Сколько устройств можно подключить?", a: "BASIC — до 5 устройств. PRO и ULTRA — без ограничений." },
];

const NAV_ITEMS = [
  { id: "home", label: "ГЛАВНАЯ" },
  { id: "plans", label: "ТАРИФЫ" },
  { id: "servers", label: "СЕРВЕРЫ" },
  { id: "faq", label: "FAQ" },
  { id: "contacts", label: "КОНТАКТЫ" },
];

type AuthMode = "login" | "register";

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [selectedServer, setSelectedServer] = useState<typeof SERVERS[0] | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
    setMenuOpen(false);
  };

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white font-ibm relative overflow-x-hidden">
      {/* Grid background */}
      <div className="fixed inset-0 pointer-events-none z-0 grid-bg opacity-30" />
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-radial from-neon-cyan/3 via-transparent to-transparent" />

      {/* AUTH MODAL */}
      {authOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setAuthOpen(false)}
        >
          <div className="absolute inset-0 bg-dark-bg/80 backdrop-blur-sm" onClick={() => setAuthOpen(false)} />
          <div className="relative w-full max-w-md cyber-card rounded-lg p-8 animate-scale-in">
            {/* Close */}
            <button
              onClick={() => setAuthOpen(false)}
              className="absolute top-4 right-4 text-white/30 hover:text-neon-cyan transition-colors"
            >
              <Icon name="X" size={18} />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-7 h-7 relative flex items-center justify-center">
                <div className="absolute inset-0 border border-neon-cyan rotate-45 animate-neon-pulse" />
                <Icon name="Shield" size={12} className="text-neon-cyan relative z-10" />
              </div>
              <span className="font-orbitron text-sm font-bold neon-text-cyan tracking-widest">
                NEO<span className="text-white/60">SHIELD</span>
              </span>
            </div>

            {/* Tabs */}
            <div className="flex mb-8 border-b border-dark-border">
              {(["login", "register"] as AuthMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setAuthMode(mode)}
                  className={`flex-1 pb-3 font-orbitron text-xs tracking-widest transition-all duration-200 ${
                    authMode === mode
                      ? "text-neon-cyan border-b-2 border-neon-cyan -mb-px"
                      : "text-white/30 hover:text-white/60"
                  }`}
                >
                  {mode === "login" ? "ВХОД" : "РЕГИСТРАЦИЯ"}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {authMode === "register" && (
                <div>
                  <label className="font-mono-ibm text-xs text-white/40 tracking-widest mb-1.5 block">ИМЯ</label>
                  <input
                    type="text"
                    placeholder="Ваше имя"
                    className="w-full bg-dark-bg border border-dark-border rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-neon-cyan transition-colors placeholder:text-white/20 font-ibm"
                  />
                </div>
              )}
              <div>
                <label className="font-mono-ibm text-xs text-white/40 tracking-widest mb-1.5 block">EMAIL</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full bg-dark-bg border border-dark-border rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-neon-cyan transition-colors placeholder:text-white/20 font-ibm"
                />
              </div>
              <div>
                <label className="font-mono-ibm text-xs text-white/40 tracking-widest mb-1.5 block">ПАРОЛЬ</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-dark-bg border border-dark-border rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-neon-cyan transition-colors placeholder:text-white/20 font-ibm"
                />
              </div>

              {authMode === "login" && (
                <div className="text-right">
                  <button className="font-mono-ibm text-xs text-white/30 hover:text-neon-cyan transition-colors">
                    Забыли пароль?
                  </button>
                </div>
              )}

              <button className="w-full cyber-btn-primary py-3.5 text-xs rounded font-orbitron tracking-widest mt-2">
                {authMode === "login" ? "ВОЙТИ →" : "СОЗДАТЬ АККАУНТ →"}
              </button>

              {authMode === "register" && (
                <p className="font-mono-ibm text-xs text-white/30 text-center leading-relaxed">
                  7 дней бесплатно · Карта не нужна
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-dark-bg/90 backdrop-blur-md border-b border-dark-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => scrollTo("home")} className="flex items-center gap-3">
            <div className="w-7 h-7 relative flex items-center justify-center">
              <div className="absolute inset-0 border border-neon-cyan rotate-45 animate-neon-pulse" />
              <Icon name="Shield" size={12} className="text-neon-cyan relative z-10" />
            </div>
            <span className="font-orbitron text-base font-bold neon-text-cyan tracking-widest">
              NEO<span className="text-white/50">SHIELD</span>
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
              className="cyber-btn-primary px-4 py-2 text-xs rounded"
            >
              НАЧАТЬ
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
              <button onClick={() => { openAuth("login"); setMenuOpen(false); }} className="flex-1 py-2 font-orbitron text-xs text-white/50 border border-dark-border rounded hover:border-neon-cyan hover:text-neon-cyan transition-colors">
                ВОЙТИ
              </button>
              <button onClick={() => { openAuth("register"); setMenuOpen(false); }} className="flex-1 cyber-btn-primary py-2 text-xs rounded">
                НАЧАТЬ
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ═══ HERO ═══ */}
      <section id="home" className="relative min-h-screen flex items-center pt-16">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/60 via-transparent to-dark-bg" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-dark-bg/40 to-dark-bg/80" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-neon-cyan/30 bg-neon-cyan/5 rounded font-mono-ibm text-xs text-neon-cyan/80">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-neon-pulse" />
              AES-256 · ZERO LOGS · 50+ СЕРВЕРОВ
            </div>

            <h1 className="font-orbitron font-black leading-none">
              <span className="block text-6xl md:text-8xl neon-text-cyan animate-flicker">NEO</span>
              <span className="block text-6xl md:text-8xl text-white">SHIELD</span>
              <span className="block text-2xl md:text-3xl text-white/30 font-light tracking-[0.3em] mt-2">VPN</span>
            </h1>

            <p className="text-white/50 text-base leading-relaxed max-w-md font-ibm">
              Анонимность. Скорость. Свобода.<br />
              Защита нового поколения.
            </p>

            <div className="flex flex-wrap gap-3">
              <button onClick={() => openAuth("register")} className="cyber-btn-primary px-8 py-4 text-xs rounded">
                ПОПРОБОВАТЬ 7 ДНЕЙ →
              </button>
              <button onClick={() => scrollTo("plans")} className="px-8 py-4 text-xs font-orbitron tracking-widest text-white/40 border border-dark-border rounded hover:border-neon-cyan/40 hover:text-white/70 transition-all">
                ТАРИФЫ
              </button>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-bg to-transparent" />
      </section>

      {/* ═══ FEATURES strip ═══ */}
      <section className="py-16 px-6 border-y border-dark-border">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: "Lock", label: "AES-256", sub: "Шифрование" },
            { icon: "Zap", label: "WireGuard", sub: "Протокол" },
            { icon: "EyeOff", label: "No Logs", sub: "Политика" },
            { icon: "Globe", label: "50+", sub: "Серверов" },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded border border-neon-cyan/20 bg-neon-cyan/5 flex items-center justify-center flex-shrink-0">
                <Icon name={f.icon} fallback="Shield" size={16} className="text-neon-cyan" />
              </div>
              <div>
                <div className="font-orbitron text-sm font-bold text-white">{f.label}</div>
                <div className="font-mono-ibm text-xs text-white/30">{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ PLANS ═══ */}
      <section id="plans" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <div className="font-mono-ibm text-xs text-neon-cyan/60 tracking-widest mb-3">// ТАРИФЫ</div>
            <h2 className="font-orbitron text-4xl font-bold text-white">
              ВЫБЕРИ <span className="neon-text-cyan">ПЛАН</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 relative border ${
                  plan.popular
                    ? "border-neon-cyan bg-neon-cyan/5 neon-glow-cyan"
                    : "border-dark-border bg-dark-card hover:border-neon-cyan/30"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-6 px-3 py-0.5 bg-neon-cyan font-orbitron text-xs text-dark-bg font-bold rounded">
                    ПОПУЛЯРНЫЙ
                  </div>
                )}

                <div className="font-orbitron text-sm text-white/40 mb-4">{plan.name}</div>

                <div className="mb-6">
                  <span className="font-orbitron text-5xl font-black neon-text-cyan">{plan.price}</span>
                  <span className="text-white/30 text-sm ml-2">₽/мес</span>
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-white/60 font-ibm">
                      <div className="w-1 h-1 rounded-full bg-neon-cyan flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => openAuth("register")}
                  className={`w-full py-3 text-xs rounded font-orbitron tracking-widest transition-all ${
                    plan.popular
                      ? "cyber-btn-primary"
                      : "border border-dark-border text-white/50 hover:border-neon-cyan/50 hover:text-neon-cyan"
                  }`}
                >
                  ВЫБРАТЬ →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MAP ═══ */}
      <section id="servers" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <div className="font-mono-ibm text-xs text-neon-cyan/60 tracking-widest mb-3">// СЕТЬ</div>
            <h2 className="font-orbitron text-4xl font-bold text-white">
              КАРТА <span className="neon-text-cyan">СЕРВЕРОВ</span>
            </h2>
          </div>

          <div className="rounded-lg border border-dark-border overflow-hidden bg-dark-card">
            <div className="relative" style={{ paddingBottom: "46%" }}>
              <div className="absolute inset-0">
                <svg viewBox="0 0 1000 460" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  {/* Grid */}
                  {[...Array(10)].map((_, i) => (
                    <line key={`h${i}`} x1="0" y1={i * 46} x2="1000" y2={i * 46} stroke="rgba(0,255,255,0.03)" strokeWidth="1" />
                  ))}
                  {[...Array(20)].map((_, i) => (
                    <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="460" stroke="rgba(0,255,255,0.03)" strokeWidth="1" />
                  ))}
                  {/* Continents */}
                  <g fill="rgba(0,255,255,0.06)" stroke="rgba(0,255,255,0.15)" strokeWidth="0.7">
                    <path d="M80,78 L200,53 L240,88 L235,178 L190,228 L150,248 L100,198 L65,162 Z" />
                    <path d="M155,262 L205,242 L235,282 L248,368 L205,428 L162,408 L140,338 L132,292 Z" />
                    <path d="M420,52 L510,42 L545,75 L538,142 L478,160 L432,150 L400,108 Z" />
                    <path d="M432,170 L518,160 L548,198 L558,302 L518,382 L462,392 L420,342 L400,252 L412,190 Z" />
                    <path d="M545,42 L810,35 L848,98 L828,202 L758,222 L685,242 L622,222 L562,190 L535,130 Z" />
                    <path d="M755,312 L848,302 L876,340 L866,402 L804,422 L742,392 L722,352 Z" />
                  </g>
                  {/* Lines to selected */}
                  {selectedServer && SERVERS.filter(s => s.id !== selectedServer.id).map(s => (
                    <line
                      key={s.id}
                      x1={selectedServer.x * 10}
                      y1={selectedServer.y * 4.6}
                      x2={s.x * 10}
                      y2={s.y * 4.6}
                      stroke="rgba(0,200,255,0.12)"
                      strokeWidth="0.6"
                      strokeDasharray="3,5"
                    />
                  ))}
                </svg>

                {SERVERS.map((server) => (
                  <button
                    key={server.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10"
                    style={{ left: `${server.x}%`, top: `${server.y}%` }}
                    onClick={() => setSelectedServer(selectedServer?.id === server.id ? null : server)}
                  >
                    <div className="relative">
                      <div
                        className="w-3 h-3 rounded-full border transition-all duration-300 group-hover:scale-150"
                        style={{
                          background: selectedServer?.id === server.id ? "#00ffff" : "rgba(0,200,255,0.4)",
                          borderColor: "#00ffff",
                          boxShadow: selectedServer?.id === server.id
                            ? "0 0 12px #00ffff, 0 0 24px rgba(0,255,255,0.4)"
                            : "0 0 6px rgba(0,200,255,0.5)",
                        }}
                      />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                        <div className="bg-dark-bg border border-neon-cyan/30 rounded px-2 py-1 text-xs font-mono-ibm text-neon-cyan">
                          {server.flag} {server.city}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected server */}
            {selectedServer ? (
              <div className="border-t border-neon-cyan/20 p-5 flex items-center justify-between gap-4 bg-neon-cyan/3 animate-fade-in">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedServer.flag}</span>
                  <div>
                    <div className="font-orbitron text-sm font-bold text-white">{selectedServer.city}</div>
                    <div className="font-mono-ibm text-xs text-neon-cyan/60">Сервер выбран</div>
                  </div>
                </div>
                <button onClick={() => openAuth("register")} className="cyber-btn-primary px-5 py-2.5 text-xs rounded">
                  ПОДКЛЮЧИТЬСЯ →
                </button>
              </div>
            ) : (
              <div className="border-t border-dark-border p-4 flex items-center gap-2">
                <Icon name="MapPin" size={14} className="text-neon-cyan/40" />
                <span className="font-mono-ibm text-xs text-white/30">Нажми на точку для выбора сервера</span>
              </div>
            )}
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
                className={`rounded-lg border overflow-hidden transition-all duration-200 ${
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
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <div className="font-mono-ibm text-xs text-neon-cyan/60 tracking-widest mb-3">// КОНТАКТЫ</div>
            <h2 className="font-orbitron text-4xl font-bold text-white mb-8">СВЯЗАТЬСЯ</h2>
            <div className="space-y-4">
              {[
                { icon: "Mail", value: "support@neoshield.vpn" },
                { icon: "MessageCircle", value: "@neoshield_vpn" },
                { icon: "Clock", value: "Поддержка 24/7" },
              ].map((c) => (
                <div key={c.value} className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded border border-neon-cyan/20 bg-neon-cyan/5 flex items-center justify-center flex-shrink-0">
                    <Icon name={c.icon} fallback="Shield" size={14} className="text-neon-cyan" />
                  </div>
                  <span className="font-ibm text-sm text-white/60">{c.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Имя"
              className="w-full bg-dark-bg border border-dark-border rounded px-4 py-3 text-white text-sm font-ibm focus:outline-none focus:border-neon-cyan transition-colors placeholder:text-white/20"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-dark-bg border border-dark-border rounded px-4 py-3 text-white text-sm font-ibm focus:outline-none focus:border-neon-cyan transition-colors placeholder:text-white/20"
            />
            <textarea
              placeholder="Сообщение"
              rows={4}
              className="w-full bg-dark-bg border border-dark-border rounded px-4 py-3 text-white text-sm font-ibm focus:outline-none focus:border-neon-cyan transition-colors placeholder:text-white/20 resize-none"
            />
            <button className="w-full cyber-btn-primary py-3.5 text-xs rounded font-orbitron tracking-widest">
              ОТПРАВИТЬ →
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-dark-border py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Icon name="Shield" size={14} className="text-neon-cyan" />
            <span className="font-orbitron text-xs neon-text-cyan tracking-widest">NEOSHIELD VPN</span>
          </div>
          <div className="font-mono-ibm text-xs text-white/20">
            © 2026 NeoShield · No Logs · AES-256
          </div>
          <button onClick={() => openAuth("login")} className="font-mono-ibm text-xs text-white/30 hover:text-neon-cyan transition-colors">
            ВОЙТИ В КАБИНЕТ →
          </button>
        </div>
      </footer>
    </div>
  );
}
