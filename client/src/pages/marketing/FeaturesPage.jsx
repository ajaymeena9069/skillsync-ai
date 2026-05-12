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
} from "lucide-react";
import { Button  } from "../../components/Button";
import { Card } from "../../components/Card";
import { Badge } from "../../components/Badge";

export function FeaturesPage({ onGetStarted }) {
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
      color: "from-primary to-primary/80",
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
      color: "from-secondary to-secondary/80",
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
      color: "from-warning to-warning/80",
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
      color: "from-success to-success/80",
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
      color: "from-info to-info/80",
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
      color: "from-primary to-secondary",
    },
  ];

  const additionalFeatures = [
    {
      icon: Brain,
      title: "AI Career Assistant",
      description:
        "Chat with our AI to get personalized career advice, resume tips, and job search strategies.",
      badge: "New",
    },
    {
      icon: FileText,
      title: "Resume Builder",
      description:
        "Create professional, ATS-optimized resumes with AI-powered suggestions and templates.",
      badge: "Popular",
    },
    {
      icon: BarChart3,
      title: "Career Analytics",
      description:
        "Track your job search progress, application success rate, and skill development over time.",
      badge: "Pro",
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description:
        "Enterprise-grade encryption and data protection. Your information is always safe and private.",
      badge: "Secure",
    },
    {
      icon: Zap,
      title: "Fast Processing",
      description:
        "Lightning-fast AI processing means you get results in seconds, not hours.",
      badge: "Fast",
    },
    {
      icon: Rocket,
      title: "API Access",
      description:
        "Integrate SkillSync AI into your own applications with our developer-friendly API.",
      badge: "Developer",
    },
  ];

  const techStack = [
    {
      name: "Frontend",
      technologies: ["React", "TypeScript", "Tailwind CSS"],
      icon: Brain,
    },
    {
      name: "Backend",
      technologies: ["Node.js", "Express", "MongoDB"],
      icon: Rocket,
    },
    {
      name: "AI/ML",
      technologies: [
        "OpenAI API",
        "Natural Language Processing",
        "ML Algorithms",
      ],
      icon: Sparkles,
    },
    {
      name: "Real-time",
      technologies: ["Socket.io", "Redis", "WebSockets"],
      icon: Zap,
    },
  ];

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Badge variant="primary" className="mb-6 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-1" />
            Platform Features
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Powerful Features for
            <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Career Success
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Everything you need to find your dream job, bridge skill gaps, and
            accelerate your career growth—all powered by advanced AI.
          </p>
          <Button size="lg" onClick={onGetStarted}>
            Start Free Trial
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        <div className="space-y-24">
          {mainFeatures.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
              >
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {feature.title}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    {feature.description}
                  </p>
                  <div className="space-y-3">
                    {feature.features.map((item, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Card
                  className={`${i % 2 === 1 ? "lg:order-1" : ""} p-8 bg-gradient-to-br ${feature.color} text-white`}
                >
                  <div className="aspect-square flex items-center justify-center">
                    <div className="text-center">
                      <Icon className="w-24 h-24 mx-auto mb-4 opacity-80" />
                      <p className="text-lg opacity-90">Feature Preview</p>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        <div className="mt-32">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              More Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground">
              Additional tools to supercharge your job search and career
              development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card key={i} hover className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant="primary">{feature.badge}</Badge>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="mt-32">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Built with Modern Technologies
            </h2>
            <p className="text-xl text-muted-foreground">
              A full-stack MERN application powered by AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((stack, i) => {
              const Icon = stack.icon;
              return (
                <Card key={i} className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{stack.name}</h3>
                  <div className="space-y-2">
                    {stack.technologies.map((tech, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <span className="text-sm text-muted-foreground">
                          {tech}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="mt-20">
          <Card className="p-12 bg-gradient-to-br from-primary via-primary/90 to-secondary text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Experience AI-Powered Career Matching
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Upload your resume and discover how AI can help advance your
              career
            </p>
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
              onClick={onGetStarted}
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
