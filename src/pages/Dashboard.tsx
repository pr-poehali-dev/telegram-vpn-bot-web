import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const LEADER_IMG =
  "https://cdn.poehali.dev/projects/c5530eba-c9a4-45d0-b3b8-b97285df77dc/bucket/772efb66-806a-4ffb-ad15-f2b69a0b5a91.jpg";

// ─── MOCK DATA ─────────────────────────────────────────────────
const MOCK_TG_USER = {
  accountType: "telegram" as const,
  name: "Алексей Ш.",
  username: "@alexsh_user",
  tgId: "412839201",
  avatar: LEADER_IMG,
  subscription: {
    status: "active" as "active" | "expired" | "none",
    plan: "SBS CONNECT",
    startedAt: "2026-03-13",
    expiresAt: "2026-05-13",
    daysTotal: 61,
    daysLeft: 30,
  },
  payments: [
    { date: "13.03.2026", amount: "199 ₽", status: "paid", id: "#1023" },
    { date: "13.02.2026", amount: "199 ₽", status: "paid", id: "#0987" },
    { date: "13.01.2026", amount: "199 ₽", status: "paid", id: "#0941" },
  ],
  referrals: { count: 3, bonus: "597 ₽", link: "https://t.me/sbsmanager_bot?start=ref_412839201" },
  yandexFamily: { status: "active", slots: 5, used: 3, inviteLink: "https://ya.ru/family/invite/xxxxx" },
};

const MOCK_EMAIL_USER = {
  accountType: "email" as const,
  name: "Мария К.",
  email: "maria@example.com",
  avatar: null,
  subscription: {
    status: "active" as "active" | "expired" | "none",
    plan: "SBS CONNECT",
    startedAt: "2026-04-01",
    expiresAt: "2026-05-01",
    daysTotal: 30,
    daysLeft: 18,
  },
  payments: [
    { date: "01.04.2026", amount: "199 ₽", status: "paid", id: "#1101" },
  ],
  referrals: { count: 1, bonus: "199 ₽", link: "https://sbsconnect.ru?ref=maria_k" },
  yandexFamily: { status: "active", slots: 5, used: 2, inviteLink: "https://ya.ru/family/invite/yyyyy" },
};

type AnyUser = typeof MOCK_TG_USER | typeof MOCK_EMAIL_USER;
type DemoMode = "telegram" | "email";

// ─── STATUS BADGE ──────────────────────────────────────────────
function StatusBadge({ status }: { status: "active" | "expired" | "none" }) {
  if (status === "active")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-neon-green/30 bg-neon-green/8 font-mono-ibm text-xs text-neon-green">
        <span className="w-1.5 h-1.5 rounded-full status-dot-online" />
        АКТИВНА
      </span>
    );
  if (status === "expired")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-yellow-400/30 bg-yellow-400/8 font-mono-ibm text-xs text-yellow-400">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
        ИСТЕКЛА
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 bg-white/5 font-mono-ibm text-xs text-white/30">
      <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
      НЕТ ПОДПИСКИ
    </span>
  );
}

