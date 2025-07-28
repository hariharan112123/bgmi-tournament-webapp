import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Bell, ChevronDown, User, Settings, LogOut, Shield } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Navbar() {
  const { user } = useAuth();
  const [location] = useLocation();

  const navItems = [
    { href: "/tournaments", label: "Tournaments", active: location.startsWith("/tournaments") },
    { href: "/rankings", label: "Rankings", active: location === "/rankings" },
    { href: "/team", label: "Teams", active: location === "/team" },
    { href: "/replays", label: "Replays", active: location === "/replays" },
  ];

  return (
    <nav className="bg-card-bg border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer">
                <div className="w-10 h-10 gaming-gradient rounded-lg flex items-center justify-center">
                  <Trophy className="text-white text-lg" />
                </div>
                <span className="text-xl font-bold text-bgmi-orange">BGMI Pro</span>
              </div>
            </Link>
            
            <div className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span className={`cursor-pointer transition-colors ${
                    item.active 
                      ? "text-bgmi-orange" 
                      : "text-white hover:text-bgmi-orange"
                  }`}>
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="text-gray-400 hover:text-bgmi-orange cursor-pointer h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-error-red text-xs rounded-full w-2 h-2"></span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-700">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.profileImageUrl || ""} alt={user?.username || ""} />
                    <AvatarFallback className="bg-bgmi-orange text-white">
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:block">
                    {user?.username || "Player"}
                  </span>
                  {user?.isAdmin && (
                    <Badge variant="secondary" className="bg-bgmi-gold text-dark-bg text-xs">
                      Admin
                    </Badge>
                  )}
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-56 bg-card-bg border-gray-700">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/team" className="flex items-center cursor-pointer">
                    <Trophy className="mr-2 h-4 w-4" />
                    My Team
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>

                {user?.isAdmin && (
                  <>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center cursor-pointer text-bgmi-orange">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem asChild>
                  <a href="/api/logout" className="flex items-center cursor-pointer text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
