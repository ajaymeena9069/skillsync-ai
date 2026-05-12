import {
  ArrowRight,
  CheckCircle2,
  Star,
  Sparkles,
  Upload,
  Target,
  TrendingUp,
  Award,
  MessageSquare,
  Users,
  Clock,
  Zap,
  Shield,
  BarChart3,
  ChevronDown,
} from "lucide-react";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Badge } from "../../components/Badge";

export function LandingPage({ onGetStarted }) {
  const stats = [
    { value: "99%", label: "Resume Parsing Accuracy", icon: Sparkles },
    { value: "96%", label: "Smart Job Match Score", icon: Target },
    { value: "AI-Powered", label: "Skill Gap Analysis", icon: TrendingUp },
    { value: "Real-Time", label: "Candidate Ranking", icon: Users },
  ];

  const features = [
    {
      icon: Sparkles,
      title: "AI Resume Parsing",
      description:
        "Instantly extract skills, experience, and qualifications from any resume format with 99% accuracy.",
    },
    {
      icon: Target,
      title: "Smart Job Matching",
      description:
        "Get personalized job recommendations with AI-powered match scores up to 96% accuracy.",
    },
    {
      icon: TrendingUp,
      title: "Skill Gap Analysis",
      description:
        "Identify missing skills and get actionable insights to bridge the gap between you and your dream job.",
    },
    {
      icon: Award,
      title: "Learning Roadmaps",
      description:
        "AI-generated 30-day learning plans with curated resources to master in-demand skills.",
    },
    {
      icon: Users,
      title: "Recruiter Dashboard",
      description:
        "Advanced candidate ranking and filtering tools powered by AI to find perfect matches.",
    },
    {
      icon: MessageSquare,
      title: "Real-Time Notifications",
      description:
        "Stay updated with instant alerts for new job matches, messages, and application updates.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Upload Resume",
      description: "Simply drag and drop your resume in any format",
      icon: Upload,
    },
    {
      number: "02",
      title: "AI Extracts Skills",
      description: "Our AI analyzes and extracts your skills and experience",
      icon: Sparkles,
    },
    {
      number: "03",
      title: "Match Jobs",
      description: "Get personalized job matches with accuracy scores",
      icon: Target,
    },
    {
      number: "04",
      title: "Improve Skills",
      description: "Follow AI-generated roadmaps to close skill gaps",
      icon: TrendingUp,
    },
    {
      number: "05",
      title: "Get Hired",
      description: "Apply with confidence and land your dream job",
      icon: Award,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Full Stack Developer",
      avatar: "👩",
      content:
        "The AI resume parsing instantly identified my key skills and suggested relevant job matches. The skill gap analysis helped me focus on what to learn next.",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      role: "Frontend Developer",
      avatar: "👨",
      content:
        "The personalized learning roadmap is exactly what I needed. It breaks down complex skills into manageable weekly goals with curated resources.",
      rating: 5,
    },
    {
      name: "Emily Thompson",
      role: "Tech Recruiter",
      avatar: "👩",
      content:
        "The recruiter dashboard with AI-powered candidate ranking saves time. Being able to filter and rank candidates by skill match is incredibly useful.",
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: "How does the AI matching work?",
      answer:
        "Our AI analyzes your resume, skills, and experience, then compares them against thousands of job postings to find the best matches based on requirements, company culture, and career growth potential.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Absolutely. We use enterprise-grade encryption and never share your personal information without your explicit consent. Your data is stored securely and you have full control over your privacy settings.",
    },
    {
      question: "How accurate is the skill gap analysis?",
      answer:
        "Our AI has been trained on millions of job postings and resumes, achieving 95% accuracy in identifying skill gaps. We continuously improve our algorithms based on real hiring outcomes.",
    },
    {
      question: "Can I use this as a recruiter?",
      answer:
        "Yes! We offer specialized recruiter accounts with advanced features like candidate ranking, bulk job posting, and analytics dashboards to streamline your hiring process.",
    },
    {
      question: "What file formats do you support?",
      answer:
        "We support PDF, DOC, DOCX, and TXT formats. Our AI can parse resumes in any standard format with high accuracy.",
    },
    {
      question: "Is there a free plan?",
      answer:
        "Yes, we offer a free plan with basic features including resume analysis and job matching. Premium plans unlock advanced features like unlimited applications and priority support.",
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-accent/30 to-background pt-20 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(79,70,229,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(139,92,246,0.1),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <Badge variant="primary" className="mb-6 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-1" />
              Powered by Advanced AI
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              AI-Powered
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Career Growth Platform
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Upload your resume, discover relevant opportunities, analyze skill
              gaps, and get a personalized roadmap to advance your career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={onGetStarted}
                className="text-lg px-8 py-6"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={onGetStarted}
                className="text-lg px-8 py-6"
              >
                Upload Resume
                <Upload className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Free to use • AI-powered insights • Portfolio project by MERN
              developer
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl" />
            <Card className="relative overflow-hidden border-2 border-primary/20 shadow-2xl">
              <div className="aspect-video bg-gradient-to-br from-accent via-background to-accent/50 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-lg text-muted-foreground">
                    Dashboard Preview
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
              Platform Capabilities
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="primary" className="mb-4">
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {" "}
                Transform Your Career
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Powerful AI-driven features designed to help you find the perfect
              job and grow your skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card key={i} hover className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
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
      </section>

      <section className="py-24 bg-accent/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="primary" className="mb-4">
              How It Works
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Your Journey to
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {" "}
                Career Success
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Five simple steps to transform your career with AI-powered
              insights
            </p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary -translate-y-1/2 opacity-20" />

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <Card
                    key={i}
                    className="relative p-6 text-center hover:shadow-lg transition-shadow"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                      {step.number}
                    </div>
                    <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="primary" className="mb-4">
              Testimonials
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Loved by Job Seekers
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {" "}
                & Recruiters
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Real feedback from users experiencing AI-powered career
              development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-warning text-warning"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6">
                  {testimonial.content}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-accent/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="primary" className="mb-4">
              FAQ
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about SkillSync AI
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <Card key={i} className="p-6">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-muted-foreground ml-7">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="relative overflow-hidden p-12 bg-gradient-to-br from-primary via-primary/90 to-secondary text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="relative text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Start Your Career Journey Today
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Experience the power of AI-driven career development and skill
                matching
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90"
                  onClick={onGetStarted}
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={onGetStarted}
                >
                  Upload Resume
                  <Upload className="w-5 h-5 ml-2" />
                </Button>
              </div>
              <div className="flex items-center justify-center gap-6 mt-8 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Free to use
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  AI-powered matching
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Instant results
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
