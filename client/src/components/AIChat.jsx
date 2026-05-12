import { useState } from "react";
import { X, Send, Sparkles, User } from "lucide-react";
import { Card } from "./Card";
import { Button } from "./Button";

export function AIChat({ isOpen, onClose }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content: "Hello! I'm your AI career assistant. How can I help you today?",
      time: "10:00 AM",
    },
    {
      id: 2,
      type: "user",
      content: "What skills should I focus on to get a job at Google?",
      time: "10:01 AM",
    },
    {
      id: 3,
      type: "ai",
      content:
        "Based on your profile and current Google job openings, I recommend focusing on:\n\n1. **System Design** - Many senior roles require strong architecture skills\n2. **Advanced TypeScript** - Google uses TypeScript extensively\n3. **Cloud Technologies** - Particularly GCP and Kubernetes\n\nWould you like me to create a learning roadmap for these skills?",
      time: "10:01 AM",
    },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        type: "user",
        content: message,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setMessage("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: "ai",
          content:
            "I'm analyzing your request. This is a demo response. In a real application, this would connect to an AI backend.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed right-0 bottom-0 sm:right-4 sm:bottom-4 h-full sm:h-[600px] w-full sm:w-96 bg-card border sm:rounded-2xl shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary to-secondary text-white sm:rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold">AI Career Assistant</h2>
              <p className="text-xs text-white/80">Always here to help</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.type === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.type === "ai"
                    ? "bg-gradient-to-br from-primary to-secondary"
                    : "bg-accent"
                }`}
              >
                {msg.type === "ai" ? (
                  <Sparkles className="w-4 h-4 text-white" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <div
                className={`flex-1 max-w-[80%] ${msg.type === "user" ? "flex justify-end" : ""}`}
              >
                <Card
                  className={`p-3 ${
                    msg.type === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-accent"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                  <p
                    className={`text-xs mt-2 ${
                      msg.type === "user"
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {msg.time}
                  </p>
                </Card>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-2.5 bg-accent border border-border rounded-xl
                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <Button onClick={handleSend}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setMessage("Help me improve my resume")}
              className="px-3 py-1.5 text-xs bg-accent hover:bg-accent/80 rounded-lg transition-colors"
            >
              Resume help
            </button>
            <button
              onClick={() => setMessage("Find me jobs")}
              className="px-3 py-1.5 text-xs bg-accent hover:bg-accent/80 rounded-lg transition-colors"
            >
              Find jobs
            </button>
            <button
              onClick={() => setMessage("Create a roadmap")}
              className="px-3 py-1.5 text-xs bg-accent hover:bg-accent/80 rounded-lg transition-colors"
            >
              Roadmap
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
