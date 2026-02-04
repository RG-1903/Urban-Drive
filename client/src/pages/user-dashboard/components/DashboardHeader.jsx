import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const DashboardHeader = ({ user, loyaltyData }) => {
  return (
    <div className="relative overflow-hidden bg-white rounded-3xl p-8 mb-8 border border-slate-100 shadow-premium">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent to-primary rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <Image
              src={user?.avatar}
              alt={user?.avatarAlt || user?.firstName}
              className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <Icon name="Check" size={10} color="white" strokeWidth={4} />
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold font-accent text-slate-900 mb-2 tracking-tight">
              Welcome back, {user?.firstName}
            </h1>
            <div className="flex items-center gap-2 text-slate-500 text-sm lg:text-base font-medium">
              <Icon name="Calendar" size={16} className="text-accent" />
              <span>Member since {new Date(user?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-4">
          <div className="flex-1 min-w-[140px] bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:border-accent/20 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                <Icon name="Award" size={16} className="text-accent" />
              </div>
              <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Points</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{loyaltyData?.points || 0}</div>
          </div>

          <div className="flex-1 min-w-[140px] bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:border-accent/20 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                <Icon name="Crown" size={16} className="text-yellow-500" />
              </div>
              <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Tier</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{loyaltyData?.tier || 'Silver'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;