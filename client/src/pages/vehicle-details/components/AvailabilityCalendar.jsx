import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Icon from '../../../components/AppIcon';

const AvailabilityCalendar = ({ vehicle }) => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <div className="flex-1 w-full">
        <style>{`
          .react-calendar {
            width: 100%;
            background: transparent;
            border: none;
            font-family: inherit;
          }
          .react-calendar__navigation {
            margin-bottom: 1rem;
          }
          .react-calendar__navigation button {
            color: #0f172a;
            min-width: 44px;
            background: none;
            font-size: 1rem;
            font-weight: 700;
          }
          .react-calendar__navigation button:enabled:hover,
          .react-calendar__navigation button:enabled:focus {
            background-color: #f1f5f9;
            border-radius: 8px;
          }
          .react-calendar__month-view__weekdays {
            text-align: center;
            text-transform: uppercase;
            font-weight: 700;
            font-size: 0.75em;
            color: #94a3b8;
            text-decoration: none;
          }
          .react-calendar__month-view__days__day {
            color: #0f172a;
            font-weight: 500;
            padding: 0.75rem 0;
          }
          .react-calendar__tile:enabled:hover,
          .react-calendar__tile:enabled:focus {
            background-color: #f1f5f9;
            border-radius: 8px;
            color: #0f172a;
          }
          .react-calendar__tile--now {
            background: #f8fafc;
            border-radius: 8px;
            color: #0f172a;
            border: 1px solid #e2e8f0;
          }
          .react-calendar__tile--active {
            background: #0f172a !important;
            border-radius: 8px;
            color: white !important;
          }
        `}</style>
        <Calendar
          onChange={setDate}
          value={date}
          minDate={new Date()}
          className="p-2"
        />
      </div>

      <div className="w-full md:w-auto md:min-w-[200px] space-y-4 pt-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-slate-900"></div>
          <span className="text-sm font-medium text-slate-700">Selected</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-slate-200"></div>
          <span className="text-sm font-medium text-slate-500">Available</span>
        </div>
        <div className="flex items-center gap-3 opacity-50">
          <div className="w-3 h-3 rounded-full bg-slate-100"></div>
          <span className="text-sm font-medium text-slate-400">Unavailable</span>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;