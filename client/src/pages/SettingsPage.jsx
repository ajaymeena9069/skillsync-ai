import { useState } from "react";
import { Settings, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useUpgradeDeveloperMutation, useGetMeQuery } from "../services/authApi";

export function SettingsPage() {
  const { data: userData } = useGetMeQuery();
  const user = userData?.data;
  const [adminKey, setAdminKey] = useState("");
  const [upgradeDeveloper, { isLoading }] = useUpgradeDeveloperMutation();
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleUpgrade = async (e) => {
    e.preventDefault();
    if (!adminKey.trim()) return;

    try {
      setStatus({ type: "", message: "" });
      const result = await upgradeDeveloper({ adminKey }).unwrap();
      if (result.success) {
        setStatus({ type: "success", message: "Successfully upgraded to Developer Account!" });
        setAdminKey("");
      }
    } catch (err) {
      setStatus({ type: "error", message: err?.data?.message || "Invalid Developer Key" });
    }
  };

  return (
    <div className="min-h-screen dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          badge="Settings"
          title="Account"
          gradientText="Settings"
          description="Manage your account preferences and settings"
        />
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Developer Access</h3>
            
            {user?.isDeveloper ? (
              <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="font-medium text-purple-900 dark:text-purple-300">Developer Account Active</p>
                  <p className="text-sm text-purple-700/80 dark:text-purple-400/80">You have unlimited access to all AI features.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpgrade} className="max-w-md space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Upgrade to a developer account to get unlimited access to all AI features without any rate limits.
                </p>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      value={adminKey}
                      onChange={(e) => setAdminKey(e.target.value)}
                      placeholder="Enter Developer Key"
                      type="password"
                      icon={<Zap className="w-4 h-4" />}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isLoading || !adminKey.trim()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isLoading ? "Verifying..." : "Upgrade"}
                    {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
                </div>
                {status.message && (
                  <p className={`text-sm ${status.type === "success" ? "text-green-600" : "text-red-600"}`}>
                    {status.message}
                  </p>
                )}
              </form>
            )}
          </div>
          
          <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-6">
            <p className="text-gray-600 dark:text-gray-400">
              More settings coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
