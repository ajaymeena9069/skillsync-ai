import {
  Camera,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Edit2,
  Save,
} from "lucide-react";
import { useState } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { Input } from "../components/Input";
import { ProgressBar } from "../components/ProgressBar";

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your personal information and preferences
          </p>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <Card className="p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center text-6xl">
                👤
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 text-center">
              <h3 className="font-semibold text-lg">Alex Johnson</h3>
              <p className="text-sm text-muted-foreground">
                Senior React Developer
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                defaultValue="Alex Johnson"
                disabled={!isEditing}
              />
              <Input
                label="Email"
                type="email"
                defaultValue="alex.johnson@email.com"
                disabled={!isEditing}
              />
              <Input
                label="Phone"
                type="tel"
                defaultValue="+1 (555) 123-4567"
                disabled={!isEditing}
              />
              <Input
                label="Location"
                defaultValue="San Francisco, CA"
                disabled={!isEditing}
              />
            </div>

            <div className="pt-4">
              <label className="block mb-2 text-sm text-foreground/80">
                Bio
              </label>
              <textarea
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                  transition-all duration-200 min-h-24"
                disabled={!isEditing}
                defaultValue="Passionate React developer with 5+ years of experience building scalable web applications. Experienced in TypeScript, Node.js, and AWS."
              />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Professional Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Current Role
              </label>
              <Input
                defaultValue="Senior React Developer"
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Years of Experience
              </label>
              <Input defaultValue="5 years" disabled={!isEditing} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Preferred Job Type
              </label>
              <select
                disabled={!isEditing}
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Freelance</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Expected Salary Range
              </label>
              <Input defaultValue="$120k - $180k" disabled={!isEditing} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Job Alerts
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm">Email notifications</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm">Weekly job digest</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">SMS notifications</span>
                </label>
              </div>
            </div>

            <div className="pt-4">
              <label className="text-sm text-muted-foreground mb-2 block">
                Preferred Locations
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="primary">San Francisco, CA</Badge>
                <Badge variant="primary">Remote</Badge>
                <Badge variant="primary">New York, NY</Badge>
              </div>
              {isEditing && (
                <Button variant="outline" size="sm">
                  Add Location
                </Button>
              )}
            </div>

            <div className="pt-4">
              <label className="text-sm text-muted-foreground mb-2 block">
                Job Categories
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="primary">Frontend Development</Badge>
                <Badge variant="primary">Full Stack</Badge>
                <Badge variant="primary">React</Badge>
              </div>
              {isEditing && (
                <Button variant="outline" size="sm">
                  Add Category
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Profile Completeness</h2>
          <Badge variant="primary">75% Complete</Badge>
        </div>
        <ProgressBar value={75} variant="primary" showPercentage={false} />
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-5 h-5 bg-success/10 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-success rounded-full" />
            </div>
            <span className="text-muted-foreground">Basic Info</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-5 h-5 bg-success/10 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-success rounded-full" />
            </div>
            <span className="text-muted-foreground">Skills Added</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-5 h-5 bg-warning/10 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-warning rounded-full" />
            </div>
            <span className="text-muted-foreground">Add Portfolio</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-5 h-5 bg-warning/10 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-warning rounded-full" />
            </div>
            <span className="text-muted-foreground">Add Certifications</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
