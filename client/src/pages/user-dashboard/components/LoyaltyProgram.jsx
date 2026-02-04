import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LoyaltyProgram = ({ loyaltyData, onRedeem, compact = false }) => {
  const tiers = [
    { name: 'Silver', points: 0, color: 'text-slate-400', bgColor: 'bg-slate-100' },
    { name: 'Gold', points: 1000, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { name: 'Platinum', points: 2500, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { name: 'Diamond', points: 5000, color: 'text-blue-600', bgColor: 'bg-blue-100' }
  ];

  const currentTierIndex = tiers.findIndex(tier => tier.name === (loyaltyData?.tier || 'Silver'));
  const currentTier = tiers[currentTierIndex];
  const nextTier = tiers[currentTierIndex + 1];

  const pointsNeeded = nextTier ? nextTier.points - (loyaltyData?.points || 0) : 0;
  const progressPercentage = nextTier
    ? ((loyaltyData.points - currentTier.points) / (nextTier.points - currentTier.points)) * 100
    : 100;

  return (
    <div className="space-y-6">
      {/* Premium Card Design */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 shadow-2xl">
        {/* Abstract Pattern */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-white/60 text-sm font-medium uppercase tracking-widest mb-1">UrbanDrive</p>
              <h2 className="text-3xl font-accent font-bold tracking-wide">{loyaltyData?.tier} Membership</h2>
            </div>
            <Icon name="Crown" size={32} className="text-yellow-400" />
          </div>

          <div className="flex justify-between items-end">
            <div>
              <p className="text-white/60 text-sm mb-1">Available Points</p>
              <p className="text-4xl font-bold font-mono tracking-wider">{loyaltyData?.points?.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-xs mb-1">Member Since</p>
              <p className="font-medium">2023</p>
            </div>
          </div>

          {nextTier && (
            <div className="mt-8">
              <div className="flex justify-between text-xs text-white/60 mb-2">
                <span>Progress to {nextTier.name}</span>
                <span>{pointsNeeded} pts needed</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-yellow-200 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rewards Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-premium">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold font-accent text-slate-900">Exclusive Rewards</h3>
          <span className="text-xs font-medium text-accent bg-accent/5 px-3 py-1 rounded-full">
            {loyaltyData?.availableRewards?.length} Available
          </span>
        </div>

        <div className="space-y-4">
          {loyaltyData?.availableRewards?.map((reward) => (
            <div key={reward.id} className="group flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-accent/30 hover:bg-accent/5 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Icon name="Gift" size={20} className="text-accent" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 group-hover:text-accent transition-colors">{reward.title}</h4>
                <p className="text-xs text-slate-500">{reward.points} points required</p>
              </div>
              <button
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${loyaltyData.points >= reward.points
                    ? 'bg-slate-900 text-white hover:bg-accent hover:shadow-lg hover:-translate-y-0.5'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                onClick={() => {
                  console.log('Redeem clicked');
                  onRedeem(reward.id);
                }}
              >
                Redeem
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoyaltyProgram;