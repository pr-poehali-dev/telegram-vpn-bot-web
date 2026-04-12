import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/c5530eba-c9a4-45d0-b3b8-b97285df77dc/files/7ce7ef9f-4712-4898-b8ee-4c3a344835df.jpg";

const SERVERS = [
  { id: 1, country: "Германия", city: "Франкфурт", flag: "🇩🇪", x: 48.5, y: 32, ping: 12, load: 35, status: "online" },
  { id: 2, country: "США", city: "Нью-Йорк", flag: "🇺🇸", x: 22, y: 36, ping: 87, load: 67, status: "online" },
  { id: 3, country: "США", city: "Лос-Анджелес", flag: "🇺🇸", x: 12, y: 40, ping: 102, load: 45, status: "online" },
  { id: 4, country: "Нидерланды", city: "Амстердам", flag: "🇳🇱", x: 47, y: 29, ping: 18, load: 22, status: "online" },
  { id: 5, country: "Япония", city: "Токио", flag: "🇯🇵", x: 80, y: 36, ping: 145, load: 58, status: "online" },
  { id: 6, country: "Великобритания", city: "Лондон", flag: "🇬🇧", x: 45, y: 28, ping: 21, load: 41, status: "online" },
  { id: 7, country: "Сингапур", city: "Сингапур", flag: "🇸🇬", x: 74, y: 55, ping: 178, load: 33, status: "online" },
  { id: 8, country: "Канада", city: "Торонто", flag: "🇨🇦", x: 19, y: 30, ping: 95, load: 28, status: "online" },
  { id: 9, country: "Австралия", city: "Сидней", flag: "🇦🇺", x: 82, y: 72, ping: 220, load: 15, status: "maintenance" },
  { id: 10, country: "Швейцария", city: "Цюрих", flag: "🇨🇭", x: 49, y: 32, ping: 14, load: 19, status: "online" },
  { id: 11, country: "Франция", city: "Париж", flag: "🇫🇷", x: 46.5, y: 31, ping: 16, load: 44, status: "online" },
  { id: 12, country: "Бразилия", city: "Сан-Паулу", flag: "🇧🇷", x: 30, y: 65, ping: 198, load: 52, status: "online" },
];

const PLANS = [
  {
    name: "BASIC",
    price: "299",
    period: "мес",
    color: "cyan",
    features: ["5 устройств", "10 стран", "AES-256 шифрование", "100 Мбит/с", "Поддержка 24/7"],
    popular: false,
  },
  {
    name: "PRO",
    price: "599",
    period: "мес",
    color: "purple",
    features: ["Безлимит устройств", "50+ стран", "AES-256 + WireGuard", "1 Гбит/с", "Приоритетная поддержка", "Выделенный IP"],
    popular: true,
  },
  {
    name: "ULTRA",
    price: "1199",
    period: "мес",
    color: "cyan",
    features: ["Безлимит устройств", "Все страны", "Мульти-протокол", "10 Гбит/с", "Персональный менеджер", "Выделенный IP", "Бизнес-аналитика"],
    popular: false,
  },
];

const FAQ_ITEMS = [
  { q: "Что такое NeoShield VPN?", a: "NeoShield VPN — это сервис для шифрования вашего интернет-трафика. Все данные проходят через защищённый туннель, что делает вас невидимым для провайдеров и злоумышленников." },
  { q: "Сколько устройств можно подключить?", a: "На тарифе BASIC — до 5 устройств одновременно. На тарифах PRO и ULTRA количество устройств не ограничено." },
  { q: "Есть ли логи активности?", a: "Нет. Мы придерживаемся политики нулевого логирования. Ваши данные, история посещений и IP-адрес не хранятся на наших серверах." },
  { q: "Какие протоколы поддерживаются?", a: "Мы поддерживаем OpenVPN, WireGuard, IKEv2 и собственный протокол NeoTunnel с двойным шифрованием." },
  { q: "Есть ли бесплатный пробный период?", a: "Да, первые 7 дней бесплатно на любом тарифе. Для активации нужна только электронная почта." },
];

