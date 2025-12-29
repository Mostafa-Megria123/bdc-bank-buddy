import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface RequestInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
}

export const RequestInfoModal: React.FC<RequestInfoModalProps> = ({
  isOpen,
  onClose,
  projectName,
}) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call to send email
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Logic to send to fixed internal mail
    console.log("Sending email to: realestate-inquiries@bdc.com", {
      subject: `Inquiry about ${projectName}`,
      body: formData,
    });

    toast({
      title: language === "ar" ? "تم الإرسال بنجاح" : "Sent Successfully",
      description:
        language === "ar"
          ? "تم استلام طلبك وسنتواصل معك قريباً."
          : "Your request has been received and we will contact you shortly.",
    });

    setLoading(false);
    onClose();
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {language === "ar" ? "طلب معلومات" : "Request Information"}
          </DialogTitle>
          <DialogDescription>
            {language === "ar"
              ? `يرجى ملء النموذج أدناه للاستفسار عن ${projectName}.`
              : `Please fill out the form below to inquire about ${projectName}.`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              {language === "ar" ? "الاسم الكامل" : "Full Name"}
            </Label>
            <Input
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder={language === "ar" ? "الاسم" : "Name"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">
              {language === "ar" ? "البريد الإلكتروني" : "Email"}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value="user@example.com"
              disabled
              placeholder="example@domain.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">
              {language === "ar" ? "رقم الهاتف" : "Phone Number"}
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="+20..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">
              {language === "ar" ? "الرسالة" : "Message"}
            </Label>
            <textarea
              id="message"
              name="message"
              className="w-full min-h-[100px] p-3 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.message}
              onChange={handleChange}
              placeholder={
                language === "ar"
                  ? "أكتب استفسارك هنا..."
                  : "Type your inquiry here..."
              }
            />
          </div>
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-primary">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {language === "ar" ? "إرسال الطلب" : "Send Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
