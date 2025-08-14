import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye,
  Edit,
  Trash2,
  Globe,
  MapPin
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import SectionHeader from '@/components/common/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const ContractsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('local');

  // Mock data for contracts
  const localContracts = [
    {
      id: 1,
      title: 'عقد توريد معدات مكتبية',
      client: 'شركة الأمل للتجارة',
      amount: '150,000 ريال',
      status: 'نشط',
      startDate: '2024-01-15',
      endDate: '2025-01-15',
      category: 'توريد'
    },
    {
      id: 2,
      title: 'عقد خدمات تنظيف',
      client: 'مؤسسة النور',
      amount: '80,000 ريال',
      status: 'منتهي',
      startDate: '2023-06-01',
      endDate: '2024-05-31',
      category: 'خدمات'
    },
    {
      id: 3,
      title: 'عقد استشارات إدارية',
      client: 'شركة المستقبل',
      amount: '200,000 ريال',
      status: 'تحت المراجعة',
      startDate: '2024-03-01',
      endDate: '2025-03-01',
      category: 'استشارات'
    }
  ];

  const internationalContracts = [
    {
      id: 4,
      title: 'International Software License Agreement',
      client: 'TechCorp Solutions',
      amount: '$45,000',
      status: 'نشط',
      startDate: '2024-02-01',
      endDate: '2025-02-01',
      category: 'تقنية'
    },
    {
      id: 5,
      title: 'Cross-Border Trade Agreement',
      client: 'Global Enterprises',
      amount: '€75,000',
      status: 'نشط',
      startDate: '2024-01-10',
      endDate: '2024-12-31',
      category: 'تجارة دولية'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'نشط': return 'default';
      case 'منتهي': return 'secondary';
      case 'تحت المراجعة': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'نشط': return '🟢';
      case 'منتهي': return '🔴';
      case 'تحت المراجعة': return '🟡';
      default: return '⚪';
    }
  };

  const contracts = activeTab === 'local' ? localContracts : internationalContracts;
  const filteredContracts = contracts.filter(contract =>
    contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-8">
        <SectionHeader
          title="إدارة العقود"
          subtitle="إدارة شاملة للعقود المحلية والدولية"
          icon={FileText}
          rightContent={
            <div className="flex items-center space-x-2 space-x-reverse">
              <Button className="btn-hero">
                <Plus className="w-4 h-4 mr-2" />
                عقد جديد
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                تصدير
              </Button>
            </div>
          }
        />

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="professional-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">إجمالي العقود</p>
                  <h3 className="text-2xl font-bold text-card-foreground">248</h3>
                </div>
                <FileText className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="professional-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">عقود نشطة</p>
                  <h3 className="text-2xl font-bold text-card-foreground">156</h3>
                </div>
                <MapPin className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="professional-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">عقود دولية</p>
                  <h3 className="text-2xl font-bold text-card-foreground">34</h3>
                </div>
                <Globe className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="professional-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">القيمة الإجمالية</p>
                  <h3 className="text-2xl font-bold text-card-foreground">15.2M</h3>
                </div>
                <div className="text-2xl">💰</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contracts Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="professional-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>قائمة العقود</CardTitle>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="البحث في العقود..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="local" className="flex items-center space-x-2 space-x-reverse">
                    <MapPin className="w-4 h-4" />
                    <span>العقود المحلية</span>
                  </TabsTrigger>
                  <TabsTrigger value="international" className="flex items-center space-x-2 space-x-reverse">
                    <Globe className="w-4 h-4" />
                    <span>العقود الدولية</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab}>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right">عنوان العقد</TableHead>
                          <TableHead className="text-right">العميل</TableHead>
                          <TableHead className="text-right">القيمة</TableHead>
                          <TableHead className="text-right">الفئة</TableHead>
                          <TableHead className="text-right">الحالة</TableHead>
                          <TableHead className="text-right">تاريخ البداية</TableHead>
                          <TableHead className="text-right">تاريخ الانتهاء</TableHead>
                          <TableHead className="text-right">الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredContracts.map((contract, index) => (
                          <motion.tr
                            key={contract.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="hover:bg-accent/50"
                          >
                            <TableCell className="font-medium">
                              {contract.title}
                            </TableCell>
                            <TableCell>{contract.client}</TableCell>
                            <TableCell className="font-semibold">
                              {contract.amount}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {contract.category}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusColor(contract.status)}>
                                {getStatusIcon(contract.status)} {contract.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{contract.startDate}</TableCell>
                            <TableCell>{contract.endDate}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1 space-x-reverse">
                                <Button variant="ghost" size="icon" className="hover-scale">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="hover-scale">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="hover-scale hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default ContractsPage;