import { useState } from "react";
import { useForm } from "react-hook-form";
import { X, Send, FileText } from "lucide-react";
import { Button } from "./Button";
import { useApplyForJobMutation } from "../services/applicationApi";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

export function ApplyModal({ isOpen, onClose, job }) {
  const [applyForJob, { isLoading }] = useApplyForJobMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      coverLetter: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await applyForJob({
        jobId: job._id,
        coverLetter: data.coverLetter,
      }).unwrap();

      toast.success("Application submitted successfully!");
      reset();
      onClose();
    } catch (error) {
      toast.error(error.data?.message || "Failed to submit application");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Apply for {job?.title}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">{job?.company}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-4">
            {/* Resume Info */}
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                    Your resume will be submitted automatically
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">
                    Make sure your resume is up to date
                  </p>
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cover Letter *
              </label>
              <textarea
                {...register("coverLetter", {
                  required: "Cover letter is required",
                  minLength: {
                    value: 50,
                    message: "Cover letter must be at least 50 characters",
                  },
                  maxLength: {
                    value: 2000,
                    message: "Cover letter cannot exceed 2000 characters",
                  },
                })}
                rows={6}
                placeholder="Why are you interested in this role? What makes you a great fit? (Minimum 50 characters)"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.coverLetter
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-gray-200 dark:border-gray-700 focus:border-purple-500"
                } bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none`}
              />
              {errors.coverLetter && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.coverLetter.message}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                Minimum 50 characters - Show your enthusiasm!
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Application
            </Button>
          </div>
        </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
