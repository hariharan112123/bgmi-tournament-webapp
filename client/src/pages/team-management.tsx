import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useUserTeam, useTeamMembers, useTeamInvitations, useCreateTeam, useInviteToTeam } from "@/hooks/useApi";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/navbar";
import TeamInvitation from "@/components/team-invitation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  Plus, 
  Crown, 
  UserPlus, 
  Trophy, 
  DollarSign,
  Calendar,
  Settings,
  Mail
} from "lucide-react";

export default function TeamManagement() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [teamForm, setTeamForm] = useState({
    name: "",
    tag: "",
  });
  const [inviteEmail, setInviteEmail] = useState("");

  const { data: userTeam, isLoading: teamLoading } = useUserTeam(user?.id || "");
  const { data: teamMembers = [] } = useTeamMembers(userTeam?.id || "");
  const { data: invitations = [] } = useTeamInvitations(user?.id || "");

  const createTeamMutation = useCreateTeam();
  const invitePlayerMutation = useInviteToTeam();

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamForm.name || !teamForm.tag) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    createTeamMutation.mutate({
      ...teamForm,
      captainId: user?.id || "",
    });
  };

  const handleInvitePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email.",
        variant: "destructive",
      });
      return;
    }
    if (!userTeam) return;
    invitePlayerMutation.mutate({
      teamId: userTeam.id,
      userId: `user-${inviteEmail.split('@')[0]}`, // Mock for demo
      invitedBy: user?.id || "",
    });
  };

  if (teamLoading) {
    return (
      <div className="min-h-screen bg-dark-bg text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-700 rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="h-80 bg-gray-700 rounded"></div>
              <div className="h-80 bg-gray-700 rounded"></div>
              <div className="h-80 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Team Management</h1>
          <p className="text-gray-400">Build your squad and invite the best players</p>
        </div>

        {!userTeam ? (
          /* No Team - Show Create Team Form */
          <div className="max-w-2xl mx-auto">
            <Card className="bg-card-bg border-gray-700">
              <CardHeader>
                <CardTitle className="text-center">
                  {showCreateForm ? "Create Your Team" : "You're not part of any team"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!showCreateForm ? (
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 gaming-gradient rounded-full flex items-center justify-center mx-auto">
                      <Users className="text-white text-2xl" />
                    </div>
                    <div>
                      <p className="text-gray-400 mb-6">
                        Create your own team or wait for an invitation from another team captain.
                      </p>
                      <div className="space-y-3">
                        <Button 
                          onClick={() => setShowCreateForm(true)}
                          className="w-full bg-bgmi-orange hover:bg-orange-600"
                        >
                          <Plus className="mr-2 h-5 w-5" />
                          Create Team
                        </Button>
                        <p className="text-sm text-gray-500">
                          Or check your invitations below
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleCreateTeam} className="space-y-6">
                    <div>
                      <Label htmlFor="teamName">Team Name</Label>
                      <Input
                        id="teamName"
                        value={teamForm.name}
                        onChange={(e) => setTeamForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Soul Esports"
                        className="bg-dark-bg border-gray-600 text-white"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="teamTag">Team Tag</Label>
                      <Input
                        id="teamTag"
                        value={teamForm.tag}
                        onChange={(e) => setTeamForm(prev => ({ ...prev, tag: e.target.value.toUpperCase() }))}
                        placeholder="e.g., SOUL"
                        maxLength={6}
                        className="bg-dark-bg border-gray-600 text-white"
                        required
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        type="submit"
                        disabled={createTeamMutation.isPending}
                        className="flex-1 bg-bgmi-orange hover:bg-orange-600"
                      >
                        {createTeamMutation.isPending ? "Creating..." : "Create Team"}
                      </Button>
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setShowCreateForm(false)}
                        className="border-gray-600"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Show Invitations if any */}
            {invitations.length > 0 && (
              <Card className="bg-card-bg border-gray-700 mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-bgmi-orange" />
                    Team Invitations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {invitations.map((invitation: any) => (
                      <TeamInvitation key={invitation.id} invitation={invitation} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          /* Has Team - Show Team Management */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Team Overview */}
            <Card className="bg-card-bg border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 gaming-gradient rounded-lg flex items-center justify-center text-sm font-bold">
                    {userTeam.tag}
                  </div>
                  {userTeam.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Members</span>
                    <span className="font-medium">{teamMembers.length}/4</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Tournaments Won</span>
                    <span className="text-success-green font-medium">{userTeam.totalWins}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Total Earnings</span>
                    <span className="text-bgmi-gold font-medium">₹{Number(userTeam.totalEarnings).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Created</span>
                    <span className="text-white text-sm">
                      {userTeam.createdAt ? new Date(userTeam.createdAt).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </div>

                <Separator className="bg-gray-700" />

                <div className="space-y-2">
                  <h4 className="font-semibold mb-3">Team Members</h4>
                  {teamMembers.map((member: any) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={member.user.profileImageUrl} />
                          <AvatarFallback className="bg-bgmi-orange text-white text-xs">
                            {member.user.username?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{member.user.username || "Player"}</span>
                        {member.role === 'captain' && (
                          <Crown className="h-4 w-4 text-bgmi-gold" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full border-gray-600">
                  <Settings className="mr-2 h-4 w-4" />
                  Team Settings
                </Button>
              </CardContent>
            </Card>

            {/* Invite Players */}
            {userTeam.captainId === user?.id && (
              <Card className="bg-card-bg border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-bgmi-orange" />
                    Invite Players
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleInvitePlayer} className="space-y-4">
                    <div>
                      <Label htmlFor="inviteEmail">Player Email</Label>
                      <Input
                        id="inviteEmail"
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="player@example.com"
                        className="bg-dark-bg border-gray-600 text-white"
                      />
                    </div>
                    <Button 
                      type="submit"
                      disabled={invitePlayerMutation.isPending || teamMembers.length >= 4}
                      className="w-full bg-bgmi-orange hover:bg-orange-600"
                    >
                      {invitePlayerMutation.isPending ? "Sending..." : "Send Invitation"}
                    </Button>
                  </form>

                  {teamMembers.length >= 4 && (
                    <p className="text-sm text-gray-400 mt-3 text-center">
                      Team is full (4/4 members)
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Team Statistics */}
            <Card className="bg-card-bg border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-bgmi-gold" />
                  Team Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-dark-bg rounded-lg">
                    <div className="text-2xl font-bold text-bgmi-orange">{userTeam.totalWins}</div>
                    <div className="text-xs text-gray-400">Wins</div>
                  </div>
                  <div className="text-center p-3 bg-dark-bg rounded-lg">
                    <div className="text-2xl font-bold text-bgmi-gold">₹{Number(userTeam.totalEarnings).toLocaleString()}</div>
                    <div className="text-xs text-gray-400">Earnings</div>
                  </div>
                </div>

                <Separator className="bg-gray-700" />

                <div>
                  <h4 className="font-semibold mb-3">Recent Activity</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-bgmi-orange rounded-full"></div>
                      <span className="text-gray-400">Team created</span>
                      <span className="text-xs text-gray-500">
                        {userTeam.createdAt ? new Date(userTeam.createdAt).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Active Invitations */}
        {invitations.length > 0 && userTeam && (
          <div className="mt-8">
            <Card className="bg-card-bg border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-bgmi-orange" />
                  Pending Invitations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invitations.map((invitation: any) => (
                    <TeamInvitation key={invitation.id} invitation={invitation} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
