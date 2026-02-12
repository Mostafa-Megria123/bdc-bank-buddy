import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/useLanguage";
import { useAuth } from "@/contexts/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Filter,
  Upload,
  Download,
  CreditCard,
  RefreshCw,
  ShoppingCart,
  Loader,
} from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import { reservationService } from "@/services/reservation.service";
import { FileService } from "@/services/file-service";
import type { ReservationDTO, PaymentCompletionDTO } from "@/types/reservation";

interface PaymentDialogProps {
  reservation: ReservationDTO;
  tString: (key: string) => string;
  onSuccess?: () => void;
}

const PaymentDialog = ({
  reservation,
  tString,
  onSuccess,
}: PaymentDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState({
    deposit: reservation.paymentCompletion?.depositAmount?.toString() || "",
    paymentMethod: reservation.paymentCompletion?.paymentMethod || "",
    paymentDate: reservation.paymentCompletion?.paymentDate || "",
    serialNo: reservation.paymentCompletion?.serialNumber || "",
    attachment: null as File | null,
  });

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!paymentData.deposit || !paymentData.paymentMethod) {
        throw new Error(
          tString("myReservations.paymentDialog.requiredFieldsError") ||
            "Please fill in all required fields",
        );
      }

      const paymentCompletionDTO: PaymentCompletionDTO = {
        depositAmount: parseFloat(paymentData.deposit),
        paymentMethod: paymentData.paymentMethod,
        paymentDate: paymentData.paymentDate || undefined,
        serialNumber: paymentData.serialNo || undefined,
      };

      // Check if we're adding or editing
      if (
        !reservation.paymentCompletion ||
        !reservation.paymentCompletion.depositAmount
      ) {
        // Add payment
        await reservationService.addPaymentCompletion(
          reservation.id,
          paymentCompletionDTO,
          paymentData.attachment || undefined,
        );
      } else {
        // Edit payment
        await reservationService.editPaymentCompletion(
          reservation.id,
          paymentCompletionDTO,
          paymentData.attachment || undefined,
        );
      }

      setOpen(false);
      onSuccess?.();
    } catch (err) {
      console.error("Error submitting payment:", err);

      // Check for authentication errors (401 status or specific messages)
      const error = err as { response?: { status: number } } | Error;
      const isAuthError =
        ("response" in error && error.response?.status === 401) ||
        (error instanceof Error && error.message?.includes("401")) ||
        (error instanceof Error && error.message?.includes("Unauthorized")) ||
        (error instanceof Error && error.message?.includes("token"));

      if (isAuthError) {
        // Close dialog and show auth error toast
        setOpen(false);
        toast({
          title:
            tString("myReservations.paymentDialog.sessionExpired") ||
            "Session Expired",
          description:
            tString("myReservations.paymentDialog.pleaseLoginAgain") ||
            "Your session has ended. Please login again.",
          variant: "destructive",
        });
      } else {
        // Show regular error
        setError(
          (error instanceof Error ? error.message : String(error)) ||
            tString("myReservations.paymentDialog.submissionError") ||
            "Failed to submit payment. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-primary hover:bg-primary/90">
          <CreditCard className="h-4 w-4 mr-1" />
          {!reservation.paymentCompletion ||
          !reservation.paymentCompletion.depositAmount
            ? tString("myReservations.paymentDialog.addPayment")
            : tString("myReservations.paymentDialog.editPayment")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {tString("myReservations.paymentDialog.title")}
          </DialogTitle>
          <DialogDescription>
            {tString("myReservations.paymentDialog.description") ||
              "Enter your payment details below"}
          </DialogDescription>
        </DialogHeader>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        <div className="space-y-4">
          <div>
            <Label htmlFor="deposit">
              {tString("myReservations.paymentDialog.depositLabel")} *
            </Label>
            <Input
              id="deposit"
              type="number"
              value={paymentData.deposit}
              onChange={(e) =>
                setPaymentData({ ...paymentData, deposit: e.target.value })
              }
              placeholder={tString(
                "myReservations.paymentDialog.depositPlaceholder",
              )}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label>
              {tString("myReservations.paymentDialog.paymentMethodLabel")} *
            </Label>
            <Select
              value={paymentData.paymentMethod}
              onValueChange={(value) =>
                setPaymentData({ ...paymentData, paymentMethod: value })
              }
              disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue
                  placeholder={tString(
                    "myReservations.paymentDialog.selectPaymentMethodPlaceholder",
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">
                  {tString("myReservations.paymentDialog.methods.cash")}
                </SelectItem>
                <SelectItem value="DOMESTIC_TRANSFER">
                  {tString("myReservations.paymentDialog.methods.domestic")}
                </SelectItem>
                <SelectItem value="INTERNATIONAL_TRANSFER">
                  {tString(
                    "myReservations.paymentDialog.methods.international",
                  )}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="paymentDate">
              {tString("myReservations.paymentDialog.paymentDate")}
            </Label>
            <Input
              id="paymentDate"
              type="date"
              value={paymentData.paymentDate}
              onChange={(e) =>
                setPaymentData({ ...paymentData, paymentDate: e.target.value })
              }
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="serialNo">
              {tString("myReservations.paymentDialog.serialNumber")}
            </Label>
            <Input
              id="serialNo"
              value={paymentData.serialNo}
              onChange={(e) =>
                setPaymentData({ ...paymentData, serialNo: e.target.value })
              }
              placeholder={tString(
                "myReservations.paymentDialog.serialPlaceholder",
              )}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="attachment">
              {tString("myReservations.paymentDialog.attachmentsLabel")} *
            </Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <input
                id="attachment"
                type="file"
                accept=".pdf,.jpg,.jpeg"
                onChange={(e) =>
                  setPaymentData({
                    ...paymentData,
                    attachment: e.target.files?.[0] || null,
                  })
                }
                className="hidden"
                disabled={isSubmitting}
              />
              <Label
                htmlFor="attachment"
                className="cursor-pointer text-sm text-primary hover:underline">
                {tString("myReservations.paymentDialog.clickToUpload")}
              </Label>
              {paymentData.attachment && (
                <p className="mt-2 text-sm text-foreground">
                  {paymentData.attachment.name}
                </p>
              )}
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90">
            {isSubmitting ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                {tString("myReservations.submitting") || "Submitting..."}
              </>
            ) : (
              tString("myReservations.paymentDialog.save")
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const MyReservations = () => {
  const { tString, language } = useLanguage();
  const { user } = useAuth();

  const [reservations, setReservations] = useState<ReservationDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [refundingId, setRefundingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [downloadingAttachmentId, setDownloadingAttachmentId] = useState<
    number | null
  >(null);

  const initialFilters = {
    status: "",
    dateFrom: "",
    dateTo: "",
  };

  const [filters, setFilters] = useState(initialFilters);

  // Fetch reservations on component mount or when user changes
  useEffect(() => {
    const fetchReservations = async () => {
      if (!user?.id) {
        setError(
          tString("myReservations.userNotAuthenticated") ||
            "User not authenticated",
        );
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await reservationService.getReservationsByUser(
          user.id,
          page,
          10,
        );
        setReservations(response.content || []);
      } catch (err) {
        console.error("Error fetching reservations:", err);
        setError(
          tString("myReservations.failedLoadReservations") ||
            "Failed to load reservations. Please try again later.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [user?.id, page, tString]);

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const handleRefreshReservations = async () => {
    if (!user?.id) return;
    setIsRefreshing(true);
    setError(null);
    try {
      const response = await reservationService.getReservationsByUser(
        user.id,
        page,
        10,
      );
      setReservations(response.content || []);
      setSuccessMessage(
        tString("myReservations.refreshSuccess") ||
          "Reservations refreshed successfully",
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error refreshing reservations:", err);
      setError(
        tString("myReservations.refreshError") ||
          "Failed to refresh reservations. Please try again.",
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRequestRefund = async (reservationId: number) => {
    setRefundingId(reservationId);
    try {
      await reservationService.requestRefund(reservationId);
      setSuccessMessage(
        tString("myReservations.refundRequestSuccess") ||
          "Refund request submitted successfully",
      );
      // Refresh reservations to get updated status
      if (user?.id) {
        const response = await reservationService.getReservationsByUser(
          user.id,
          page,
          10,
        );
        setReservations(response.content || []);
      }
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error requesting refund:", err);
      setError(
        tString("myReservations.refundRequestError") ||
          "Failed to submit refund request. Please try again.",
      );
    } finally {
      setRefundingId(null);
    }
  };

  const handleDownloadAttachment = async (
    reservationId: number,
    attachmentUrl: string,
  ) => {
    setDownloadingAttachmentId(reservationId);
    try {
      await FileService.downloadAttachment(attachmentUrl);
    } catch (err) {
      console.error("Error downloading attachment:", err);
      setError(
        tString("myReservations.downloadError") ||
          "Failed to download attachment. Please try again.",
      );
    } finally {
      setDownloadingAttachmentId(null);
    }
  };

  // Apply filters to reservations
  const filteredReservations = reservations.filter((r) => {
    // Status filter
    if (filters.status) {
      const statusNormalized = String(filters.status).toLowerCase();
      const reservationStatus = String(r.status).toLowerCase();
      if (statusNormalized !== reservationStatus) return false;
    }

    // Date filters (compare based on lastModifiedDate)
    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom);
      const modifiedDate = new Date(r.lastModifiedDate);
      if (isNaN(from.getTime()) || modifiedDate < from) return false;
    }
    if (filters.dateTo) {
      const to = new Date(filters.dateTo);
      const modifiedDate = new Date(r.lastModifiedDate);
      // include the end date by setting time to end of day
      to.setHours(23, 59, 59, 999);
      if (isNaN(to.getTime()) || modifiedDate > to) return false;
    }

    return true;
  });

  const statuses = [
    { value: "NEW", label: tString("myReservations.statuses.New") },
    {
      value: "PAYMENT_DATA_ENTERED",
      label: tString("myReservations.statuses.PaymentDataEntered"),
    },
    {
      value: "PENDING_PAYMENT_COMPLETION",
      label: tString("myReservations.statuses.PendingPaymentCompletion"),
    },
    { value: "APPROVED", label: tString("myReservations.statuses.Approved") },
    { value: "REJECTED", label: tString("myReservations.statuses.Rejected") },
    {
      value: "PAYMENT_REFUND_REQUESTED",
      label: tString("myReservations.statuses.PaymentRefundRequested"),
    },
  ];

  const getStatusColor = (status: string) => {
    const statusUpper = String(status).toUpperCase();
    switch (statusUpper) {
      case "NEW":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "PAYMENT_DATA_ENTERED":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "PENDING_PAYMENT_COMPLETION":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "APPROVED":
        return "bg-green-50 text-green-700 border-green-200";
      case "REJECTED":
        return "bg-red-50 text-red-700 border-red-200";
      case "PAYMENT_REFUND_REQUESTED":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusLabel = (status: string): string => {
    const statusObj = statuses.find(
      (s) => s.value.toUpperCase() === String(status).toUpperCase(),
    );
    return statusObj?.label || status;
  };

  const getProjectName = (reservation: ReservationDTO): string => {
    // Get language from localStorage or default to 'en'
    const language = localStorage.getItem("language") || "en";
    return language === "ar"
      ? reservation.projectNameAr
      : reservation.projectNameEn;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-2xl mx-auto">
          <div className="text-center mb-12">
            <SectionTitle
              title={tString("myReservations.pageTitle")}
              icon={ShoppingCart}
            />
            <p className="text-xl text-muted-foreground animate-fade-in">
              {tString("myReservations.pageSubtitle")}
            </p>
          </div>

          {/* Success state */}
          {successMessage && (
            <Card className="mb-8 border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <p className="text-green-700">{successMessage}</p>
              </CardContent>
            </Card>
          )}

          {/* Error state */}
          {error && !isLoading && (
            <Card className="mb-8 border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-700">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Loading state */}
          {isLoading && (
            <Card className="mb-8 animate-fade-in">
              <CardContent className="pt-6 flex items-center justify-center py-8">
                <Loader className="h-6 w-6 animate-spin mr-2" />
                <p>
                  {tString("myReservations.loading") ||
                    "Loading reservations..."}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          {!isLoading && (
            <Card className="mb-8 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  {tString("myReservations.filterTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                  <div>
                    <Label>
                      {tString("myReservations.filters.statusLabel")}
                    </Label>
                    <Select
                      value={filters.status}
                      onValueChange={(value) =>
                        setFilters({ ...filters, status: value })
                      }>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={tString(
                            "myReservations.filters.allStatuses",
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{tString("myReservations.filters.dateFrom")}</Label>
                    <Input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) =>
                        setFilters({ ...filters, dateFrom: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>{tString("myReservations.filters.dateTo")}</Label>
                    <Input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) =>
                        setFilters({ ...filters, dateTo: e.target.value })
                      }
                    />
                  </div>
                  <div className="lg:col-span-1 flex gap-2">
                    <Button
                      onClick={handleRefreshReservations}
                      disabled={isRefreshing}
                      className="flex-1 bg-primary hover:bg-primary/90">
                      {isRefreshing ? (
                        <>
                          <Loader className="h-4 w-4 mr-2 animate-spin" />
                          {tString("myReservations.refreshing") ||
                            "Refreshing..."}
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          {tString("myReservations.refresh") || "Refresh"}
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleResetFilters}
                      variant="outline"
                      className="flex-1">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {tString("myReservations.filters.reset")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reservations Table */}
          {!isLoading && (
            <Card className="animate-fade-in">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead
                          className={language === "ar" ? "text-right" : ""}>
                          {tString("myReservations.table.orderId")}
                        </TableHead>
                        <TableHead
                          className={language === "ar" ? "text-right" : ""}>
                          {tString("myReservations.table.project")}
                        </TableHead>
                        <TableHead
                          className={language === "ar" ? "text-right" : ""}>
                          {tString("myReservations.table.unitNo")}
                        </TableHead>
                        <TableHead
                          className={language === "ar" ? "text-right" : ""}>
                          {tString("myReservations.table.status")}
                        </TableHead>
                        <TableHead
                          className={language === "ar" ? "text-right" : ""}>
                          {tString("myReservations.table.unitPrice")}
                        </TableHead>
                        <TableHead
                          className={language === "ar" ? "text-right" : ""}>
                          {tString("myReservations.table.deposit")}
                        </TableHead>
                        <TableHead
                          className={language === "ar" ? "text-right" : ""}>
                          {tString("myReservations.table.modified")}
                        </TableHead>
                        {/* <TableHead
                          className={language === "ar" ? "text-right" : ""}>
                          {tString("myReservations.table.attachments")}
                        </TableHead> */}
                        {/* <TableHead
                          className={language === "ar" ? "text-right" : ""}>
                          {tString("myReservations.table.actions")}
                        </TableHead> */}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReservations.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={9}
                            className="text-center py-8 text-muted-foreground">
                            {tString("myReservations.noReservations") ||
                              "No reservations found"}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredReservations.map((reservation, index) => (
                          <TableRow
                            key={reservation.id}
                            className="animate-fade-in hover:bg-muted/50 transition-colors duration-300"
                            style={{ animationDelay: `${index * 0.1}s` }}>
                            <TableCell className="font-medium">
                              {reservation.orderId}
                            </TableCell>
                            <TableCell>{getProjectName(reservation)}</TableCell>
                            <TableCell>{reservation.unitNumber}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={getStatusColor(reservation.status)}>
                                {getStatusLabel(reservation.status)}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-semibold text-primary">
                              {reservation.unitPrice?.toLocaleString()} EGP
                            </TableCell>
                            <TableCell>
                              {reservation.deposit
                                ? `${reservation.deposit.toLocaleString()} EGP`
                                : tString("myReservations.none")}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-muted-foreground ml-1" />
                                {new Date(
                                  reservation.lastModifiedDate,
                                ).toLocaleDateString()}
                              </div>
                            </TableCell>
                            {/* <TableCell>
                              {reservation.paymentCompletion?.attachmentUrl ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 text-xs"
                                  onClick={() =>
                                    handleDownloadAttachment(
                                      reservation.id,
                                      reservation.paymentCompletion
                                        ?.attachmentUrl || "",
                                    )
                                  }
                                  disabled={
                                    downloadingAttachmentId === reservation.id
                                  }>
                                  {downloadingAttachmentId ===
                                  reservation.id ? (
                                    <>
                                      <Loader className="h-3 w-3 mr-1 animate-spin" />
                                      {tString("myReservations.downloading") ||
                                        "Downloading..."}
                                    </>
                                  ) : (
                                    <>
                                      <Download className="h-3 w-3 mr-1" />
                                      {tString(
                                        "myReservations.downloadAttachment",
                                      ) || "Download"}
                                    </>
                                  )}
                                </Button>
                              ) : (
                                <span className="text-muted-foreground text-sm">
                                  {tString("myReservations.none")}
                                </span>
                              )}
                            </TableCell> */}
                            {/* <TableCell>
                              <div className="flex flex-col gap-2">
                                {(reservation.status === "NEW" ||
                                  reservation.status ===
                                    "PENDING_PAYMENT_COMPLETION" ||
                                  reservation.status ===
                                    "PAYMENT_REFUND_REQUESTED") && (
                                  <PaymentDialog
                                    reservation={reservation}
                                    tString={tString}
                                    onSuccess={() => {
                                      setSuccessMessage(
                                        tString(
                                          "myReservations.paymentSubmitSuccess",
                                        ) ||
                                          "Payment details submitted successfully",
                                      );
                                      // Refresh reservations
                                      if (user?.id) {
                                        reservationService
                                          .getReservationsByUser(
                                            user.id,
                                            page,
                                            10,
                                          )
                                          .then((response) =>
                                            setReservations(
                                              response.content || [],
                                            ),
                                          )
                                          .catch((err) =>
                                            console.error(
                                              "Error refreshing reservations:",
                                              err,
                                            ),
                                          );
                                      }
                                      setTimeout(
                                        () => setSuccessMessage(null),
                                        3000,
                                      );
                                    }}
                                  />
                                )}
                                {reservation.status === "REJECTED_BY_BDC" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-red-200 text-red-700 hover:bg-red-50"
                                    onClick={() =>
                                      handleRequestRefund(reservation.id)
                                    }
                                    disabled={refundingId === reservation.id}>
                                    {refundingId === reservation.id ? (
                                      <>
                                        <Loader className="h-4 w-4 mr-1 animate-spin" />
                                        {tString("myReservations.submitting") ||
                                          "Submitting..."}
                                      </>
                                    ) : (
                                      <>
                                        <RefreshCw className="h-4 w-4 mr-1" />
                                        {tString(
                                          "myReservations.requestRefund",
                                        )}
                                      </>
                                    )}
                                  </Button>
                                )}
                              </div>
                            </TableCell> */}
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};

export default MyReservations;
