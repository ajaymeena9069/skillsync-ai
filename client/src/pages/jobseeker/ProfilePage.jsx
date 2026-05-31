// client/src/pages/ProfilePage.jsx
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Camera,
  MapPin,
  Briefcase,
  Save,
  User,
  Globe,
  Link2,
  Code,
  Sparkles,
  CheckCircle2,
  Circle,
  X,
  Plus,
  ExternalLink,
  Loader2,
  Upload,
  Trash2,
  Lock,
} from "lucide-react";
import { Button } from "../../components/Button";
import { PageLoader } from "../../components/PageLoader";
import { Badge } from "../../components/Badge";
import { Input } from "../../components/Input";
import { ProgressBar } from "../../components/ProgressBar";
import { ProfileProgress } from "../../components/common/ProfileProgress";
import { OptimizedAvatar } from "../../components/common/OptimizedAvatar";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
} from "../../services/jobseekerApi";
import { updateUser } from "../../features/auth/authSlice";

export function ProfilePage() {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.auth.user);
  const avatarInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const { data: profileData, isLoading, refetch } = useGetProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [uploadAvatar] = useUploadAvatarMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    currentRole: "",
    experience: "",
    preferredJobType: "full-time",
    expectedSalary: "",
    bio: "",
    skills: [],
    socialLinks: {
      linkedin: "",
      github: "",
      portfolio: "",
    },
  });

  // Load data from API/Redux
  useEffect(() => {
    const userData = profileData?.data || reduxUser;
    if (userData && !isEditing) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        location: userData.location || "",
        currentRole: userData.currentRole || "",
        experience: userData.experience || "",
        preferredJobType: userData.preferredJobType || "full-time",
        expectedSalary: userData.expectedSalary || "",
        bio: userData.bio || "",
        skills: userData.skills || [],
        socialLinks: {
          linkedin: userData.socialLinks?.linkedin || "",
          github: userData.socialLinks?.github || "",
          portfolio: userData.socialLinks?.portfolio || "",
        },
      });
      if (!selectedAvatarFile) {
        setAvatarPreview(userData.avatar || null);
      }
    }
  }, [profileData, reduxUser, isEditing]);

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

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
      setShowSkillInput(false);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      setErrorMessage("Only JPEG, PNG, GIF, and WEBP images are allowed");
      setTimeout(() => setErrorMessage(""), 4000);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image must be less than 5MB");
      setTimeout(() => setErrorMessage(""), 4000);
      return;
    }

    setSelectedAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setSuccessMessage("New avatar selected. Click Save to upload.");
    setTimeout(() => setSuccessMessage(""), 3000);
    e.target.value = "";
  };

  const handleRemoveAvatarPreview = () => {
    setSelectedAvatarFile(null);
    const originalAvatar =
      profileData?.data?.avatar || reduxUser?.avatar || null;
    setAvatarPreview(originalAvatar);
    setSuccessMessage("Avatar selection cancelled.");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // client/src/pages/ProfilePage.jsx - Fixed handleSave function

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage("");

    try {
      // Upload avatar first if changed
      if (selectedAvatarFile) {
        const avatarFormData = new FormData();
        avatarFormData.append("avatar", selectedAvatarFile);
        const uploadResult = await uploadAvatar(avatarFormData).unwrap();

        if (uploadResult.success) {
          dispatch(updateUser({ avatar: uploadResult.data.avatar }));
        }
      }

      // Update profile - ONLY send allowed fields
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        currentRole: formData.currentRole,
        experience: formData.experience,
        bio: formData.bio,
        skills: formData.skills,
        socialLinks: formData.socialLinks,
        preferredJobType: formData.preferredJobType,
        expectedSalary: formData.expectedSalary,
      };

      // ✅ Remove any undefined or empty string fields that might cause issues
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] === undefined || updateData[key] === null) {
          delete updateData[key];
        }
      });

      const result = await updateProfile(updateData).unwrap();

      if (result.success) {
        // Update Redux state with all profile data
        const updatedUserData = {
          name: formData.name,
          phone: formData.phone,
          location: formData.location,
          currentRole: formData.currentRole,
          experience: formData.experience,
          bio: formData.bio,
          skills: formData.skills,
          socialLinks: formData.socialLinks,
          preferredJobType: formData.preferredJobType,
          expectedSalary: formData.expectedSalary,
          isProfileComplete: result.data?.isProfileComplete === true, // ✅ Ensure boolean
        };

        dispatch(updateUser(updatedUserData));

        setSuccessMessage(result.message || "Profile updated successfully!");
        setIsEditing(false);
        setSelectedAvatarFile(null);
        refetch();

        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Save error:", error);
      const errorMsg =
        error?.data?.message || error?.message || "Failed to update profile";
      setErrorMessage(errorMsg);
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setIsSaving(false);
    }
  };
  const handleCancel = () => {
    const userData = profileData?.data || reduxUser;
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        location: userData.location || "",
        currentRole: userData.currentRole || "",
        experience: userData.experience || "",
        preferredJobType: userData.preferredJobType || "full-time",
        expectedSalary: userData.expectedSalary || "",
        bio: userData.bio || "",
        skills: userData.skills || [],
        socialLinks: {
          linkedin: userData.socialLinks?.linkedin || "",
          github: userData.socialLinks?.github || "",
          portfolio: userData.socialLinks?.portfolio || "",
        },
      });
      setAvatarPreview(userData.avatar || null);
    }
    setSelectedAvatarFile(null);
    setShowSkillInput(false);
    setIsEditing(false);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const calculateProfileCompleteness = () => {
    let filled = 0;
    const total = 8;
    if (reduxUser?.name && reduxUser.name.trim()) filled++;
    if (reduxUser?.email && reduxUser.email.trim()) filled++;
    if (reduxUser?.phone && reduxUser.phone.trim()) filled++;
    if (reduxUser?.location && reduxUser.location.trim()) filled++;
    if (reduxUser?.currentRole && reduxUser.currentRole.trim()) filled++;
    if (
      reduxUser?.experience &&
      reduxUser.experience !== "" &&
      reduxUser.experience !== "0 years"
    )
      filled++;
    if (reduxUser?.skills && reduxUser.skills.length >= 3) filled++;
    if (reduxUser?.resumeUrl && reduxUser.resumeUrl !== "") filled++;
    return Math.round((filled / total) * 100);
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Your Profile</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            Account{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Settings
            </span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Manage your personal information, preferences, and professional
            details
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center justify-end gap-3">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-gray-300 dark:border-gray-600"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-purple-600 to-indigo-600"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-700">{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
            <X className="w-5 h-5 text-red-600" />
            <span className="text-red-700">{errorMessage}</span>
          </div>
        )}

        {/* Profile Progress */}
        <ProfileProgress user={reduxUser} userType="jobseeker" />

        {/* Profile Header Card */}
        <div className="bg-white dark:bg-gray-800/80 rounded-2xl border shadow-sm overflow-hidden">
          <div className="px-8 pt-8 pb-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar Section */}
              <div className="relative group flex-shrink-0">
                <div
                  className={`w-32 h-32 rounded-full border-4 border-white dark:border-gray-700 shadow-xl flex-shrink-0 ${
                    isEditing ? "cursor-pointer" : ""
                  }`}
                  onClick={isEditing ? handleAvatarClick : undefined}
                >
                  <OptimizedAvatar 
                    src={avatarPreview} 
                    alt={formData.name} 
                    fallbackText={formData.name?.charAt(0)?.toUpperCase() || "?"}
                    className="w-full h-full text-5xl"
                    size={300}
                  />
                </div>

                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleAvatarChange}
                  className="hidden"
                />

                {isEditing && (
                  <div className="absolute -bottom-2 -right-2 flex gap-1.5">
                    <button
                      type="button"
                      onClick={handleAvatarClick}
                      className="w-9 h-9 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                    {selectedAvatarFile && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatarPreview}
                        className="w-9 h-9 bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    )}
                  </div>
                )}

                {isEditing && (
                  <div
                    className="absolute inset-0 w-32 h-32 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200 cursor-pointer"
                    onClick={handleAvatarClick}
                  >
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    {isEditing ? (
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="text-2xl font-bold mb-2"
                        placeholder="Your Name"
                      />
                    ) : (
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formData.name || "Your Name"}
                      </h2>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>{formData.location || "Your Location"}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant="outline"
                        className="text-xs px-3 py-1 border-purple-200 text-purple-700 bg-purple-50 gap-1.5"
                      >
                        <Lock className="w-3 h-3" />
                        <span className="capitalize">{reduxUser?.role}</span>
                      </Badge>
                      <span className="text-xs text-gray-400">
                        Role cannot be changed
                      </span>
                    </div>
                  </div>
                  <Badge variant="primary" className="text-sm px-4 py-1.5">
                    {formData.skills.length >= 3 ? "Verified" : "Basic Member"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800/30 dark:to-gray-800/80">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Contact Information
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                      Full Name
                    </label>
                    {isEditing ? (
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {formData.name || "Not set"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                      Email Address
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {formData.email || "Not set"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {formData.phone || "Not set"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                      Location
                    </label>
                    {isEditing ? (
                      <Input
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {formData.location || "Not set"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800/30 dark:to-gray-800/80">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Professional Information
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                      Job Title
                    </label>
                    {isEditing ? (
                      <Input
                        name="currentRole"
                        value={formData.currentRole}
                        onChange={handleInputChange}
                        placeholder="e.g., Software Engineer"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {formData.currentRole || "Not set"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                      Years of Experience
                    </label>
                    {isEditing ? (
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:text-white"
                      >
                        <option value="">Select Experience</option>
                        <option value="Fresher">Fresher (0 years)</option>
                        <option value="1 year">1 year</option>
                        <option value="2 years">2 years</option>
                        <option value="3 years">3 years</option>
                        <option value="4 years">4 years</option>
                        <option value="5 years">5 years</option>
                        <option value="5+ years">5+ years</option>
                        <option value="10+ years">10+ years</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {formData.experience || "Not set"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                      Preferred Job Type
                    </label>
                    {isEditing ? (
                      <select
                        name="preferredJobType"
                        value={formData.preferredJobType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:text-white"
                      >
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="freelance">Freelance</option>
                        <option value="internship">Internship</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 dark:text-white capitalize">
                        {formData.preferredJobType || "Not set"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                      Expected Salary
                    </label>
                    {isEditing ? (
                      <Input
                        name="expectedSalary"
                        value={formData.expectedSalary}
                        onChange={handleInputChange}
                        placeholder="e.g., $80,000/year"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {formData.expectedSalary || "Not set"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none dark:text-white"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {formData.bio || "No bio provided"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800/30 dark:to-gray-800/80">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Social Profiles
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Link2 className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <div className="flex-1">
                      {isEditing ? (
                        <Input
                          placeholder="LinkedIn URL"
                          value={formData.socialLinks.linkedin}
                          onChange={(e) =>
                            handleSocialChange("linkedin", e.target.value)
                          }
                        />
                      ) : formData.socialLinks.linkedin ? (
                        <a
                          href={formData.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 dark:text-gray-400 hover:text-purple-600 truncate block"
                        >
                          {formData.socialLinks.linkedin}
                        </a>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">
                          Not set
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Code className="w-5 h-5 text-gray-800 dark:text-gray-300 flex-shrink-0" />
                    <div className="flex-1">
                      {isEditing ? (
                        <Input
                          placeholder="GitHub URL"
                          value={formData.socialLinks.github}
                          onChange={(e) =>
                            handleSocialChange("github", e.target.value)
                          }
                        />
                      ) : formData.socialLinks.github ? (
                        <a
                          href={formData.socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 dark:text-gray-400 hover:text-purple-600 truncate block"
                        >
                          {formData.socialLinks.github}
                        </a>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">
                          Not set
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ExternalLink className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                    <div className="flex-1">
                      {isEditing ? (
                        <Input
                          placeholder="Portfolio URL"
                          value={formData.socialLinks.portfolio}
                          onChange={(e) =>
                            handleSocialChange("portfolio", e.target.value)
                          }
                        />
                      ) : formData.socialLinks.portfolio ? (
                        <a
                          href={formData.socialLinks.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 dark:text-gray-400 hover:text-purple-600 truncate block"
                        >
                          {formData.socialLinks.portfolio}
                        </a>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">
                          Not set
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Skills Section */}
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800/30 dark:to-gray-800/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Technical Skills
                    </h3>
                  </div>
                  {isEditing && !showSkillInput && (
                    <button
                      onClick={() => setShowSkillInput(true)}
                      className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Skill
                    </button>
                  )}
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="primary"
                      className="text-sm px-3 py-1.5 gap-1"
                    >
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-1 text-purple-400 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                  {formData.skills.length === 0 && !isEditing && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No skills added yet
                    </p>
                  )}
                  {formData.skills.length === 0 && isEditing && (
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      Add skills to improve your profile visibility
                    </p>
                  )}
                </div>
                {isEditing && showSkillInput && (
                  <div className="flex gap-2 mt-3">
                    <Input
                      placeholder="Enter skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddSkill();
                        if (e.key === "Escape") setShowSkillInput(false);
                      }}
                      className="flex-1"
                      autoFocus
                    />
                    <Button size="sm" onClick={handleAddSkill}>
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setShowSkillInput(false);
                        setNewSkill("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Completion Card */}
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700/50 bg-gradient-to-r from-purple-50/30 to-indigo-50/30 dark:from-purple-900/20 dark:to-indigo-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Profile Completion
                    </h3>
                  </div>
                  <Badge variant="primary" className="text-sm">
                    {calculateProfileCompleteness()}%
                  </Badge>
                </div>
              </div>
              <div className="p-6">
                <ProgressBar
                  value={calculateProfileCompleteness()}
                  variant="primary"
                  showPercentage={false}
                />
                <div className="mt-4 space-y-2">
                  {[
                    { key: "name", label: "Full Name" },
                    { key: "email", label: "Email Address" },
                    { key: "phone", label: "Phone Number" },
                    { key: "location", label: "Location" },
                    { key: "currentRole", label: "Job Title" },
                    { key: "skills", label: "Skills (min 3)", isArray: true },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-2 text-sm"
                    >
                      {item.isArray ? (
                        formData.skills.length >= 3 ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                        )
                      ) : formData[item.key] ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                      )}
                      <span className="text-gray-600 dark:text-gray-400">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
