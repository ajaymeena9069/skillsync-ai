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
} from "lucide-react";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Badge } from "../../components/Badge";

export function AboutPage({ onGetStarted }) {
  const problems = [
    {
      icon: Target,
      title: "Career Guidance Gap",
      description:
        "Many job seekers struggle to identify which skills they need to develop for their target roles.",
    },
    {
      icon: TrendingUp,
      title: "Skill Mismatch",
      description:
        "Traditional job boards don't provide personalized skill gap analysis or learning recommendations.",
    },
    {
      icon: Users,
      title: "Hiring Inefficiency",
      description:
        "Recruiters spend hours manually reviewing resumes and ranking candidates without AI assistance.",
    },
  ];

  const solutions = [
    {
      title: "AI Resume Parsing",
      description:
        "Automatically extract skills, experience, and qualifications from any resume format with 99% accuracy.",
    },
    {
      title: "Smart Job Matching",
      description:
        "Match candidates with relevant opportunities based on their skills, experience, and career goals.",
    },
    {
      title: "Skill Gap Analysis",
      description:
        "Identify missing skills and provide actionable recommendations to bridge the gap.",
    },
    {
      title: "Personalized Roadmaps",
      description:
        "Generate custom 30-day learning plans with curated resources and weekly milestones.",
    },
    {
      title: "Recruiter Tools",
      description:
        "AI-powered candidate ranking and filtering to streamline the hiring process.",
    },
    {
      title: "Real-Time Updates",
      description:
        "Instant notifications for job matches, messages, and application status changes.",
    },
  ];

  const technologies = [
    {
      category: "Frontend",
      items: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    },
    {
      category: "Backend",
      items: ["Node.js", "Express.js", "MongoDB", "Mongoose"],
    },
    {
      category: "AI/ML",
      items: ["OpenAI API", "Natural Language Processing", "Machine Learning"],
    },
    {
      category: "Real-Time",
      items: ["Socket.io", "Redis", "WebSockets", "Event-Driven Architecture"],
    },
    { category: "Authentication", items: ["JWT", "bcrypt", "Secure Sessions"] },
    { category: "Tools", items: ["Git", "Docker", "Postman", "VS Code"] },
  ];

  const features = [
    "Production-ready full-stack application",
    "RESTful API design",
    "Real-time communication",
    "Secure authentication & authorization",
    "AI-powered matching algorithms",
    "Responsive UI/UX design",
    "MongoDB database design",
    "Clean code architecture",
  ];

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <Badge variant="primary" className="mb-6 px-4 py-2">
            <Code className="w-4 h-4 mr-1" />
            About This Project
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Built to Solve
            <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Real Career Challenges
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            SkillSync AI is a full-stack MERN application that demonstrates
            advanced web development capabilities combined with AI integration
            to create a meaningful career development platform.
          </p>
        </div>

        <Card className="p-8 md:p-12 mb-20 bg-gradient-to-br from-accent/50 to-background">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Project Vision
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  SkillSync AI was created to showcase the integration of modern
                  web technologies with artificial intelligence to solve
                  real-world career development challenges.
                </p>
                <p>
                  This project demonstrates proficiency in building
                  production-grade full-stack applications with complex features
                  including AI integration, real-time communication, and
                  advanced data processing.
                </p>
                <p>
                  The platform addresses three key problems: lack of
                  personalized career guidance, skill mismatch in job
                  applications, and inefficient hiring processes for recruiters.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
              <Card className="relative aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-8">
                <div className="text-center">
                  <Brain className="w-24 h-24 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
                  <p className="text-sm text-muted-foreground">
                    MERN Stack Project
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </Card>

        <div className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Problems Being Solved
            </h2>
            <p className="text-xl text-muted-foreground">
              Addressing real challenges in career development and recruitment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {problems.map((problem, i) => {
              const Icon = problem.icon;
              return (
                <Card key={i} className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-destructive/10 to-warning/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-destructive" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-center">
                    {problem.title}
                  </h3>
                  <p className="text-muted-foreground text-center">
                    {problem.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Solution Features
            </h2>
            <p className="text-xl text-muted-foreground">
              How SkillSync AI addresses these challenges
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((solution, i) => (
              <Card key={i} className="p-6">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle2 className="w-6 h-6 text-success mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      {solution.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {solution.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Technology Stack
            </h2>
            <p className="text-xl text-muted-foreground">
              Built with modern, production-grade technologies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((tech, i) => (
              <Card key={i} className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  {tech.category}
                </h3>
                <div className="space-y-2">
                  {tech.items.map((item, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span className="text-sm text-muted-foreground">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-20 bg-accent/30 rounded-3xl p-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Key Implementations
            </h2>
            <p className="text-xl text-muted-foreground">
              Demonstrating full-stack development expertise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/10 to-secondary/10">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Project Goals
              </h2>
              <div className="space-y-4 text-muted-foreground mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-success mt-1 flex-shrink-0" />
                  <p>
                    <strong>Technical Excellence:</strong> Demonstrate
                    proficiency in building complex, scalable full-stack
                    applications
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-success mt-1 flex-shrink-0" />
                  <p>
                    <strong>AI Integration:</strong> Showcase ability to
                    integrate AI APIs and implement intelligent features
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-success mt-1 flex-shrink-0" />
                  <p>
                    <strong>Real-World Application:</strong> Build something
                    that solves actual problems in career development
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-success mt-1 flex-shrink-0" />
                  <p>
                    <strong>Portfolio Quality:</strong> Create a
                    production-ready application that demonstrates job-readiness
                  </p>
                </div>
              </div>
              <Button size="lg" onClick={onGetStarted}>
                Try the Platform
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </Card>
        </div>

        <Card className="p-12 bg-gradient-to-br from-primary via-primary/90 to-secondary text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Connect & Collaborate
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Interested in the technical implementation or want to collaborate on
            similar projects?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
            >
              <GitBranch className="w-5 h-5 mr-2" />
              View on GitHub
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <Link className="w-5 h-5 mr-2" />
              Connect on LinkedIn
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
