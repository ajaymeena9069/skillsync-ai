import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { MarketingNavbar } from "../components/MarketingNavbar";
import { MarketingFooter } from "../components/MarketingFooter";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "../components/common/PageTransition";

export function MarketingLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPage = location.pathname.slice(1) || "home";

  const handleNavigate = (page) => {
    navigate(page === "home" ? "/" : `/${page}`);
  };

  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <>
      <MarketingNavbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onGetStarted={handleGetStarted}
      />
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>
          <Outlet />
        </PageTransition>
      </AnimatePresence>
      <MarketingFooter onNavigate={handleNavigate} />
    </>
  );
}
