import {
  TrendingUp,
  Briefcase,
  Target,
  Award,
  ArrowRight,
  MapPin,
  Clock,
  DollarSign,
} from "lucide-react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { ProgressBar } from "../components/ProgressBar";

export function Dashboard() {
  const suggestedJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120k - $180k",
      matchScore: 95,
      skills: ["React", "TypeScript", "Node.js"],
      postedTime: "2 days ago",
    },
    {
      id: 2,
      title: "Full Stack Engineer",
      company: "StartupXYZ",
      location: "Remote",
      type: "Full-time",
      salary: "$100k - $150k",
      matchScore: 88,
      skills: ["Python", "React", "AWS"],
      postedTime: "1 week ago",
    },
    {
      id: 3,
      title: "React Developer",
      company: "Digital Solutions",
      location: "New York, NY",
      type: "Contract",
      salary: "$80/hr",
      matchScore: 82,
      skills: ["React", "Redux", "JavaScript"],
      postedTime: "3 days ago",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Alex!</h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your career journey
          </p>
        </div>
        <Button>
          Update Profile
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <Card className="p-6 bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent border-primary/20">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Profile Strength</h3>
            <p className="text-sm text-muted-foreground">
              Complete your profile to get better matches
            </p>
          </div>
          <Badge variant="primary">75% Complete</Badge>
        </div>
        <ProgressBar value={75} variant="primary" showPercentage={false} />
        <div className="mt-4 flex gap-2 flex-wrap">
          <Badge variant="success">Resume Added</Badge>
          <Badge variant="success">Skills Listed</Badge>
          <Badge variant="warning">Portfolio Missing</Badge>
          <Badge variant="warning">Certifications Needed</Badge>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <div className="text-2xl font-bold">24</div>
          <div className="text-sm text-muted-foreground">Job Matches</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-secondary" />
            </div>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <div className="text-2xl font-bold">8</div>
          <div className="text-sm text-muted-foreground">Applications Sent</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-success" />
            </div>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <div className="text-2xl font-bold">12</div>
          <div className="text-sm text-muted-foreground">Skills Mastered</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-warning" />
            </div>
            <span className="text-xs text-success">+15%</span>
          </div>
          <div className="text-2xl font-bold">85%</div>
          <div className="text-sm text-muted-foreground">Profile Views</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Top Job Matches</h2>
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {suggestedJobs.map((job) => (
              <Card key={job.id} hover className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {job.company}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="success" className="font-semibold">
                      {job.matchScore}% Match
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {job.postedTime}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {job.skills.map((skill) => (
                    <Badge key={skill} variant="primary">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {job.salary}
                    </span>
                  </div>
                  <Button size="sm">Apply Now</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Activity</h2>

          <Card className="p-4">
            <div className="space-y-4">
              {[
                {
                  action: "Applied to Frontend Developer at Google",
                  time: "2 hours ago",
                  type: "success",
                },
                {
                  action: "Profile viewed by Microsoft recruiter",
                  time: "5 hours ago",
                  type: "info",
                },
                {
                  action: "Completed React Advanced course",
                  time: "1 day ago",
                  type: "success",
                },
                {
                  action: "New skill gap identified: AWS",
                  time: "2 days ago",
                  type: "warning",
                },
              ].map((activity, i) => (
                <div key={i} className="flex gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.type === "success"
                        ? "bg-success"
                        : activity.type === "warning"
                          ? "bg-warning"
                          : "bg-info"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-primary to-secondary text-white">
            <h3 className="font-semibold mb-2">Boost Your Profile</h3>
            <p className="text-sm text-white/90 mb-4">
              Upload your latest projects to increase your match score by 20%
            </p>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              Add Projects
            </Button>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold mb-3">Your Top Skills</h3>
            <div className="space-y-3">
              {[
                { name: "React", level: 90 },
                { name: "TypeScript", level: 85 },
                { name: "Node.js", level: 75 },
                { name: "Python", level: 70 },
              ].map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{skill.name}</span>
                    <span className="text-muted-foreground">
                      {skill.level}%
                    </span>
                  </div>
                  <ProgressBar value={skill.level} showPercentage={false} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
