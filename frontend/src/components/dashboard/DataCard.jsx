import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, WalletCards, MapPinned, Globe, Users } from "lucide-react";

const translateScope = (scope) => {
  const map = {
    local: "محلي",
    international: "دولي",
    from: "من الشركة",
    against: "ضد الشركة"
  };
  return map[scope] || scope;
};

const translateStatus = (status, type) => {
  const dict = {
    contracts: {
      active: "نشط", expired: "منتهٍ", terminated: "ملغي", pending: "معلق", cancelled: "ملغى"
    },
    investigation_actions: {
      pending: "معلق", done: "مكتمل", cancelled: "ملغى", in_review: "قيد المراجعة"
    },
    litigation_actions: {
      pending: "معلق", done: "مكتمل", cancelled: "ملغى", in_review: "قيد المراجعة"
    }
  };
  return dict[type]?.[status] || status;
};

const getIconForTitle = (title) => {
  const icons = {
    "أحدث العقود المضافة": FileText,
    "أحدث العقود المحدثة": WalletCards,
    "أحدث إجراءات التحقيقات": MapPinned,
    "أحدث إجراءات القضايا": Globe,
  };
  const Icon = icons[title] || Users;
  return <Icon className="text-3xl text-green-600 dark:text-green-300" />;
};

const DataCard = ({ title, items, type }) => {
  const icon = getIconForTitle(title);

  return (
    <Card className="bg-white/70 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-all">
      <CardHeader className="bg-gold-light/30 dark:bg-greenic/20 border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-white">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-gold-light/50 dark:bg-greenic/40 text-gray-700 dark:text-green-100">
              <tr>
                {type === "contracts" && (
                  <>
                    <th className="p-2">رقم العقد</th>
                    <th className="p-2">اسم الشركة</th>
                    <th className="p-2">نوع العقد</th>
                    <th className="p-2">تاريخ البدء</th>
                    <th className="p-2">الحالة</th>
                  </>
                )}
                {["investigation_actions", "litigation_actions"].includes(type) && (
                  <>
                    <th className="p-2">نوع الإجراء</th>
                    <th className="p-2">الطلبات</th>
                    <th className="p-2">النتيجة</th>
                    <th className="p-2">تاريخ الإجراء</th>
                    <th className="p-2">الحالة</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  {type === "contracts" && (
                    <>
                      <td className="p-2">{item.number}</td>
                      <td className="p-2">{item.contract_parties}</td>
                      <td className="p-2">{translateScope(item.scope)}</td>
                      <td className="p-2">{item.start_date}</td>
                      <td className="p-2">
                        <Badge className={`px-2 py-1 text-xs rounded-full ${
                          item.status === "active"
                            ? "bg-green-200 text-greenic dark:bg-limuni-900 dark:text-white"
                            : "bg-red-200 text-red-800 dark:bg-red-700 dark:text-white"
                        }`}>
                          {translateStatus(item.status, type)}
                        </Badge>
                      </td>
                    </>
                  )}
                  {["investigation_actions", "litigation_actions"].includes(type) && (
                    <>
                      <td className="p-2">{item.action_type?.action_name}</td>
                      <td className="p-2">{item.requirements}</td>
                      <td className="p-2">{item.results}</td>
                      <td className="p-2">{item.action_date}</td>
                      <td className="p-2">
                        <Badge className={`px-2 py-1 text-xs rounded-full ${
                          item.status === "done"
                            ? "bg-green-200 text-green-800 dark:bg-green-700 dark:text-white"
                            : "bg-red-200 text-red-800 dark:bg-red-700 dark:text-white"
                        }`}>
                          {translateStatus(item.status, type)}
                        </Badge>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataCard;
