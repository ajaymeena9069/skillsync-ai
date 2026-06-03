// client/src/pages/marketing/AboutPage.jsx
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Target,
  Code,
  TrendingUp,
  Award,
  Rocket,
  Heart,
  Globe,
  Zap,
  CheckCircle2,
  ArrowRight,
  Brain,
  Users,
  Sparkles,
  GitBranch,
  Link,
  Shield,
  Clock,
  BarChart3,
  Briefcase,
  FileText,
  MessageSquare,
} from "lucide-react";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Badge } from "../../components/Badge";
import contactInfo from "../../data/contactInfo.json";

export function AboutPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const problems = [
    {
      icon: Target,
      title: "Career Guidance Gap",
      description:
        "Many job seekers struggle to identify which skills they need to develop for their target roles.",
      color: "from-red-500 to-rose-500",
    },
    {
      icon: TrendingUp,
      title: "Skill Mismatch",
      description:
        "Traditional job boards don't provide personalized skill gap analysis or learning recommendations.",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Users,
      title: "Hiring Inefficiency",
      description:
        "Recruiters spend hours manually reviewing resumes and ranking candidates without AI assistance.",
      color: "from-blue-500 to-cyan-500",
    },
  ];

  const solutions = [
    {
      icon: Sparkles,
      title: "AI Resume Parsing",
      description:
        "Automatically extract skills, experience, and qualifications from any resume format with high accuracy.",
    },
    {
      icon: Target,
      title: "Smart Job Matching",
      description:
        "Match candidates with relevant opportunities based on their skills, experience, and career goals.",
    },
    {
      icon: TrendingUp,
      title: "Skill Gap Analysis",
      description:
        "Identify missing skills and provide actionable recommendations to bridge the gap.",
    },
    {
      icon: Rocket,
      title: "Personalized Roadmaps",
      description:
        "Generate custom learning plans with curated resources and weekly milestones.",
    },
    {
      icon: Users,
      title: "Recruiter Tools",
      description:
        "AI-powered candidate ranking and filtering to streamline the hiring process.",
    },
    {
      icon: Globe,
      title: "Real-Time Updates",
      description:
        "Instant notifications for job matches, messages, and application status changes.",
    },
  ];

  const techStack = [
    { name: "React 18", icon: "⚛️", color: "from-cyan-500 to-blue-500" },
    { name: "Node.js", icon: "🟢", color: "from-green-500 to-emerald-500" },
    { name: "Express.js", icon: "🚂", color: "from-gray-500 to-gray-700" },
    { name: "MongoDB", icon: "🍃", color: "from-green-600 to-emerald-600" },
    { name: "Tailwind CSS", icon: "🎨", color: "from-sky-500 to-blue-500" },
    { name: "Redux Toolkit", icon: "🔄", color: "from-purple-500 to-pink-500" },
    { name: "RTK Query", icon: "⚡", color: "from-indigo-500 to-purple-500" },
    { name: "JWT Auth", icon: "🔐", color: "from-amber-500 to-orange-500" },
    { name: "Socket.io", icon: "📡", color: "from-gray-600 to-gray-800" },
    { name: "Gemini AI", icon: "🧠", color: "from-purple-600 to-indigo-600" },
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure Authentication",
      desc: "JWT with refresh tokens & Google OAuth",
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      desc: "Live notifications & chat",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      desc: "Track applications & views",
    },
    {
      icon: Briefcase,
      title: "Job Management",
      desc: "Post, edit & manage jobs",
    },
    {
      icon: FileText,
      title: "Resume Parsing",
      desc: "AI-powered skill extraction",
    },
    {
      icon: MessageSquare,
      title: "AI Match Analysis",
      desc: "Smart candidate scoring",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
      {/* Ambient background for light mode glass effect */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-purple-200/40 dark:bg-purple-900/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-indigo-200/40 dark:bg-indigo-900/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-indigo-500/10" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="primary" className="mb-6 px-4 py-2 text-sm gap-2">
            <Sparkles className="w-4 h-4" />
            About This Project
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Built to Solve
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Real Career Challenges
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            SkillSync AI is a full-stack MERN application that combines AI
            integration with modern web technologies to create a meaningful
            career development platform.
          </p>
          <div className="mt-8">
            <Button
              onClick={() => navigate(isAuthenticated ? "/app/dashboard" : "/auth")}
              size="lg"
              className="gap-2"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started"} <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Problems Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Problems We're Solving
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Addressing real challenges in career development and recruitment
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {problems.map((problem, i) => {
              const Icon = problem.icon;
              return (
                <Card
                  key={i}
                  className="p-6 text-center group hover:shadow-2xl transition-all duration-300 border border-white/60 dark:border-purple-900/50 bg-white/60 dark:bg-gray-900/50 backdrop-blur-2xl hover:-translate-y-1 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none"
                >
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-r ${problem.color} flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {problem.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {problem.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Solutions Section */}
      <div className="py-16 bg-white/50 dark:bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Smart features that power the platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((solution, i) => {
              const Icon = solution.icon;
              return (
                <div
                  key={i}
                  className="flex gap-3 p-4 rounded-xl border border-white/60 dark:border-purple-900/50 bg-white/60 dark:bg-gray-900/50 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {solution.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {solution.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Technology Stack
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Built with modern, production-grade technologies
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {techStack.map((tech, i) => (
              <div
                key={i}
                className="bg-white/60 dark:bg-gray-900/50 backdrop-blur-2xl rounded-xl p-4 text-center border border-white/60 dark:border-purple-900/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`text-3xl mb-2 bg-gradient-to-r ${tech.color} bg-clip-text text-transparent`}
                >
                  {tech.icon}
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {tech.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white/50 dark:bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Key Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Production-ready implementation
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="flex gap-3 p-4 rounded-xl border border-white/60 dark:border-purple-900/50 bg-white/60 dark:bg-gray-900/50 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Project Vision Card */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 md:p-12 relative overflow-hidden border border-purple-100 dark:border-purple-900/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl shadow-xl">
            {/* Background glowing orbs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -z-10" />
            <div className="max-w-3xl mx-auto text-center">
              <Brain className="w-16 h-16 text-purple-600 dark:text-purple-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Project Vision
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                SkillSync AI demonstrates the integration of modern web
                technologies with artificial intelligence to solve real-world
                career development challenges. It showcases proficiency in
                building production-grade full-stack applications with complex
                features including AI integration, real-time communication, and
                advanced data processing.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Badge variant="primary" className="px-3 py-1">
                  MERN Stack
                </Badge>
                <Badge variant="success" className="px-3 py-1">
                  AI-Powered
                </Badge>
                <Badge variant="warning" className="px-3 py-1">
                  Real-Time
                </Badge>
                <Badge variant="info" className="px-3 py-1">
                  Production Ready
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="relative overflow-hidden p-12 text-center border border-purple-100 dark:border-purple-900/50 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
            {/* Background glowing orbs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -z-10" />

            <div className="max-w-3xl mx-auto relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Join Our Mission
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Be part of the next generation of career development. Whether you're looking for your next role or looking to hire top talent, SkillSync AI is built for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate(isAuthenticated ? "/app/dashboard" : "/auth")}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 border-transparent gap-2"
                >
                  {isAuthenticated ? "Enter Workspace" : "Join SkillSync AI"} <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800/50 dark:text-purple-300 dark:hover:bg-purple-900/20 hover:scale-105 transition-all duration-300 gap-2"
                  onClick={() => window.open(contactInfo.socialLinks.github.url, "_blank")}
                >
                  <GitBranch className="w-5 h-5 mr-1" />
                  Contribute on GitHub
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
