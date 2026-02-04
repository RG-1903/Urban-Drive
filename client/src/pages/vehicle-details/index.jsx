import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Icon from '../../components/AppIcon';
import { API_URL } from '../../utils/config';
import Footer from '../homepage/components/Footer';
import Image from '../../components/AppImage';

// Components
import VehicleSpecs from './components/VehicleSpecs';
import VehicleGallery from './components/VehicleGallery';
import VehicleReviews from './components/VehicleReviews';
import AvailabilityCalendar from './components/AvailabilityCalendar';

const VehicleDetails = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const res = await axios.get(`${API_URL}/vehicles/${id}`);
                setVehicle(res.data.data.vehicle);
            } catch (err) {
                setError('Could not load vehicle details.');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchVehicle();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    if (error || !vehicle) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center text-slate-900">
                <div className="text-center px-6">
                    <Icon name="AlertTriangle" size={48} className="mx-auto mb-4 text-red-500" />
                    <h2 className="text-2xl font-bold mb-2">Vehicle Not Found</h2>
                    <button onClick={() => navigate('/vehicle-search')} className="text-slate-600 hover:text-slate-900 underline font-medium">
                        Return to Fleet
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen text-slate-900 font-sans selection:bg-slate-100 pb-24 lg:pb-0">

            {/* FLOATING BACK BUTTON (No Navbar) */}
            <div className="fixed top-6 left-6 z-50">
                <button
                    onClick={() => navigate(-1)}
                    className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-110 transition-transform flex items-center justify-center text-slate-900"
                >
                    <Icon name="ArrowLeft" size={20} />
                </button>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">

                {/* HEADER SECTION */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-600">
                            {vehicle.category} Collection
                        </span>
                        {vehicle.ratingAverage >= 4.8 && (
                            <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                                <Icon name="Award" size={12} />
                                Guest Favorite
                            </span>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-4 leading-tight tracking-tight">
                        {vehicle.name}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 font-medium">
                        <div className="flex items-center gap-1 font-bold text-slate-900">
                            <Icon name="Star" size={14} className="text-slate-900 fill-current" />
                            <span>{vehicle.ratingAverage?.toFixed(1) || '5.0'}</span>
                        </div>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="underline decoration-slate-300 underline-offset-4">{vehicle.ratingQuantity || 0} reviews</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <div className="flex items-center gap-1 text-slate-500">
                            <Icon name="MapPin" size={14} />
                            <span>San Francisco, CA</span>
                        </div>
                    </div>
                </div>

                {/* GALLERY SECTION (Grid Layout) */}
                <div className="mb-12 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                    <VehicleGallery images={vehicle.images?.length > 0 ? vehicle.images : (vehicle.image ? [vehicle.image] : [])} />
                </div>

                {/* MAIN CONTENT GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24 relative">

                    {/* LEFT COLUMN - CONTENT */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Quick Stats / Overview */}
                        <div className="flex items-center justify-between py-8 border-b border-slate-100">
                            <div className="space-y-1">
                                <h3 className="font-bold text-xl text-slate-900">Hosted by UrbanDrive</h3>
                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <span>Joined 2023</span>
                                    <span>•</span>
                                    <span>Response rate: 100%</span>
                                    <span>•</span>
                                    <span>Response time: &lt; 1 hr</span>
                                </div>
                            </div>
                            <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-200">
                                <span className="font-serif font-bold text-xl">UD</span>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                            <div className="flex gap-4">
                                <div className="mt-1 text-slate-900"><Icon name="Award" size={24} /></div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Superhost</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="mt-1 text-slate-900"><Icon name="MapPin" size={24} /></div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Great Location</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">95% of recent guests gave the location a 5-star rating.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="mt-1 text-slate-900"><Icon name="Key" size={24} /></div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Great Check-in Experience</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">100% of recent guests gave the check-in process a 5-star rating.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="mt-1 text-slate-900"><Icon name="Shield" size={24} /></div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Enhanced Cleaning</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">This host has committed to UrbanDrive's 5-step enhanced cleaning process.</p>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-100 w-full" />

                        {/* Description */}
                        <div>
                            <h3 className="font-bold text-2xl text-slate-900 mb-6">About this vehicle</h3>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                {vehicle.description || "Experience the pinnacle of automotive engineering. This vehicle combines raw power with sophisticated luxury, delivering an unforgettable driving experience perfect for business or pleasure."}
                            </p>
                        </div>

                        <div className="h-px bg-slate-100 w-full" />

                        {/* Specs */}
                        <div>
                            <h3 className="font-bold text-2xl text-slate-900 mb-8">Features & Specs</h3>
                            <VehicleSpecs vehicle={vehicle} />
                        </div>

                        <div className="h-px bg-slate-100 w-full" />

                        {/* Calendar */}
                        <div>
                            <h3 className="font-bold text-2xl text-slate-900 mb-2">Availability</h3>
                            <p className="text-slate-500 mb-8">Select dates to check pricing</p>
                            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                                <AvailabilityCalendar vehicle={vehicle} />
                            </div>
                        </div>

                        <div className="h-px bg-slate-100 w-full" />

                        {/* Reviews */}
                        <div>
                            <h3 className="font-bold text-2xl text-slate-900 mb-8">
                                <span className="flex items-center gap-2">
                                    <Icon name="Star" size={28} className="fill-current" />
                                    {vehicle.ratingAverage?.toFixed(1) || '5.0'} · {vehicle.ratingQuantity || 0} reviews
                                </span>
                            </h3>
                            <VehicleReviews vehicleId={vehicle.id || vehicle._id} vehicle={vehicle} />
                        </div>

                        <div className="h-px bg-slate-100 w-full" />

                        {/* Location Placeholder */}
                        <div>
                            <h3 className="font-bold text-2xl text-slate-900 mb-6">Where you'll be</h3>
                            <div className="bg-slate-100 rounded-3xl h-64 w-full flex items-center justify-center border border-slate-200">
                                <div className="text-center text-slate-400">
                                    <Icon name="Map" size={48} className="mx-auto mb-2 opacity-50" />
                                    <p className="font-bold">San Francisco, California</p>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-100 w-full" />

                        {/* Cancellation Policy */}
                        <div>
                            <h3 className="font-bold text-2xl text-slate-900 mb-4">Cancellation Policy</h3>
                            <p className="text-slate-600 mb-2"><span className="font-bold text-slate-900">Free cancellation for 48 hours.</span> After that, cancel up to 24 hours before check-in and get a full refund, minus the service fee.</p>
                            <button className="font-bold underline decoration-slate-300 hover:text-slate-600">Read more</button>
                        </div>

                    </div>

                    {/* RIGHT COLUMN - STICKY BOOKING WIDGET (Desktop Only) */}
                    <div className="hidden lg:block lg:col-span-1 relative">
                        <div className="sticky top-32">
                            <div className="bg-white rounded-3xl shadow-[0_6px_16px_rgba(0,0,0,0.08)] border border-slate-200 p-6 space-y-6">
                                <div className="flex items-end justify-between">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-bold text-slate-900">${vehicle.pricePerDay}</span>
                                        <span className="text-slate-500">/ day</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                                        <Icon name="Star" size={12} className="fill-current" />
                                        <span>{vehicle.ratingAverage?.toFixed(1) || '5.0'}</span>
                                        <span className="text-slate-400">({vehicle.ratingQuantity || 0})</span>
                                    </div>
                                </div>

                                <div className="border border-slate-200 rounded-xl overflow-hidden">
                                    <div className="grid grid-cols-2 border-b border-slate-200">
                                        <div className="p-3 border-r border-slate-200 bg-slate-50/50 hover:bg-slate-100 transition-colors cursor-pointer">
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Pick-up</label>
                                            <div className="text-sm font-medium text-slate-900">Add date</div>
                                        </div>
                                        <div className="p-3 bg-slate-50/50 hover:bg-slate-100 transition-colors cursor-pointer">
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Drop-off</label>
                                            <div className="text-sm font-medium text-slate-900">Add date</div>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-slate-50/50 hover:bg-slate-100 transition-colors cursor-pointer">
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Location</label>
                                        <div className="text-sm font-medium text-slate-900">San Francisco, CA</div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate(`/booking-wizard?vehicleId=${vehicle.id || vehicle._id}`)}
                                    className="w-full py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition-all active:scale-[0.98]"
                                >
                                    Book Now
                                </button>

                                <div className="text-center">
                                    <p className="text-xs text-slate-400">You won't be charged yet</p>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-slate-100">
                                    <div className="flex justify-between text-slate-600 text-sm">
                                        <span className="underline decoration-slate-200">Weekly discount</span>
                                        <span className="text-green-600 font-medium">-10%</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600 text-sm">
                                        <span className="underline decoration-slate-200">Cleaning fee</span>
                                        <span>$0</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600 text-sm">
                                        <span className="underline decoration-slate-200">Service fee</span>
                                        <span>$0</span>
                                    </div>
                                    <div className="flex justify-between text-slate-900 font-bold text-base pt-3 border-t border-slate-100">
                                        <span>Total before taxes</span>
                                        <span>${vehicle.pricePerDay}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-xs text-slate-400 flex items-center justify-center gap-2">
                                    <Icon name="Flag" size={12} />
                                    <span className="underline">Report this listing</span>
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <div className="mt-24 border-t border-slate-100 pt-12">
                <Footer />
            </div>

            {/* MOBILE FLOATING BAR (Hidden on Desktop) */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full z-50 bg-white border-t border-slate-200 p-4 pb-8 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-slate-900">${vehicle.pricePerDay}</span>
                            <span className="text-sm text-slate-500">/ day</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium underline">Oct 24 - 28</p>
                    </div>
                    <button
                        onClick={() => navigate(`/booking-wizard?vehicleId=${vehicle.id || vehicle._id}`)}
                        className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
                    >
                        Book Now
                    </button>
                </div>
            </div>

        </div>
    );
};

export default VehicleDetails;
