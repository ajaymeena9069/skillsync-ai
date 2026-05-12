import {
  MapPin,
  Mail,
  Phone,
  Link,
  GitBranch,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  Download,
  Star,
  MessageSquare,
} from "lucide-react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { ProgressBar } from "../components/ProgressBar";

export function CandidateProfile() {
  const candidate = {
    name: "Sarah Johnson",
    avatar: "👩",
    role: "Senior React Developer",
    location: "San Francisco, CA",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    matchScore: 96,
    skills: [
      { name: "React", level: 95 },
      { name: "TypeScript", level: 90 },
      { name: "Node.js", level: 85 },
      { name: "AWS", level: 80 },
      { name: "GraphQL", level: 75 },
      { name: "Docker", level: 70 },
    ],
    experience: [
      {
        title: "Senior Frontend Developer",
        company: "TechCorp Inc.",
        duration: "2021 - Present",
        location: "San Francisco, CA",
        highlights: [
          "Led a team of 5 developers in building a new product line",
          "Improved application performance by 40% through optimization",
          "Mentored junior developers and conducted code reviews",
        ],
      },
      {
        title: "Frontend Developer",
        company: "StartupXYZ",
        duration: "2019 - 2021",
        location: "Remote",
        highlights: [
          "Built and maintained component library used across 10+ projects",
          "Implemented CI/CD pipeline reducing deployment time by 60%",
        ],
      },
    ],
    education: {
      degree: "Bachelor of Science in Computer Science",
      school: "Stanford University",
      year: "2015 - 2019",
      gpa: "3.8/4.0",
    },
    certifications: [
      "AWS Certified Solutions Architect",
      "Professional Scrum Master (PSM I)",
      "React Advanced Certification",
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost">← Back to Candidates</Button>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4" />
            Download Resume
          </Button>
          <Button variant="outline">
            <MessageSquare className="w-4 h-4" />
            Message
          </Button>
          <Button variant="danger">Reject</Button>
          <Button>
            <Star className="w-4 h-4" />
            Shortlist
          </Button>
        </div>
      </div>

      <Card className="p-8">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center text-5xl flex-shrink-0">
            {candidate.avatar}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-1">{candidate.name}</h1>
                <p className="text-xl text-muted-foreground mb-3">
                  {candidate.role}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {candidate.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {candidate.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {candidate.phone}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center mb-2">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="42"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="42"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={`${2 * Math.PI * 42 * (1 - candidate.matchScore / 100)}`}
                      className="text-success"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute">
                    <div className="text-2xl font-bold">
                      {candidate.matchScore}
                    </div>
                    <div className="text-xs text-muted-foreground">Match</div>
                  </div>
                </div>
                <Badge variant="success" className="px-4 py-2">
                  Excellent Match
                </Badge>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Link className="w-4 h-4" />
                LinkedIn
              </Button>
              <Button variant="outline" size="sm">
                <GitBranch className="w-4 h-4" />
                GitHub
              </Button>
              <Button variant="outline" size="sm">
                <Globe className="w-4 h-4" />
                Portfolio
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Work Experience
            </h2>
            <div className="space-y-6">
              {candidate.experience.map((exp, i) => (
                <div
                  key={i}
                  className="relative pl-6 border-l-2 border-primary/30 pb-6 last:pb-0"
                >
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-primary rounded-full" />
                  <div className="mb-2">
                    <h3 className="font-semibold text-lg">{exp.title}</h3>
                    <p className="text-muted-foreground">{exp.company}</p>
                    <p className="text-sm text-muted-foreground">
                      {exp.duration} • {exp.location}
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {exp.highlights.map((highlight, j) => (
                      <li
                        key={j}
                        className="text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <span className="text-primary mt-1">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              Education
            </h2>
            <div className="pl-6 border-l-2 border-primary/30">
              <div className="absolute -ml-[9px] w-4 h-4 bg-primary rounded-full" />
              <h3 className="font-semibold text-lg">
                {candidate.education.degree}
              </h3>
              <p className="text-muted-foreground">
                {candidate.education.school}
              </p>
              <p className="text-sm text-muted-foreground">
                {candidate.education.year} • GPA: {candidate.education.gpa}
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Certifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {candidate.certifications.map((cert, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl bg-success/5 border border-success/20"
                >
                  <Award className="w-5 h-5 text-success flex-shrink-0" />
                  <span className="text-sm">{cert}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-semibold mb-4">Skills Assessment</h3>
            <div className="space-y-4">
              {candidate.skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-muted-foreground">
                      {skill.level}%
                    </span>
                  </div>
                  <ProgressBar value={skill.level} showPercentage={false} />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold mb-4">Why This Match?</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-success rounded-full" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    5+ years React experience
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Matches requirement
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-success rounded-full" />
                </div>
                <div>
                  <p className="text-sm font-medium">TypeScript expertise</p>
                  <p className="text-xs text-muted-foreground">
                    Core skill match
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-success rounded-full" />
                </div>
                <div>
                  <p className="text-sm font-medium">Leadership experience</p>
                  <p className="text-xs text-muted-foreground">
                    Led teams of 5+
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-warning/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-warning rounded-full" />
                </div>
                <div>
                  <p className="text-sm font-medium">AWS knowledge growing</p>
                  <p className="text-xs text-muted-foreground">
                    Room for improvement
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-primary to-secondary text-white">
            <h3 className="font-semibold mb-2">AI Recommendation</h3>
            <p className="text-sm text-white/90 mb-4">
              Strong match for Senior React Developer role. Technical skills
              align well with requirements. Consider for immediate interview.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                Schedule Interview
              </Button>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="w-4 h-4" />
                Send Email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4" />
                Export Profile
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Star className="w-4 h-4" />
                Add to Favorites
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
