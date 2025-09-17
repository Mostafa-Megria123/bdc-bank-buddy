import React, { useState } from 'react';
import { useLanguage } from '@/contexts/useLanguage';
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
  const { language, t, tString } = useLanguage();
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
      formNo: 'RES-2025-001',
  project: tString('myReservations.sampleProjects.0'),
      status: 'New',
  statusText: tString('myReservations.statuses.New'),
      modified: '2025-01-15',
  governorate: tString('myReservations.locations.cairo'),
  city: tString('myReservations.locations.newCairo'),
  area: tString('myReservations.locations.fifthSettlement'),
  neighborhood: tString('myReservations.locations.firstDistrict'),
      mougawra: '12',
      buildingNo: 'A1',
      unitNo: '301',
      floorNo: '3',
  floorType: tString('myReservations.floorTypes.repeated'),
      paymentAttachments: null,
  unitType: tString('myReservations.unitTypes.3br2bath'),
      price: '2,500,000 EGP',
      deposit: '250,000 EGP'
    },
    {
      id: '2',
      formNo: 'RES-2025-002',
  project: tString('myReservations.sampleProjects.1'),
      status: 'Payment data entered',
  statusText: tString('myReservations.statuses.PaymentDataEntered'),
      modified: '2025-01-10',
  governorate: tString('myReservations.locations.giza'),
  city: tString('myReservations.locations.sixOctober'),
  area: tString('myReservations.locations.sheikhZayed'),
  neighborhood: tString('myReservations.locations.seventhDistrict'),
      mougawra: '8',
      buildingNo: 'B2',
      unitNo: '205',
      floorNo: '2',
  floorType: tString('myReservations.floorTypes.repeated'),
      paymentAttachments: ['payment_receipt.pdf'],
  unitType: tString('myReservations.unitTypes.2br1bath'),
      price: '1,800,000 EGP',
      deposit: '180,000 EGP'
    },
    {
      id: '3',
      formNo: 'RES-2025-003',
  project: tString('myReservations.sampleProjects.2'),
      status: 'Approved',
  statusText: tString('myReservations.statuses.Approved'),
      modified: '2025-01-05',
  governorate: tString('myReservations.locations.cairo'),
  city: tString('myReservations.locations.heliopolis'),
  area: tString('myReservations.locations.elNozha'),
  neighborhood: tString('myReservations.locations.thirdDistrict'),
      mougawra: '15',
      buildingNo: 'C3',
      unitNo: '102',
      floorNo: '1',
  floorType: tString('myReservations.floorTypes.ground'),
      paymentAttachments: ['payment_receipt.pdf', 'bank_transfer.jpg'],
  unitType: tString('myReservations.unitTypes.4br3bath'),
      price: '3,200,000 EGP',
      deposit: '320,000 EGP'
    },
    {
      id: '4',
      formNo: 'RES-2025-004',
  project: tString('myReservations.sampleProjects.3'),
      status: 'Rejected',
  statusText: tString('myReservations.statuses.Rejected'),
      modified: '2024-12-28',
  governorate: tString('myReservations.locations.alexandria'),
  city: tString('myReservations.locations.alexandria'),
  area: tString('myReservations.locations.sidiGaber'),
  neighborhood: tString('myReservations.locations.secondDistrict'),
      mougawra: '5',
      buildingNo: 'D1',
      unitNo: '405',
      floorNo: '4',
  floorType: tString('myReservations.floorTypes.repeated'),
      paymentAttachments: ['rejected_payment.pdf'],
  unitType: tString('myReservations.unitTypes.1br1bath'),
      price: '1,200,000 EGP',
      deposit: '120,000 EGP'
    },
    {
      id: '5',
      formNo: 'RES-2025-005',
  project: tString('myReservations.sampleProjects.4'),
      status: 'Payment data entered',
  statusText: tString('myReservations.statuses.PaymentDataEntered'),
      modified: '2025-01-01',
  governorate: tString('myReservations.locations.redSea'),
  city: tString('myReservations.locations.hurghada'),
  area: tString('myReservations.locations.sekalla'),
  neighborhood: tString('myReservations.locations.touristDistrict'),
      mougawra: '20',
      buildingNo: 'E5',
      unitNo: '108',
      floorNo: '1',
  floorType: tString('myReservations.floorTypes.ground'),
      paymentAttachments: ['bank_receipt.pdf', 'transfer_proof.jpg'],
  unitType: tString('myReservations.unitTypes.2br2bath'),
      price: '2,800,000 EGP',
      deposit: '280,000 EGP'
    }
  ];

  // Apply filters to reservations
  const filteredReservations = reservations.filter((r) => {
    // Project filter (exact match when selected)
    if (filters.project && filters.project !== r.project) return false;

    // Status filter (statuses array uses 'value' strings; we compare against reservation.status)
    if (filters.status) {
      // Allow matching by exact value or localized label
      const statusNormalized = String(filters.status).toLowerCase();
      const reservationStatus = String(r.status).toLowerCase();
      const reservationStatusLabel = String(r.statusText).toLowerCase();
      if (statusNormalized !== reservationStatus && statusNormalized !== reservationStatusLabel) return false;
    }

    // Date filters (compare ISO dates)
    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom);
      const modifiedDate = new Date(r.modified);
      if (isNaN(from.getTime()) || modifiedDate < from) return false;
    }
    if (filters.dateTo) {
      const to = new Date(filters.dateTo);
      const modifiedDate = new Date(r.modified);
      // include the end date by setting time to end of day
      to.setHours(23, 59, 59, 999);
      if (isNaN(to.getTime()) || modifiedDate > to) return false;
    }

    return true;
  });

  const projects = [
  tString('myReservations.sampleProjects.0'),
  tString('myReservations.sampleProjects.1'),
  tString('myReservations.sampleProjects.2'),
  tString('myReservations.sampleProjects.3'),
  tString('myReservations.sampleProjects.4')
  ];

  const statuses = [
  { value: 'New', label: tString('myReservations.statuses.New') },
  { value: 'Payment data entered', label: tString('myReservations.statuses.PaymentDataEntered') },
  { value: 'Approved', label: tString('myReservations.statuses.Approved') },
  { value: 'Rejected', label: tString('myReservations.statuses.Rejected') },
  { value: 'Payment Refund Requested', label: tString('myReservations.statuses.PaymentRefundRequested') }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Payment data entered': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Approved': return 'bg-green-50 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
      case 'Payment Refund Requested': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-muted text-muted-foreground border-border';
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
            <Button size="sm" className="bg-primary hover:bg-primary/90">
            <CreditCard className="h-4 w-4 mr-1" />
            {reservation.status === 'New' 
              ? tString('myReservations.paymentDialog.addPayment')
              : tString('myReservations.paymentDialog.editPayment')
            }
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {tString('myReservations.paymentDialog.title')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
                <Label htmlFor="deposit">
                {tString('myReservations.paymentDialog.depositLabel')} *
              </Label>
              <Input
                id="deposit"
                type="number"
                value={paymentData.deposit}
                onChange={(e) => setPaymentData({...paymentData, deposit: e.target.value})}
                placeholder={tString('myReservations.paymentDialog.depositPlaceholder')}
              />
            </div>
            <div>
              <Label>{tString('myReservations.paymentDialog.paymentMethodLabel')} *</Label>
              <Select value={paymentData.paymentMethod} onValueChange={(value) => setPaymentData({...paymentData, paymentMethod: value})}>
                <SelectTrigger>
                  <SelectValue placeholder={tString('myReservations.paymentDialog.selectPaymentMethodPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">{tString('myReservations.paymentDialog.methods.cash')}</SelectItem>
                  <SelectItem value="domestic">{tString('myReservations.paymentDialog.methods.domestic')}</SelectItem>
                  <SelectItem value="international">{tString('myReservations.paymentDialog.methods.international')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="paymentDate">
                {tString('myReservations.paymentDialog.paymentDate')}
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
                {tString('myReservations.paymentDialog.serialNumber')}
              </Label>
              <Input
                id="serialNo"
                value={paymentData.serialNo}
                onChange={(e) => setPaymentData({...paymentData, serialNo: e.target.value})}
                placeholder={tString('myReservations.paymentDialog.serialPlaceholder')}
              />
            </div>
            <div>
              <Label htmlFor="attachment">
                {tString('myReservations.paymentDialog.attachmentsLabel')} *
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
                  {tString('myReservations.paymentDialog.clickToUpload')}
                </Label>
                {paymentData.attachment && (
                  <p className="mt-2 text-sm text-foreground">{paymentData.attachment.name}</p>
                )}
              </div>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90">
              {tString('myReservations.paymentDialog.save')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-fade-in">
              {tString('myReservations.pageTitle')}
            </h1>
            <p className="text-xl text-muted-foreground animate-fade-in">
              {tString('myReservations.pageSubtitle')}
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-8 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                {tString('myReservations.filterTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>{tString('myReservations.filters.projectLabel')}</Label>
                  <Select value={filters.project} onValueChange={(value) => setFilters({...filters, project: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={tString('myReservations.filters.allProjects')} />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project} value={project}>{project}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{tString('myReservations.filters.statusLabel')}</Label>
                  <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={tString('myReservations.filters.allStatuses')} />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{tString('myReservations.filters.dateFrom')}</Label>
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                  />
                </div>
                <div>
                  <Label>{tString('myReservations.filters.dateTo')}</Label>
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
                      <TableHead>{tString('myReservations.table.project')}</TableHead>
                      <TableHead>{tString('myReservations.table.formNo')}</TableHead>
                      <TableHead>{tString('myReservations.table.status')}</TableHead>
                      <TableHead>{tString('myReservations.table.unitType')}</TableHead>
                      <TableHead>{tString('myReservations.table.price')}</TableHead>
                      <TableHead>{tString('myReservations.table.modified')}</TableHead>
                      <TableHead>{tString('myReservations.table.city')}</TableHead>
                      <TableHead>{tString('myReservations.table.unitNo')}</TableHead>
                      <TableHead>{tString('myReservations.table.attachments')}</TableHead>
                      <TableHead>{tString('myReservations.table.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReservations.map((reservation, index) => (
                      <TableRow 
                        key={reservation.id}
                        className="animate-fade-in hover:bg-muted/50 transition-colors duration-300"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <TableCell className="font-medium">{reservation.project}</TableCell>
                        <TableCell>{reservation.formNo}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(reservation.status)}>
                            {reservation.statusText}
                          </Badge>
                        </TableCell>
                        <TableCell>{reservation.unitType}</TableCell>
                        <TableCell className="font-semibold text-primary">{reservation.price}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                            {reservation.modified}
                          </div>
                        </TableCell>
                        <TableCell>{reservation.city}</TableCell>
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
                              {tString('myReservations.none')}
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
                                {tString('myReservations.requestRefund')}
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