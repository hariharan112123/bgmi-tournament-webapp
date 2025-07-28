import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, Users, Crown } from "lucide-react";

interface TeamInvitationProps {
  invitation: {
    id: string;
    teamId: string;
    userId: string;
    invitedBy: string;
    status: string;
    createdAt: string;
    team: {
      id: string;
      name: string;
      tag: string;
      logoUrl?: string;
    };
    inviter: {
      id: string;
      username?: string;
      profileImageUrl?: string;
    };
  };
}

export default function TeamInvitation({ invitation }: TeamInvitationProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateInvitationMutation = useMutation({
    mutationFn: async (status: string) => {
      return await apiRequest("PATCH", `/api/team-invitations/${invitation.id}`, {
        status
      });
    },
    onSuccess: (_, status) => {
      toast({
        title: status === 'accepted' ? "Invitation Accepted!" : "Invitation Declined",
        description: status === 'accepted' 
          ? `You've joined ${invitation.team.name}` 
          : `You've declined the invitation from ${invitation.team.name}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user/invitations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/team'] });
      queryClient.invalidateQueries({ queryKey: ['/api/teams', invitation.teamId, 'members'] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update invitation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAccept = () => {
    updateInvitationMutation.mutate('accepted');
  };

  const handleDecline = () => {
    updateInvitationMutation.mutate('declined');
  };

  return (
    <Card className="bg-dark-bg border-gray-600 card-hover">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Team Logo/Tag */}
            <div className="w-12 h-12 gaming-gradient rounded-lg flex items-center justify-center font-bold text-white">
              {invitation.team.logoUrl ? (
                <img 
                  src={invitation.team.logoUrl} 
                  alt={invitation.team.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                invitation.team.tag || invitation.team.name.slice(0, 2).toUpperCase()
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-white">{invitation.team.name}</h4>
                <Badge variant="outline" className="border-gray-500 text-gray-300">
                  #{invitation.team.tag}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users className="h-3 w-3" />
                <span>Team Invitation</span>
                <span>•</span>
                <span>Invited by</span>
                <Avatar className="w-4 h-4">
                  <AvatarImage src={invitation.inviter.profileImageUrl} />
                  <AvatarFallback className="bg-bgmi-orange text-white text-xs">
                    {invitation.inviter.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{invitation.inviter.username || "Player"}</span>
              </div>
              
              <div className="text-xs text-gray-500 mt-1">
                Invited {new Date(invitation.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {invitation.status === 'pending' && (
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={handleAccept}
                disabled={updateInvitationMutation.isPending}
                className="bg-success-green hover:bg-green-600 text-white"
              >
                <Check className="h-4 w-4 mr-1" />
                Accept
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDecline}
                disabled={updateInvitationMutation.isPending}
                className="bg-error-red hover:bg-red-600"
              >
                <X className="h-4 w-4 mr-1" />
                Decline
              </Button>
            </div>
          )}

          {/* Status Badge for non-pending invitations */}
          {invitation.status !== 'pending' && (
            <Badge 
              className={
                invitation.status === 'accepted' 
                  ? 'bg-success-green text-dark-bg' 
                  : 'bg-error-red text-white'
              }
            >
              {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
            </Badge>
          )}
        </div>

        {/* Loading State */}
        {updateInvitationMutation.isPending && (
          <div className="mt-3 text-center">
            <div className="text-sm text-gray-400">Updating invitation...</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
