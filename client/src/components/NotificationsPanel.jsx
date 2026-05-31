import { useState } from "react";
import {
  X,
  Briefcase,
  MessageSquare,
  TrendingUp,
  Award,
  Bell,
  ExternalLink,
  Check,
  Circle,
  Trash2,
  Loader2,
} from "lucide-react";
import { Card } from "./Card";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} from "../services/notificationApi";
import { AnimatePresence, motion } from "framer-motion";

export function NotificationsPanel({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { data: notificationsData, isLoading } = useGetNotificationsQuery(undefined, {
    skip: !isOpen,
  });
  
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const notifications = notificationsData?.data || [];

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    if (notification.link && notification.link.startsWith("/")) {
      navigate(notification.link);
      onClose();
    }
  };

  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      setDeletingId(id);
      await deleteNotification(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-card border-l border-border shadow-2xl z-50 flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {isLoading ? (
            <div className="text-center p-4 text-gray-500">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => {
              let Icon = Bell;
              if (notification.type === "application_submitted" || notification.type === "application_status") Icon = Briefcase;
              else if (notification.type === "profile_view") Icon = TrendingUp;

              return (
                <Card
                  key={notification._id}
                  className={`p-4 cursor-pointer transition-colors dark:bg-gray-800 dark:border-gray-700 ${
                    !notification.isRead ? "border-purple-200 bg-purple-50/50 dark:border-purple-900/50 dark:bg-purple-900/20" : ""
                  }`}
                  hover
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        !notification.isRead
                          ? "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className={`font-semibold text-sm ${!notification.isRead ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-300"}`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-purple-600 dark:bg-purple-500 rounded-full flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, notification._id)}
                      disabled={deletingId === notification._id}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors disabled:opacity-50"
                      title="Delete notification"
                    >
                      {deletingId === notification._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <Button variant="outline" className="w-full" onClick={handleMarkAllRead}>
              Mark All as Read
            </Button>
          </div>
        )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
