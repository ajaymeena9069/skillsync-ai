import {
  TrendingUp,
  Target,
  BookOpen,
  Video,
  FileText,
  ExternalLink,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { ProgressBar } from "../components/ProgressBar";

export function SkillGapPage() {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Skill Gap Analysis</h1>
        <p className="text-muted-foreground mt-1">
          Identify and bridge the gaps between your skills and market demands
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
          </div>
          <div className="text-2xl font-bold">{currentSkills.length}</div>
          <div className="text-sm text-muted-foreground">Current Skills</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
              <Circle className="w-5 h-5 text-warning" />
            </div>
          </div>
          <div className="text-2xl font-bold">{missingSkills.length}</div>
          <div className="text-sm text-muted-foreground">Skills to Learn</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="text-2xl font-bold">78%</div>
          <div className="text-sm text-muted-foreground">Market Readiness</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Your Current Skills</h2>
            <Badge variant="success">{currentSkills.length} Skills</Badge>
          </div>

          <div className="space-y-4">
            {currentSkills.map((skill) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span className="font-medium">{skill.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs">
                      {skill.category}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
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
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Skills Gap Identified</h2>
            <Badge variant="warning">{missingSkills.length} Missing</Badge>
          </div>

          <div className="space-y-4">
            {missingSkills.map((skill) => (
              <Card key={skill.name} className="p-4 border-warning/30">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Circle className="w-4 h-4 text-warning" />
                    <span className="font-medium">{skill.name}</span>
                  </div>
                  <Badge
                    variant={
                      skill.importance === "High"
                        ? "danger"
                        : skill.importance === "Medium"
                          ? "warning"
                          : "info"
                    }
                  >
                    {skill.importance} Priority
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {skill.category}
                  </span>
                  <span className="text-muted-foreground">
                    Market Demand: {skill.demand}%
                  </span>
                </div>
                <ProgressBar
                  value={skill.demand}
                  showPercentage={false}
                  variant="warning"
                />
              </Card>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">
          Recommended Learning Resources
        </h2>

        <div className="space-y-6">
          {recommendations.map((rec) => (
            <div key={rec.skill} className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">{rec.skill}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {rec.resources.map((resource, i) => (
                  <Card key={i} hover className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        {resource.type === "Course" && (
                          <BookOpen className="w-5 h-5 text-primary" />
                        )}
                        {resource.type === "Video" && (
                          <Video className="w-5 h-5 text-primary" />
                        )}
                        {resource.type === "Article" && (
                          <FileText className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Badge variant="primary" className="mb-2 text-xs">
                          {resource.type}
                        </Badge>
                        <h4 className="font-medium text-sm mb-1 line-clamp-2">
                          {resource.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {resource.platform}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {resource.duration}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-3">
                      Start Learning
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-primary/10 via-secondary/10 to-transparent border-primary/20">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">
              Ready to Start Learning?
            </h3>
            <p className="text-muted-foreground mb-4">
              We've created a personalized 30-day roadmap to help you master
              these skills
            </p>
            <Button>
              View AI Roadmap
              <TrendingUp className="w-4 h-4" />
            </Button>
          </div>
          <div className="hidden md:block text-6xl opacity-20">🎯</div>
        </div>
      </Card>
    </div>
  );
}
