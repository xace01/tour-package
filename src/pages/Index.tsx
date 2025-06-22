
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import PackageCard from '@/components/PackageCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, MapPin, Star, Users, Shield } from 'lucide-react';

interface Package {
  id: string;
  title: string;
  location: string;
  description: string;
  price: number;
  duration: string;
  image_url?: string;
}

const Index = () => {
  const { user, profile, isAdmin } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedPackages();
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFeaturedPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .limit(6)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('package_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setFavorites(data?.map(f => f.package_id) || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const handleSearch = (query: string) => {
    // Navigate to packages page with search
    window.location.href = `/packages?search=${encodeURIComponent(query)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={handleSearch} />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Your Next Adventure
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Explore breathtaking destinations and create unforgettable memories with our curated tour packages
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/packages">
                <Button size="lg" className="bg-white text-green-800 hover:bg-gray-100">
                  Explore Packages
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              {!user && (
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-800">
                    Join Our Community
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Message for Logged In Users */}
      {user && !isAdmin && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome back, {profile?.name}! 🌟
                </h2>
                <p className="text-gray-700 text-lg max-w-2xl mx-auto">
                  We're your trusted travel partner, offering carefully curated tour packages 
                  to the world's most amazing destinations. From adventure treks to luxury getaways, 
                  we help you create memories that last a lifetime.
                </p>
                <div className="mt-6">
                  <Link to="/dashboard">
                    <Button className="bg-green-600 hover:bg-green-700">
                      View My Dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Features Section - Hide for Admin */}
      {!isAdmin && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose TourPackage?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We make travel planning simple and enjoyable with our comprehensive tour packages
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Curated Destinations</h3>
                <p className="text-gray-600">
                  Hand-picked destinations and experiences from around the world
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
                <p className="text-gray-600">
                  Verified reviews and ratings from real travelers
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Booking</h3>
                <p className="text-gray-600">
                  Safe and secure booking process with instant confirmation
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Packages */}
      {packages.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Featured Tour Packages
              </h2>
              <p className="text-gray-600">
                Discover our most popular destinations and experiences
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {packages.map((pkg) => (
                    <PackageCard
                      key={pkg.id}
                      package={pkg}
                      isFavorite={favorites.includes(pkg.id)}
                      onFavoriteChange={fetchFavorites}
                    />
                  ))}
                </div>
                
                <div className="text-center mt-12">
                  <Link to="/packages">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700">
                      View All Packages
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* Call to Action - Hide for Admin */}
      {!user && (
        <section className="py-16 bg-green-600 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl mb-8">
              Join thousands of happy travelers and book your next adventure today
            </p>
            <Link to="/auth">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