const NAV_ITEMS = [
  { id: "home", label: "ГЛАВНАЯ" },
  { id: "connect", label: "ПОДКЛЮЧИТЬСЯ" },
  { id: "plans", label: "ТАРИФЫ" },
  { id: "servers", label: "СЕРВЕРЫ" },
  { id: "status", label: "СТАТУСЫ" },
  { id: "faq", label: "FAQ" },
  { id: "contacts", label: "КОНТАКТЫ" },
];

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [selectedServer, setSelectedServer] = useState<typeof SERVERS[0] | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [particles] = useState(() =>
    Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 8,
      duration: 5 + Math.random() * 8,
    }))
  );

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
    setMenuOpen(false);
  };

  const getLoadColor = (load: number) => {
    if (load < 40) return "#39ff14";
    if (load < 70) return "#ffcc00";
    return "#ff3355";
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white font-ibm relative overflow-x-hidden">
      {/* Background particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-neon-cyan"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: 0.3,
              animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/90 backdrop-blur-md border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => scrollTo("home")} className="flex items-center gap-3">
            <div className="w-8 h-8 relative flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-neon-cyan rotate-45 animate-neon-pulse" />
              <Icon name="Shield" size={14} className="text-neon-cyan relative z-10" />
            </div>
            <span className="font-orbitron text-lg font-bold neon-text-cyan tracking-widest">
              NEO<span className="text-neon-purple">SHIELD</span>
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`px-3 py-1.5 font-orbitron text-xs tracking-widest transition-all duration-300 ${
                  activeSection === item.id
                    ? "text-neon-cyan border-b border-neon-cyan"
                    : "text-white/50 hover:text-neon-cyan"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollTo("connect")}
            className="hidden md:block cyber-btn-primary px-4 py-2 text-xs rounded"
          >
            ПОДКЛЮЧИТЬСЯ
          </button>

          <button className="md:hidden text-neon-cyan" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-dark-card border-t border-dark-border py-4 px-4 flex flex-col gap-2 animate-fade-in">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-left py-2 font-orbitron text-xs tracking-widest text-white/70 hover:text-neon-cyan transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ═══ HERO ═══ */}
      <section id="home" className="relative min-h-screen flex items-center pt-16">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 scanline"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-dark-bg/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-neon-cyan/40 bg-neon-cyan/5 rounded font-mono-ibm text-xs text-neon-cyan">
              <div className="w-2 h-2 rounded-full status-dot-online" />
              СИСТЕМА АКТИВНА · 99.9% UPTIME
            </div>

            <h1 className="font-orbitron text-5xl md:text-7xl font-black leading-none animate-fade-in-up">
              <span className="neon-text-cyan animate-flicker">NEO</span>
              <br />
              <span className="text-white">SHIELD</span>
              <br />
              <span className="neon-text-purple text-3xl md:text-4xl font-medium tracking-widest">VPN</span>
            </h1>

            <p className="text-white/60 text-lg leading-relaxed max-w-lg">
              Защита нового поколения для вашего цифрового присутствия.<br />
              Анонимность. Скорость. Свобода.
            </p>

            <div className="flex flex-wrap gap-4">
              <button onClick={() => scrollTo("connect")} className="cyber-btn-primary px-8 py-4 text-sm rounded">
                НАЧАТЬ ЗАЩИТУ →
              </button>
              <button onClick={() => scrollTo("plans")} className="cyber-btn-secondary px-8 py-4 text-sm rounded">
                ТАРИФЫ
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "СЕРВЕРОВ", value: "50+" },
                { label: "СТРАН", value: "30+" },
                { label: "ПОЛЬЗОВАТЕЛЕЙ", value: "100K+" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-orbitron text-2xl font-bold neon-text-cyan">{stat.value}</div>
                  <div className="font-mono-ibm text-xs text-white/40 tracking-widest mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Globe */}
          <div className="hidden md:flex items-center justify-center animate-float">
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 rounded-full border border-neon-cyan/20 animate-neon-pulse" />
              <div className="absolute inset-4 rounded-full border border-neon-purple/20" style={{ animation: "neon-pulse 3s ease-in-out infinite reverse" }} />
              <div className="absolute inset-8 rounded-full border border-neon-cyan/30" style={{ animation: "neon-pulse 2.5s ease-in-out infinite" }} />
              <div className="absolute inset-0 rounded-full opacity-40 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_IMAGE})` }} />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon name="Shield" size={80} className="text-neon-cyan opacity-60" />
              </div>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    background: i % 2 === 0 ? "#00ffff" : "#bf5fff",
                    boxShadow: `0 0 8px ${i % 2 === 0 ? "#00ffff" : "#bf5fff"}`,
                    left: `${50 + 45 * Math.cos((i * Math.PI * 2) / 8)}%`,
                    top: `${50 + 45 * Math.sin((i * Math.PI * 2) / 8)}%`,
                    transform: "translate(-50%, -50%)",
                    animation: `pulse-green ${1 + i * 0.3}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CONNECT ═══ */}
      <section id="connect" className="relative py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="font-mono-ibm text-neon-cyan text-xs tracking-widest mb-3">// БЫСТРОЕ ПОДКЛЮЧЕНИЕ</div>
            <h2 className="font-orbitron text-4xl font-bold text-white">
              АКТИВИРОВАТЬ <span className="neon-text-purple">ЗАЩИТУ</span>
            </h2>
          </div>

          <div className="cyber-card rounded-lg p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="font-mono-ibm text-xs text-white/50 tracking-widest mb-2 block">EMAIL</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full bg-dark-bg border border-dark-border rounded px-4 py-3 text-white font-ibm focus:outline-none focus:border-neon-cyan transition-colors placeholder:text-white/20"
                />
              </div>
              <div>
                <label className="font-mono-ibm text-xs text-white/50 tracking-widest mb-2 block">ТАРИФ</label>
                <select className="w-full bg-dark-bg border border-dark-border rounded px-4 py-3 text-white font-ibm focus:outline-none focus:border-neon-cyan transition-colors">
                  <option>BASIC — 299₽/мес</option>
                  <option>PRO — 599₽/мес</option>
                  <option>ULTRA — 1199₽/мес</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 border border-neon-green/30 bg-neon-green/5 rounded">
              <Icon name="Gift" size={18} className="text-neon-green flex-shrink-0" />
              <span className="font-ibm text-sm text-white/70">
                <span className="text-neon-green font-medium">7 дней бесплатно</span> — без привязки карты
              </span>
            </div>

            <button className="w-full cyber-btn-primary py-4 text-sm rounded font-orbitron tracking-widest">
              НАЧАТЬ ПРОБНЫЙ ПЕРИОД →
            </button>

            <div className="grid grid-cols-3 gap-4 text-center pt-2 border-t border-dark-border">
              {[
                { icon: "Lock", label: "AES-256" },
                { icon: "Zap", label: "WireGuard" },
                { icon: "EyeOff", label: "No Logs" },
              ].map((f) => (
                <div key={f.label} className="flex flex-col items-center gap-2 pt-2">
                  <Icon name={f.icon} fallback="Shield" size={20} className="text-neon-cyan" />
                  <span className="font-mono-ibm text-xs text-white/50">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PLANS ═══ */}
      <section id="plans" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="font-mono-ibm text-neon-cyan text-xs tracking-widest mb-3">// ТАРИФНЫЕ ПЛАНЫ</div>
            <h2 className="font-orbitron text-4xl font-bold text-white">
              ВЫБЕРИ <span className="neon-text-cyan">УРОВЕНЬ</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`cyber-card rounded-lg p-6 flex flex-col transition-all duration-300 hover:-translate-y-2 relative ${
                  plan.popular ? "border-neon-purple neon-glow-purple" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-neon-purple font-orbitron text-xs text-dark-bg font-bold rounded">
                    ПОПУЛЯРНЫЙ
                  </div>
                )}
                <div className="mb-6">
                  <div className={`font-mono-ibm text-xs tracking-widest mb-1 ${plan.color === "cyan" ? "text-neon-cyan" : "text-neon-purple"}`}>
                    // ПЛАН
                  </div>
                  <div className="font-orbitron text-2xl font-bold text-white">{plan.name}</div>
                </div>

                <div className="mb-6">
                  <span className={`font-orbitron text-5xl font-black ${plan.color === "cyan" ? "neon-text-cyan" : "neon-text-purple"}`}>
                    {plan.price}
                  </span>
                  <span className="text-white/40 text-sm ml-2">₽/{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-white/70">
                      <Icon name="Check" size={14} className={plan.color === "cyan" ? "text-neon-cyan" : "text-neon-purple"} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 text-sm rounded ${plan.color === "cyan" ? "cyber-btn-primary" : "cyber-btn-secondary"}`}>
                  ВЫБРАТЬ →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MAP / SERVERS ═══ */}
      <section id="servers" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="font-mono-ibm text-neon-cyan text-xs tracking-widest mb-3">// ГЛОБАЛЬНАЯ СЕТЬ</div>
            <h2 className="font-orbitron text-4xl font-bold text-white">
              КАРТА <span className="neon-text-purple">СЕРВЕРОВ</span>
            </h2>
            <p className="text-white/40 font-ibm mt-3 text-sm">Нажми на точку, чтобы увидеть детали сервера</p>
          </div>

          <div className="cyber-card rounded-lg overflow-hidden">
            {/* Interactive Map */}
            <div className="relative bg-dark-bg/80 overflow-hidden" style={{ paddingBottom: "48%" }}>
              <div className="absolute inset-0">
                <svg viewBox="0 0 1000 480" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  {/* Grid */}
                  {[...Array(10)].map((_, i) => (
                    <line key={`h${i}`} x1="0" y1={i * 48} x2="1000" y2={i * 48} stroke="rgba(0,255,255,0.04)" strokeWidth="1" />
                  ))}
                  {[...Array(20)].map((_, i) => (
                    <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="480" stroke="rgba(0,255,255,0.04)" strokeWidth="1" />
                  ))}
                  {/* Continents */}
                  <g fill="rgba(0,255,255,0.08)" stroke="rgba(0,255,255,0.2)" strokeWidth="0.8">
                    <path d="M80,80 L200,55 L240,90 L235,180 L190,230 L150,250 L100,200 L65,165 Z" />
                    <path d="M155,265 L205,245 L235,285 L248,370 L205,430 L162,410 L140,340 L132,295 Z" />
                    <path d="M420,55 L510,45 L545,78 L538,145 L478,162 L432,152 L400,110 Z" />
                    <path d="M432,172 L518,162 L548,200 L558,305 L518,385 L462,395 L420,345 L400,255 L412,192 Z" />
                    <path d="M545,45 L810,38 L848,102 L828,205 L758,225 L685,245 L622,225 L562,192 L535,132 Z" />
                    <path d="M755,315 L848,304 L876,342 L866,405 L804,425 L742,395 L722,355 Z" />
                  </g>
                  {/* Connection lines between selected server and others */}
                  {selectedServer && SERVERS.filter(s => s.id !== selectedServer.id && s.status === "online").map(s => (
                    <line
                      key={s.id}
                      x1={selectedServer.x * 10}
                      y1={selectedServer.y * 4.8}
                      x2={s.x * 10}
                      y2={s.y * 4.8}
                      stroke="rgba(0,255,255,0.15)"
                      strokeWidth="0.5"
                      strokeDasharray="4,4"
                    />
                  ))}
                </svg>

                {/* Server dots */}
                {SERVERS.map((server) => (
                  <button
                    key={server.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10"
                    style={{ left: `${server.x}%`, top: `${server.y}%` }}
                    onClick={() => setSelectedServer(selectedServer?.id === server.id ? null : server)}
                  >
                    <div className="relative">
                      <div
                        className="w-4 h-4 rounded-full border-2 transition-all duration-300 group-hover:scale-150"
                        style={{
                          background: server.status === "online" ? getLoadColor(server.load) : "#555",
                          borderColor: server.status === "online" ? getLoadColor(server.load) : "#555",
                          boxShadow: server.status === "online" ? `0 0 8px ${getLoadColor(server.load)}` : "none",
                          animation: selectedServer?.id === server.id ? "neon-pulse 1s infinite" : server.status === "online" ? "pulse-green 2.5s infinite" : "none",
                          transform: selectedServer?.id === server.id ? "scale(1.5)" : undefined,
                        }}
                      />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                        <div className="bg-dark-card border border-neon-cyan/40 rounded px-2 py-1 text-xs font-mono-ibm text-neon-cyan shadow-lg">
                          {server.flag} {server.city} · {server.ping}ms
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Server detail panel */}
            {selectedServer && (
              <div className="border-t border-neon-cyan/20 p-6 bg-neon-cyan/3 animate-fade-in">
                <div className="grid md:grid-cols-5 gap-6 items-center">
                  <div className="md:col-span-2">
                    <div className="font-mono-ibm text-xs text-white/40 mb-1">ВЫБРАННЫЙ СЕРВЕР</div>
                    <div className="font-orbitron font-bold text-white text-xl">
                      {selectedServer.flag} {selectedServer.city}
                    </div>
                    <div className="font-ibm text-sm text-white/50">{selectedServer.country}</div>
                  </div>
                  <div>
                    <div className="font-mono-ibm text-xs text-white/40 mb-1">ПИНГ</div>
                    <div className="font-orbitron text-3xl font-bold neon-text-cyan">
                      {selectedServer.ping}<span className="text-sm text-white/40 ml-1">мс</span>
                    </div>
                  </div>
                  <div>
                    <div className="font-mono-ibm text-xs text-white/40 mb-2">ЗАГРУЗКА {selectedServer.load}%</div>
                    <div className="w-full bg-dark-bg rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${selectedServer.load}%`,
                          background: getLoadColor(selectedServer.load),
                          boxShadow: `0 0 8px ${getLoadColor(selectedServer.load)}`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <button className="cyber-btn-primary px-5 py-3 text-xs rounded w-full">
                      ПОДКЛЮЧИТЬСЯ →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Server list */}
            <div className="border-t border-dark-border p-6">
              <div className="font-mono-ibm text-xs text-white/40 tracking-widest mb-4">
                // СПИСОК СЕРВЕРОВ ({SERVERS.filter(s => s.status === "online").length} ONLINE / {SERVERS.length} ВСЕГО)
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                {SERVERS.map((server) => (
                  <button
                    key={server.id}
                    className={`flex items-center gap-3 p-3 rounded border transition-all duration-200 text-left ${
                      selectedServer?.id === server.id
                        ? "border-neon-cyan bg-neon-cyan/5 neon-border-cyan"
                        : "border-dark-border hover:border-neon-cyan/40 hover:bg-dark-card"
                    }`}
                    onClick={() => setSelectedServer(selectedServer?.id === server.id ? null : server)}
                  >
                    <span className="text-lg leading-none">{server.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-ibm text-sm text-white truncate">{server.city}</div>
                      <div className="font-mono-ibm text-xs text-white/40">{server.ping} мс</div>
                    </div>
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        background: server.status === "online" ? getLoadColor(server.load) : "#555",
                        boxShadow: server.status === "online" ? `0 0 6px ${getLoadColor(server.load)}` : "none",
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATUS ═══ */}
      <section id="status" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="font-mono-ibm text-neon-cyan text-xs tracking-widest mb-3">// МОНИТОРИНГ</div>
            <h2 className="font-orbitron text-4xl font-bold text-white">
              СТАТУС <span className="neon-text-cyan">СИСТЕМЫ</span>
            </h2>
          </div>

          <div className="space-y-3">
            {[
              { name: "API Gateway", uptime: "99.98%", status: "online", latency: "8ms" },
              { name: "VPN Core", uptime: "99.95%", status: "online", latency: "3ms" },
              { name: "DNS Resolver", uptime: "100%", status: "online", latency: "1ms" },
              { name: "Auth Service", uptime: "99.99%", status: "online", latency: "12ms" },
              { name: "Billing System", uptime: "99.9%", status: "online", latency: "45ms" },
              { name: "Sydney Cluster", uptime: "87.2%", status: "maintenance", latency: "—" },
            ].map((service) => (
              <div key={service.name} className="cyber-card rounded-lg p-5 flex items-center gap-4 flex-wrap">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${service.status === "online" ? "status-dot-online" : "bg-yellow-400"}`} />
                <div className="flex-1 min-w-[120px]">
                  <div className="font-orbitron text-sm font-medium text-white">{service.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono-ibm text-xs text-white/40">ЗАДЕРЖКА</div>
                  <div className="font-mono-ibm text-sm text-neon-cyan">{service.latency}</div>
                </div>
                <div className="text-right min-w-[80px]">
                  <div className="font-mono-ibm text-xs text-white/40">UPTIME</div>
                  <div className={`font-mono-ibm text-sm font-bold ${service.status === "online" ? "status-online" : "text-yellow-400"}`}>
                    {service.uptime}
                  </div>
                </div>
                <div className={`font-orbitron text-xs px-3 py-1 rounded border ${
                  service.status === "online"
                    ? "border-neon-green/40 text-neon-green bg-neon-green/5"
                    : "border-yellow-400/40 text-yellow-400 bg-yellow-400/5"
                }`}>
                  {service.status === "online" ? "ONLINE" : "MAINT"}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 border border-neon-cyan/20 bg-neon-cyan/5 rounded flex items-center gap-3">
            <Icon name="Activity" size={18} className="text-neon-cyan flex-shrink-0" />
            <span className="font-ibm text-sm text-white/70">
              Последнее обновление: <span className="text-neon-cyan font-mono-ibm">2026-04-12 14:32:07 UTC</span>
            </span>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="font-mono-ibm text-neon-cyan text-xs tracking-widest mb-3">// СПРАВКА</div>
            <h2 className="font-orbitron text-4xl font-bold text-white">
              ЧАСТО <span className="neon-text-purple">ЗАДАЮТ</span>
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className={`cyber-card rounded-lg overflow-hidden transition-all duration-300 ${openFaq === i ? "border-neon-cyan/50" : ""}`}
              >
                <button
                  className="w-full p-5 flex items-center justify-between gap-4 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono-ibm text-xs text-neon-cyan mt-0.5 flex-shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-ibm font-medium text-white">{item.q}</span>
                  </div>
                  <Icon
                    name={openFaq === i ? "ChevronUp" : "ChevronDown"}
                    size={16}
                    className={`flex-shrink-0 transition-colors ${openFaq === i ? "text-neon-cyan" : "text-white/30"}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 border-t border-dark-border animate-fade-in">
                    <p className="font-ibm text-sm text-white/60 leading-relaxed pt-4">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CONTACTS ═══ */}
      <section id="contacts" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="font-mono-ibm text-neon-cyan text-xs tracking-widest mb-3">// СВЯЗЬ</div>
            <h2 className="font-orbitron text-4xl font-bold text-white">КОНТАКТЫ</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {[
                { icon: "Mail", label: "Email", value: "support@neoshield.vpn", color: "cyan" },
                { icon: "MessageCircle", label: "Telegram", value: "@neoshield_vpn", color: "purple" },
                { icon: "Clock", label: "Поддержка", value: "24/7 без выходных", color: "cyan" },
                { icon: "Globe", label: "Юрисдикция", value: "Нидерланды · No Logs", color: "purple" },
              ].map((c) => (
                <div key={c.label} className="cyber-card rounded-lg p-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded flex items-center justify-center flex-shrink-0 ${
                    c.color === "cyan" ? "bg-neon-cyan/10 border border-neon-cyan/30" : "bg-neon-purple/10 border border-neon-purple/30"
                  }`}>
                    <Icon name={c.icon} fallback="Shield" size={18} className={c.color === "cyan" ? "text-neon-cyan" : "text-neon-purple"} />
                  </div>
                  <div>
                    <div className="font-mono-ibm text-xs text-white/40">{c.label}</div>
                    <div className="font-ibm text-sm text-white">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cyber-card rounded-lg p-6 space-y-4">
              <div className="font-orbitron text-sm text-neon-cyan">НАПИСАТЬ НАМ</div>
              <input
                type="text"
                placeholder="Ваше имя"
                className="w-full bg-dark-bg border border-dark-border rounded px-4 py-3 text-white font-ibm text-sm focus:outline-none focus:border-neon-cyan transition-colors placeholder:text-white/20"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-dark-bg border border-dark-border rounded px-4 py-3 text-white font-ibm text-sm focus:outline-none focus:border-neon-cyan transition-colors placeholder:text-white/20"
              />
              <textarea
                placeholder="Сообщение..."
                rows={4}
                className="w-full bg-dark-bg border border-dark-border rounded px-4 py-3 text-white font-ibm text-sm focus:outline-none focus:border-neon-cyan transition-colors placeholder:text-white/20 resize-none"
              />
              <button className="w-full cyber-btn-primary py-3 text-sm rounded">ОТПРАВИТЬ →</button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-dark-border py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Icon name="Shield" size={16} className="text-neon-cyan" />
            <span className="font-orbitron text-sm neon-text-cyan">
              NEO<span className="text-neon-purple">SHIELD</span> VPN
            </span>
          </div>
          <div className="font-mono-ibm text-xs text-white/30 text-center">
            © 2026 NeoShield VPN · No Logs Policy · AES-256 Encryption
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full status-dot-online" />
            <span className="font-mono-ibm text-xs text-neon-green">ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}