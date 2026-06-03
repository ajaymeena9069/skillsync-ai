// client/src/pages/marketing/ContactPage.jsx
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
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
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Badge } from "../../components/Badge";
import { Input } from "../../components/Input";
import contactInfo from "../../data/contactInfo.json";

export function ContactPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      description: "Get in touch for questions or collaboration",
      value: contactInfo.emails.contact,
      action: "Send Email",
      color: "from-purple-500 to-indigo-500",
      link: `mailto:${contactInfo.emails.contact}`,
    },
    {
      icon: GitBranch,
      title: "GitHub",
      description: "View source code and contribute",
      value: contactInfo.socialLinks.github.display,
      action: "View Repository",
      color: "from-gray-600 to-gray-800",
      link: contactInfo.socialLinks.github.url,
    },
    {
      icon: Link,
      title: "LinkedIn",
      description: "Connect for professional networking",
      value: contactInfo.socialLinks.linkedin.display,
      action: "View Profile",
      color: "from-blue-500 to-cyan-500",
      link: contactInfo.socialLinks.linkedin.url,
    },
  ];

  const inquiryTypes = [
    {
      icon: Briefcase,
      title: "Project Inquiries",
      email: contactInfo.emails.project,
      description:
        "Questions about the technical implementation or architecture",
    },
    {
      icon: HelpCircle,
      title: "Technical Support",
      email: contactInfo.emails.support,
      description: "Bug reports, feature requests, or usage questions",
    },
    {
      icon: Users,
      title: "Collaboration",
      email: contactInfo.emails.collaborate,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
      {/* Ambient background for light mode glass effect */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-purple-200/40 dark:bg-purple-900/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-indigo-200/40 dark:bg-indigo-900/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" className="mb-6 px-4 py-2 text-sm gap-2">
            <MessageSquare className="w-4 h-4" />
            Contact Us
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Get in
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Questions about the project? Want to collaborate? Reach out through
            any of these channels.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {contactMethods.map((method, i) => {
            const Icon = method.icon;
            return (
              <Card
                key={i}
                className="p-6 text-center hover:shadow-2xl transition-all duration-300 border border-white/60 dark:border-purple-900/50 bg-white/60 dark:bg-gray-900/50 backdrop-blur-2xl hover:-translate-y-1 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-r ${method.color} flex items-center justify-center mx-auto mb-4 shadow-md`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                  {method.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {method.description}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                  {method.value}
                </p>
                <a href={method.link} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="w-full">
                    {method.action}
                  </Button>
                </a>
              </Card>
            );
          })}
        </div>

        {/* Contact Form & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Send a Message
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Have questions or feedback? Fill out the form and I'll get back to
              you.
            </p>

            <form className="space-y-5">
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
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Inquiry Type
                </label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500">
                  <option>Technical Question</option>
                  <option>Feature Request</option>
                  <option>Bug Report</option>
                  <option>Collaboration</option>
                  <option>Other</option>
                </select>
              </div>

              <Input label="Subject" placeholder="How can we help?" required />

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Message
                </label>
                <textarea
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all min-h-32"
                  placeholder="Tell us more about your inquiry..."
                  required
                />
              </div>

              <Button size="lg" className="w-full gap-2">
                Send Message
                <Send className="w-4 h-4" />
              </Button>

              <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
                I'll respond to inquiries as soon as possible
              </p>
            </form>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Inquiry Types */}
            <Card className="p-5 border border-white/60 dark:border-purple-900/50 bg-white/60 dark:bg-gray-900/50 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Inquiry Types
              </h3>
              <div className="space-y-4">
                {inquiryTypes.map((type, i) => {
                  const Icon = type.icon;
                  return (
                    <div key={i} className="flex gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          {type.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          {type.description}
                        </p>
                        <a
                          href={`mailto:${type.email}`}
                          className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400"
                        >
                          {type.email}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* GitHub Card */}
            <Card className="p-5 relative overflow-hidden border border-purple-100 dark:border-purple-900/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl -z-10" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Project Repository
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                This is an open-source portfolio project. View the code,
                documentation, and contribute on GitHub.
              </p>
              <a
                href={contactInfo.socialLinks.github.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="w-full gap-2">
                  <GitBranch className="w-4 h-4" />
                  View on GitHub
                </Button>
              </a>
            </Card>

            {/* Social Links */}
            <Card className="p-5 border border-white/60 dark:border-purple-900/50 bg-white/60 dark:bg-gray-900/50 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Follow Us
              </h3>
              <div className="flex gap-3">
                <a
                  href={contactInfo.socialLinks.twitter.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                </a>
                <a
                  href={contactInfo.socialLinks.linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 transition-all"
                >
                  <Link className="w-4 h-4" />
                </a>
                <a
                  href={contactInfo.socialLinks.github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 transition-all"
                >
                  <GitBranch className="w-4 h-4" />
                </a>
              </div>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Common Questions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Quick answers to questions you might have
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <Card key={i} className="p-5 border border-white/60 dark:border-purple-900/50 bg-white/60 dark:bg-gray-900/50 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20">
          <Card className="relative overflow-hidden p-12 text-center border border-purple-100 dark:border-purple-900/50 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
            {/* Background glowing orbs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />

            <div className="max-w-2xl mx-auto relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-white">
                Still Need Assistance?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                If you couldn't find the answers you're looking for, our support team is just a message away.
              </p>
              <div className="flex justify-center">
                <Button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 border-transparent gap-2"
                >
                  <MessageSquare className="w-5 h-5 mr-1" /> Send Us a Message
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
