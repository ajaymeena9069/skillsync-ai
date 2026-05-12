import { useState } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Filter,
  ChevronDown,
  BookmarkPlus,
  ExternalLink,
} from "lucide-react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { Input } from "../components/Input";

export function JobsPage() {
  const [selectedFilters, setSelectedFilters] = useState({
    location: "all",
    experience: "all",
    type: "all",
  });

  const jobs = [
    {
      id: 1,
      title: "Senior React Developer",
      company: "Google",
      logo: "🔴",
      location: "Mountain View, CA",
      type: "Full-time",
      experience: "Senior",
      salary: "$150k - $200k",
      matchScore: 96,
      skills: ["React", "TypeScript", "GraphQL", "Node.js"],
      description: "Join our team building next-gen web applications...",
      posted: "2 days ago",
    },
    {
      id: 2,
      title: "Full Stack Engineer",
      company: "Meta",
      logo: "🔵",
      location: "Menlo Park, CA",
      type: "Full-time",
      experience: "Mid-Level",
      salary: "$130k - $180k",
      matchScore: 92,
      skills: ["React", "Python", "AWS", "PostgreSQL"],
      description: "Build scalable systems that impact billions...",
      posted: "4 days ago",
    },
    {
      id: 3,
      title: "Frontend Developer",
      company: "Airbnb",
      logo: "🏠",
      location: "San Francisco, CA",
      type: "Full-time",
      experience: "Mid-Level",
      salary: "$120k - $160k",
      matchScore: 89,
      skills: ["React", "TypeScript", "CSS", "Redux"],
      description: "Create beautiful experiences for travelers...",
      posted: "1 week ago",
    },
    {
      id: 4,
      title: "React Native Developer",
      company: "Uber",
      logo: "🚗",
      location: "Remote",
      type: "Full-time",
      experience: "Senior",
      salary: "$140k - $190k",
      matchScore: 87,
      skills: ["React Native", "TypeScript", "iOS", "Android"],
      description: "Build mobile apps used by millions daily...",
      posted: "3 days ago",
    },
    {
      id: 5,
      title: "JavaScript Engineer",
      company: "Netflix",
      logo: "🎬",
      location: "Los Gatos, CA",
      type: "Full-time",
      experience: "Mid-Level",
      salary: "$135k - $175k",
      matchScore: 85,
      skills: ["JavaScript", "React", "Node.js", "AWS"],
      description: "Help build the future of entertainment...",
      posted: "5 days ago",
    },
    {
      id: 6,
      title: "Frontend Architect",
      company: "Amazon",
      logo: "📦",
      location: "Seattle, WA",
      type: "Full-time",
      experience: "Senior",
      salary: "$160k - $210k",
      matchScore: 83,
      skills: ["React", "TypeScript", "Architecture", "AWS"],
      description: "Lead frontend architecture for Amazon Prime...",
      posted: "1 week ago",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Job Matches</h1>
        <p className="text-muted-foreground mt-1">
          AI-powered job recommendations based on your profile
        </p>
      </div>

      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search job titles, skills, companies..."
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <Button>Search</Button>
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4" />
            More Filters
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="p-5 h-fit">
          <h3 className="font-semibold mb-4">Filters</h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <select className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option>All Locations</option>
                <option>Remote</option>
                <option>San Francisco, CA</option>
                <option>New York, NY</option>
                <option>Seattle, WA</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Experience Level
              </label>
              <select className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option>All Levels</option>
                <option>Entry Level</option>
                <option>Mid-Level</option>
                <option>Senior</option>
                <option>Lead</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Job Type</label>
              <div className="space-y-2">
                {["Full-time", "Part-time", "Contract", "Freelance"].map(
                  (type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{type}</span>
                    </label>
                  ),
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Salary Range
              </label>
              <select className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option>Any Salary</option>
                <option>$80k - $120k</option>
                <option>$120k - $160k</option>
                <option>$160k+</option>
              </select>
            </div>

            <Button variant="outline" className="w-full">
              Reset Filters
            </Button>
          </div>
        </Card>

        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">{jobs.length}</span>{" "}
              matching jobs
            </p>
            <select className="px-3 py-1.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>Best Match</option>
              <option>Most Recent</option>
              <option>Highest Salary</option>
            </select>
          </div>

          {jobs.map((job) => (
            <Card key={job.id} hover className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                  {job.logo}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1">
                        {job.title}
                      </h3>
                      <p className="text-muted-foreground">{job.company}</p>
                    </div>
                    <Badge
                      variant="success"
                      className="flex-shrink-0 px-3 py-1.5"
                    >
                      {job.matchScore}% Match
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {job.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {job.salary}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.posted}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="primary">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button>
                      Apply Now
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button variant="outline">
                      <BookmarkPlus className="w-4 h-4" />
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
