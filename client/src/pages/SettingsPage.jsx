// client/src/pages/SettingsPage.jsx
import { Settings } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";

export function SettingsPage() {
  return (
    <div className="min-h-screen dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          badge="Settings"
          title="Account"
          gradientText="Settings"
          description="Manage your account preferences and settings"
        />
        <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6">
          <p className="text-gray-600 dark:text-gray-400">
            Settings page coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
