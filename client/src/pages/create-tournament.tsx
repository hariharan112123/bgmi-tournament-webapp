import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Trophy, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";

export default function CreateTournament() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    mode: "",
    type: "",
    prizePool: "",
    maxTeams: "",
    startDate: null as Date | null,
    rules: "",
  });

  const createTournamentMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/tournaments", data);
    },
    onSuccess: () => {
      toast({
        title: "Tournament Created!",
        description: "Your tournament has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      setLocation("/tournaments");
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
        description: "Failed to create tournament. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.mode || !formData.type || !formData.prizePool || !formData.maxTeams || !formData.startDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createTournamentMutation.mutate({
      ...formData,
      prizePool: formData.prizePool,
      maxTeams: parseInt(formData.maxTeams),
      startDate: formData.startDate?.toISOString(),
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button asChild variant="ghost" size="icon">
              <Link href="/tournaments">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-4xl font-bold">Create Tournament</h1>
              <p className="text-gray-400">Set up your BGMI tournament and start building the competition</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="bg-card-bg border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-bgmi-orange" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-white">Tournament Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., BGMI Championship 2025"
                  className="bg-dark-bg border-gray-600 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your tournament..."
                  className="bg-dark-bg border-gray-600 text-white min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-white">Game Mode *</Label>
                  <Select value={formData.mode} onValueChange={(value) => handleInputChange("mode", value)}>
                    <SelectTrigger className="bg-dark-bg border-gray-600 text-white">
                      <SelectValue placeholder="Select game mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Solo">Solo</SelectItem>
                      <SelectItem value="Duo">Duo</SelectItem>
                      <SelectItem value="Squad">Squad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Tournament Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger className="bg-dark-bg border-gray-600 text-white">
                      <SelectValue placeholder="Select tournament type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Free">Free Entry</SelectItem>
                      <SelectItem value="Paid">Paid Entry</SelectItem>
                      <SelectItem value="Invite">Invite Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tournament Settings */}
          <Card className="bg-card-bg border-gray-700">
            <CardHeader>
              <CardTitle>Tournament Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="prizePool" className="text-white">Prize Pool (₹) *</Label>
                  <Input
                    id="prizePool"
                    type="number"
                    value={formData.prizePool}
                    onChange={(e) => handleInputChange("prizePool", e.target.value)}
                    placeholder="e.g., 100000"
                    className="bg-dark-bg border-gray-600 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="maxTeams" className="text-white">Maximum Teams *</Label>
                  <Input
                    id="maxTeams"
                    type="number"
                    value={formData.maxTeams}
                    onChange={(e) => handleInputChange("maxTeams", e.target.value)}
                    placeholder="e.g., 32"
                    className="bg-dark-bg border-gray-600 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Start Date & Time *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-dark-bg border-gray-600 text-white",
                        !formData.startDate && "text-gray-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-card-bg border-gray-700">
                    <Calendar
                      mode="single"
                      selected={formData.startDate || undefined}
                      onSelect={(date) => handleInputChange("startDate", date)}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

          {/* Rules and Regulations */}
          <Card className="bg-card-bg border-gray-700">
            <CardHeader>
              <CardTitle>Rules and Regulations</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="rules" className="text-white">Tournament Rules</Label>
                <Textarea
                  id="rules"
                  value={formData.rules}
                  onChange={(e) => handleInputChange("rules", e.target.value)}
                  placeholder="Enter tournament rules and regulations..."
                  className="bg-dark-bg border-gray-600 text-white min-h-[120px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={createTournamentMutation.isPending}
              className="bg-bgmi-orange hover:bg-orange-600 text-white px-8 py-3 font-semibold"
            >
              {createTournamentMutation.isPending ? "Creating..." : "Create Tournament"}
            </Button>
            
            <Button asChild variant="outline" className="border-gray-600 text-gray-300">
              <Link href="/tournaments">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
