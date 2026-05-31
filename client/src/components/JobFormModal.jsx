// client/src/components/JobFormModal.jsx
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  X,
  Briefcase,
  MapPin,
  Sparkles,
  Plus,
  Trash2,
  AlertCircle,
  Building2,
  Globe,
  CalendarDays,
  GraduationCap,
  Coins,
  FileText,
  Hash,
  Award,
  Gift,
  ChevronDown,
  PenBox,
} from "lucide-react";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";

export function JobFormModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData = null,
  mode = "create",
}) {
  // ✅ Directly get user from Redux - company data is already inside user
  const user = useSelector(selectUser);
  const companyData = user?.company || {};

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      company: "",
      location: "",
      locationType: "remote",
      employmentType: "full-time",
      experienceLevel: "mid",
      salaryMin: "",
      salaryMax: "",
      salaryCurrency: "INR",
      description: "",
      requiredSkills: [],
      preferredSkills: [],
      benefits: [],
    },
  });

  const {
    fields: requiredFields,
    append: appendRequired,
    remove: removeRequired,
    replace: replaceRequired,
  } = useFieldArray({ control, name: "requiredSkills" });

  const {
    fields: preferredFields,
    append: appendPreferred,
    remove: removePreferred,
    replace: replacePreferred,
  } = useFieldArray({ control, name: "preferredSkills" });

  const {
    fields: benefitFields,
    append: appendBenefit,
    remove: removeBenefit,
    replace: replaceBenefits,
  } = useFieldArray({ control, name: "benefits" });

  // Auto-fill company info from user object
  useEffect(() => {
    if (isOpen && mode === "create" && companyData) {
      if (companyData.name) setValue("company", companyData.name);
      if (companyData.location) setValue("location", companyData.location);
      if (companyData.benefits?.length) {
        replaceBenefits(
          companyData.benefits.map((benefit) => ({ value: benefit })),
        );
      }
    }
  }, [isOpen, mode, companyData, setValue, replaceBenefits]);

  // Load initial data for edit mode
  useEffect(() => {
    if (isOpen && initialData && mode === "edit") {
      setValue("title", initialData.title || "");
      setValue("company", initialData.company || "");
      setValue("location", initialData.location || "");
      setValue("locationType", initialData.locationType || "remote");
      setValue("employmentType", initialData.employmentType || "full-time");
      setValue("experienceLevel", initialData.experienceLevel || "mid");
      setValue("salaryMin", initialData.salaryMin || "");
      setValue("salaryMax", initialData.salaryMax || "");
      setValue("salaryCurrency", initialData.salaryCurrency || "INR");
      setValue("description", initialData.description || "");

      if (initialData.requiredSkills?.length) {
        replaceRequired(
          initialData.requiredSkills.map((skill) => ({ value: skill })),
        );
      }
      if (initialData.preferredSkills?.length) {
        replacePreferred(
          initialData.preferredSkills.map((skill) => ({ value: skill })),
        );
      }
      if (initialData.benefits?.length) {
        replaceBenefits(
          initialData.benefits.map((benefit) => ({ value: benefit })),
        );
      }
    }
  }, [
    isOpen,
    initialData,
    mode,
    setValue,
    replaceRequired,
    replacePreferred,
    replaceBenefits,
  ]);

  // Reset form on close
  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const onSubmitForm = (data) => {
    if (
      data.salaryMin &&
      data.salaryMax &&
      Number(data.salaryMin) > Number(data.salaryMax)
    ) {
      alert("Minimum salary cannot be greater than maximum salary");
      return;
    }

    if (data.requiredSkills.length === 0) {
      alert("Please add at least one required skill");
      return;
    }

    if (!data.title.trim()) {
      alert("Job title is required");
      return;
    }
    if (!data.company.trim()) {
      alert("Company name is required");
      return;
    }
    if (!data.location.trim()) {
      alert("Location is required");
      return;
    }
    if (!data.description.trim()) {
      alert("Job description is required");
      return;
    }

    const cleanedData = {
      ...data,
      requiredSkills: data.requiredSkills.map((s) => s.value.trim()),
      preferredSkills: data.preferredSkills.map((s) => s.value.trim()),
      benefits: data.benefits.map((b) => b.value.trim()),
      salaryMin: data.salaryMin ? Number(data.salaryMin) : undefined,
      salaryMax: data.salaryMax ? Number(data.salaryMax) : undefined,
      description: data.description.trim(),
    };

    if (!cleanedData.salaryMin) delete cleanedData.salaryMin;
    if (!cleanedData.salaryMax) delete cleanedData.salaryMax;

    onSubmit(cleanedData);
  };

  if (!isOpen) return null;

  const isEditMode = mode === "edit";
  const modalTitle = isEditMode ? "Edit Job Position" : "Create New Position";
  const modalSubtitle = isEditMode
    ? "Update the details to attract better talent"
    : "Fill in the details to attract top talent";
  const submitButtonText = isEditMode ? "Update Job" : "Post Job Opening";
  const submitIcon = isEditMode ? (
    <PenBox className="w-4 h-4 mr-2" />
  ) : (
    <Briefcase className="w-4 h-4 mr-2" />
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-all duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl max-h-[90vh] bg-white/95 backdrop-blur-md dark:bg-gray-800/95 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/20">
          {/* Header */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm dark:bg-gray-800/95 border-b border-gray-200 dark:border-gray-800 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg ${
                  isEditMode
                    ? "from-amber-500 to-orange-600 shadow-amber-500/20"
                    : "from-purple-600 to-indigo-600 shadow-purple-500/20"
                }`}
              >
                {isEditMode ? (
                  <PenBox className="w-5 h-5 text-white" />
                ) : (
                  <Briefcase className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {modalTitle}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {modalSubtitle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmitForm)}
            className="overflow-y-auto px-6 py-6 space-y-8 max-h-[calc(90vh-80px)] custom-scrollbar"
          >
            {/* Section 1: Basic Information */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-800">
                <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                  Basic Information
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Job Title */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Hash className="w-4 h-4 text-gray-400" />
                    Job Title
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("title", {
                      required: "Job title is required",
                      minLength: {
                        value: 3,
                        message: "Job title must be at least 3 characters",
                      },
                    })}
                    placeholder="Senior Frontend Developer"
                    className={`w-full px-4 py-2.5 rounded-xl border ${
                      errors.title
                        ? "border-red-500 focus:ring-red-500/20"
                        : "border-gray-200 dark:border-gray-700 focus:border-purple-500"
                    } bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200`}
                  />
                  {errors.title && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Company Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    Company Name
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("company", {
                      required: "Company name is required",
                      minLength: {
                        value: 2,
                        message: "Company name must be at least 2 characters",
                      },
                    })}
                    placeholder="TechCorp Inc."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                  />
                  {errors.company && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{" "}
                      {errors.company.message}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    Location
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("location", {
                      required: "Location is required",
                    })}
                    placeholder="San Francisco, CA"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                  />
                  {errors.location && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{" "}
                      {errors.location.message}
                    </p>
                  )}
                </div>

                {/* Location Type */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Globe className="w-4 h-4 text-gray-400" />
                    Work Mode
                  </label>
                  <div className="relative">
                    <select
                      {...register("locationType")}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                    >
                      <option value="remote">Remote</option>
                      <option value="onsite">Onsite</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Employment Type */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <CalendarDays className="w-4 h-4 text-gray-400" />
                    Employment Type
                  </label>
                  <div className="relative">
                    <select
                      {...register("employmentType")}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                    >
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                      <option value="freelance">Freelance</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Experience Level */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <GraduationCap className="w-4 h-4 text-gray-400" />
                    Experience Level
                  </label>
                  <div className="relative">
                    <select
                      {...register("experienceLevel")}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                    >
                      <option value="entry">Entry Level</option>
                      <option value="junior">Junior (1-2 years)</option>
                      <option value="mid">Mid Level (3-5 years)</option>
                      <option value="senior">Senior (5-8 years)</option>
                      <option value="lead">Lead (8+ years)</option>
                      <option value="executive">
                        Executive (10+ years)
                      </option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Salary */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Coins className="w-4 h-4 text-gray-400" />
                    Salary Range (per year)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="relative">
                      <select
                        {...register("salaryCurrency")}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-sm"
                      >
                        <option value="INR">₹ INR</option>
                        <option value="USD">$ USD</option>
                        <option value="EUR">€ EUR</option>
                        <option value="GBP">£ GBP</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                    </div>
                    <input
                      {...register("salaryMin")}
                      type="number"
                      placeholder="Min"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-center"
                    />
                    <input
                      {...register("salaryMax")}
                      type="number"
                      placeholder="Max"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-center"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Job Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-800">
                <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                  Job Description
                </h3>
              </div>

              <textarea
                {...register("description", {
                  required: "Job description is required",
                  minLength: {
                    value: 50,
                    message:
                      "Please provide a detailed description (minimum 50 characters)",
                  },
                })}
                rows={5}
                placeholder="Describe the role, responsibilities, technologies used, and what makes this opportunity exciting..."
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.description
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-gray-200 dark:border-gray-700 focus:border-purple-500"
                } bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200`}
              />
              {errors.description && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />{" "}
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Section 3: Required Skills */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-800">
                <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                  Required Skills
                  <span className="text-red-500 ml-1">*</span>
                </h3>
              </div>

              <SkillInput
                onAdd={(skill) => {
                  const current = getValues("requiredSkills");
                  if (!current.map((s) => s.value).includes(skill))
                    appendRequired({ value: skill });
                }}
                placeholder="React, TypeScript, Node.js"
              />

              <div className="flex flex-wrap gap-2 min-h-[40px]">
                {requiredFields.map((field, index) => (
                  <Badge
                    key={field.id}
                    variant="primary"
                    className="gap-1.5 px-3 py-1.5 text-sm bg-purple-100 text-purple-700 border-purple-200"
                  >
                    {field.value}
                    <button
                      type="button"
                      onClick={() => removeRequired(index)}
                      className="ml-1.5 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {requiredFields.length === 0 && (
                  <p className="text-xs text-red-400 dark:text-red-500 italic">
                    ⚠️ Add at least one required skill
                  </p>
                )}
              </div>
            </div>

            {/* Section 4: Preferred Skills */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-800">
                <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <Sparkles className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                  Preferred Skills
                  <span className="text-gray-400 text-xs font-normal ml-2">
                    (Optional)
                  </span>
                </h3>
              </div>

              <SkillInput
                onAdd={(skill) => {
                  const current = getValues("preferredSkills");
                  if (!current.map((s) => s.value).includes(skill))
                    appendPreferred({ value: skill });
                }}
                placeholder="AWS, Docker, Kubernetes"
              />

              <div className="flex flex-wrap gap-2">
                {preferredFields.map((field, index) => (
                  <Badge
                    key={field.id}
                    variant="secondary"
                    className="gap-1.5 px-3 py-1.5 text-sm bg-gray-100 text-gray-600"
                  >
                    {field.value}
                    <button
                      type="button"
                      onClick={() => removePreferred(index)}
                      className="ml-1.5 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Section 5: Benefits */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-800">
                <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                  <Gift className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                  Benefits & Perks
                  <span className="text-gray-400 text-xs font-normal ml-2">
                    (Optional)
                  </span>
                </h3>
              </div>

              <SkillInput
                onAdd={(benefit) => {
                  const current = getValues("benefits");
                  if (!current.map((b) => b.value).includes(benefit))
                    appendBenefit({ value: benefit });
                }}
                placeholder="Health Insurance, Remote Work, Learning Budget"
              />

              <div className="flex flex-wrap gap-2">
                {benefitFields.map((field, index) => (
                  <Badge
                    key={field.id}
                    variant="success"
                    className="gap-1.5 px-3 py-1.5 text-sm bg-emerald-100 text-emerald-700 border-emerald-200"
                  >
                    {field.value}
                    <button
                      type="button"
                      onClick={() => removeBenefit(index)}
                      className="ml-1.5 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm dark:bg-gray-800/95 pt-6 pb-2 border-t border-gray-200 dark:border-gray-800 mt-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 order-2 sm:order-1 h-11"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  className={`flex-1 order-1 sm:order-2 h-11 ${
                    isEditMode
                      ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-amber-500/25"
                      : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-500/25"
                  }`}
                >
                  {submitIcon}
                  {submitButtonText}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoom-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-in {
          animation-duration: 0.2s;
          animation-fill-mode: both;
        }
        .fade-in {
          animation-name: fade-in;
        }
        .zoom-in {
          animation-name: zoom-in;
        }
      `}</style>
    </>
  );
}

// Reusable Skill Input Component
function SkillInput({ onAdd, placeholder }) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (!input.trim()) return;

    const skills = input.includes(",")
      ? input
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s)
      : [input.trim()];

    skills.forEach(onAdd);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
        />
      </div>
      <Button
        type="button"
        onClick={handleAdd}
        size="sm"
        variant="outline"
        className="gap-2 w-full sm:w-auto h-11 px-6"
      >
        <Plus className="w-4 h-4" />
        Add
      </Button>
    </div>
  );
}
