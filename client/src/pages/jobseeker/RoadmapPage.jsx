// client/src/pages/RoadmapPage.jsx
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
  Sparkles,
  ChevronRight,
  Rocket,
  Zap,
  Star,
} from "lucide-react";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";

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

  const totalWeeks = roadmap.length;
  const completedWeeks = roadmap.filter((w) => w.status === "completed").length;
  const totalTasks = roadmap.reduce((acc, w) => acc + w.tasks.length, 0);
  const completedTasks = roadmap.reduce(
    (acc, w) => acc + w.tasks.filter((t) => t.completed).length,
    0,
  );
  const totalHours = roadmap.reduce(
    (acc, w) => acc + w.tasks.reduce((sum, t) => sum + parseInt(t.duration), 0),
    0,
  );

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

  const overallProgress = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm mb-4 dark:bg-purple-900/30 dark:text-purple-400">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Learning Path</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 dark:text-white">
            Your{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Learning Roadmap
            </span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto dark:text-gray-400">
            A personalized 30-day plan to master in-demand skills and accelerate
            your career
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-5 shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <Badge variant="success" className="text-xs">
                {completedWeeks}/{totalWeeks}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {completedWeeks}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Weeks Completed
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-5 shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Target className="w-5 h-5 text-white" />
              </div>
              <Badge variant="primary" className="text-xs">
                {completedTasks}/{totalTasks}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {completedTasks}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Tasks Completed
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-5 shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <Badge variant="warning" className="text-xs">
                {totalHours}h
              </Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalHours}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Learning Hours
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-5 shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <Badge variant="info" className="text-xs">
                {overallProgress}%
              </Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {30 - completedWeeks * 7}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Days Remaining
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-6 shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Overall Progress
              </h3>
            </div>
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {overallProgress}%
            </span>
          </div>
          <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="flex justify-between mt-3 text-xs text-gray-400 dark:text-gray-500">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-7 lg:left-9 top-0 bottom-0 w-0.5 rounded-full" />

          <div className="space-y-8">
            {roadmap.map((week, index) => {
              const StatusIcon = getStatusIcon(week.status);
              const completedTasks = week.tasks.filter(
                (t) => t.completed,
              ).length;
              const progressPercentage =
                (completedTasks / week.tasks.length) * 100;
              const isCompleted = week.status === "completed";
              const isInProgress = week.status === "in-progress";

              return (
                <div key={week.week} className="relative group">
                  <div className="flex flex-col lg:flex-row gap-5">
                    {/* Week Badge */}
                    <div className="relative z-10 flex-shrink-0 lg:w-48">
                      <div className="flex items-center gap-4 lg:flex-col lg:items-start">
                        <div
                          className={`
                          w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105
                          ${isCompleted ? "bg-gradient-to-r from-emerald-500 to-teal-600" : ""}
                          ${isInProgress ? "bg-gradient-to-r from-amber-500 to-orange-600" : ""}
                          ${!isCompleted && !isInProgress ? "bg-gradient-to-r from-gray-500 to-gray-600" : ""}
                        `}
                        >
                          <StatusIcon className="w-7 h-7 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm text-gray-400 dark:text-gray-500">
                            Week {week.week}
                          </div>
                          <div className="font-semibold text-gray-900 dark:text-white text-lg">
                            {week.title}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Week Content */}
                    <div className="flex-1">
                      <Card className="p-6 border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={getStatusColor(week.status)}
                              className="capitalize"
                            >
                              {week.status === "in-progress"
                                ? "In Progress"
                                : week.status === "completed"
                                  ? "Completed"
                                  : "Upcoming"}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span>
                                {week.tasks.reduce(
                                  (sum, t) => sum + parseInt(t.duration),
                                  0,
                                )}{" "}
                                hours total
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Progress
                            </span>
                            <span className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                              {Math.round(progressPercentage)}%
                            </span>
                          </div>
                        </div>

                        <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full mb-5">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isCompleted
                                ? "bg-emerald-500"
                                : isInProgress
                                  ? "bg-amber-500"
                                  : "bg-gray-400 dark:bg-gray-600"
                            }`}
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>

                        {/* Tasks */}
                        <div className="space-y-2 mb-5">
                          {week.tasks.map((task, i) => (
                            <div
                              key={i}
                              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                                task.completed
                                  ? "bg-emerald-50/50 dark:bg-emerald-950/30"
                                  : "bg-gray-50 dark:bg-gray-800/50"
                              }`}
                            >
                              {task.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                              ) : (
                                <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                              )}
                              <span
                                className={`flex-1 text-sm ${
                                  task.completed
                                    ? "line-through text-gray-400 dark:text-gray-500"
                                    : "text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {task.title}
                              </span>
                              <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {task.duration}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                          <div className="flex flex-wrap gap-2">
                            <BookOpen className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5" />
                            {week.skills.map((skill) => (
                              <Badge
                                key={skill}
                                variant="primary"
                                className="text-xs gap-1"
                              >
                                <Code className="w-3 h-3" /> {skill}
                              </Badge>
                            ))}
                          </div>
                          {week.status !== "completed" && (
                            <Button
                              size="sm"
                              className={`gap-1 ${
                                isInProgress
                                  ? "bg-amber-600 hover:bg-amber-700"
                                  : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                              }`}
                            >
                              {isInProgress
                                ? "Continue Learning"
                                : "Start Week"}
                              <ChevronRight className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completion Reward Card */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 rounded-2xl p-8 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                  Complete Your Journey
                  <Sparkles className="w-5 h-5" />
                </h3>
                <p className="text-white/90 max-w-md">
                  Finish all weeks to earn an official certificate and unlock
                  premium job matches
                </p>
              </div>
            </div>
            <Button className="bg-white text-purple-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all px-6 gap-2 group">
              <Rocket className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              View Certificate
            </Button>
          </div>
        </div>

        {/* Motivational Tip */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-5 shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-100 to-amber-100 flex items-center justify-center dark:from-yellow-900/30 dark:to-amber-900/30">
              <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                💡{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  Pro Tip:
                </span>{" "}
                Consistency is key! Just 1-2 hours daily will help you complete
                this roadmap in 30 days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
