// client/src/pages/marketing/FeaturesPage.jsx
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Sparkles,
  Target,
  TrendingUp,
  Award,
  Users,
  MessageSquare,
  BarChart3,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
  FileText,
  Brain,
  Rocket,
  Code,
  Database,
  Globe,
  Clock,
} from "lucide-react";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Badge } from "../../components/Badge";

export function FeaturesPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const mainFeatures = [
    {
      icon: Sparkles,
      title: "AI Resume Parsing",
      description:
        "Upload your resume and watch our AI instantly extract every detail with industry-leading accuracy.",
      features: [
        "Supports PDF, DOC, DOCX, and TXT formats",
        "99% accuracy in skill extraction",
        "Automatic experience calculation",
        "Project and certification detection",
        "Multi-language support",
        "Instant processing (under 5 seconds)",
      ],
      color: "from-purple-500 to-indigo-500",
      bg: "from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30",
    },
    {
      icon: Target,
      title: "Smart Job Matching",
      description:
        "Get personalized job recommendations powered by advanced AI algorithms that understand your unique profile.",
      features: [
        "AI-powered match scoring (up to 96% accuracy)",
        "Real-time job database updates",
        "Location and remote work filtering",
        "Salary range matching",
        "Company culture compatibility",
        "Career growth potential analysis",
      ],
      color: "from-blue-500 to-cyan-500",
      bg: "from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
    },
    {
      icon: TrendingUp,
      title: "Skill Gap Analysis",
      description:
        "Identify exactly what skills you need to learn to qualify for your dream job.",
      features: [
        "Compare your skills vs. job requirements",
        "Priority-ranked skill recommendations",
        "Market demand insights",
        "Learning resource suggestions",
        "Progress tracking",
        "Skill endorsement system",
      ],
      color: "from-emerald-500 to-teal-500",
      bg: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30",
    },
    {
      icon: Award,
      title: "Personalized Learning Roadmaps",
      description:
        "AI-generated 30-day learning plans customized to your goals and current skill level.",
      features: [
        "Week-by-week structured plans",
        "Curated learning resources",
        "Video courses and tutorials",
        "Practice projects and exercises",
        "Progress milestones",
        "Certificate opportunities",
      ],
      color: "from-amber-500 to-orange-500",
      bg: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30",
    },
    {
      icon: Users,
      title: "Recruiter Dashboard",
      description:
        "Advanced tools for recruiters to find, rank, and manage top talent efficiently.",
      features: [
        "AI-powered candidate ranking",
        "Bulk job posting",
        "Advanced filtering and search",
        "Hiring pipeline management",
        "Team collaboration tools",
        "Analytics and reporting",
      ],
      color: "from-pink-500 to-rose-500",
      bg: "from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30",
    },
    {
      icon: MessageSquare,
      title: "Real-Time Notifications",
      description:
        "Stay informed with instant updates about job matches, messages, and application status.",
      features: [
        "Job match alerts",
        "Recruiter message notifications",
        "Application status updates",
        "Skill gap reminders",
        "Learning milestone celebrations",
        "Customizable notification preferences",
      ],
      color: "from-sky-500 to-blue-500",
      bg: "from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30",
    },
  ];

  const additionalFeatures = [
    {
      icon: Brain,
      title: "AI Career Assistant",
      description:
        "Chat with our AI to get personalized career advice, resume tips, and job search strategies.",
      badge: "New",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: FileText,
      title: "Resume Builder",
      description:
        "Create professional, ATS-optimized resumes with AI-powered suggestions and templates.",
      badge: "Popular",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: BarChart3,
      title: "Career Analytics",
      description:
        "Track your job search progress, application success rate, and skill development over time.",
      badge: "Advanced",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description:
        "Enterprise-grade encryption and data protection. Your information is always safe and private.",
      badge: "Secure",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Zap,
      title: "Fast Processing",
      description:
        "Lightning-fast AI processing means you get results in seconds, not hours.",
      badge: "Fast",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: Rocket,
      title: "API Access",
      description:
        "Integrate SkillSync AI into your own applications with our developer-friendly API.",
      badge: "Developer",
      color: "from-sky-500 to-blue-500",
    },
  ];

  const techStack = [
    {
      name: "Frontend",
      technologies: ["React 18", "TypeScript", "Tailwind CSS", "Redux Toolkit"],
      icon: Code,
      color: "from-purple-500 to-indigo-500",
    },
    {
      name: "Backend",
      technologies: ["Node.js", "Express.js", "MongoDB", "Mongoose"],
      icon: Database,
      color: "from-emerald-500 to-teal-500",
    },
    {
      name: "AI/ML",
      technologies: ["Gemini AI", "OpenAI API", "NLP", "ML Algorithms"],
      icon: Brain,
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Real-time",
      technologies: ["Socket.io", "WebSockets", "Redis", "Event-driven"],
      icon: Globe,
      color: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
      {/* Ambient background for light mode glass effect */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-purple-200/40 dark:bg-purple-900/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-indigo-200/40 dark:bg-indigo-900/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Badge variant="primary" className="mb-6 px-4 py-2 text-sm gap-2">
            <Sparkles className="w-4 h-4" />
            Platform Features
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Powerful Features for
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Career Success
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Everything you need to find your dream job, bridge skill gaps, and
            accelerate your career growth—all powered by advanced AI.
          </p>
          <Button onClick={() => navigate(isAuthenticated ? "/app/dashboard" : "/auth")} size="lg" className="gap-2">
            {isAuthenticated ? "Go to Dashboard" : "Get Started"}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Main Features */}
        <div className="space-y-24">
          {mainFeatures.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  i % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-5 shadow-md`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-5">
                    {feature.description}
                  </p>
                  <div className="space-y-2.5">
                    {feature.features.map((item, j) => (
                      <div key={j} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <Card
                  className={`${i % 2 === 1 ? "lg:order-1" : ""} p-8 bg-gradient-to-br ${feature.bg} border border-gray-200 dark:border-gray-700/50 shadow-sm`}
                >
                  <div className="aspect-square flex items-center justify-center">
                    <div className="text-center">
                      <div
                        className={`w-24 h-24 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}
                      >
                        <Icon className="w-12 h-12 text-white" />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Feature Preview
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Additional Features */}
        <div className="mt-32">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              More Powerful Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Additional tools to supercharge your job search and career
              development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card key={i} className="p-5 hover:shadow-2xl transition-all duration-300 border border-white/60 dark:border-purple-900/50 bg-white/60 dark:bg-gray-900/50 backdrop-blur-2xl hover:-translate-y-1 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none group">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-sm`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <Badge variant="primary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-32">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Built with Modern Technologies
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              A full-stack MERN application powered by AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((stack, i) => {
              const Icon = stack.icon;
              return (
                <Card key={i} className="p-5 text-center hover:shadow-2xl transition-all duration-300 border border-white/60 dark:border-purple-900/50 bg-white/60 dark:bg-gray-900/50 backdrop-blur-2xl hover:-translate-y-1 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stack.color} flex items-center justify-center mx-auto mb-3 shadow-md`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    {stack.name}
                  </h3>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {stack.technologies.map((tech, j) => (
                      <span
                        key={j}
                        className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20">
          <Card className="relative overflow-hidden p-12 border border-purple-100 dark:border-purple-900/50 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
            {/* Background glowing orbs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-3xl -z-10" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="text-center md:text-left max-w-2xl">
                <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-white">
                  Unlock Your Career Potential
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Stop applying in the dark. Let our AI features guide you to your next big opportunity with data-driven insights.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Button
                  onClick={() => navigate(isAuthenticated ? "/app/dashboard" : "/auth")}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 border-transparent gap-2"
                >
                  {isAuthenticated ? "Access Features" : "Start Free Trial"} <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
