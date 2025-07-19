import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Play, Headphones, Heart, Search, Star, Users } from 'lucide-react';

export const LandingPage = () => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);

  if (authMode) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Button 
            variant="outline" 
            onClick={() => setAuthMode(null)}
            className="mb-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            ← Back to Home
          </Button>
          {authMode === 'login' ? (
            <LoginForm onToggleMode={() => setAuthMode('register')} />
          ) : (
            <RegisterForm onToggleMode={() => setAuthMode('login')} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm">
              <Headphones className="h-12 w-12" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            PodcastHub
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Your gateway to thousands of amazing audio stories, conversations, and insights. 
            Discover, listen, and never miss an episode.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => setAuthMode("register")}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
            >
              Get Started Free
            </Button>
            <Button 
              size="lg" 
              onClick={() => setAuthMode('login')}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 text-center text-white">
              <Play className="h-12 w-12 mx-auto mb-4 text-accent" />
              <h3 className="text-xl font-semibold mb-3">Stream Anywhere</h3>
              <p className="text-white/80">
                Listen to your favorite podcasts on any device, anytime, anywhere with our seamless audio player.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 text-center text-white">
              <Heart className="h-12 w-12 mx-auto mb-4 text-accent" />
              <h3 className="text-xl font-semibold mb-3">Save Favorites</h3>
              <p className="text-white/80">
                Create your personal collection of favorite episodes and never lose track of the content you love.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 text-center text-white">
              <Search className="h-12 w-12 mx-auto mb-4 text-accent" />
              <h3 className="text-xl font-semibold mb-3">Discover More</h3>
              <p className="text-white/80">
                Explore podcasts by genre, search by title, and find your next favorite show with ease.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="bg-white/10 rounded-lg backdrop-blur-sm p-8 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-3xl font-bold mb-2">1000+</div>
              <div className="text-white/80">Podcast Shows</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">50K+</div>
              <div className="text-white/80">Episodes</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">9</div>
              <div className="text-white/80">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-white/80">Access</div>
            </div>
          </div>
        </div>

        {/* What We Offer */}
        <div className="text-center text-white mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Why Choose PodcastHub?</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <div className="flex items-center mb-4">
                <Star className="h-6 w-6 text-accent mr-3" />
                <h3 className="text-xl font-semibold">Curated Content</h3>
              </div>
              <p className="text-white/80">
                Access carefully curated podcasts spanning from investigative journalism to comedy, 
                ensuring quality content across all genres.
              </p>
            </div>
            <div className="text-left">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-accent mr-3" />
                <h3 className="text-xl font-semibold">Personal Experience</h3>
              </div>
              <p className="text-white/80">
                Create your profile, track your listening progress, and get personalized 
                recommendations based on your preferences.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Start Your Audio Journey?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Join thousands of listeners discovering amazing stories every day.
          </p>
          <Button 
            size="lg" 
            onClick={() => setAuthMode('register')}
            className="bg-accent text-white hover:bg-accent/90 shadow-glow"
          >
            Start Listening Now
          </Button>
        </div>
      </div>
    </div>
  );
};