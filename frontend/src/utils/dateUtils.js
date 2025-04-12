// Helper functions for date operations

// Get the current week's start and end dates
export const getCurrentWeekRange = (date = new Date()) => {
  const today = new Date(date);
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - dayOfWeek);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);
  
  return { startDate, endDate };
};

// Format date to YYYY-MM-DD
export const formatDateToString = (date) => {
  return date.toISOString().split('T')[0];
};

// Format time to HH:MM
export const formatTimeToString = (date) => {
  return date.toTimeString().substring(0, 5);
};

// Parse time string (HH:MM) and combine with date
export const parseTimeString = (dateObj, timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const newDate = new Date(dateObj);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
};

// Get days of the week
export const getDaysOfWeek = () => {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
};

// Get array of time slots for the day (e.g., "09:00", "09:15", "09:30", etc.)
export const getTimeSlots = (interval = 30) => {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      slots.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  return slots;
};

// Add a function to get more granular time slots (15-minute intervals)
export const getGranularTimeSlots = () => {
  return getTimeSlots(15); // Generate slots with 15-minute intervals
};

// Check if two events overlap
export const eventsOverlap = (event1, event2) => {
  return (
    new Date(event1.startTime) < new Date(event2.endTime) &&
    new Date(event1.endTime) > new Date(event2.startTime)
  );
};

// Snap a time to the nearest 15-minute interval
export const snapToTimeSlot = (date, interval = 15) => {
  const minutes = date.getMinutes();
  const remainder = minutes % interval;
  
  const snappedDate = new Date(date);
  
  if (remainder < interval / 2) {
    // Round down
    snappedDate.setMinutes(minutes - remainder);
  } else {
    // Round up
    snappedDate.setMinutes(minutes + (interval - remainder));
  }
  
  snappedDate.setSeconds(0);
  snappedDate.setMilliseconds(0);
  
  return snappedDate;
};

// Get days in a month (for month view)
export const getMonthDays = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

// Get month name from month index
export const getMonthName = (month) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[month];
};