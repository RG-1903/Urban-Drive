import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Icon from '../../components/AppIcon';
import { API_URL } from '../../utils/config';
import Header from '../../components/ui/Header';
import Image from '../../components/AppImage';

import StepIndicator from './components/StepIndicator';
import BookingSummary from './components/BookingSummary';
import VehicleSelectionStep from './components/VehicleSelectionStep';
import DateLocationStep from './components/DateLocationStep';
import InsuranceExtrasStep from './components/InsuranceExtrasStep';
import PaymentStep from './components/PaymentStep';
import ConfirmationStep from './components/ConfirmationStep';

const BookingWizard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [bookingData, setBookingData] = useState({
    vehicle: null,
    dates: null,
    location: null,
    insurance: null,
    extras: [],
    payment: null,
    availability: null
  });

  const steps = [
    { id: 1, title: 'Vehicle', icon: 'Car' },
    { id: 2, title: 'Journey', icon: 'MapPin' },
    { id: 3, title: 'Protection', icon: 'Shield' },
    { id: 4, title: 'Payment', icon: 'CreditCard' },
    { id: 5, title: 'Confirmed', icon: 'Check' }
  ];

  const location = useLocation();

  useEffect(() => {
    const initWizard = async () => {
      if (authLoading) return;

      const vehicleId = searchParams.get('vehicleId');
      const stateDates = location.state?.dates;

      if (vehicleId) {
        try {
          const res = await axios.get(`${API_URL}/vehicles/${vehicleId}`);

          let initialStep = 2;
          let newBookingData = {
            vehicle: res.data.data.vehicle
          };

          if (stateDates) {
            const pickupDate = new Date(stateDates.pickup);
            const returnDate = new Date(stateDates.return);
            const diffTime = Math.abs(returnDate - pickupDate);
            const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

            newBookingData.dates = {
              pickup: pickupDate.toISOString().split('T')[0],
              pickupTime: '10:00',
              return: returnDate.toISOString().split('T')[0],
              returnTime: '10:00',
              days: days
            };

            newBookingData.location = {
              pickup: 'Main Office',
              return: 'Main Office'
            };

            newBookingData.insurance = {
              price: 0,
              label: 'Basic',
              description: 'Standard coverage'
            };

            newBookingData.availability = true;

            initialStep = 4; // Jump to Payment
          }

          setBookingData(prev => ({
            ...prev,
            ...newBookingData
          }));
          setCurrentStep(initialStep);
        } catch (err) {
          setError('Could not load the selected vehicle.');
        }
      }
      setIsLoading(false);
    };

    initWizard();
  }, [searchParams, authLoading, location.state]);

  const handleDataUpdate = (newData) => {
    setBookingData(prev => ({ ...prev, ...newData }));
  };

  const createBooking = async (finalBookingData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Calculate total price
      const days = finalBookingData.dates.days || 0;
      const vehicleTotal = finalBookingData.vehicle.pricePerDay * days;
      const insuranceTotal = (finalBookingData.insurance?.price || 0) * days;
      const extrasTotal = finalBookingData.extras.reduce((acc, curr) => acc + curr.price, 0) * days;
      const totalPrice = vehicleTotal + insuranceTotal + extrasTotal;

      const payload = {
        vehicle: finalBookingData.vehicle._id,
        startDate: finalBookingData.dates.pickup,
        endDate: finalBookingData.dates.return,
        pickupLocation: finalBookingData.location.pickup,
        returnLocation: finalBookingData.location.return || finalBookingData.location.pickup,
        insurance: finalBookingData.insurance,
        extras: finalBookingData.extras,
        paymentMethod: finalBookingData.payment?.method || 'card',
        totalPrice
      };

      const res = await axios.post(`${API_URL}/bookings`, payload);

      setBookingData(prev => ({
        ...prev,
        payment: {
          ...prev.payment,
          bookingId: res.data.data.booking._id,
          amount: totalPrice.toFixed(2)
        }
      }));

      setCurrentStep(5);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Booking creation failed:', err);
      setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async (stepData) => {
    if (stepData) handleDataUpdate(stepData);

    if (currentStep === 4) {
      const finalData = { ...bookingData, ...stepData };
      await createBooking(finalData);
    } else if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(-1);
    }
  };

  const validateStep = (step) => {
    if (step === 1) return !!bookingData.vehicle;
    if (step === 2) return !!bookingData.dates && !!bookingData.location && bookingData.availability;
    if (step === 3) return true;
    return true;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 border-2 border-primary/10 border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon name="Loader2" className="text-primary animate-pulse" size={24} />
            </div>
          </div>
          <p className="text-muted-foreground font-medium tracking-[0.2em] uppercase text-xs">Initializing Experience</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary overflow-hidden flex flex-col lg:flex-row">

      <div className="lg:w-1/2 h-64 lg:h-screen relative lg:fixed left-0 top-0 z-0 lg:z-10 overflow-hidden">
        <div className="absolute inset-0 bg-muted">
          {bookingData.vehicle && (
            <motion.div
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="w-full h-full"
            >
              <Image
                src={bookingData.vehicle.image}
                alt={bookingData.vehicle.name}
                className="w-full h-full object-cover opacity-80"
              />
            </motion.div>
          )}
          {/* Cinematic Gradients */}
          {/* Cinematic Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Vehicle Info Overlay */}
        <div className="absolute bottom-0 left-0 p-8 lg:p-16 w-full z-20">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-white/80">
                {bookingData.vehicle?.category} Collection
              </span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-serif font-bold text-white mb-4 leading-none">
              {bookingData.vehicle?.name}
            </h1>
            <p className="text-white/60 text-lg max-w-md line-clamp-2">
              {bookingData.vehicle?.description}
            </p>
          </motion.div>
        </div>

        {/* Back Button (Desktop) */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 z-30 w-12 h-12 rounded-full bg-background/20 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-background/40 transition-all group"
        >
          <Icon name="ArrowLeft" className="text-foreground group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>

      {/* RIGHT PANEL - BOOKING FLOW */}
      <div className="lg:w-1/2 lg:ml-auto relative z-10 bg-background min-h-screen flex flex-col">
        {/* Header Area */}
        <div className="p-6 lg:p-12 pb-0 flex justify-between items-center">
          <div className="lg:hidden">
            {/* Mobile Back Button */}
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-muted-foreground">
              <Icon name="ArrowLeft" />
            </button>
          </div>
          <div className="flex-1 flex justify-end">
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Total Estimated</p>
              <p className="text-2xl font-serif text-foreground">
                ${bookingData.vehicle ? (bookingData.vehicle.pricePerDay * (bookingData.dates?.days || 1)).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </div>

        {/* Steps Progress */}
        <div className="px-6 lg:px-12 py-8">
          <StepIndicator currentStep={currentStep} steps={steps} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 px-6 lg:px-12 pb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="max-w-xl mx-auto"
            >
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                  <Icon name="AlertCircle" size={20} />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              {currentStep === 1 && <VehicleSelectionStep onNext={handleNext} bookingData={bookingData} />}
              {currentStep === 2 && <DateLocationStep onNext={handleNext} onPrevious={handlePrevious} bookingData={bookingData} />}
              {currentStep === 3 && <InsuranceExtrasStep onNext={handleNext} onPrevious={handlePrevious} bookingData={bookingData} onDataUpdate={handleDataUpdate} />}
              {currentStep === 4 && <PaymentStep onNext={handleNext} onPrevious={handlePrevious} bookingData={bookingData} onDataUpdate={handleDataUpdate} error={error} setError={setError} isLoading={isLoading} setLoading={setIsLoading} />}
              {currentStep === 5 && <ConfirmationStep bookingData={bookingData} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Area */}
        <div className="p-6 lg:p-12 border-t border-border text-center text-muted-foreground text-xs">
          <p>&copy; 2024 UrbanDrive. Premium Fleet Services.</p>
        </div>
      </div>
    </div>
  );
};

export default BookingWizard;