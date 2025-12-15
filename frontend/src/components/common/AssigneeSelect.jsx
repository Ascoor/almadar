import { useEffect, useMemo, useState } from "react";
import { fetchAssignableUsers } from "@/services/api/assignments";
import { useLanguage } from "@/context/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ROLE_LABELS = {
  admin: { ar: "رئيس قسم", en: "Head of Department" },
  manager: { ar: "مدير", en: "Manager" },
  lawyer: { ar: "محام", en: "Lawyer" },
  legal_investigator: { ar: "باحث قانوني", en: "Legal Investigator" },
  user: { ar: "موظف", en: "Employee" },
};

export default function AssigneeSelect({
  context,
  value,
  onChange,
  allowClear = false,
}) {
  const { lang, translations } = useLanguage();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const selectedId = typeof value === "number" ? value : value?.id;

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchAssignableUsers(context, query);
        if (active) {
          setOptions(Array.isArray(res?.data?.data) ? res.data.data : []);
        }
      } catch (error) {
        if (error?.name !== "CanceledError") {
          setOptions([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    const timeout = setTimeout(load, 250);
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [context, query]);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.id === selectedId),
    [options, selectedId],
  );

  const placeholder = translations?.assignee?.placeholder || "اختر المكلف";

  return (
    <div className="space-y-1">
      <Label className="text-sm font-medium">
        {translations?.assignee?.label || "المُسند إليه"}
      </Label>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={translations?.search_placeholder}
        className="mb-2"
      />
      <div className="rounded-lg border border-border bg-card">
        <select
          className="w-full bg-transparent p-2 text-sm focus:outline-none"
          value={selectedId ?? ""}
          onChange={(e) => {
            const id = e.target.value ? Number(e.target.value) : null;
            const found = options.find((opt) => opt.id === id);
            onChange?.(found || null);
          }}
        >
          <option value="">
            {loading
              ? translations?.loading || "..."
              : allowClear
                ? translations?.assignee?.placeholder || placeholder
                : translations?.assignee?.placeholder || placeholder}
          </option>
          {!loading && options.length === 0 && (
            <option value="" disabled>
              {translations?.assignee?.empty || "لا يوجد مستخدمون متاحون"}
            </option>
          )}
          {!loading &&
            options.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} — {ROLE_LABELS[user.roles?.[0]]?.[lang] || user.roles?.[0]}
              </option>
            ))}
        </select>
      </div>
      {selectedOption && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{selectedOption.name}</span>
          <Badge variant="outline">
            {ROLE_LABELS[selectedOption.roles?.[0]]?.[lang] || selectedOption.roles?.[0]}
          </Badge>
        </div>
      )}
    </div>
  );
}

