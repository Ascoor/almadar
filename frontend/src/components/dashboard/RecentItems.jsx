import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RecentItems = () => {
  const recentItems = [
    {
      id: 1,
      title: 'عقد توريد معدات صناعية',
      type: 'العقود الدولية',
      status: 'نشط',
      date: '٢٠٢٣/٠٥/١٥',
      statusColor: 'bg-green-100 text-green-800',
    },
    {
      id: 2,
      title: 'قضية تعويض ضد شركة النهضة',
      type: 'القضايا المرفوعة من الشركة',
      status: 'قيد النظر',
      date: '٢٠٢٣/٠٦/٢٢',
      statusColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 3,
      title: 'استشارة قانونية حول حقوق الملكية الفكرية',
      type: 'الاستشارات القانونية',
      status: 'مكتمل',
      date: '٢٠٢٣/٠٧/٠٣',
      statusColor: 'bg-blue-100 text-blue-800',
    },
    {
      id: 4,
      title: 'عقد إيجار مكاتب الشركة',
      type: 'العقود المحلية',
      status: 'نشط',
      date: '٢٠٢٣/٠٤/١٠',
      statusColor: 'bg-green-100 text-green-800',
    },
    {
      id: 5,
      title: 'دعوى عمالية ضد الشركة',
      type: 'القضايا المرفوعة على الشركة',
      status: 'قيد النظر',
      date: '٢٠٢٣/٠٧/١٨',
      statusColor: 'bg-amber-100 text-amber-800',
    },
  ];

  return (
    <Card className="border shadow-lg shadow-navy dark:shadow-reded-dark/50">
      <CardHeader>
        <CardTitle className="text-xl">آخر الملفات</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-muted text-muted-foreground text-sm">
              <tr>
                <th className="p-3 rounded-tr-lg">الموضوع</th>
                <th className="p-3">النوع</th>
                <th className="p-3">الحالة</th>
                <th className="p-3 rounded-tl-lg">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentItems.map((item) => (
                <tr key={item.id} className="hover:bg-muted/50">
                  <td className="p-3">{item.title}</td>
                  <td className="p-3 text-sm text-gray-600">{item.type}</td>
                  <td className="p-3">
                    <Badge variant="outline" className={item.statusColor}>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-sm text-gray-600">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentItems;
