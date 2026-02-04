import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RecommendationsCard = ({ recommendations, onAction }) => {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-cinematic">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-card-foreground">Recommended for You</h2>
        <Button onClick={() => onAction('view-all')} variant="outline" size="sm" iconName="Sparkles" iconPosition="left">
          View All
        </Button>
      </div>
      <div className="space-y-4">
        {recommendations?.map((item) => (
          <div key={item?.id} className="bg-surface rounded-xl p-4 border border-border hover:shadow-cinematic transition-all duration-300">
            <div className="flex gap-4">
              {/* Vehicle Image */}
              <div className="w-20 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={item?.vehicle?.image}
                  alt={item?.vehicle?.imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-surface-foreground text-sm truncate">
                    {item?.vehicle?.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-accent bg-accent/10 px-2 py-1 rounded-full">
                    <Icon name="TrendingUp" size={12} />
                    <span>{item?.matchScore}% match</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {item?.reason}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Icon name="DollarSign" size={12} />
                      {item?.vehicle?.pricePerDay}/day
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Star" size={12} fill="currentColor" className="text-yellow-500" />
                      {item?.vehicle?.rating}
                    </span>
                  </div>

                  <div className="flex gap-1">
                    <Button onClick={() => onAction('view', item)} variant="ghost" size="xs" iconName="Heart">
                    </Button>
                    <Button onClick={() => onAction('book', item)} variant="outline" size="xs">
                      Book
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Special Offers */}
      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="font-semibold text-card-foreground mb-4 text-sm">Special Offers</h3>
        <div className="space-y-3">
          {recommendations?.slice(0, 2)?.map((item) => (
            <div key={`offer-${item?.id}`} className="bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Icon name="Percent" size={16} className="text-accent" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-card-foreground">
                    Weekend Special - 20% Off
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Valid for {item?.vehicle?.name} bookings
                  </p>
                </div>
                <Button onClick={() => onAction('claim', item)} variant="accent" size="xs">
                  Claim
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendationsCard;