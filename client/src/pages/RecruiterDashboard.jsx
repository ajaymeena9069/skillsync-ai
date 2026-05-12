import {
  Users,
  Briefcase,
  TrendingUp,
  Clock,
  Star,
  MapPin,
  Search,
  Filter,
  MoreVertical,
} from "lucide-react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";

export function RecruiterDashboard() {
  const topCandidates = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Senior React Developer",
      location: "San Francisco, CA",
      matchScore: 96,
      avatar: "👩",
      skills: ["React", "TypeScript", "Node.js", "AWS"],
      experience: "5 years",
      status: "Available",
      appliedDate: "2 days ago",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Full Stack Engineer",
      location: "Remote",
      matchScore: 94,
      avatar: "👨",
      skills: ["Python", "React", "PostgreSQL", "Docker"],
      experience: "4 years",
      status: "Available",
      appliedDate: "3 days ago",
    },
    {
      id: 3,
      name: "Emily Davis",
      role: "Frontend Developer",
      location: "New York, NY",
      matchScore: 91,
      avatar: "👩",
      skills: ["React", "Vue.js", "CSS", "JavaScript"],
      experience: "3 years",
      status: "Interviewing",
      appliedDate: "1 week ago",
    },
    {
      id: 4,
      name: "Alex Kumar",
      role: "React Native Developer",
      location: "Austin, TX",
      matchScore: 89,
      avatar: "👨",
      skills: ["React Native", "TypeScript", "iOS", "Android"],
      experience: "4 years",
      status: "Available",
      appliedDate: "5 days ago",
    },
  ];

  const activeJobs = [
    {
      id: 1,
      title: "Senior React Developer",
      applicants: 48,
      views: 324,
      matches: 12,
      status: "Active",
      postedDate: "2 weeks ago",
    },
    {
      id: 2,
      title: "Full Stack Engineer",
      applicants: 35,
      views: 256,
      matches: 8,
      status: "Active",
      postedDate: "1 week ago",
    },
    {
      id: 3,
      title: "Frontend Developer",
      applicants: 52,
      views: 412,
      matches: 15,
      status: "Active",
      postedDate: "3 weeks ago",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage candidates and track hiring pipeline
          </p>
        </div>
        <Button>
          <Briefcase className="w-4 h-4" />
          Post New Job
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <div className="text-2xl font-bold">12</div>
          <div className="text-sm text-muted-foreground">Active Jobs</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-info/10 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-info" />
            </div>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <div className="text-2xl font-bold">248</div>
          <div className="text-sm text-muted-foreground">Total Applicants</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-success" />
            </div>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <div className="text-2xl font-bold">45</div>
          <div className="text-sm text-muted-foreground">Shortlisted</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <span className="text-xs text-success">-2 days</span>
          </div>
          <div className="text-2xl font-bold">14 days</div>
          <div className="text-sm text-muted-foreground">Avg Time to Hire</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Top Matched Candidates</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4" />
                Search
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {topCandidates.map((candidate) => (
              <Card key={candidate.id} hover className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                    {candidate.avatar}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {candidate.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {candidate.role}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="success" className="font-semibold">
                          {candidate.matchScore}% Match
                        </Badge>
                        <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {candidate.location}
                      </span>
                      <span>{candidate.experience} experience</span>
                      <Badge
                        variant={
                          candidate.status === "Available"
                            ? "success"
                            : "warning"
                        }
                      >
                        {candidate.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {candidate.skills.map((skill) => (
                        <Badge key={skill} variant="primary">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Applied {candidate.appliedDate}
                      </span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View Profile
                        </Button>
                        <Button size="sm">Shortlist</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Active Job Postings</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                      Job Title
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                      Applicants
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                      Views
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                      Matches
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                      Posted
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activeJobs.map((job) => (
                    <tr
                      key={job.id}
                      className="border-b border-border hover:bg-accent/50 transition-colors"
                    >
                      <td className="py-4 px-2 font-medium">{job.title}</td>
                      <td className="py-4 px-2">{job.applicants}</td>
                      <td className="py-4 px-2">{job.views}</td>
                      <td className="py-4 px-2">
                        <Badge variant="success">{job.matches}</Badge>
                      </td>
                      <td className="py-4 px-2">
                        <Badge variant="primary">{job.status}</Badge>
                      </td>
                      <td className="py-4 px-2 text-sm text-muted-foreground">
                        {job.postedDate}
                      </td>
                      <td className="py-4 px-2">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-semibold mb-4">Hiring Pipeline</h3>
            <div className="space-y-3">
              {[
                { stage: "Applied", count: 248, color: "bg-muted" },
                { stage: "Screening", count: 124, color: "bg-info" },
                { stage: "Interview", count: 45, color: "bg-warning" },
                { stage: "Offer", count: 12, color: "bg-success" },
                { stage: "Hired", count: 8, color: "bg-primary" },
              ].map((stage) => (
                <div key={stage.stage}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">{stage.stage}</span>
                    <span className="text-sm font-semibold">{stage.count}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full">
                    <div
                      className={`h-full rounded-full ${stage.color}`}
                      style={{ width: `${(stage.count / 248) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                {
                  action: "New application from Sarah Johnson",
                  time: "2 hours ago",
                  type: "success",
                },
                {
                  action: "Interview scheduled with Michael Chen",
                  time: "5 hours ago",
                  type: "info",
                },
                {
                  action: "Offer sent to Emily Davis",
                  time: "1 day ago",
                  type: "success",
                },
                {
                  action: "Job posting expires in 3 days",
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
                  <div>
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
            <h3 className="font-semibold mb-2">Boost Your Reach</h3>
            <p className="text-sm text-white/90 mb-4">
              Promote your job posting to reach 3x more qualified candidates
            </p>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              Learn More
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
