import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, WalletCards, MapPinned, Globe, Users } from "lucide-react";

// دالة لتحويل النطاق (scope) إلى اللغة العربية
const translateScope = (scope) => {
  switch (scope) {
    case "local":
      return "محلي";
    case "international":
      return "دولي";
    case "from":
      return "من الشركة";
    case "against":
      return "ضد الشركة";
    default:
      return scope;
  }
};

// دالة لترجمة الحالة
const translateStatus = (status, type) => {
  switch (type) {
    case "contracts":
      switch (status) {
        case "active":
          return "نشط";
        case "expired":
          return "منتهٍ";
        case "terminated":
          return "ملغي";
        case "pending":
          return "معلق";
        case "cancelled":
          return "ملغى";
        default:
          return status;
      }
    case "investigation_actions":
      switch (status) {
        case "pending":
          return "معلق";
        case "done":
          return "مكتمل";
        case "cancelled":
          return "ملغى";
        case "in_review":
          return "قيد المراجعة";
        default:
          return status;
      }
    case "litigation_actions":
      switch (status) {
        case "pending":
          return "معلق";
        case "done":
          return "مكتمل";
        case "cancelled":
          return "ملغى";
        case "in_review":
          return "قيد المراجعة";
        default:
          return status;
      }
    default:
      return status;
  }
};

// دالة لاختيار الأيقونة بناءً على العنوان
const getIconForTitle = (title) => {
  switch (title) {
    case "أحدث العقود المضافة":
      return <FileText className="text-3xl text-royal" />;
    case "أحدث العقود المحدثة":
      return <WalletCards className="text-3xl text-royal" />;
    case "أحدث إجراءات التحقيقات":
      return <MapPinned className="text-3xl text-royal" />;
    case "أحدث إجراءات القضايا":
      return <Globe className="text-3xl text-royal" />;
    default:
      return <Users className="text-3xl text-royal" />;
  }
};

const DataCard = ({ title, items, type }) => {
  const icon = getIconForTitle(title);

  return (
    <Card className="border shadow-xl bg-white/50 dark:bg-royal-darker dark:shadow-greenic-light/30 transition-all duration-200">
      <CardHeader className="bg-royal-light/20 dark:bg-royal-ultraDark">
        <CardTitle className="flex items-center text-xl text-center text-navy dark:text-white">
          <span className="ml-2">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="dark:text-greenic-light text-sm dark:bg-greenic-light/10 text-greenic-dark bg-royal-light/20">
              <tr className="text-navy-darker">
                {type === "contracts" && (
                  <>
                    <th className="p-2">رقم العقد</th>
                    <th className="p-2 rounded-tr-lg">اسم الشركة</th>
                    <th className="p-2">نوع العقد</th>
                    <th className="p-2">تاريخ البدء</th>
                    <th className="p-2 rounded-tl-lg">الحالة</th>
                  </>
                )}
                {type === "investigation_actions" && (
                  <>
                    <th className="p-2 rounded-tr-lg">نوع الإجراء</th>
                    <th className="p-2">الطلبات</th>
                    <th className="p-2">النتيجة</th>
                    <th className="p-2">تاريخ الإجراء</th>
                    <th className="p-2 rounded-tl-lg">الحالة</th>
                  </>
                )}
                {type === "litigation_actions" && (
                  <>
                    <th className="p-2 rounded-tr-lg">نوع الإجراء</th>
                    <th className="p-2">الطلبات</th>
                    <th className="p-2">النتيجة</th>
                    <th className="p-2">تاريخ الإجراء</th>
                    <th className="p-2 rounded-tl-lg">الحالة</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody className="divide-y dark:divide-gray-600">
              {items.map((item) => {
                if (type === "contracts") {
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-muted/50 dark:hover:bg-gray-600"
                    >
                      <td className="p-2">{item.number}</td>
                      <td className="p-2">{item.contract_parties}</td>
                      <td className="p-2">{translateScope(item.scope)}</td>
                      <td className="p-2">{item.start_date}</td>
                      <td className="p-2">
                        <Badge
                          variant="outline"
                          className={
                            item.status === "active"
                              ? "bg-green-200 rounded-tr-md text-center font-bold"
                              : "bg-red-200 rounded-tr-md text-center"
                          }
                        >
                          {translateStatus(item.status, "contracts")}
                        </Badge>
                      </td>
                    </tr>
                  );
                }

                if (type === "investigation_actions") {
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-muted/50 dark:hover:bg-gray-600"
                    >
                      <td className="p-2">
                        {item.action_type?.action_name}
                      </td>
                      <td className="p-2">{item.requirements}</td>
                      <td className="p-2">{item.results}</td>
                      <td className="p-2">{item.action_date}</td>
                      <td className="p-2">
                        <Badge
                          variant="outline"
                          className={
                            item.status === "done"
                              ? "bg-green-200 rounded-tr-md text-center font-bold"
                              : "bg-red-200 rounded-tr-md text-center"
                          }
                        >
                          {translateStatus(
                            item.status,
                            "investigation_actions"
                          )}
                        </Badge>
                      </td>
                    </tr>
                  );
                }

                if (type === "litigation_actions") {
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-muted/50 dark:hover:bg-gray-600"
                    >
                      <td className="p-2">
                        {item.action_type?.action_name}
                      </td>
                      <td className="p-2">{item.requirements}</td>
                      <td className="p-2">{item.results}</td>
                      <td className="p-2">{item.action_date}</td>
                      <td className="p-2">
                        <Badge
                          variant="outline"
                          className={
                            item.status === "done"
                              ? "bg-green-200 rounded-tr-md text-center"
                              : "bg-red-200 rounded-tr-md text-center"
                          }
                        >
                          {translateStatus(
                            item.status,
                            "litigation_actions"
                          )}
                        </Badge>
                      </td>
                    </tr>
                  );
                }

                // إذا كان النوع غير معروف أو لا نريد عرض صف:
                return null;
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataCard;