// ─── MAIN ──────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [demoMode, setDemoMode] = useState<DemoMode>("telegram");
  const [configCopied, setConfigCopied] = useState(false);
  const [refCopied, setRefCopied] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "payments" | "referrals" | "family">("overview");

  const user: AnyUser = demoMode === "telegram" ? MOCK_TG_USER : MOCK_EMAIL_USER;
  const isTg = user.accountType === "telegram";
  const sub = user.subscription;
  const hasActiveSub = sub.status === "active";

  const copyText = (text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const tabs = [
    { id: "overview" as const, label: "ОБЗОР", icon: "LayoutDashboard" },
    { id: "payments" as const, label: "ПЛАТЕЖИ", icon: "CreditCard" },
    { id: "referrals" as const, label: "РЕФЕРАЛЫ", icon: "Users" },
    { id: "family" as const, label: "ЯНД. СЕМЬЯ", icon: "Star" },
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-white font-ibm relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 grid-bg opacity-20" />

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-dark-bg/90 backdrop-blur-md border-b border-dark-border">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-3">
            <img src={LEADER_IMG} alt="SBS" className="w-8 h-8 rounded-full object-cover border border-neon-cyan/60" />
            <span className="font-orbitron text-sm font-bold neon-text-cyan tracking-widest">
              SBS <span className="text-white/60">CONNECT</span>
            </span>
          </button>

          {/* Demo switcher */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-card border border-dark-border rounded-xl">
            <span className="font-mono-ibm text-xs text-white/30">DEMO:</span>
            {(["telegram", "email"] as DemoMode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setDemoMode(m); setActiveTab("overview"); }}
                className={`font-mono-ibm text-xs px-2 py-0.5 rounded transition-all ${
                  demoMode === m ? "text-neon-cyan bg-neon-cyan/10" : "text-white/30 hover:text-white/60"
                }`}
              >
                {m === "telegram" ? "TG" : "EMAIL"}
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 font-mono-ibm text-xs text-white/30 hover:text-neon-cyan transition-colors"
          >
            <Icon name="LogOut" size={14} />
            ВЫЙТИ
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-20">

        {/* ── PROFILE CARD ──────────────────────────────────── */}
        <div className="cyber-card rounded-2xl p-6 mb-6 animate-fade-in-up">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {isTg ? (
                <img
                  src={MOCK_TG_USER.avatar}
                  alt="avatar"
                  className="w-16 h-16 rounded-full object-cover border-2 border-neon-cyan/50"
                  style={{ boxShadow: "0 0 20px rgba(0,255,255,0.2)" }}
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-full border-2 border-neon-cyan/30 bg-dark-card flex items-center justify-center font-orbitron text-xl font-bold neon-text-cyan"
                  style={{ boxShadow: "0 0 16px rgba(0,255,255,0.15)" }}
                >
                  {user.name.charAt(0)}
                </div>
              )}
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-dark-bg bg-neon-green status-dot-online" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <span className="font-orbitron text-base font-bold text-white">{user.name}</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-neon-cyan/30 bg-neon-cyan/5 font-mono-ibm text-xs text-neon-cyan/70">
                  <Icon name={isTg ? "Send" : "Mail"} size={10} />
                  {isTg ? "Telegram" : "Email"}
                </span>
              </div>
              {isTg ? (
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="font-mono-ibm text-xs text-white/40">{MOCK_TG_USER.username}</span>
                  <span className="font-mono-ibm text-xs text-white/20">ID: {MOCK_TG_USER.tgId}</span>
                </div>
              ) : (
                <span className="font-mono-ibm text-xs text-white/40">{MOCK_EMAIL_USER.email}</span>
              )}
            </div>

            <StatusBadge status={sub.status} />
          </div>
        </div>

        {/* ── TABS ──────────────────────────────────────────── */}
        <div className="flex gap-1 mb-6 border-b border-dark-border overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 font-orbitron text-xs tracking-widest transition-all duration-200 border-b-2 -mb-px whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-neon-cyan border-neon-cyan"
                  : "text-white/30 border-transparent hover:text-white/60"
              }`}
            >
              <Icon name={tab.icon} size={12} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ══ TAB: OVERVIEW ═════════════════════════════════ */}
        {activeTab === "overview" && (
          <div className="space-y-4 animate-fade-in-up">

            {/* Subscription */}
            <div className="cyber-card rounded-2xl p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="font-mono-ibm text-xs text-neon-cyan/50 tracking-widest mb-1">// ПОДПИСКА</div>
                  <div className="font-orbitron text-lg font-bold text-white">
                    {hasActiveSub ? "SBS CONNECT" : sub.status === "expired" ? "Подписка истекла" : "Нет подписки"}
                  </div>
                </div>
                <StatusBadge status={sub.status} />
              </div>

              {hasActiveSub && "startedAt" in sub && (
                <>
                  <div className="grid grid-cols-3 gap-4 mb-5">
                    {[
                      { label: "НАЧАЛО", value: sub.startedAt, highlight: false },
                      { label: "ИСТЕКАЕТ", value: sub.expiresAt, highlight: true },
                      { label: "ОСТАЛОСЬ", value: `${sub.daysLeft} дн.`, highlight: false },
                    ].map((s) => (
                      <div key={s.label} className="p-3 rounded-xl border border-dark-border bg-dark-bg/50">
                        <div className="font-mono-ibm text-xs text-white/30 mb-1">{s.label}</div>
                        <div className={`font-orbitron text-sm ${s.highlight ? "neon-text-cyan" : "text-white"}`}>
                          {s.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-5">
                    <div className="flex justify-between font-mono-ibm text-xs text-white/30 mb-2">
                      <span>Прогресс периода</span>
                      <span>{sub.daysLeft} / {sub.daysTotal} дней</span>
                    </div>
                    <div className="h-1.5 bg-dark-border rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(sub.daysLeft / sub.daysTotal) * 100}%`,
                          background: "linear-gradient(90deg, rgba(0,255,255,0.6), #00ffff)",
                          boxShadow: "0 0 8px rgba(0,255,255,0.6)",
                        }}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-3 flex-wrap">
                {hasActiveSub ? (
                  <button className="cyber-btn-secondary px-5 py-2.5 text-xs rounded-xl font-orbitron tracking-widest">
                    ПРОДЛИТЬ → 199 ₽
                  </button>
                ) : (
                  <button className="cyber-btn-primary px-5 py-2.5 text-xs rounded-xl font-orbitron tracking-widest">
                    ПОДКЛЮЧИТЬ → 199 ₽/МЕС
                  </button>
                )}
              </div>
            </div>

            {/* VPN Config */}
            <div className="cyber-card rounded-2xl p-6">
              <div className="font-mono-ibm text-xs text-neon-cyan/50 tracking-widest mb-1">// VPN КОНФИГ</div>
              <div className="font-orbitron text-lg font-bold text-white mb-4">Получить конфигурацию</div>

              {hasActiveSub ? (
                <>
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-neon-green/20 bg-neon-green/5 mb-4">
                    <Icon name="CheckCircle" size={16} className="text-neon-green flex-shrink-0" />
                    <span className="font-ibm text-sm text-white/70">
                      Подписка активна — конфиг доступен для скачивания
                    </span>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => copyText("wg-config-mock-key-xxxxx", setConfigCopied)}
                      className="cyber-btn-primary px-5 py-2.5 text-xs rounded-xl font-orbitron tracking-widest flex items-center gap-2"
                    >
                      <Icon name={configCopied ? "Check" : "Copy"} size={13} />
                      {configCopied ? "СКОПИРОВАНО!" : "СКОПИРОВАТЬ КЛЮЧ"}
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 text-xs font-orbitron tracking-widest text-white/40 border border-dark-border rounded-xl hover:border-neon-cyan/40 hover:text-white/70 transition-all">
                      <Icon name="Download" size={13} />
                      СКАЧАТЬ .CONF
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4 p-4 rounded-xl border border-yellow-400/20 bg-yellow-400/5">
                  <Icon name="AlertTriangle" size={18} className="text-yellow-400 flex-shrink-0" />
                  <div>
                    <div className="font-orbitron text-xs text-yellow-400 mb-1">ПОДПИСКА НЕАКТИВНА</div>
                    <div className="font-ibm text-sm text-white/50">Оформи подписку чтобы получить VPN-конфиг</div>
                  </div>
                  <button className="ml-auto flex-shrink-0 cyber-btn-primary px-4 py-2 text-xs rounded-lg font-orbitron tracking-widest">
                    199 ₽/МЕС
                  </button>
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: "Send", label: "Открыть бот", sub: "@sbsmanager_bot", active: true },
                { icon: "RefreshCw", label: "Продлить", sub: "199 ₽/мес", active: true },
                { icon: "Users", label: "Рефералы", sub: `${user.referrals.count} чел.`, active: true },
                { icon: "Star", label: "Яндекс Семья", sub: hasActiveSub ? "Активна" : "Недоступно", active: hasActiveSub },
              ].map((item) => (
                <button
                  key={item.label}
                  disabled={!item.active}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                    item.active ? "cyber-card hover:-translate-y-0.5" : "border-dark-border bg-dark-card/50 opacity-40 cursor-not-allowed"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg border border-neon-cyan/25 bg-neon-cyan/8 flex items-center justify-center mb-3">
                    <Icon name={item.icon} size={14} className="text-neon-cyan" />
                  </div>
                  <div className="font-orbitron text-xs text-white mb-0.5">{item.label}</div>
                  <div className="font-mono-ibm text-xs text-white/30">{item.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══ TAB: PAYMENTS ══════════════════════════════════ */}
        {activeTab === "payments" && (
          <div className="animate-fade-in-up">
            <div className="cyber-card rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-dark-border">
                <div className="font-mono-ibm text-xs text-neon-cyan/50 tracking-widest mb-0.5">// ИСТОРИЯ</div>
                <div className="font-orbitron text-base font-bold text-white">Платежи</div>
              </div>
              {user.payments.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <Icon name="CreditCard" size={32} className="text-white/10 mx-auto mb-3" />
                  <div className="font-ibm text-sm text-white/30">Платежей пока нет</div>
                </div>
              ) : (
                <div className="divide-y divide-dark-border">
                  {user.payments.map((p) => (
                    <div key={p.id} className="px-6 py-4 flex items-center gap-4 hover:bg-neon-cyan/2 transition-colors">
                      <div className="w-8 h-8 rounded-lg border border-neon-green/20 bg-neon-green/5 flex items-center justify-center flex-shrink-0">
                        <Icon name="CheckCircle" size={14} className="text-neon-green" />
                      </div>
                      <div className="flex-1">
                        <div className="font-ibm text-sm text-white">{p.date}</div>
                        <div className="font-mono-ibm text-xs text-white/30">{p.id}</div>
                      </div>
                      <div className="font-orbitron text-sm font-bold neon-text-cyan">{p.amount}</div>
                      <span className="px-2 py-0.5 rounded border border-neon-green/25 bg-neon-green/8 font-mono-ibm text-xs text-neon-green">
                        ОПЛАЧЕНО
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ TAB: REFERRALS ═════════════════════════════════ */}
        {activeTab === "referrals" && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "ПРИГЛАШЕНО", value: user.referrals.count, unit: "чел.", color: "cyan" },
                { label: "ЗАРАБОТАНО", value: user.referrals.bonus, unit: "", color: "green" },
                { label: "СКИДКА", value: "10%", unit: "за реф.", color: "purple" },
              ].map((s) => (
                <div key={s.label} className="cyber-card rounded-xl p-5 text-center">
                  <div className="font-mono-ibm text-xs text-white/30 tracking-widest mb-2">{s.label}</div>
                  <div className={`font-orbitron text-2xl font-black ${
                    s.color === "cyan" ? "neon-text-cyan" : s.color === "green" ? "text-neon-green" : "text-neon-purple"
                  }`}>
                    {s.value}
                  </div>
                  {s.unit && <div className="font-mono-ibm text-xs text-white/30 mt-0.5">{s.unit}</div>}
                </div>
              ))}
            </div>

            <div className="cyber-card rounded-2xl p-6">
              <div className="font-mono-ibm text-xs text-neon-cyan/50 tracking-widest mb-1">// РЕФЕРАЛЬНАЯ ССЫЛКА</div>
              <div className="font-orbitron text-base font-bold text-white mb-4">Пригласи друга</div>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-dark-border bg-dark-bg/60 mb-4">
                <span className="flex-1 font-mono-ibm text-xs text-white/50 truncate">{user.referrals.link}</span>
                <button
                  onClick={() => copyText(user.referrals.link, setRefCopied)}
                  className="flex-shrink-0 cyber-btn-primary px-3 py-1.5 text-xs rounded-lg font-orbitron tracking-widest flex items-center gap-1.5"
                >
                  <Icon name={refCopied ? "Check" : "Copy"} size={12} />
                  {refCopied ? "СКОПИРОВАНО" : "КОПИРОВАТЬ"}
                </button>
              </div>
              <p className="font-ibm text-xs text-white/30">
                За каждого приглашённого друга ты получаешь скидку 10% на следующий месяц. Друг получает 10% скидку на первую оплату.
              </p>
            </div>
          </div>
        )}

        {/* ══ TAB: FAMILY ════════════════════════════════════ */}
        {activeTab === "family" && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="cyber-card rounded-2xl p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="font-mono-ibm text-xs text-neon-cyan/50 tracking-widest mb-1">// ЯНДЕКС ПЛЮС</div>
                  <div className="font-orbitron text-lg font-bold text-white">Семейная группа</div>
                </div>
                {user.yandexFamily.status === "active" ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-neon-green/30 bg-neon-green/8 font-mono-ibm text-xs text-neon-green">
                    <span className="w-1.5 h-1.5 rounded-full status-dot-online" />
                    АКТИВНА
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 bg-white/5 font-mono-ibm text-xs text-white/30">
                    НЕАКТИВНА
                  </span>
                )}
              </div>

              {/* Slots */}
              <div className="mb-5">
                <div className="flex justify-between font-mono-ibm text-xs text-white/30 mb-2">
                  <span>МЕСТА В ГРУППЕ</span>
                  <span>{user.yandexFamily.used} / {user.yandexFamily.slots} занято</span>
                </div>
                <div className="flex gap-1.5">
                  {Array.from({ length: user.yandexFamily.slots }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 h-2 rounded-full"
                      style={
                        i < user.yandexFamily.used
                          ? { background: "#00ffff", boxShadow: "0 0 6px rgba(0,255,255,0.5)" }
                          : { background: "#1a2540" }
                      }
                    />
                  ))}
                </div>
              </div>

              {hasActiveSub ? (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-dark-border bg-dark-bg/60 mb-4">
                    <span className="flex-1 font-mono-ibm text-xs text-white/50 truncate">
                      {user.yandexFamily.inviteLink}
                    </span>
                    <button
                      onClick={() => copyText(user.yandexFamily.inviteLink, setInviteCopied)}
                      className="flex-shrink-0 cyber-btn-primary px-3 py-1.5 text-xs rounded-lg font-orbitron tracking-widest flex items-center gap-1.5"
                    >
                      <Icon name={inviteCopied ? "Check" : "Copy"} size={12} />
                      {inviteCopied ? "СКОПИРОВАНО" : "КОПИРОВАТЬ"}
                    </button>
                  </div>
                  <p className="font-ibm text-xs text-white/30">
                    Ссылка действует ограниченное время. Если истекла — обратись в поддержку @sbsmanager_bot за новой.
                  </p>
                </>
              ) : (
                <div className="flex items-center gap-4 p-4 rounded-xl border border-yellow-400/20 bg-yellow-400/5">
                  <Icon name="AlertTriangle" size={16} className="text-yellow-400 flex-shrink-0" />
                  <div className="font-ibm text-sm text-white/50">
                    Ссылка-приглашение доступна при активной подписке
                  </div>
                  <button className="ml-auto flex-shrink-0 cyber-btn-primary px-4 py-2 text-xs rounded-lg font-orbitron tracking-widest">
                    ПОДКЛЮЧИТЬ
                  </button>
                </div>
              )}
            </div>

            <div className="cyber-card rounded-xl p-5">
              <div className="font-mono-ibm text-xs text-white/30 mb-3">ЧТО ДАЁТ ЯНДЕКС ПЛЮС СЕМЬЯ</div>
              <ul className="space-y-2">
                {[
                  "Яндекс Музыка без рекламы",
                  "Кинопоиск — фильмы и сериалы",
                  "Яндекс Такси — кешбэк баллами",
                  "Яндекс Маркет — бонусы",
                  "До 6 аккаунтов в одной группе",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 font-ibm text-sm text-white/60">
                    <div className="w-1 h-1 rounded-full bg-neon-cyan flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
