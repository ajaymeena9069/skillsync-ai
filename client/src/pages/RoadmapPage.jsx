import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Target,
  TrendingUp,
  BookOpen,
  Code,
  Award,
} from "lucide-react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";

export function RoadmapPage() {
  const roadmap = [
    {
      week: 1,
      title: "AWS Fundamentals",
      status: "completed",
      tasks: [
        {
          title: "Complete AWS Cloud Practitioner course",
          completed: true,
          duration: "4h",
        },
        {
          title: "Set up AWS account and explore console",
          completed: true,
          duration: "2h",
        },
        { title: "Deploy first EC2 instance", completed: true, duration: "3h" },
        { title: "Practice with S3 buckets", completed: true, duration: "2h" },
      ],
      skills: ["AWS", "Cloud Computing", "EC2", "S3"],
    },
    {
      week: 2,
      title: "Docker Basics",
      status: "in-progress",
      tasks: [
        {
          title: "Docker fundamentals course",
          completed: true,
          duration: "3h",
        },
        { title: "Create first Dockerfile", completed: true, duration: "2h" },
        { title: "Build and run containers", completed: false, duration: "3h" },
        { title: "Docker Compose tutorial", completed: false, duration: "2h" },
      ],
      skills: ["Docker", "Containers", "DevOps"],
    },
    {
      week: 3,
      title: "Advanced Docker & AWS Integration",
      status: "upcoming",
      tasks: [
        {
          title: "Deploy Docker containers to AWS ECS",
          completed: false,
          duration: "4h",
        },
        { title: "Learn Docker networking", completed: false, duration: "3h" },
        {
          title: "Container orchestration basics",
          completed: false,
          duration: "3h",
        },
        { title: "Build CI/CD pipeline", completed: false, duration: "4h" },
      ],
      skills: ["AWS ECS", "Docker", "CI/CD"],
    },
    {
      week: 4,
      title: "GraphQL & API Design",
      status: "upcoming",
      tasks: [
        { title: "GraphQL fundamentals", completed: false, duration: "3h" },
        { title: "Build GraphQL server", completed: false, duration: "4h" },
        { title: "Integrate with React", completed: false, duration: "3h" },
        {
          title: "Best practices and optimization",
          completed: false,
          duration: "2h",
        },
      ],
      skills: ["GraphQL", "API Design", "Apollo"],
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "in-progress":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return CheckCircle2;
      case "in-progress":
        return Clock;
      default:
        return Circle;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Learning Roadmap</h1>
          <p className="text-muted-foreground mt-1">
            Your personalized 30-day learning plan
          </p>
        </div>
        <Button>
          <Calendar className="w-4 h-4" />
          Export Calendar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
          </div>
          <div className="text-2xl font-bold">1/4</div>
          <div className="text-sm text-muted-foreground">Weeks Completed</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="text-2xl font-bold">8/16</div>
          <div className="text-sm text-muted-foreground">Tasks Completed</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning" />
            </div>
          </div>
          <div className="text-2xl font-bold">42h</div>
          <div className="text-sm text-muted-foreground">Learning Time</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-info/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-info" />
            </div>
          </div>
          <div className="text-2xl font-bold">21</div>
          <div className="text-sm text-muted-foreground">Days Remaining</div>
        </Card>
      </div>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-8">
          {roadmap.map((week) => {
            const StatusIcon = getStatusIcon(week.status);
            const completedTasks = week.tasks.filter((t) => t.completed).length;
            const progressPercentage =
              (completedTasks / week.tasks.length) * 100;

            return (
              <div key={week.week} className="relative">
                <div className="flex gap-6">
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                        week.status === "completed"
                          ? "bg-success text-success-foreground"
                          : week.status === "in-progress"
                            ? "bg-warning text-warning-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <StatusIcon className="w-8 h-8" />
                    </div>
                  </div>

                  <Card className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-xl font-semibold">
                            Week {week.week}
                          </h2>
                          <Badge variant={getStatusColor(week.status)}>
                            {week.status === "in-progress"
                              ? "In Progress"
                              : week.status === "completed"
                                ? "Completed"
                                : "Upcoming"}
                          </Badge>
                        </div>
                        <h3 className="text-lg text-muted-foreground">
                          {week.title}
                        </h3>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground mb-1">
                          Progress
                        </div>
                        <div className="text-2xl font-bold">
                          {Math.round(progressPercentage)}%
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-2 bg-muted rounded-full mb-4">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          week.status === "completed"
                            ? "bg-success"
                            : week.status === "in-progress"
                              ? "bg-warning"
                              : "bg-muted-foreground"
                        }`}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>

                    <div className="space-y-2 mb-4">
                      {week.tasks.map((task, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-3 p-3 rounded-xl ${
                            task.completed ? "bg-success/5" : "bg-muted/50"
                          }`}
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          )}
                          <span
                            className={`flex-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}
                          >
                            {task.title}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {task.duration}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {week.skills.map((skill) => (
                          <Badge key={skill} variant="primary">
                            <Code className="w-3 h-3 mr-1" />
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      {week.status !== "completed" && (
                        <Button size="sm">
                          {week.status === "in-progress"
                            ? "Continue"
                            : "Start Week"}
                        </Button>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Card className="p-6 bg-gradient-to-br from-primary via-primary/90 to-secondary text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">
                Complete Roadmap Reward
              </h3>
              <p className="text-sm text-white/90">
                Earn a certificate and unlock premium job matches
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            Learn More
          </Button>
        </div>
      </Card>
    </div>
  );
}
