import React, { useState } from "react";
import { useLanguage } from "@/contexts/useLanguage";
import { useAuth } from "@/contexts/useAuth";
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
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "@/lib/validations";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Upload, UserPlus, Facebook } from "lucide-react";
import CaptchaField from "@/components/CaptchaField";
import IDGuideImage from "@/assets/ID.png";
import { getTranslation } from "@/locales";

const Register = () => {
  const { language } = useLanguage();
  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nationalIdError, setNationalIdError] = useState(false);
  const [registrationError, setRegistrationError] = useState("");
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nationalId: "",
      name: "",
      printedNumber: "",
      mobile: "",
      confirmMobile: "",
      email: "",
      confirmEmail: "",
      password: "",
      confirmPassword: "",
      notificationLanguage: "ar",
      nationality: "Egypt",
      residence: "",
      governorate: "",
      address: "",
      phone: "",
      maritalStatus: "",
      captcha: "",
    },
  });

  const residenceValue = watch("residence");
  const captchaValue = watch("captcha");
  const passwordValue = watch("password");

  // Update password requirements in real-time
  React.useEffect(() => {
    if (passwordValue) {
      setPasswordRequirements({
        length: passwordValue.length >= 8,
        lowercase: /[a-z]/.test(passwordValue),
        uppercase: /[A-Z]/.test(passwordValue),
        number: /[0-9]/.test(passwordValue),
        specialChar: /[@#$%^&+=!]/.test(passwordValue),
      });
    } else {
      setPasswordRequirements({
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        specialChar: false,
      });
    }
  }, [passwordValue]);

  const handleFormSubmit = async (data: RegisterFormData) => {
    // Reset error states
    setNationalIdError(false);
    setRegistrationError("");

    // Check if there are any validation errors
    if (Object.keys(errors).length > 0) {
      const errorMessages = Object.values(errors)
        .map((error) => error?.message)
        .filter(Boolean)
        .slice(0, 3) // Show first 3 errors
        .join(" • ");

      toast.error(errorMessages);
      return;
    }

    try {
      await registerUser({
        ...data,
        nationalIdImage: uploadedFile,
      });
      toast.success(
        getTranslation(
          language,
          "auth.register.accountCreatedSuccess",
        ) as string,
      );
      navigate("/verification-pending");
    } catch (error) {
      const err = error as {
        message?: string;
        response?: { data?: { message?: string } };
      };
      const errorMessage =
        err?.message ||
        err?.response?.data?.message ||
        (getTranslation(
          language,
          "auth.register.registrationFailed",
        ) as string);

      // Check if it's a National ID already exists error
      if (
        errorMessage.toLowerCase().includes("national id") &&
        errorMessage.toLowerCase().includes("already exists")
      ) {
        setNationalIdError(true);
        setRegistrationError(errorMessage);
        toast.error(
          getTranslation(
            language,
            "auth.register.nationalIdAlreadyRegistered",
          ) as string,
        );
      } else {
        setRegistrationError(errorMessage);
        toast.error(errorMessage);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setValue("nationalIdImage", file);
    }
  };

  const handleSocialLogin = (provider: "google" | "facebook") => {
    const baseUrl = process.env.REACT_APP_API_URL || "";
    window.location.href = `${baseUrl}/oauth2/authorization/${provider}`;
  };

  const governorates = [
    "Cairo",
    "Alexandria",
    "Giza",
    "Dakahlia",
    "Red Sea",
    "Beheira",
    "Fayoum",
    "Gharbiya",
    "Ismailia",
    "Menofia",
    "Minya",
    "Qaliubiya",
    "New Valley",
    "Suez",
    "Aswan",
    "Assiut",
    "Beni Suef",
    "Port Said",
    "Damietta",
    "Sharkia",
    "South Sinai",
    "Kafr El Sheikh",
    "Matrouh",
    "Luxor",
    "Qena",
    "North Sinai",
    "Sohag",
  ];

  const countries = [
    "Egypt",
    "Saudi Arabia",
    "UAE",
    "Kuwait",
    "Qatar",
    "Bahrain",
    "Oman",
  ];
  const maritalStatuses =
    language === "ar"
      ? ["أعزب", "متزوج", "مطلق", "أرمل", "متزوج من أجنبي"]
      : ["Single", "Married", "Divorced", "Widowed", "Married to Foreigner"];

  return (
    <div className="min-h-screen bg-gradient-subtle py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-brand animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-foreground">
              {getTranslation(language, "auth.register.title") as string}
            </CardTitle>
            <p className="text-muted-foreground">
              {getTranslation(language, "auth.register.subtitle") as string}
            </p>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(handleFormSubmit, () => {
                // Show toast on validation failure
                const errorMessages = Object.values(errors)
                  .map((error) => error?.message)
                  .filter(Boolean)
                  .slice(0, 3)
                  .join(" • ");

                if (errorMessages) {
                  toast.error(errorMessages);
                }
              })}
              className="space-y-6">
              {/* National ID */}
              <div className="space-y-2">
                <Label htmlFor="nationalId">
                  {getTranslation(language, "auth.register.nationalId") as string}{" "}
                  *
                </Label>
                <Input
                  id="nationalId"
                  type="text"
                  maxLength={14}
                  {...register("nationalId")}
                  aria-invalid={!!errors.nationalId}
                />
                {errors.nationalId && (
                  <p className="text-sm text-destructive">
                    {errors.nationalId.message}
                  </p>
                )}
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  {getTranslation(language, "auth.register.name") as string}{" "}
                  *
                </Label>
                <Input
                  id="name"
                  type="text"
                  {...register("name")}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* National ID Image */}
              <div className="space-y-2">
                <Label htmlFor="nationalIdImage">
                  {getTranslation(language, "auth.register.nationalIdImage") as string}{" "}
                  *
                </Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-2 text-center hover:border-primary/50 transition-colors duration-300">
                  <Upload className="mx-auto h-8 w-6 text-muted-foreground mb-1" />
                  <input
                    id="nationalIdImage"
                    type="file"
                    accept=".jpg,.jpeg,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Label
                    htmlFor="nationalIdImage"
                    className="cursor-pointer text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                    {getTranslation(language, "auth.register.uploadFile") as string}
                  </Label>
                  {uploadedFile && (
                    <p className="mt-2 text-sm text-primary">
                      {uploadedFile.name}
                    </p>
                  )}
                </div>
                {errors.nationalIdImage && (
                  <p className="text-sm text-destructive">
                    {String(errors.nationalIdImage.message)}
                  </p>
                )}
              </div>

              {/* Printed Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col justify-center">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="printedNumber">
                        {getTranslation(
                          language,
                          "auth.register.printedNumber",
                        ) as string}{" "}
                        *
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        {getTranslation(
                          language,
                          "auth.register.printedNumberHelper",
                        ) as string}
                      </p>
                    </div>
                    <Input
                      id="printedNumber"
                      type="text"
                      maxLength={9}
                      placeholder={getTranslation(
                        language,
                        "auth.register.enter9Digits",
                      ) as string}
                      {...register("printedNumber")}
                      aria-invalid={!!errors.printedNumber}
                    />
                    {errors.printedNumber && (
                      <p className="text-sm text-destructive">
                        {errors.printedNumber.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="border-2 border-orange-200 rounded-lg p-4 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900 max-w-xs w-full">
                    <img
                      src={IDGuideImage}
                      alt={
                        language === "ar"
                          ? "دليل رقم المصنع"
                          : "Factory Number Guide"
                      }
                      className="w-full h-auto rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Numbers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile">
                    {getTranslation(
                      language,
                      "auth.register.mobileNumber",
                    ) as string}{" "}
                    *
                  </Label>
                  <Input
                    id="mobile"
                    type="tel"
                    {...register("mobile")}
                    aria-invalid={!!errors.mobile}
                  />
                  {errors.mobile && (
                    <p className="text-sm text-destructive">
                      {errors.mobile.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmMobile">
                    {getTranslation(
                      language,
                      "auth.register.confirmMobileNumber",
                    ) as string}{" "}
                    *
                  </Label>
                  <Input
                    id="confirmMobile"
                    type="tel"
                    {...register("confirmMobile")}
                    aria-invalid={!!errors.confirmMobile}
                  />
                  {errors.confirmMobile && (
                    <p className="text-sm text-destructive">
                      {errors.confirmMobile.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email Addresses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    {getTranslation(
                      language,
                      "auth.register.emailAddress",
                    ) as string}{" "}
                    *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmEmail">
                    {getTranslation(
                      language,
                      "auth.register.confirmEmailAddress",
                    ) as string}{" "}
                    *
                  </Label>
                  <Input
                    id="confirmEmail"
                    type="email"
                    {...register("confirmEmail")}
                    aria-invalid={!!errors.confirmEmail}
                  />
                  {errors.confirmEmail && (
                    <p className="text-sm text-destructive">
                      {errors.confirmEmail.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">
                    {getTranslation(
                      language,
                      "auth.register.password",
                    ) as string}{" "}
                    *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      aria-invalid={!!errors.password}
                      className="pr-10"
                      style={{
                        appearance: "none",
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1">
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                  <div className="text-xs space-y-1 mt-2">
                    <p
                      className={
                        passwordRequirements.length
                          ? "text-green-600 dark:text-green-400"
                          : "text-muted-foreground"
                      }>
                      {getTranslation(language, "auth.register.chars8") as string}
                    </p>
                    <p
                      className={
                        passwordRequirements.lowercase &&
                        passwordRequirements.uppercase
                          ? "text-green-600 dark:text-green-400"
                          : "text-muted-foreground"
                      }>
                      {getTranslation(
                        language,
                        "auth.register.uppercaseLowercase",
                      ) as string}
                    </p>
                    <p
                      className={
                        passwordRequirements.number &&
                        passwordRequirements.specialChar
                          ? "text-green-600 dark:text-green-400"
                          : "text-muted-foreground"
                      }>
                      {getTranslation(
                        language,
                        "auth.register.numberAndSpecial",
                      ) as string}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    {getTranslation(
                      language,
                      "auth.register.confirmPassword",
                    ) as string}{" "}
                    *
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword")}
                      aria-invalid={!!errors.confirmPassword}
                      className="pr-10"
                      style={{
                        appearance: "none",
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1">
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Country and Residence */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    {getTranslation(
                      language,
                      "auth.register.countryOfNationality",
                    ) as string}{" "}
                    *
                  </Label>
                  <Controller
                    name="nationality"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.nationality && (
                    <p className="text-sm text-destructive">
                      {errors.nationality.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>
                    {getTranslation(
                      language,
                      "auth.register.placeOfResidence",
                    ) as string}{" "}
                    *
                  </Label>
                  <Controller
                    name="residence"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.residence && (
                    <p className="text-sm text-destructive">
                      {errors.residence.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Governorate (if Egypt) */}
              {residenceValue === "Egypt" && (
                <div className="space-y-2">
                  <Label>
                    {getTranslation(
                      language,
                      "auth.register.governorate",
                    ) as string}{" "}
                    *
                  </Label>
                  <Controller
                    name="governorate"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {governorates.map((gov) => (
                            <SelectItem key={gov} value={gov}>
                              {gov}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.governorate && (
                    <p className="text-sm text-destructive">
                      {errors.governorate.message}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label>
                  {getTranslation(
                    language,
                    "auth.register.maritalStatus",
                  ) as string}{" "}
                  *
                </Label>
                <Controller
                  name="maritalStatus"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {maritalStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.maritalStatus && (
                  <p className="text-sm text-destructive">
                    {errors.maritalStatus.message}
                  </p>
                )}
              </div>
              {/* </div> */}

              {/* Notification Language */}
              <div className="space-y-2">
                <Label>
                  {getTranslation(
                    language,
                    "auth.register.preferredLanguage",
                  ) as string}{" "}
                  *
                </Label>
                <Controller
                  name="notificationLanguage"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.notificationLanguage && (
                  <p className="text-sm text-destructive">
                    {errors.notificationLanguage.message}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">
                  {getTranslation(language, "auth.register.address") as string} *
                </Label>
                <Textarea
                  id="address"
                  rows={3}
                  {...register("address")}
                  aria-invalid={!!errors.address}
                />
                {errors.address && (
                  <p className="text-sm text-destructive">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <CaptchaField
                value={captchaValue}
                onChange={(value) => setValue("captcha", value)}
                error={errors.captcha?.message}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300 disabled:opacity-50">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="mr-2 h-4 w-4" />
                )}
                {getTranslation(language, "auth.register.createAccount") as string}
              </Button>

              {/* National ID Already Exists Error */}
              {nationalIdError && (
                <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-4 border border-red-200 dark:border-red-900 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-red-900 dark:text-red-300 mb-2">
                      {getTranslation(
                        language,
                        "auth.register.nationalIdAlreadyRegistered",
                      ) as string}
                    </p>
                    <p className="text-sm text-red-800 dark:text-red-400">
                      {getTranslation(
                        language,
                        "auth.register.nationalIdExists",
                      ) as string}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      type="button"
                      onClick={() => navigate("/login")}
                      variant="secondary"
                      className="w-full">
                      {getTranslation(language, "auth.register.goToLogin") as string}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => navigate("/verify-now")}
                      variant="secondary"
                      className="w-full">
                      {getTranslation(
                        language,
                        "auth.register.resendVerification",
                      ) as string}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
