import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Users, Target, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-transparent to-dark-bg z-10"></div>
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600" 
            alt="BGMI Tournament Arena" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 py-20 sm:py-32">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-16 h-16 gaming-gradient rounded-lg flex items-center justify-center">
                <Trophy className="text-white text-2xl" />
              </div>
              <span className="text-3xl font-bold text-bgmi-orange">BGMI Pro</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-bold mb-6">
              <span className="text-white">BGMI</span>
              <span className="text-bgmi-orange"> Tournament</span>
              <span className="text-bgmi-gold"> Platform</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join the ultimate BGMI esports experience. Create tournaments, manage teams, and compete for glory in India's premier battle royale championships.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                className="bg-bgmi-orange hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold"
              >
                <a href="/api/login">
                  <Zap className="mr-2 h-5 w-5" />
                  Get Started
                </a>
              </Button>
              
              <Button 
                variant="outline" 
                className="border-bgmi-gold text-bgmi-gold hover:bg-bgmi-gold hover:text-dark-bg px-8 py-3"
              >
                <Trophy className="mr-2 h-5 w-5" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Why Choose BGMI Pro?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience the most comprehensive tournament platform designed specifically for BGMI esports
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-card-bg border-gray-700 card-hover">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 gaming-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
                <Trophy className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Tournament Management</h3>
              <p className="text-gray-400">
                Create and manage professional tournaments with automated bracketing, scheduling, and prize distribution.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card-bg border-gray-700 card-hover">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 gaming-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Team Management</h3>
              <p className="text-gray-400">
                Build your squad, manage rosters, send invitations, and track team performance across tournaments.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card-bg border-gray-700 card-hover">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 gaming-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Live Match Control</h3>
              <p className="text-gray-400">
                Real-time match tracking, kill updates, zone management, and live communication with teams.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-card-bg py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-bgmi-orange mb-1">50+</div>
              <div className="text-gray-400 text-sm">Active Tournaments</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-bgmi-gold mb-1">₹15L+</div>
              <div className="text-gray-400 text-sm">Total Prize Pool</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-success-green mb-1">5,000+</div>
              <div className="text-gray-400 text-sm">Registered Teams</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">30+</div>
              <div className="text-gray-400 text-sm">Live Matches</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center bg-card-bg rounded-xl p-8 border border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Compete?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of players already competing in BGMI tournaments. Create your team and start your esports journey today.
          </p>
          <Button 
            asChild
            className="bg-bgmi-orange hover:bg-orange-600 text-white px-8 py-3 text-lg"
          >
            <a href="/api/login">
              Start Playing Now
            </a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card-bg border-t border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 gaming-gradient rounded-lg flex items-center justify-center">
              <Trophy className="text-white text-sm" />
            </div>
            <span className="text-xl font-bold text-bgmi-orange">BGMI Pro</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 BGMI Pro Tournament Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
