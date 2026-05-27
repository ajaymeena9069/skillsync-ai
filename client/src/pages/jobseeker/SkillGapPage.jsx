// client/src/pages/SkillGapPage.jsx
import { useState } from "react";
import {
  TrendingUp,
  Target,
  BookOpen,
  Video,
  FileText,
  ExternalLink,
  CheckCircle2,
  Circle,
  Sparkles,
  ChevronRight,
  Award,
  Clock,
  AlertCircle,
  Zap,
} from "lucide-react";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { ProgressBar } from "../../components/ProgressBar";

export function SkillGapPage() {
  const [selectedSkill, setSelectedSkill] = useState(null);

  const currentSkills = [
    { name: "React", level: 90, category: "Frontend" },
    { name: "TypeScript", level: 85, category: "Languages" },
    { name: "Node.js", level: 75, category: "Backend" },
    { name: "CSS/Tailwind", level: 80, category: "Frontend" },
    { name: "Git", level: 85, category: "Tools" },
    { name: "JavaScript", level: 95, category: "Languages" },
  ];

  const missingSkills = [
    { name: "AWS", importance: "High", demand: 95, category: "Cloud" },
    { name: "Docker", importance: "High", demand: 90, category: "DevOps" },
    { name: "GraphQL", importance: "Medium", demand: 75, category: "Backend" },
    {
      name: "Kubernetes",
      importance: "Medium",
      demand: 70,
      category: "DevOps",
    },
    { name: "MongoDB", importance: "Low", demand: 65, category: "Database" },
  ];

  const recommendations = [
    {
      skill: "AWS",
      resources: [
        {
          type: "Course",
          title: "AWS Certified Solutions Architect",
          platform: "Udemy",
          duration: "12 hours",
        },
        {
          type: "Article",
          title: "AWS Fundamentals Guide",
          platform: "AWS Docs",
          duration: "2 hours",
        },
        {
          type: "Video",
          title: "AWS Complete Tutorial",
          platform: "YouTube",
          duration: "4 hours",
        },
      ],
    },
    {
      skill: "Docker",
      resources: [
        {
          type: "Course",
          title: "Docker Mastery",
          platform: "Udemy",
          duration: "8 hours",
        },
        {
          type: "Article",
          title: "Docker Best Practices",
          platform: "Docker Docs",
          duration: "1 hour",
        },
      ],
    },
  ];

  const marketReadiness = Math.round(
    (currentSkills.length / (currentSkills.length + missingSkills.length)) *
      100,
  );

  const getImportanceColor = (importance) => {
    switch (importance) {
      case "High":
        return "from-red-500 to-rose-600";
      case "Medium":
        return "from-amber-500 to-orange-600";
      default:
        return "from-emerald-500 to-teal-600";
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm mb-4 dark:bg-purple-900/30 dark:text-purple-400">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Analysis</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 dark:text-white">
            Skill Gap{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Analysis
            </span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto dark:text-gray-400">
            Identify and bridge the gaps between your current skills and market
            demands
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-6 shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <Badge variant="success" className="text-xs">
                Mastered
              </Badge>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {currentSkills.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Current Skills
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-6 shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-white" />
              </div>
              <Badge variant="warning" className="text-xs">
                To Learn
              </Badge>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {missingSkills.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Skills to Learn
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-6 shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <Badge variant="primary" className="text-xs">
                Ready
              </Badge>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {marketReadiness}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Market Readiness
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Skills Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-sm overflow-hidden dark:bg-gray-800/80 dark:border-gray-700/50">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-emerald-50/30 to-teal-50/30 dark:from-emerald-950/20 dark:to-teal-950/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Your Current Skills
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Skills you've already mastered
                    </p>
                  </div>
                </div>
                <Badge variant="success" className="text-sm px-3 py-1">
                  {currentSkills.length} Skills
                </Badge>
              </div>
            </div>
            <div className="p-6 space-y-5">
              {currentSkills.map((skill, index) => (
                <div
                  key={skill.name}
                  className="group animate-in fade-in slide-in-from-bottom duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400"></div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {skill.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="default"
                        className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      >
                        {skill.category}
                      </Badge>
                      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        {skill.level}%
                      </span>
                    </div>
                  </div>
                  <ProgressBar
                    value={skill.level}
                    showPercentage={false}
                    variant="success"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Skills Gap Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-sm overflow-hidden dark:bg-gray-800/80 dark:border-gray-700/50">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-amber-50/30 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Skills Gap Identified
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Skills to focus on for career growth
                    </p>
                  </div>
                </div>
                <Badge variant="warning" className="text-sm px-3 py-1">
                  {missingSkills.length} Missing
                </Badge>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {missingSkills.map((skill, index) => (
                <div
                  key={skill.name}
                  className="group cursor-pointer"
                  onClick={() => setSelectedSkill(skill.name)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400"></div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {skill.name}
                      </span>
                    </div>
                    <Badge
                      className={`bg-gradient-to-r ${getImportanceColor(skill.importance)} text-white text-xs px-2 py-1`}
                    >
                      {skill.importance} Priority
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span>{skill.category}</span>
                    <span>Market Demand: {skill.demand}%</span>
                  </div>
                  <ProgressBar
                    value={skill.demand}
                    showPercentage={false}
                    variant="warning"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Learning Resources Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-sm overflow-hidden dark:bg-gray-800/80 dark:border-gray-700/50">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-50/30 to-cyan-50/30 dark:from-blue-950/20 dark:to-cyan-950/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center shadow-md">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recommended Learning Resources
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Curated courses and materials to bridge your skill gaps
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-8">
            {recommendations.map((rec, idx) => (
              <div key={rec.skill} className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {rec.skill}
                  </h3>
                  <Badge variant="primary" className="text-xs">
                    Focus Area
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rec.resources.map((resource, i) => (
                    <div
                      key={i}
                      className="group bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center flex-shrink-0">
                          {resource.type === "Course" && (
                            <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          )}
                          {resource.type === "Video" && (
                            <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          )}
                          {resource.type === "Article" && (
                            <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Badge
                            variant="primary"
                            className="mb-2 text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400"
                          >
                            {resource.type}
                          </Badge>
                          <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-1 line-clamp-2">
                            {resource.title}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {resource.platform}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              {resource.duration}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3 gap-1 border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                      >
                        Start Learning <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Roadmap CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Ready to Start Learning?
                </h3>
                <p className="text-white/90 max-w-md">
                  We've created a personalized 30-day roadmap to help you master
                  these skills and accelerate your career.
                </p>
              </div>
            </div>
            <Button className="bg-white text-purple-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all px-6 gap-2">
              View AI Roadmap <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Pro Tips Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 p-6 shadow-sm dark:bg-gray-800/80 dark:border-gray-700/50">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Pro Tips for Skill Development
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Focus on High Demand Skills
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Prioritize skills with 80%+ market demand
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Learn by Doing
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Build projects to reinforce learning
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Track Your Progress
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Set weekly learning goals
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
