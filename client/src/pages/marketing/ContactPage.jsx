import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Send,
  Clock,
  Link,
  Share2,
  GitBranch,
  HelpCircle,
  Briefcase,
  Users,
} from "lucide-react";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Badge } from "../../components/Badge";
import { Input } from "../../components/Input";

export function ContactPage({ onGetStarted }) {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      description: "Get in touch for questions or collaboration",
      value: "contact@skillsync.dev",
      action: "Send Email",
      color: "from-primary to-primary/80",
    },
    {
      icon: GitBranch,
      title: "GitHub",
      description: "View source code and contribute",
      value: "github.com/skillsync-ai",
      action: "View Repository",
      color: "from-secondary to-secondary/80",
    },
    {
      icon: Link,
      title: "LinkedIn",
      description: "Connect for professional networking",
      value: "Connect on LinkedIn",
      action: "View Profile",
      color: "from-success to-success/80",
    },
  ];

  const inquiryTypes = [
    {
      icon: Briefcase,
      title: "Project Inquiries",
      email: "project@skillsync.dev",
      description:
        "Questions about the technical implementation or architecture",
    },
    {
      icon: HelpCircle,
      title: "Technical Support",
      email: "support@skillsync.dev",
      description: "Bug reports, feature requests, or usage questions",
    },
    {
      icon: Users,
      title: "Collaboration",
      email: "collaborate@skillsync.dev",
      description: "Open source contributions or project collaboration",
    },
  ];

  const faqs = [
    {
      question: "Is this project open source?",
      answer:
        "Yes! SkillSync AI is an open-source portfolio project. You can view the source code, documentation, and contribute on GitHub.",
    },
    {
      question: "Can I use this for my own projects?",
      answer:
        "Absolutely! Feel free to fork the repository, learn from the code, or use it as inspiration for your own projects. Attribution is appreciated but not required.",
    },
    {
      question: "How can I report bugs or request features?",
      answer:
        "You can report bugs or request features through the GitHub issues page or by using the contact form above.",
    },
    {
      question: "Are you looking for contributors?",
      answer:
        "Yes! Contributions are welcome. Check the GitHub repository for open issues and contribution guidelines.",
    },
  ];

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" className="mb-6 px-4 py-2">
            <MessageSquare className="w-4 h-4 mr-1" />
            Contact Us
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Get in
            <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Questions about the project? Want to collaborate? Reach out through
            any of these channels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {contactMethods.map((method, i) => {
            const Icon = method.icon;
            return (
              <Card key={i} hover className="p-6 text-center">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{method.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {method.description}
                </p>
                <p className="font-medium mb-4">{method.value}</p>
                <Button variant="outline" size="sm" className="w-full">
                  {method.action}
                </Button>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-4">Send a Message</h2>
            <p className="text-muted-foreground mb-8">
              Have questions or feedback? Fill out the form and I'll get back to
              you.
            </p>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="First Name" placeholder="John" required />
                <Input label="Last Name" placeholder="Doe" required />
              </div>

              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                required
              />

              <Input
                label="Phone Number (Optional)"
                type="tel"
                placeholder="+1 (555) 000-0000"
              />

              <div>
                <label className="block mb-2 text-sm text-foreground/80">
                  Inquiry Type
                </label>
                <select className="w-full px-4 py-2.5 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                  <option>Technical Question</option>
                  <option>Feature Request</option>
                  <option>Bug Report</option>
                  <option>Collaboration</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm text-foreground/80">
                  Subject
                </label>
                <Input placeholder="How can we help?" required />
              </div>

              <div>
                <label className="block mb-2 text-sm text-foreground/80">
                  Message
                </label>
                <textarea
                  className="w-full px-4 py-2.5 bg-input-background border border-border rounded-xl
                    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                    transition-all duration-200 min-h-32"
                  placeholder="Tell us more about your inquiry..."
                  required
                />
              </div>

              <Button size="lg" className="w-full">
                Send Message
                <Send className="w-5 h-5 ml-2" />
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                I'll respond to inquiries as soon as possible
              </p>
            </form>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Inquiry Types</h3>
              <div className="space-y-4">
                {inquiryTypes.map((type, i) => {
                  const Icon = type.icon;
                  return (
                    <div key={i} className="flex gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">{type.title}</h4>
                        <p className="text-sm text-muted-foreground mb-1">
                          {type.description}
                        </p>
                        <a
                          href={`mailto:${type.email}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {type.email}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
              <h3 className="font-semibold text-lg mb-2">Project Repository</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                This is an open-source portfolio project. View the code,
                documentation, and contribute on GitHub.
              </p>
              <Button variant="outline" className="w-full">
                <GitBranch className="w-4 h-4 mr-2" />
                View on GitHub
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-12 h-12 bg-accent hover:bg-primary hover:text-primary-foreground rounded-xl flex items-center justify-center transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-accent hover:bg-primary hover:text-primary-foreground rounded-xl flex items-center justify-center transition-colors"
                >
                  <Link className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-accent hover:bg-primary hover:text-primary-foreground rounded-xl flex items-center justify-center transition-colors"
                >
                  <GitBranch className="w-5 h-5" />
                </a>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
              <h3 className="font-semibold text-lg mb-2">
                Need Immediate Help?
              </h3>
              <p className="text-muted-foreground mb-4">
                Check out our help center for instant answers to common
                questions.
              </p>
              <Button variant="outline" className="w-full">
                Visit Help Center
              </Button>
            </Card>
          </div>
        </div>

        <div className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Common Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Quick answers to questions you might have
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <Card key={i} className="p-6">
                <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <Card className="p-12 bg-gradient-to-br from-primary via-primary/90 to-secondary text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Try the Platform
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Experience AI-powered career matching and skill analysis
            </p>
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
              onClick={onGetStarted}
            >
              Get Started Free
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
