import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MessageSquare, Star, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../components/Button";
import { FeedbackModal } from "../../components/common/FeedbackModal";
import { useGetAllPublicTestimonialsQuery } from "../../services/testimonialApi";
import { OptimizedAvatar } from "../../components/common/OptimizedAvatar";
import { PageLoader } from "../../components/PageLoader";

const formatRelativeTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return `Just now`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
};

export function TestimonialsPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const { data: testimonialsRes, isLoading } = useGetAllPublicTestimonialsQuery();
  const testimonials = testimonialsRes?.data || [];

  const handleSubmitFeedback = () => {
    if (isAuthenticated) {
      setIsFeedbackModalOpen(true);
    } else {
      toast.error("Please login to submit feedback", {
        action: {
          label: "Login",
          onClick: () => navigate("/auth"),
        },
      });
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Community Voices</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            What Our{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Community Says
            </span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Real stories from job seekers and recruiters who transformed their hiring experience with SkillSync AI.
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mb-12">
          <Button
            onClick={handleSubmitFeedback}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-2.5 text-base gap-2"
          >
            <Plus className="w-4 h-4" />
            Share Your Feedback
          </Button>
        </div>

        {/* Testimonials – clean comment list */}
        {testimonials.length > 0 ? (
          <div className="space-y-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial._id}
                className="group bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50 p-6 transition-all duration-300 hover:shadow-md animate-in fade-in slide-in-from-bottom duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <OptimizedAvatar
                    src={testimonial.avatar?.startsWith("http") ? testimonial.avatar : null}
                    alt={testimonial.name}
                    fallbackText={testimonial.name?.charAt(0)?.toUpperCase() || "👤"}
                    size={48}
                    className="w-12 h-12 rounded-full ring-2 ring-purple-500/30 dark:ring-purple-400/30 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    {/* Author & rating row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
                          {testimonial.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {testimonial.role}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < (testimonial.rating || 5)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300 dark:text-gray-700"
                                }`}
                            />
                          ))}
                        </div>
                        {testimonial.createdAt && (
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {formatRelativeTime(testimonial.createdAt)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {testimonial.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No feedback yet</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              Be the first to share your experience and help others discover SkillSync AI.
            </p>
            <Button
              onClick={handleSubmitFeedback}
              className="mt-6 bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Share Your Feedback
            </Button>
          </div>
        )}
      </div>

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
    </div>
  );
}