import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Filter, Upload, Download, CreditCard, RefreshCw } from 'lucide-react';

const MyReservations = () => {
  const { language } = useLanguage();
  const [filters, setFilters] = useState({
    project: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  });

  // Mock reservation data
  const reservations = [
    {
      id: '1',
      formNo: 'RES-2024-001',
      project: language === 'ar' ? 'مشروع النخيل الذهبي' : 'Golden Palm Project',
      status: 'New',
      statusText: language === 'ar' ? 'جديد' : 'New',
      modified: '2024-01-15',
      governorate: language === 'ar' ? 'القاهرة' : 'Cairo',
      city: language === 'ar' ? 'القاهرة الجديدة' : 'New Cairo',
      area: language === 'ar' ? 'التجمع الخامس' : 'Fifth Settlement',
      neighborhood: language === 'ar' ? 'الحي الأول' : 'First District',
      mougawra: '12',
      buildingNo: 'A1',
      unitNo: '301',
      floorNo: '3',
      floorType: language === 'ar' ? 'متكرر' : 'Repeated',
      paymentAttachments: null
    },
    {
      id: '2',
      formNo: 'RES-2024-002',
      project: language === 'ar' ? 'كمبوند الواحة' : 'Oasis Compound',
      status: 'Payment data entered',
      statusText: language === 'ar' ? 'تم إدخال بيانات الدفع' : 'Payment data entered',
      modified: '2024-01-10',
      governorate: language === 'ar' ? 'الجيزة' : 'Giza',
      city: language === 'ar' ? '6 أكتوبر' : '6th of October',
      area: language === 'ar' ? 'الشيخ زايد' : 'Sheikh Zayed',
      neighborhood: language === 'ar' ? 'الحي السابع' : 'Seventh District',
      mougawra: '8',
      buildingNo: 'B2',
      unitNo: '205',
      floorNo: '2',
      floorType: language === 'ar' ? 'متكرر' : 'Repeated',
      paymentAttachments: ['payment_receipt.pdf']
    },
    {
      id: '3',
      formNo: 'RES-2024-003',
      project: language === 'ar' ? 'مشروع الكورنيش' : 'Corniche Project',
      status: 'Rejected',
      statusText: language === 'ar' ? 'مرفوض' : 'Rejected',
      modified: '2024-01-05',
      governorate: language === 'ar' ? 'القاهرة' : 'Cairo',
      city: language === 'ar' ? 'مصر الجديدة' : 'Heliopolis',
      area: language === 'ar' ? 'النزهة' : 'El Nozha',
      neighborhood: language === 'ar' ? 'الحي الثالث' : 'Third District',
      mougawra: '15',
      buildingNo: 'C3',
      unitNo: '102',
      floorNo: '1',
      floorType: language === 'ar' ? 'أرضي' : 'Ground',
      paymentAttachments: ['payment_receipt.pdf', 'bank_transfer.jpg']
    }
  ];

  const projects = [
    language === 'ar' ? 'مشروع النخيل الذهبي' : 'Golden Palm Project',
    language === 'ar' ? 'كمبوند الواحة' : 'Oasis Compound',
    language === 'ar' ? 'مشروع الكورنيش' : 'Corniche Project'
  ];

  const statuses = [
    { value: 'New', label: language === 'ar' ? 'جديد' : 'New' },
    { value: 'Payment data entered', label: language === 'ar' ? 'تم إدخال بيانات الدفع' : 'Payment data entered' },
    { value: 'Approved', label: language === 'ar' ? 'مقبول' : 'Approved' },
    { value: 'Rejected', label: language === 'ar' ? 'مرفوض' : 'Rejected' },
    { value: 'Payment Refund Requested', label: language === 'ar' ? 'طلب استرداد الدفع' : 'Payment Refund Requested' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Payment data entered': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Payment Refund Requested': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const PaymentDialog = ({ reservation }: { reservation: typeof reservations[0] }) => {
    const [paymentData, setPaymentData] = useState({
      deposit: '',
      paymentMethod: '',
      paymentDate: '',
      serialNo: '',
      attachment: null as File | null
    });

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" className="bg-gradient-primary hover:opacity-90">
            <CreditCard className="h-4 w-4 mr-1" />
            {reservation.status === 'New' 
              ? (language === 'ar' ? 'إضافة بيانات الدفع' : 'Add Payment Data')
              : (language === 'ar' ? 'تعديل بيانات الدفع' : 'Edit Payment Data')
            }
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {language === 'ar' ? 'بيانات الدفع' : 'Payment Data'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="deposit">
                {language === 'ar' ? 'العربون (جنيه مصري)' : 'Deposit (EGP)'} *
              </Label>
              <Input
                id="deposit"
                type="number"
                value={paymentData.deposit}
                onChange={(e) => setPaymentData({...paymentData, deposit: e.target.value})}
                placeholder={language === 'ar' ? 'أدخل المبلغ' : 'Enter amount'}
              />
            </div>
            <div>
              <Label>{language === 'ar' ? 'طريقة الدفع' : 'Payment Method'} *</Label>
              <Select value={paymentData.paymentMethod} onValueChange={(value) => setPaymentData({...paymentData, paymentMethod: value})}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'ar' ? 'اختر طريقة الدفع' : 'Select payment method'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">{language === 'ar' ? 'نقداً' : 'Cash'}</SelectItem>
                  <SelectItem value="domestic">{language === 'ar' ? 'تحويل محلي' : 'Domestic Transfer'}</SelectItem>
                  <SelectItem value="international">{language === 'ar' ? 'تحويل دولي' : 'International Transfer'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="paymentDate">
                {language === 'ar' ? 'تاريخ الدفع' : 'Payment Date'}
              </Label>
              <Input
                id="paymentDate"
                type="date"
                value={paymentData.paymentDate}
                onChange={(e) => setPaymentData({...paymentData, paymentDate: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="serialNo">
                {language === 'ar' ? 'رقم العملية' : 'Serial Number'}
              </Label>
              <Input
                id="serialNo"
                value={paymentData.serialNo}
                onChange={(e) => setPaymentData({...paymentData, serialNo: e.target.value})}
                placeholder={language === 'ar' ? 'أدخل رقم العملية' : 'Enter serial number'}
              />
            </div>
            <div>
              <Label htmlFor="attachment">
                {language === 'ar' ? 'مرفقات الدفع (PDF, JPG, JPEG)' : 'Payment Attachments (PDF, JPG, JPEG)'} *
              </Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <input
                  id="attachment"
                  type="file"
                  accept=".pdf,.jpg,.jpeg"
                  onChange={(e) => setPaymentData({...paymentData, attachment: e.target.files?.[0] || null})}
                  className="hidden"
                />
                <Label htmlFor="attachment" className="cursor-pointer text-sm text-primary hover:underline">
                  {language === 'ar' ? 'اضغط لرفع الملف' : 'Click to upload file'}
                </Label>
                {paymentData.attachment && (
                  <p className="mt-2 text-sm text-foreground">{paymentData.attachment.name}</p>
                )}
              </div>
            </div>
            <Button className="w-full bg-gradient-primary hover:opacity-90">
              {language === 'ar' ? 'حفظ' : 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-fade-in">
              {language === 'ar' ? 'طلبات الحجز الخاصة بي' : 'My Reservation Requests'}
            </h1>
            <p className="text-xl text-muted-foreground animate-fade-in">
              {language === 'ar' 
                ? 'تتبع وإدارة جميع طلبات الحجز الخاصة بك'
                : 'Track and manage all your reservation requests'
              }
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-8 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                {language === 'ar' ? 'تصفية النتائج' : 'Filter Results'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>{language === 'ar' ? 'المشروع' : 'Project'}</Label>
                  <Select value={filters.project} onValueChange={(value) => setFilters({...filters, project: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'ar' ? 'جميع المشاريع' : 'All Projects'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">{language === 'ar' ? 'جميع المشاريع' : 'All Projects'}</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project} value={project}>{project}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{language === 'ar' ? 'حالة الطلب' : 'Form Status'}</Label>
                  <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'ar' ? 'جميع الحالات' : 'All Statuses'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">{language === 'ar' ? 'جميع الحالات' : 'All Statuses'}</SelectItem>
                      {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{language === 'ar' ? 'من تاريخ' : 'Date From'}</Label>
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                  />
                </div>
                <div>
                  <Label>{language === 'ar' ? 'إلى تاريخ' : 'Date To'}</Label>
                  <Input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reservations Table */}
          <Card className="animate-fade-in">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'ar' ? 'المشروع' : 'Project'}</TableHead>
                      <TableHead>{language === 'ar' ? 'رقم الطلب' : 'Form No'}</TableHead>
                      <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                      <TableHead>{language === 'ar' ? 'آخر تعديل' : 'Modified'}</TableHead>
                      <TableHead>{language === 'ar' ? 'المحافظة' : 'Governorate'}</TableHead>
                      <TableHead>{language === 'ar' ? 'المدينة' : 'City'}</TableHead>
                      <TableHead>{language === 'ar' ? 'المنطقة' : 'Area'}</TableHead>
                      <TableHead>{language === 'ar' ? 'رقم الوحدة' : 'Unit No'}</TableHead>
                      <TableHead>{language === 'ar' ? 'المرفقات' : 'Attachments'}</TableHead>
                      <TableHead>{language === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservations.map((reservation, index) => (
                      <TableRow 
                        key={reservation.id}
                        className="animate-fade-in hover:bg-muted/50 transition-colors duration-300"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <TableCell className="font-medium">{reservation.project}</TableCell>
                        <TableCell>{reservation.formNo}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(reservation.status)}>
                            {reservation.statusText}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                            {reservation.modified}
                          </div>
                        </TableCell>
                        <TableCell>{reservation.governorate}</TableCell>
                        <TableCell>{reservation.city}</TableCell>
                        <TableCell>{reservation.area}</TableCell>
                        <TableCell className="font-medium">{reservation.unitNo}</TableCell>
                        <TableCell>
                          {reservation.paymentAttachments ? (
                            <div className="flex flex-col gap-1">
                              {reservation.paymentAttachments.map((file, idx) => (
                                <Button key={idx} variant="outline" size="sm" className="h-8 text-xs">
                                  <Download className="h-3 w-3 mr-1" />
                                  {file}
                                </Button>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              {language === 'ar' ? 'لا يوجد' : 'None'}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2">
                            {(reservation.status === 'New' || reservation.status === 'Reservation Payment Update Requested') && (
                              <PaymentDialog reservation={reservation} />
                            )}
                            {reservation.status === 'Rejected' && (
                              <Button size="sm" variant="outline" className="border-red-200 text-red-700 hover:bg-red-50">
                                <RefreshCw className="h-4 w-4 mr-1" />
                                {language === 'ar' ? 'طلب استرداد' : 'Request Refund'}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default MyReservations;