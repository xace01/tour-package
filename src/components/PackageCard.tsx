
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Package {
  id: string;
  title: string;
  location: string;
  description: string;
  price: number;
  duration: string;
  image_url?: string;
}

interface PackageCardProps {
  package: Package;
  isFavorite?: boolean;
  onFavoriteChange?: () => void;
}

const PackageCard: React.FC<PackageCardProps> = ({ 
  package: pkg, 
  isFavorite = false, 
  onFavoriteChange 
}) => {
  const { user } = useAuth();
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const handleFavoriteToggle = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add favorites.",
        variant: "destructive"
      });
      return;
    }

    setFavoriteLoading(true);

    try {
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('package_id', pkg.id);

        if (error) throw error;

        toast({
          title: "Removed from favorites",
          description: "Package removed from your favorites."
        });
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert([{
            user_id: user.id,
            package_id: pkg.id
          }]);

        if (error) throw error;

        toast({
          title: "Added to favorites",
          description: "Package added to your favorites."
        });
      }

      if (onFavoriteChange) {
        onFavoriteChange();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={pkg.image_url || '/placeholder.svg'}
          alt={pkg.title}
          className="w-full h-48 object-cover"
        />
        {user && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={handleFavoriteToggle}
            disabled={favoriteLoading}
          >
            <Heart
              className={`h-5 w-5 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </Button>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {pkg.title}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-green-600 font-semibold">
            <DollarSign className="h-4 w-4 mr-1" />
            <span>${pkg.price}</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{pkg.location}</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            <span>{pkg.duration}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {pkg.description}
        </p>
        
        <Link to={`/package/${pkg.id}`}>
          <Button className="w-full bg-green-600 hover:bg-green-700">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default PackageCard;
