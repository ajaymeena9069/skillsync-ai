// client/src/components/common/ConfirmationModal.jsx
import { X, Loader2 } from "lucide-react";
import { Button } from "../Button";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  status,
  isLoading,
}) {
  const getStatusColor = () => {
    switch (status) {
      case "rejected":
        return "bg-red-600 hover:bg-red-700";
      case "hired":
        return "bg-emerald-600 hover:bg-emerald-700";
      case "shortlisted":
        return "bg-purple-600 hover:bg-purple-700";
      default:
        return "bg-blue-600 hover:bg-blue-700";
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 w-full max-w-md z-[10000]"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-white/10">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {title}
                  </h3>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={onConfirm}
                    className={`flex-1 text-white ${getStatusColor()}`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Confirming...
                      </span>
                    ) : (
                      "Confirm"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
