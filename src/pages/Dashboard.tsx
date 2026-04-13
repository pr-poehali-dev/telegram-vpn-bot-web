import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const LEADER_IMG =
  "https://cdn.poehali.dev/projects/c5530eba-c9a4-45d0-b3b8-b97285df77dc/bucket/772efb66-806a-4ffb-ad15-f2b69a0b5a91.jpg";

// ─── MOCK DATA ────────────────────────────────────────────────
type AccountType = "telegram" | "email";

const MOCK_TG_USER = {
  accountType: "telegram" as AccountType,
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
  vpnConfig: "active",
};

const MOCK_EMAIL_USER = {
  accountType: "email" as AccountType,
  name: "Пользователь",
  email: "user@example.com",
  avatar: null,
  subscription: { status: "none" as "active" | "expired" | "none" },
  payments: [],
};

// ─── TYPES ────────────────────────────────────────────────────
type MockUser = typeof MOCK_TG_USER | typeof MOCK_EMAIL_USER;

// ─── HELPERS ─────────────────────────────────────────────────
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

// ─── MAIN ─────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [demoMode, setDemoMode] = useState<"telegram" | "email">("telegram");
  const [configCopied, setConfigCopied] = useState(false);
  const [refCopied, setRefCopied] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "payments" | "referrals" | "family">("overview");

  const user: MockUser = demoMode === "telegram" ? MOCK_TG_USER : MOCK_EMAIL_USER;
  const isTg = user.accountType === "telegram";
  const tgUser = isTg ? (user as typeof MOCK_TG_USER) : null;
  const subStatus = user.subscription.status;
  const hasActiveSub = subStatus === "active";
  const canGetConfig = isTg && hasActiveSub;

  const copyText = (text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white font-ibm relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 grid-bg opacity-20" />

      {/* ── NAV ──────────────────────────────────────────────── */}
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
            <button
              onClick={() => setDemoMode("telegram")}
              className={`font-mono-ibm text-xs px-2 py-0.5 rounded transition-all ${demoMode === "telegram" ? "text-neon-cyan bg-neon-cyan/10" : "text-white/30 hover:text-white/60"}`}
            >
              TG
            </button>
            <span className="text-white/20">|</span>
            <button
              onClick={() => setDemoMode("email")}
              className={`font-mono-ibm text-xs px-2 py-0.5 rounded transition-all ${demoMode === "email" ? "text-neon-cyan bg-neon-cyan/10" : "text-white/30 hover:text-white/60"}`}
            >
              EMAIL
            </button>
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

        {/* ── TG BANNER (email only) ────────────────────────── */}
        {!isTg && (
          <div className="mb-6 flex items-center gap-4 px-5 py-4 rounded-xl border border-neon-purple/30 bg-neon-purple/5 animate-fade-in-up">
            <div className="w-9 h-9 rounded-lg border border-neon-purple/30 bg-neon-purple/10 flex items-center justify-center flex-shrink-0">
              <Icon name="AlertCircle" size={16} className="text-neon-purple" />
            </div>
            <div className="flex-1">
              <div className="font-orbitron text-xs text-neon-purple tracking-widest mb-0.5">ОГРАНИЧЕННЫЙ ДОСТУП</div>
              <div className="font-ibm text-xs text-white/50">
                Привяжи Telegram для получения VPN-конфига, Яндекс Семьи и реферальной программы
              </div>
            </div>
            <button className="flex-shrink-0 px-4 py-2 cyber-btn-secondary text-xs rounded-lg font-orbitron tracking-widest">
              ПРИВЯЗАТЬ TG
            </button>
          </div>
        )}

        {/* ── PROFILE CARD ─────────────────────────────────── */}
        <div className="cyber-card rounded-2xl p-6 mb-6 animate-fade-in-up">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {isTg && tgUser?.avatar ? (
                <img
                  src={tgUser.avatar}
                  alt="avatar"
                  className="w-16 h-16 rounded-full object-cover border-2 border-neon-cyan/50"
                  style={{ boxShadow: "0 0 20px rgba(0,255,255,0.2)" }}
                />
              ) : (
                <div className="w-16 h-16 rounded-full border-2 border-dark-border bg-dark-card flex items-center justify-center">
                  <Icon name="User" size={24} className="text-white/30" />
                </div>
              )}
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-dark-bg ${isTg ? "bg-neon-green" : "bg-white/20"}`}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <span className="font-orbitron text-base font-bold text-white">
                  {isTg ? tgUser!.name : (user as typeof MOCK_EMAIL_USER).name}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border font-mono-ibm text-xs ${
                    isTg
                      ? "border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan/70"
                      : "border-white/10 bg-white/5 text-white/30"
                  }`}
                >
                  <Icon name={isTg ? "Send" : "Mail"} size={10} />
                  {isTg ? "Telegram" : "Email"}
                </span>
              </div>
              {isTg ? (
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="font-mono-ibm text-xs text-white/40">{tgUser!.username}</span>
                  <span className="font-mono-ibm text-xs text-white/20">ID: {tgUser!.tgId}</span>
                </div>
              ) : (
                <span className="font-mono-ibm text-xs text-white/40">
                  {(user as typeof MOCK_EMAIL_USER).email}
                </span>
              )}
            </div>

            <StatusBadge status={subStatus} />
          </div>
        </div>

        {/* ── TABS ─────────────────────────────────────────── */}
        <div className="flex gap-1 mb-6 border-b border-dark-border">
          {(
            [
              { id: "overview", label: "ОБЗОР", icon: "LayoutDashboard" },
              { id: "payments", label: "ПЛАТЕЖИ", icon: "CreditCard" },
              ...(isTg ? [{ id: "referrals", label: "РЕФЕРАЛЫ", icon: "Users" }] : []),
              ...(isTg ? [{ id: "family", label: "ЯНД. СЕМЬЯ", icon: "Star" }] : []),
            ] as { id: typeof activeTab; label: string; icon: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 font-orbitron text-xs tracking-widest transition-all duration-200 border-b-2 -mb-px ${
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

        {/* ══ TAB: OVERVIEW ════════════════════════════════ */}
        {activeTab === "overview" && (
          <div className="space-y-4 animate-fade-in-up">

            {/* Subscription card */}
            <div className="cyber-card rounded-2xl p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="font-mono-ibm text-xs text-neon-cyan/50 tracking-widest mb-1">// ПОДПИСКА</div>
                  <div className="font-orbitron text-lg font-bold text-white">
                    {hasActiveSub ? "SBS CONNECT" : subStatus === "expired" ? "Подписка истекла" : "Нет подписки"}
                  </div>
                </div>
                <StatusBadge status={subStatus} />
              </div>

              {hasActiveSub && tgUser && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
                    <div className="p-3 rounded-xl border border-dark-border bg-dark-bg/50">
                      <div className="font-mono-ibm text-xs text-white/30 mb-1">НАЧАЛО</div>
                      <div className="font-orbitron text-sm text-white">{tgUser.subscription.startedAt}</div>
                    </div>
                    <div className="p-3 rounded-xl border border-dark-border bg-dark-bg/50">
                      <div className="font-mono-ibm text-xs text-white/30 mb-1">ИСТЕКАЕТ</div>
                      <div className="font-orbitron text-sm text-neon-cyan">{tgUser.subscription.expiresAt}</div>
                    </div>
                    <div className="p-3 rounded-xl border border-dark-border bg-dark-bg/50">
                      <div className="font-mono-ibm text-xs text-white/30 mb-1">ОСТАЛОСЬ</div>
                      <div className="font-orbitron text-sm text-white">
                        {tgUser.subscription.daysLeft}{" "}
                        <span className="text-white/30 text-xs">дней</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-5">
                    <div className="flex justify-between font-mono-ibm text-xs text-white/30 mb-2">
                      <span>Прогресс периода</span>
                      <span>
                        {tgUser.subscription.daysLeft} / {tgUser.subscription.daysTotal} дней
                      </span>
                    </div>
                    <div className="h-1.5 bg-dark-border rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full animate-neon-pulse"
                        style={{
                          width: `${(tgUser.subscription.daysLeft / tgUser.subscription.daysTotal) * 100}%`,
                          background: "linear-gradient(90deg, rgba(0,255,255,0.6), rgba(0,255,255,1))",
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

            {/* VPN Config card */}
            <div className="cyber-card rounded-2xl p-6">
              <div className="font-mono-ibm text-xs text-neon-cyan/50 tracking-widest mb-1">// VPN КОНФИГ</div>
              <div className="font-orbitron text-lg font-bold text-white mb-4">Получить конфигурацию</div>

              {canGetConfig ? (
                <>
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-neon-green/20 bg-neon-green/5 mb-4">
                    <Icon name="CheckCircle" size={16} className="text-neon-green flex-shrink-0" />
                    <span className="font-ibm text-sm text-white/70">
                      Конфиг доступен — подписка активна и аккаунт привязан к Telegram
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
              ) : !isTg ? (
                <div className="flex items-center gap-4 p-4 rounded-xl border border-neon-purple/20 bg-neon-purple/5">
                  <Icon name="Lock" size={18} className="text-neon-purple flex-shrink-0" />
                  <div>
                    <div className="font-orbitron text-xs text-neon-purple mb-1">ТОЛЬКО ДЛЯ TELEGRAM</div>
                    <div className="font-ibm text-sm text-white/50">
                      Привяжи Telegram-аккаунт, чтобы получить VPN-конфиг
                    </div>
                  </div>
                  <button className="ml-auto flex-shrink-0 cyber-btn-secondary px-4 py-2 text-xs rounded-lg font-orbitron tracking-widest">
                    ПРИВЯЗАТЬ
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4 rounded-xl border border-yellow-400/20 bg-yellow-400/5">
                  <Icon name="AlertTriangle" size={18} className="text-yellow-400 flex-shrink-0" />
                  <div>
                    <div className="font-orbitron text-xs text-yellow-400 mb-1">ПОДПИСКА НЕАКТИВНА</div>
                    <div className="font-ibm text-sm text-white/50">
                      Оформи подписку чтобы получить VPN-конфиг
                    </div>
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
                { icon: "Send", label: "Открыть бот", sub: "@sbsmanager_bot", color: "cyan", action: true },
                { icon: "RefreshCw", label: "Продлить", sub: "199 ₽/мес", color: "cyan", action: hasActiveSub },
                { icon: "Users", label: "Рефералы", sub: isTg ? `${tgUser?.referrals.count} чел.` : "Недоступно", color: isTg ? "cyan" : "none", action: isTg },
                { icon: "Star", label: "Яндекс Семья", sub: isTg && hasActiveSub ? "Активна" : "Недоступно", color: isTg && hasActiveSub ? "green" : "none", action: isTg && hasActiveSub },
              ].map((item) => (
                <button
                  key={item.label}
                  disabled={!item.action}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                    item.action
                      ? "cyber-card hover:-translate-y-0.5"
                      : "border-dark-border bg-dark-card/50 opacity-40 cursor-not-allowed"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${
                      item.color === "cyan"
                        ? "border border-neon-cyan/25 bg-neon-cyan/8"
                        : item.color === "green"
                        ? "border border-neon-green/25 bg-neon-green/8"
                        : "border border-dark-border bg-dark-bg"
                    }`}
                  >
                    <Icon
                      name={item.icon}
                      size={14}
                      className={
                        item.color === "cyan"
                          ? "text-neon-cyan"
                          : item.color === "green"
                          ? "text-neon-green"
                          : "text-white/20"
                      }
                    />
                  </div>
                  <div className="font-orbitron text-xs text-white mb-0.5">{item.label}</div>
                  <div className="font-mono-ibm text-xs text-white/30">{item.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══ TAB: PAYMENTS ════════════════════════════════ */}
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
                  {(user.payments as typeof MOCK_TG_USER.payments).map((p) => (
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

        {/* ══ TAB: REFERRALS ═══════════════════════════════ */}
        {activeTab === "referrals" && isTg && tgUser && (
          <div className="space-y-4 animate-fade-in-up">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "ПРИГЛАШЕНО", value: tgUser.referrals.count, unit: "чел.", color: "cyan" },
                { label: "ЗАРАБОТАНО", value: tgUser.referrals.bonus, unit: "", color: "green" },
                { label: "СКИДКА", value: "10%", unit: "за реф.", color: "purple" },
              ].map((s) => (
                <div key={s.label} className="cyber-card rounded-xl p-5 text-center">
                  <div className="font-mono-ibm text-xs text-white/30 tracking-widest mb-2">{s.label}</div>
                  <div
                    className={`font-orbitron text-2xl font-black ${
                      s.color === "cyan"
                        ? "neon-text-cyan"
                        : s.color === "green"
                        ? "text-neon-green"
                        : "text-neon-purple"
                    }`}
                  >
                    {s.value}
                  </div>
                  {s.unit && <div className="font-mono-ibm text-xs text-white/30 mt-0.5">{s.unit}</div>}
                </div>
              ))}
            </div>

            {/* Ref link */}
            <div className="cyber-card rounded-2xl p-6">
              <div className="font-mono-ibm text-xs text-neon-cyan/50 tracking-widest mb-1">// РЕФЕРАЛЬНАЯ ССЫЛКА</div>
              <div className="font-orbitron text-base font-bold text-white mb-4">Пригласи друга</div>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-dark-border bg-dark-bg/60 mb-4">
                <span className="flex-1 font-mono-ibm text-xs text-white/50 truncate">{tgUser.referrals.link}</span>
                <button
                  onClick={() => copyText(tgUser.referrals.link, setRefCopied)}
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

        {/* ══ TAB: FAMILY ══════════════════════════════════ */}
        {activeTab === "family" && isTg && tgUser && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="cyber-card rounded-2xl p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="font-mono-ibm text-xs text-neon-cyan/50 tracking-widest mb-1">// ЯНДЕКС ПЛЮС</div>
                  <div className="font-orbitron text-lg font-bold text-white">Семейная группа</div>
                </div>
                {tgUser.yandexFamily.status === "active" ? (
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
                  <span>{tgUser.yandexFamily.used} / {tgUser.yandexFamily.slots} занято</span>
                </div>
                <div className="flex gap-1.5">
                  {Array.from({ length: tgUser.yandexFamily.slots }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-2 rounded-full ${
                        i < tgUser.yandexFamily.used
                          ? "bg-neon-cyan"
                          : "bg-dark-border"
                      }`}
                      style={i < tgUser.yandexFamily.used ? { boxShadow: "0 0 6px rgba(0,255,255,0.5)" } : {}}
                    />
                  ))}
                </div>
              </div>

              {/* Invite link */}
              {hasActiveSub ? (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-dark-border bg-dark-bg/60 mb-4">
                    <span className="flex-1 font-mono-ibm text-xs text-white/50 truncate">
                      {tgUser.yandexFamily.inviteLink}
                    </span>
                    <button
                      onClick={() => copyText(tgUser.yandexFamily.inviteLink, setInviteCopied)}
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
                {["Яндекс Музыка без рекламы", "Кинопоиск — фильмы и сериалы", "Яндекс Такси — кешбэк баллами", "Яндекс Маркет — бонусы", "До 6 аккаунтов в одной группе"].map((f) => (
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
