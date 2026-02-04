import React, { useState } from 'react';
import axios from 'axios';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../context/AuthContext';
import { API_URL } from '../../../utils/config';

const VehicleReviews = ({ vehicleId, vehicle }) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const reviews = vehicle?.reviews || [];

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={14}
        className={index < Math.round(rating) ? 'text-slate-900 fill-current' : 'text-slate-200'}
      />
    ));
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {displayedReviews.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-500">No reviews yet. Be the first!</p>
          </div>
        ) : (
          displayedReviews.map((review, index) => (
            <div key={review._id || index} className="space-y-4">
              <div className="flex items-center gap-4">
                <Image
                  src={review.user?.avatar}
                  alt={review.user?.firstName || 'User'}
                  className="w-12 h-12 rounded-full object-cover bg-slate-100"
                />
                <div>
                  <h4 className="font-bold text-slate-900">{review.user?.firstName} {review.user?.lastName}</h4>
                  <p className="text-sm text-slate-500">
                    {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {renderStars(review.rating)}
              </div>

              <p className="text-slate-600 leading-relaxed">
                {review.review}
              </p>
            </div>
          ))
        )}
      </div>

      {reviews.length > 3 && (
        <Button
          variant="outline"
          onClick={() => setShowAllReviews(!showAllReviews)}
          className="w-full md:w-auto border-slate-900 text-slate-900 font-bold hover:bg-slate-50"
        >
          {showAllReviews ? 'Show Less' : `Show all ${reviews.length} reviews`}
        </Button>
      )}
    </div>
  );
};

export default VehicleReviews;