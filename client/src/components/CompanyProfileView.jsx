// client/src/components/CompanyProfileView.jsx
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Users,
  Calendar,
  Link2,
  Share2,
  Code,
  Heart,
  Shield,
  Zap,
  Loader2,
} from "lucide-react";
import { Badge } from "./Badge";
import { OptimizedAvatar } from "./common/OptimizedAvatar";

export function CompanyProfileView({ company, recruiterName, isLoading }) {
  const companyData = company || {};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div>
          <span className="inline-block px-3 py-1 text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 rounded-full mb-3">
            Company Profile
          </span>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              {companyData.name || "Company"}
            </span>
          </h1>
          {recruiterName && (
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              by {recruiterName}
            </p>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Header Card */}
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
              <div className="px-6 pt-6 pb-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Logo */}
                  <div className="flex-shrink-0">
                    <div className="w-28 h-28 rounded-full shadow-lg">
                      <OptimizedAvatar 
                        src={companyData.logo} 
                        alt={companyData.name} 
                        fallbackText={companyData.name?.charAt(0)?.toUpperCase()}
                        className="w-full h-full border-4 border-gray-200 dark:border-gray-700 text-4xl"
                        size={300}
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {companyData.name || "Company Name"}
                    </h2>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />{" "}
                        {companyData.location || "Location not set"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" /> Founded{" "}
                        {companyData.founded || "N/A"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />{" "}
                        {companyData.size || "Size not set"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-200 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800/30 dark:to-gray-800/80">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Contact Information
                </h3>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <Mail className="w-5 h-5 text-gray-400 dark:text-gray-500" />{" "}
                    {companyData.email || "Not set"}
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <Phone className="w-5 h-5 text-gray-400 dark:text-gray-500" />{" "}
                    {companyData.phone || "Not set"}
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <Globe className="w-5 h-5 text-gray-400 dark:text-gray-500" />{" "}
                    {companyData.website ? (
                      <a
                        href={companyData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-purple-600"
                      >
                        {companyData.website}
                      </a>
                    ) : (
                      "Not set"
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <Building2 className="w-5 h-5 text-gray-400 dark:text-gray-500" />{" "}
                    {companyData.industry || "Not set"}
                  </div>
                </div>
              </div>
            </div>

            {/* About Company */}
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-200 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800/30 dark:to-gray-800/80">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  About the Company
                </h3>
              </div>
              <div className="p-5 space-y-5">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {companyData.description || "No description provided"}
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
                      {companyData.mission || "Not specified"}
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
                      {companyData.vision || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Social Links */}
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-200 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800/30 dark:to-gray-800/80">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Connect With Us
                </h3>
              </div>
              <div className="p-5 space-y-3">
                {[
                  {
                    platform: "linkedin",
                    icon: Link2,
                    color: "text-blue-600",
                    bg: "bg-blue-50",
                    label: "LinkedIn",
                  },
                  {
                    platform: "twitter",
                    icon: Share2,
                    color: "text-sky-500",
                    bg: "bg-sky-50",
                    label: "Twitter",
                  },
                  {
                    platform: "github",
                    icon: Code,
                    color: "text-gray-700",
                    bg: "bg-gray-100",
                    label: "GitHub",
                  },
                ].map(({ platform, icon: Icon, color, bg, label }) => (
                  <div key={platform} className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}
                    >
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    {companyData.socialLinks?.[platform] ? (
                      <a
                        href={companyData.socialLinks[platform]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors truncate"
                      >
                        {label}
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400 dark:text-gray-500">
                        Not set
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-200 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800/30 dark:to-gray-800/80">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Benefits & Perks
                </h3>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  {(companyData.benefits || []).length > 0 ? (
                    companyData.benefits.map((benefit) => (
                      <Badge
                        key={benefit}
                        variant="primary"
                        className="text-sm px-3 py-1.5 gap-1"
                      >
                        <Zap className="w-3 h-3" /> {benefit}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No benefits listed
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Culture */}
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-200 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800/30 dark:to-gray-800/80">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Company Culture
                </h3>
              </div>
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {companyData.culture || "No culture description provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
