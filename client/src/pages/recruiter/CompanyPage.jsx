// client/src/pages/CompanyPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileProgress } from "../../components/common/ProfileProgress";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Users,
  Briefcase,
  Calendar,
  Edit,
  Save,
  X,
  Upload,
  CheckCircle,
  Sparkles,
  Share2,
  Link2,
  Code,
  Heart,
  Shield,
  Zap,
  TrendingUp,
  Loader2,
  Trash2,
} from "lucide-react";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { PageHeader } from "../../components/common/PageHeader";
import { StatsCard } from "../../components/common/StatsCard";
import {
  useGetCompanyProfileQuery,
  useUpdateCompanyProfileMutation,
  useUploadCompanyLogoMutation,
  useGetCompanyStatsQuery,
} from "../../services/companyApi";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../../features/auth/authSlice";
import { ProgressBar } from "../../components/ProgressBar";

export function CompanyPage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const {
    data: profileData,
    isLoading: isLoadingProfile,
    refetch,
  } = useGetCompanyProfileQuery();
  const { data: statsData, isLoading: isLoadingStats } =
    useGetCompanyStatsQuery();
  const [updateCompanyProfile, { isLoading: isUpdating }] =
    useUpdateCompanyProfileMutation();
  const [uploadCompanyLogo, { isLoading: isUploading }] =
    useUploadCompanyLogoMutation();

  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    email: "",
    phone: "",
    website: "",
    location: "",
    founded: "",
    size: "",
    industry: "",
    description: "",
    mission: "",
    vision: "",
    socialLinks: { linkedin: "", twitter: "", github: "" },
    benefits: [],
    culture: "",
  });

  const [newBenefit, setNewBenefit] = useState("");
  const [showBenefitInput, setShowBenefitInput] = useState(false);
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  useEffect(() => {
    if (profileData?.data?.company) {
      const company = profileData.data.company;
      setFormData({
        name: company.name || "",
        logo: company.logo || "",
        email: company.email || "",
        phone: company.phone || "",
        website: company.website || "",
        location: company.location || "",
        founded: company.founded || "",
        size: company.size || "",
        industry: company.industry || "",
        description: company.description || "",
        mission: company.mission || "",
        vision: company.vision || "",
        socialLinks: {
          linkedin: company.socialLinks?.linkedin || "",
          twitter: company.socialLinks?.twitter || "",
          github: company.socialLinks?.github || "",
        },
        benefits: company.benefits || [],
        culture: company.culture || "",
      });
      setLogoPreview(company.logo || "");
      setSelectedLogoFile(null);
    }
  }, [profileData]);

  const getCompanyCompletionPercentage = (company) => {
    if (!company) return 0;

    let completed = 0;
    const total = 8;

    if (company.name) completed++;
    if (company.logo) completed++;
    if (company.email) completed++;
    if (company.phone) completed++;
    if (company.location) completed++;
    if (company.industry) completed++;
    if (company.description?.length >= 50) completed++;
    if (company.benefits?.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };

  // Usage
  const completionPercentage = getCompanyCompletionPercentage(
    profileData?.data?.company,
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (platform, value) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value },
    }));
  };

  const handleAddBenefit = () => {
    if (newBenefit.trim()) {
      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()],
      }));
      setNewBenefit("");
      setShowBenefitInput(false);
    }
  };

  const handleRemoveBenefit = (benefitToRemove) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((b) => b !== benefitToRemove),
    }));
  };

  // ✅ Handle logo file selection - preview only
  const handleLogoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedLogoFile(file);
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
    setSuccessMessage("New logo selected. Click Save to update.");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // ✅ Remove selected logo (revert to original)
  const handleRemoveSelectedLogo = () => {
    setSelectedLogoFile(null);
    setLogoPreview(formData.logo);
    setSuccessMessage("Logo selection cancelled.");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleSave = async () => {
    try {
      let finalLogoUrl = formData.logo;

      // Upload new logo if selected
      if (selectedLogoFile) {
        const formDataLogo = new FormData();
        formDataLogo.append("logo", selectedLogoFile);
        const uploadResult = await uploadCompanyLogo(formDataLogo).unwrap();
        finalLogoUrl = uploadResult.data.logoUrl;
      }

      // ✅ Send clean flat data
      const updateData = {
        name: formData.name?.trim() || "",
        logo: finalLogoUrl || "",
        email: formData.email?.trim() || "",
        phone: formData.phone?.trim() || "",
        website: formData.website?.trim() || "",
        location: formData.location?.trim() || "",
        founded: formData.founded?.trim() || "",
        size: formData.size || "",
        industry: formData.industry?.trim() || "",
        description: formData.description?.trim() || "",
        mission: formData.mission?.trim() || "",
        vision: formData.vision?.trim() || "",
        culture: formData.culture?.trim() || "",
        benefits: formData.benefits || [],
        socialLinks: {
          linkedin: formData.socialLinks?.linkedin?.trim() || "",
          twitter: formData.socialLinks?.twitter?.trim() || "",
          github: formData.socialLinks?.github?.trim() || "",
        },
      };

      const result = await updateCompanyProfile(updateData).unwrap();

      // ✅ Update Redux with cleaned data
      const cleanedCompany = result.data?.company || result.data;

      dispatch(
        updateUserProfile({
          company: result.data?.company || result.data,
          isCompanyComplete: result.isComplete === true, // ✅ ensure boolean
        }),
      );

      // ✅ Update local form state
      if (cleanedCompany) {
        setFormData((prev) => ({
          ...prev,
          ...cleanedCompany,
          logo: cleanedCompany.logo || finalLogoUrl,
        }));
        setLogoPreview(cleanedCompany.logo || finalLogoUrl);
      }

      setSuccessMessage(
        result.message || "Company profile updated successfully!",
      );
      setIsEditing(false);
      setSelectedLogoFile(null);
      refetch();

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Save error:", error);
      setErrorMessage(
        error.data?.message || "Failed to update company profile",
      );
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleCancel = () => {
    if (profileData?.data?.company) {
      const company = profileData.data.company;
      setFormData({
        name: company.name || "",
        logo: company.logo || "",
        email: company.email || "",
        phone: company.phone || "",
        website: company.website || "",
        location: company.location || "",
        founded: company.founded || "",
        size: company.size || "",
        industry: company.industry || "",
        description: company.description || "",
        mission: company.mission || "",
        vision: company.vision || "",
        socialLinks: {
          linkedin: company.socialLinks?.linkedin || "",
          twitter: company.socialLinks?.twitter || "",
          github: company.socialLinks?.github || "",
        },
        benefits: company.benefits || [],
        culture: company.culture || "",
      });
      setLogoPreview(company.logo || "");
      setSelectedLogoFile(null);
    }
    setIsEditing(false);
  };

  const stats = [
    {
      label: "Active Jobs",
      value: statsData?.data?.stats?.activeJobs || 0,
      icon: Briefcase,
      change: "",
      color: "from-purple-500 to-indigo-600",
    },
    {
      label: "Total Applicants",
      value: statsData?.data?.stats?.totalApplicants || 0,
      icon: Users,
      change: "",
      color: "from-emerald-500 to-teal-600",
    },
    {
      label: "Total Hired",
      value: statsData?.data?.stats?.hired || 0,
      icon: CheckCircle,
      change: "",
      color: "from-green-500 to-emerald-600",
    },
    {
      label: "Open Positions",
      value: statsData?.data?.stats?.activeJobs || 0,
      icon: TrendingUp,
      change: "",
      color: "from-orange-500 to-amber-600",
    },
  ];

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Loading company profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <PageHeader
          badge="Company Profile"
          title="Your"
          gradientText="Company"
          description="Manage your company information, branding, and recruitment presence"
        />

        <ProfileProgress user={user} />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 rounded-full bg-purple-600 dark:bg-purple-500" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {profileData?.isComplete
                ? "Your company profile is complete ✓"
                : "Complete your company profile to attract top talent"}
            </p>
          </div>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="gap-2 border-gray-200 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:border-gray-600"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="gap-2 border-gray-200 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:border-gray-600"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isUpdating || isUploading}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white gap-2 shadow-md hover:shadow-lg transition-all"
              >
                {isUpdating || isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Changes
              </Button>
            </div>
          )}
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/30 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-emerald-700 dark:text-emerald-400">
              {successMessage}
            </span>
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/30 rounded-2xl p-4 flex items-center gap-3">
            <X className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-red-700 dark:text-red-400">
              {errorMessage}
            </span>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Header Card */}
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden">
              <div className="px-6 pt-6 pb-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Logo Section with Update Option */}
                  <div className="flex-shrink-0">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 border-4 border-gray-100 dark:border-gray-700 shadow-lg flex items-center justify-center overflow-hidden">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt={formData.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                      )}
                    </div>

                    {/* Logo Upload/Update Buttons - Only in Edit Mode */}
                    {isEditing && (
                      <div className="mt-2 flex flex-col gap-1">
                        <label className="cursor-pointer text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 flex items-center justify-center gap-1">
                          <Upload className="w-3 h-3" />
                          <span>Update Logo</span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleLogoSelect}
                            disabled={isUploading}
                          />
                        </label>
                        {selectedLogoFile && (
                          <button
                            onClick={handleRemoveSelectedLogo}
                            className="text-xs text-red-500 hover:text-red-600 flex items-center justify-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Cancel</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Company Name"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                      />
                    ) : (
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formData.name || "Your Company Name"}
                      </h2>
                    )}
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />{" "}
                        {formData.location || "Location"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" /> Founded{" "}
                        {formData.founded || "Year"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" /> {formData.size || "Size"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800/30 dark:to-gray-800/80">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Contact Information
                </h3>
              </div>
              <div className="p-5">
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Website
                      </label>
                      <input
                        type="text"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Industry
                      </label>
                      <input
                        type="text"
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g., San Francisco, CA"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Founded Year
                      </label>
                      <input
                        type="text"
                        name="founded"
                        value={formData.founded}
                        onChange={handleInputChange}
                        placeholder="e.g., 2015"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Company Size
                      </label>
                      <select
                        name="size"
                        value={formData.size}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:text-white"
                      >
                        <option value="">Select Size</option>
                        <option value="1-10 employees">1-10 employees</option>
                        <option value="11-50 employees">11-50 employees</option>
                        <option value="51-200 employees">
                          51-200 employees
                        </option>
                        <option value="201-500 employees">
                          201-500 employees
                        </option>
                        <option value="501-1000 employees">
                          501-1000 employees
                        </option>
                        <option value="1000+ employees">1000+ employees</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <Mail className="w-5 h-5 text-gray-400 dark:text-gray-500" />{" "}
                      {formData.email || "Not set"}
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <Phone className="w-5 h-5 text-gray-400 dark:text-gray-500" />{" "}
                      {formData.phone || "Not set"}
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <Globe className="w-5 h-5 text-gray-400 dark:text-gray-500" />{" "}
                      {formData.website || "Not set"}
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <Building2 className="w-5 h-5 text-gray-400 dark:text-gray-500" />{" "}
                      {formData.industry || "Not set"}
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <MapPin className="w-5 h-5 text-gray-400 dark:text-gray-500" />{" "}
                      {formData.location || "Not set"}
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500" />{" "}
                      Founded {formData.founded || "Not set"}
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <Users className="w-5 h-5 text-gray-400 dark:text-gray-500" />{" "}
                      {formData.size || "Not set"}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* About Company */}
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800/30 dark:to-gray-800/80">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  About the Company
                </h3>
              </div>
              <div className="p-5 space-y-5">
                {isEditing ? (
                  <>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:text-white"
                      placeholder="Company description..."
                    />
                    <textarea
                      name="mission"
                      value={formData.mission}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:text-white"
                      placeholder="Mission statement..."
                    />
                    <textarea
                      name="vision"
                      value={formData.vision}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:text-white"
                      placeholder="Vision statement..."
                    />
                  </>
                ) : (
                  <>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {formData.description || "No description provided"}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          <p className="font-medium text-purple-900 dark:text-purple-300">
                            Our Mission
                          </p>
                        </div>
                        <p className="text-sm text-purple-700 dark:text-purple-300">
                          {formData.mission || "Not specified"}
                        </p>
                      </div>
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                          <p className="font-medium text-indigo-900 dark:text-indigo-300">
                            Our Vision
                          </p>
                        </div>
                        <p className="text-sm text-indigo-700 dark:text-indigo-300">
                          {formData.vision || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Social Links */}
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800/30 dark:to-gray-800/80">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Connect With Us
                </h3>
              </div>
              <div className="p-5 space-y-3">
                {[
                  {
                    platform: "linkedin",
                    icon: Link2,
                    color: "text-blue-600 dark:text-blue-400",
                    bg: "bg-blue-50 dark:bg-blue-900/20",
                    placeholder: "LinkedIn URL",
                  },
                  {
                    platform: "twitter",
                    icon: Share2,
                    color: "text-sky-500 dark:text-sky-400",
                    bg: "bg-sky-50 dark:bg-sky-900/20",
                    placeholder: "Twitter URL",
                  },
                  {
                    platform: "github",
                    icon: Code,
                    color: "text-gray-700 dark:text-gray-300",
                    bg: "bg-gray-100 dark:bg-gray-800",
                    placeholder: "GitHub URL",
                  },
                ].map(({ platform, icon: Icon, color, bg, placeholder }) => (
                  <div key={platform} className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}
                    >
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.socialLinks[platform]}
                        onChange={(e) =>
                          handleSocialChange(platform, e.target.value)
                        }
                        placeholder={placeholder}
                        className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:text-white"
                      />
                    ) : (
                      <a
                        href={formData.socialLinks[platform]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors truncate"
                      >
                        {formData.socialLinks[platform] || "Not set"}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits & Perks */}
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800/30 dark:to-gray-800/80">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Benefits & Perks
                  </h3>
                  {isEditing && !showBenefitInput && (
                    <button
                      onClick={() => setShowBenefitInput(true)}
                      className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700"
                    >
                      + Add Benefit
                    </button>
                  )}
                </div>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  {formData.benefits.map((benefit) => (
                    <Badge
                      key={benefit}
                      variant="primary"
                      className="text-sm px-3 py-1.5 gap-1 dark:bg-purple-900/30 dark:text-purple-300"
                    >
                      <Zap className="w-3 h-3" /> {benefit}
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveBenefit(benefit)}
                          className="ml-1 text-purple-400 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                  {formData.benefits.length === 0 && !isEditing && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No benefits added yet
                    </p>
                  )}
                </div>
                {isEditing && showBenefitInput && (
                  <div className="flex flex-col gap-2 mt-3">
                    <input
                      type="text"
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value)}
                      placeholder="Enter benefit..."
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleAddBenefit}
                        className="flex-1"
                      >
                        Add Benefit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setShowBenefitInput(false);
                          setNewBenefit("");
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Company Culture */}
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800/30 dark:to-gray-800/80">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Company Culture
                </h3>
              </div>
              <div className="p-5">
                {isEditing ? (
                  <textarea
                    name="culture"
                    value={formData.culture}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:text-white"
                    placeholder="Describe your company culture..."
                  />
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {formData.culture || "No culture description provided"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
