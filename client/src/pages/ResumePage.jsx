import {
  Upload,
  FileText,
  Check,
  Sparkles,
  Briefcase,
  GraduationCap,
  Code,
} from "lucide-react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";

export function ResumePage() {
  const extractedData = {
    skills: [
      "React",
      "TypeScript",
      "Node.js",
      "Python",
      "AWS",
      "Docker",
      "Git",
      "MongoDB",
      "PostgreSQL",
      "GraphQL",
    ],
    experience: [
      {
        title: "Senior Frontend Developer",
        company: "TechCorp",
        duration: "2021 - Present",
        highlights: [
          "Led team of 5 developers",
          "Improved performance by 40%",
          "Migrated to TypeScript",
        ],
      },
      {
        title: "Frontend Developer",
        company: "StartupXYZ",
        duration: "2019 - 2021",
        highlights: ["Built component library", "Implemented CI/CD pipeline"],
      },
    ],
    projects: [
      { name: "E-commerce Platform", tech: "React, Node.js, MongoDB" },
      { name: "Real-time Chat App", tech: "Socket.io, React, Express" },
      { name: "Portfolio Website", tech: "Next.js, Tailwind CSS" },
    ],
    education: {
      degree: "Bachelor of Science in Computer Science",
      school: "Stanford University",
      year: "2019",
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Resume Analysis</h1>
        <p className="text-muted-foreground mt-1">
          Upload your resume for AI-powered insights
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Upload Your Resume</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop your resume here, or click to browse
              </p>
              <Button>Choose File</Button>
              <p className="text-xs text-muted-foreground mt-3">
                Supports PDF, DOC, DOCX (Max 5MB)
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-success" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">AI Analysis Complete</h2>
                <p className="text-sm text-muted-foreground">
                  Last analyzed 2 hours ago
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  Extracted Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {extractedData.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="primary"
                      className="px-3 py-1.5"
                    >
                      <Check className="w-3 h-3 mr-1" />
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Work Experience
                </h3>
                <div className="space-y-4">
                  {extractedData.experience.map((exp, i) => (
                    <div key={i} className="pl-4 border-l-2 border-primary/30">
                      <h4 className="font-medium">{exp.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {exp.company} • {exp.duration}
                      </p>
                      <ul className="mt-2 space-y-1">
                        {exp.highlights.map((highlight, j) => (
                          <li
                            key={j}
                            className="text-sm text-muted-foreground flex items-start gap-2"
                          >
                            <span className="text-primary mt-1">•</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Projects
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {extractedData.projects.map((project, i) => (
                    <Card key={i} className="p-4 border-primary/20">
                      <h4 className="font-medium mb-1">{project.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {project.tech}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Education
                </h3>
                <div className="pl-4 border-l-2 border-primary/30">
                  <h4 className="font-medium">
                    {extractedData.education.degree}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {extractedData.education.school} •{" "}
                    {extractedData.education.year}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-semibold mb-4">Resume Score</h3>
            <div className="text-center mb-4">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.85)}`}
                    className="text-success transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute">
                  <div className="text-3xl font-bold">85</div>
                  <div className="text-xs text-muted-foreground">/ 100</div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Completeness</span>
                <Badge variant="success">Excellent</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Formatting</span>
                <Badge variant="success">Great</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Keywords</span>
                <Badge variant="warning">Good</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-primary text-primary-foreground">
            <h3 className="font-semibold mb-2">AI Recommendations</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                Add specific metrics to achievements
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                Include more technical keywords
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                Highlight leadership experience
              </li>
            </ul>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4" />
                Download Optimized Resume
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Sparkles className="w-4 h-4" />
                Generate Cover Letter
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Upload className="w-4 h-4" />
                Upload New Version
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
