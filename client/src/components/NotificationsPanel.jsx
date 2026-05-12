import {
  X,
  Briefcase,
  MessageSquare,
  TrendingUp,
  Award,
  Bell,
} from "lucide-react";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Button } from "./Button";

export function NotificationsPanel({ isOpen, onClose }) {
  const notifications = [
    {
      id: 1,
      type: "job",
      icon: Briefcase,
      title: "New Job Match",
      message: "Senior React Developer at Google matches your profile 96%",
      time: "5 minutes ago",
      unread: true,
    },
    {
      id: 2,
      type: "message",
      icon: MessageSquare,
      title: "New Message",
      message: "Recruiter from Meta sent you a message",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      type: "skill",
      icon: TrendingUp,
      title: "Skill Gap Update",
      message: "Complete AWS course to improve your match score",
      time: "2 hours ago",
      unread: false,
    },
    {
      id: 4,
      type: "achievement",
      icon: Award,
      title: "Achievement Unlocked",
      message: "Completed Week 1 of your learning roadmap",
      time: "1 day ago",
      unread: false,
    },
    {
      id: 5,
      type: "job",
      icon: Briefcase,
      title: "Application Update",
      message: "Your application to Netflix was viewed",
      time: "2 days ago",
      unread: false,
    },
  ];

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-card border-l border-border shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {notifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <Card
                key={notification.id}
                className={`p-4 cursor-pointer ${
                  notification.unread ? "border-primary/50 bg-primary/5" : ""
                }`}
                hover
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      notification.type === "job"
                        ? "bg-primary/10"
                        : notification.type === "message"
                          ? "bg-info/10"
                          : notification.type === "skill"
                            ? "bg-warning/10"
                            : "bg-success/10"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        notification.type === "job"
                          ? "text-primary"
                          : notification.type === "message"
                            ? "text-info"
                            : notification.type === "skill"
                              ? "text-warning"
                              : "text-success"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-sm">
                        {notification.title}
                      </h3>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="p-4 border-t border-border">
          <Button variant="outline" className="w-full">
            Mark All as Read
          </Button>
        </div>
      </div>
    </>
  );
}
