import { Outlet } from "react-router-dom";
import { Toaster } from "../components/ui/Toaster";

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
      <Toaster />
    </div>
  );
}
