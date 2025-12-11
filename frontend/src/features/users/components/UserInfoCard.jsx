import { Mail, Phone } from "lucide-react";
import API_CONFIG from "@/config/config";

const roleLabels = {
  admin: "أدمن",
  staff: "موظف",
  user: "مستخدم",
};

const getDisplayRoles = (user) => {
  // 1) لو عندك مصفوفة أدوار
  if (Array.isArray(user?.roles) && user.roles.length > 0) {
    return user.roles.map((r) => roleLabels[r.name] || r.name);
  }
  // 2) لو عندك role واحد
  if (user?.role?.name) {
    return [roleLabels[user.role.name] || user.role.name];
  }
  return [];
};

const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (!parts.length) return "؟";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const UserInfoCard = ({ user }) => {
  if (!user) return null;

  const roles = getDisplayRoles(user);

  return (
    <div
      dir="rtl"
      className="
        relative overflow-hidden rounded-3xl border border-border
        bg-card/95 shadow-lg shadow-[var(--shadow-md)] backdrop-blur-md
        px-6 py-5 sm:px-7 sm:py-6 md:px-8 md:py-7
      "
    >
      {/* لمسة خلفية لطيفة */}
      <div
        className="
          pointer-events-none absolute inset-0 opacity-[0.06]
          bg-gradient-to-l from-primary via-secondary to-accent
        "
      />
      {/* محتوى الكرت */}
      <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-stretch">
        {/* الصورة / الأفاتار */}
        <div className="flex shrink-0 items-center justify-center">
          <div
            className="
              relative h-28 w-28 rounded-full border border-border/60
              bg-background/70 shadow-md shadow-[var(--shadow-md)]
              sm:h-32 sm:w-32
            "
          >
            <div
              className="
                absolute -inset-[2px] rounded-full
                bg-gradient-to-tr from-primary/70 via-secondary/70 to-accent/70
                opacity-70 blur-[10px]
              "
            />
            <div className="relative h-full w-full overflow-hidden rounded-full border border-background/80">
              {user.image ? (
                <img
                  src={`${API_CONFIG.baseURL}/${user.image}`}
                  className="h-full w-full object-cover"
                  alt={`صورة ${user.name || "المستخدم"}`}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <span className="font-semibold text-primary">
                    {getInitials(user.name)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* معلومات المستخدم */}
        <div className="flex-1 space-y-4 text-right">
          {/* الاسم + الأدوار */}
          <div className="space-y-2">
            <h3
              className="
                text-xl font-bold tracking-tight text-foreground
                sm:text-2xl
              "
            >
              <span className="bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent">
                {user.name || "مستخدم بدون اسم"}
              </span>
            </h3>

            {roles.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5 sm:justify-end">
                {roles.map((role, idx) => (
                  <span
                    key={`${role}-${idx}`}
                    className="
                      inline-flex items-center rounded-full border border-primary/30
                      bg-primary/5 px-3 py-1 text-xs font-semibold text-primary
                      shadow-sm
                    "
                  >
                    {role}
                  </span>
                ))}
              </div>
            )}

            {user.created_at && (
              <p className="text-xs text-muted-foreground">
                تم الإنشاء في{" "}
                {new Date(user.created_at).toLocaleDateString("ar-EG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>

          {/* بيانات التواصل */}
          <div
            className="
              mt-1 grid grid-cols-1 gap-2 text-sm text-foreground
              sm:grid-cols-2
            "
          >
            {user.phone && (
              <InfoRow icon={<Phone size={16} />} label={user.phone} />
            )}
            {user.email && (
              <InfoRow icon={<Mail size={16} />} label={user.email} />
            )}
          </div>

          {/* أي بيانات إضافية ممكن تضيفها هنا مستقبلاً (فرع، إدارة، حالة الحساب...) */}
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label }) => (
  <div className="flex items-center justify-start gap-2 sm:justify-end">
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
      {icon}
    </span>
    <span className="truncate text-sm text-foreground">{label}</span>
  </div>
);

export default UserInfoCard;
