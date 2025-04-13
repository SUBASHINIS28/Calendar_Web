import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDrop } from 'react-dnd';
import { fetchEvents, updateEvent, addEvent } from '../redux/slices/eventsSlice';
import { 
  getCurrentWeekRange, 
  formatDateToString, 
  getDaysOfWeek, 
  getTimeSlots,
  getMonthName 
} from '../utils/dateUtils';
import EventTile from './EventTile';
import EventModal from './EventModal';
import ErrorNotification from './ErrorNotification';
import '../styles/calendar.css';

const Calendar = () => {
  const dispatch = useDispatch();
  const { items: events, loading, error } = useSelector(state => state.events);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeekRange());
  const [errorMessages, setErrorMessages] = useState([]);
  const [viewType, setViewType] = useState('week'); // 'day', 'week', 'month', 'year'
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Get days of the week and time slots
  const daysOfWeek = getDaysOfWeek();
  const timeSlots = getTimeSlots();

  // Fetch events based on the current view
  useEffect(() => {
    let startDate, endDate;
    
    switch(viewType) {
      case 'day':
        startDate = new Date(currentDate);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(currentDate);
        endDate.setHours(23, 59, 59, 999);
        break;
        
      case 'week':
        startDate = currentWeek.startDate;
        endDate = currentWeek.endDate;
        break;
        
      case 'month':
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
        
      case 'year':
        startDate = new Date(currentDate.getFullYear(), 0, 1);
        endDate = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;
        
      default:
        startDate = currentWeek.startDate;
        endDate = currentWeek.endDate;
    }
    
    dispatch(fetchEvents({ 
      startDate: formatDateToString(startDate),
      endDate: formatDateToString(endDate)
    }));
  }, [dispatch, currentWeek, viewType, currentDate]);

  useEffect(() => {
    if (error) {
      const newError = {
        id: Date.now(),
        message: error
      };
      setErrorMessages(prev => [...prev, newError]);
    }
  }, [error]);

  // Handle click on a time slot to open event creation modal
  const handleSlotClick = (day, timeSlot) => {
    let slotDate;
    
    if (viewType === 'day') {
      slotDate = new Date(currentDate);
    } else if (viewType === 'month') {
      slotDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    } else {
      // Week view
      slotDate = new Date(currentWeek.startDate);
      slotDate.setDate(slotDate.getDate() + daysOfWeek.indexOf(day));
    }
    
    // Parse time slot (e.g., "09:00") if provided
    if (timeSlot) {
      const [hours, minutes] = timeSlot.split(':').map(Number);
      slotDate.setHours(hours, minutes, 0, 0);
    } else {
      // For month/year view, set default time to 9:00 AM
      slotDate.setHours(9, 0, 0, 0);
    }
    
    // Create end time (30 min later)
    const endTime = new Date(slotDate);
    endTime.setMinutes(endTime.getMinutes() + 30);
    
    setSelectedSlot({
      date: slotDate,
      startTime: slotDate,
      endTime: endTime
    });
    
    setShowModal(true);
  };

  // Navigate to previous/next period based on current view
  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    
    switch(viewType) {
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'prev' ? -1 : 1));
        setCurrentDate(newDate);
        break;
        
      case 'week':
        const { startDate, endDate } = currentWeek;
        const newStartDate = new Date(startDate);
        const newEndDate = new Date(endDate);
        
        if (direction === 'prev') {
          newStartDate.setDate(newStartDate.getDate() - 7);
          newEndDate.setDate(newEndDate.getDate() - 7);
        } else {
          newStartDate.setDate(newStartDate.getDate() + 7);
          newEndDate.setDate(newEndDate.getDate() + 7);
        }
        
        setCurrentWeek({ startDate: newStartDate, endDate: newEndDate });
        setCurrentDate(new Date(newStartDate)); // Update current date as well
        break;
        
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'prev' ? -1 : 1));
        setCurrentDate(newDate);
        break;
        
      case 'year':
        newDate.setFullYear(newDate.getFullYear() + (direction === 'prev' ? -1 : 1));
        setCurrentDate(newDate);
        break;
        
      default:
        console.warn(`Unexpected view type: ${viewType}`);
        break;
    }
  };

  // Handle view type change
  const handleViewChange = (newView) => {
    setViewType(newView);
    
    // Reset current date/week as needed
    if (newView === 'week') {
      setCurrentWeek(getCurrentWeekRange(currentDate));
    }
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSlot(null);
  };

  // Filter events for a specific day and time slot (week view)
  const getEventsForSlot = (day, timeSlot) => {
    if (!events || events.length === 0) return [];
    
    const dayIndex = daysOfWeek.indexOf(day);
    const slotDate = new Date(currentWeek.startDate);
    slotDate.setDate(slotDate.getDate() + dayIndex);
    
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotStartTime = new Date(slotDate);
    slotStartTime.setHours(hours, minutes, 0, 0);
    
    const slotEndTime = new Date(slotStartTime);
    slotEndTime.setMinutes(slotEndTime.getMinutes() + 30); // Assuming 30-minute slots
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      const eventStart = new Date(event.startTime);
      const eventEnd = new Date(event.endTime);
      
      // Check if the event is on this day
      if (eventDate.getDate() !== slotDate.getDate() || 
          eventDate.getMonth() !== slotDate.getMonth() || 
          eventDate.getFullYear() !== slotDate.getFullYear()) {
        return false;
      }
      
      // Check if the event overlaps with this time slot
      // This handles partial overlaps for 15-minute events too
      const isMatch = eventStart < slotEndTime && eventEnd > slotStartTime;

      console.log('Checking event match:', {
        event: event.title,
        eventDate: new Date(event.date).toISOString(),
        eventStart: new Date(event.startTime).toISOString(),
        eventStartHours: new Date(event.startTime).getHours(),
        eventStartMinutes: new Date(event.startTime).getMinutes(),
        slotDate: slotDate.toISOString(),
        slotStart: slotStartTime.toISOString(),
        slotStartHours: hours,
        slotStartMinutes: minutes,
        isMatch: isMatch
      });

      return isMatch;
    });
  };

  // Get events for a specific day (day/month view)
  const getEventsForDay = (day) => {
    if (!events || events.length === 0) return [];
    
    let dayDate;
    if (viewType === 'day') {
      dayDate = new Date(currentDate);
    } else if (viewType === 'month') {
      dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    } else {
      dayDate = new Date(currentWeek.startDate);
      dayDate.setDate(dayDate.getDate() + daysOfWeek.indexOf(day));
    }
    
    // Set time to midnight for date comparison
    dayDate.setHours(0, 0, 0, 0);
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      
      return eventDate.getTime() === dayDate.getTime();
    });
  };

  // Get events for a specific month
  const getEventsForMonth = (month) => {
    if (!events || events.length === 0) return [];
    
    const monthStart = new Date(currentDate.getFullYear(), month, 1);
    const monthEnd = new Date(currentDate.getFullYear(), month + 1, 0, 23, 59, 59, 999);
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= monthStart && eventDate <= monthEnd;
    });
  };

  // Calendar Cell component for drops
  const CalendarCell = ({ day, timeSlot, events }) => {
    const dispatch = useDispatch();
    
    const [{ isOver }, drop] = useDrop({
      accept: 'EVENT',
      drop: (item) => handleEventDrop(item, day, timeSlot),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    });

    const [{ isTaskOver }, taskDrop] = useDrop({
      accept: 'TASK',
      drop: (item) => handleTaskDrop(item, day, timeSlot),
      collect: (monitor) => ({
        isTaskOver: !!monitor.isOver(),
      }),
    });

    // Check for event overlaps
    const checkEventOverlap = (draggedEvent, newStartTime, newEndTime) => {
      // Implementation remains the same
      const newDate = new Date(newStartTime);
      newDate.setHours(0, 0, 0, 0);
      
      const eventsOnDay = events.filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate.getTime() === newDate.getTime() && event._id !== draggedEvent._id;
      });
      
      return eventsOnDay.some(event => {
        const eventStart = new Date(event.startTime);
        const eventEnd = new Date(event.endTime);
        
        return (
          (newStartTime < eventEnd && newEndTime > eventStart)
        );
      });
    };

    // Handle event drop
    const handleEventDrop = (item, day, timeSlot) => {
      // Create a target date object for where the event is being dropped
      let slotDate;
      
      if (viewType === 'day') {
        slotDate = new Date(currentDate);
      } else if (viewType === 'month') {
        slotDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), parseInt(day));
      } else {
        // For week view
        slotDate = new Date(currentWeek.startDate);
        slotDate.setDate(slotDate.getDate() + daysOfWeek.indexOf(day));
      }
      
      if (timeSlot) {
        const [hours, minutes] = timeSlot.split(':').map(Number);
        slotDate.setHours(hours, minutes, 0, 0);
      } else {
        // Default to 9 AM for month view
        slotDate.setHours(9, 0, 0, 0);
      }
      
      const draggedEvent = events.find(event => event._id === item.id);
      
      if (draggedEvent) {
        // Calculate duration of original event to maintain same length
        const eventStart = new Date(draggedEvent.startTime);
        const eventEnd = new Date(draggedEvent.endTime);
        const eventDuration = eventEnd - eventStart;
        
        // Calculate new end time based on the duration
        const newEndTime = new Date(slotDate.getTime() + eventDuration);
        
        // Check for overlaps
        const hasOverlap = checkEventOverlap(draggedEvent, slotDate, newEndTime);
        
        if (hasOverlap) {
          alert("Cannot move event: it would overlap with another event.");
          return;
        }
        
        // Create updated event data
        const updatedEvent = {
          ...draggedEvent,
          startTime: slotDate.toISOString(),
          endTime: newEndTime.toISOString(),
          date: new Date(slotDate.setHours(0, 0, 0, 0)).toISOString()
        };
        
        // Dispatch the update action
        dispatch(updateEvent({ 
          id: draggedEvent._id, 
          eventData: updatedEvent 
        }));
      }
    };

    // Handle task drop
    const handleTaskDrop = (item, day, timeSlot) => {
      // Implementation for handling task drops remains similar
      if (!item.task) return;
      
      let slotDate;
      
      if (viewType === 'day') {
        slotDate = new Date(currentDate);
      } else if (viewType === 'month') {
        slotDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), parseInt(day));
      } else {
        slotDate = new Date(currentWeek.startDate);
        slotDate.setDate(slotDate.getDate() + daysOfWeek.indexOf(day));
      }
      
      if (timeSlot) {
        const [hours, minutes] = timeSlot.split(':').map(Number);
        slotDate.setHours(hours, minutes, 0, 0);
      } else {
        // Default to 9 AM for month view
        slotDate.setHours(9, 0, 0, 0);
      }
      
      const endTime = new Date(slotDate);
      endTime.setMinutes(endTime.getMinutes() + 30);
      
      const eventData = {
        title: item.task.name,
        category: 'work',
        date: slotDate,
        startTime: slotDate,
        endTime: endTime,
        color: item.task.color,
        isExpanded: false
      };
      
      dispatch(addEvent(eventData));
    };
    
    return (
      <div 
        ref={node => {
          drop(node);
          taskDrop(node);
        }}
        className={`calendar-cell ${isOver || isTaskOver ? 'drop-hover' : ''}`}
        onClick={() => handleSlotClick(day, timeSlot)}
      >
        {events.map(event => (
          <EventTile 
            key={event._id} 
            event={event} 
            currentWeek={currentWeek}
            viewType={viewType}
          />
        ))}
      </div>
    );
  };

  // Month Cell component for month view
  const MonthCell = ({ day, events, isCurrentMonth = true }) => {
    const dispatch = useDispatch(); // Add this line to get access to dispatch

    // Check for event overlaps - copy this from the CalendarCell component
    const checkEventOverlap = (draggedEvent, newStartTime, newEndTime) => {
      const newDate = new Date(newStartTime);
      newDate.setHours(0, 0, 0, 0);
      
      const eventsOnDay = events.filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate.getTime() === newDate.getTime() && event._id !== draggedEvent._id;
      });
      
      return eventsOnDay.some(event => {
        const eventStart = new Date(event.startTime);
        const eventEnd = new Date(event.endTime);
        
        return (
          (newStartTime < eventEnd && newEndTime > eventStart)
        );
      });
    };

    // Define handleEventDrop within the MonthCell scope
    const handleEventDrop = (item) => {
      const slotDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), parseInt(day));
      
      // Default to 9 AM for month view
      slotDate.setHours(9, 0, 0, 0);
      
      const draggedEvent = events.find(event => event._id === item.id);
      
      if (draggedEvent) {
        const eventDuration = new Date(draggedEvent.endTime) - new Date(draggedEvent.startTime);
        const newEndTime = new Date(slotDate.getTime() + eventDuration);
        
        const hasOverlap = checkEventOverlap(draggedEvent, slotDate, newEndTime);
        
        if (hasOverlap) {
          alert("Cannot move event: it would overlap with another event.");
          return;
        }
        
        const updatedEvent = {
          ...draggedEvent,
          startTime: slotDate,
          endTime: newEndTime,
          date: new Date(new Date(slotDate).setHours(0, 0, 0, 0))
        };
        
        dispatch(updateEvent({ 
          id: draggedEvent._id, 
          eventData: updatedEvent 
        }));
      }
    };

    // Define handleTaskDrop within the MonthCell scope
    const handleTaskDrop = (item) => {
      if (!item.task) return;
      
      const slotDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), parseInt(day));
      
      // Default to 9 AM for month view
      slotDate.setHours(9, 0, 0, 0);
      
      const endTime = new Date(slotDate);
      endTime.setMinutes(endTime.getMinutes() + 30);
      
      const eventData = {
        title: item.task.name,
        category: 'work',
        date: slotDate,
        startTime: slotDate,
        endTime: endTime,
        color: item.task.color,
        isExpanded: false
      };
      
      dispatch(addEvent(eventData));
    };

    const [{ isOver }, drop] = useDrop({
      accept: ['EVENT', 'TASK'],
      drop: (item) => {
        if (item.type === 'EVENT') {
          handleEventDrop(item);
        } else if (item.type === 'TASK') {
          handleTaskDrop(item);
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    });
    
    const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const isToday = new Date().toDateString() === cellDate.toDateString();
    
    return (
      <div 
        ref={drop}
        className={`month-cell ${isOver ? 'drop-hover' : ''} ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
        onClick={() => handleSlotClick(day)}
      >
        <div className="month-cell-header">
          <span className="day-number">{day}</span>
        </div>
        <div className="month-cell-events">
          {events.slice(0, 3).map(event => (
            <div 
              key={event._id} 
              className="month-event" 
              style={{ backgroundColor: event.color }}
            >
              {event.title}
            </div>
          ))}
          {events.length > 3 && (
            <div className="more-events">+{events.length - 3} more</div>
          )}
        </div>
      </div>
    );
  };

  // Day Cell component for day view
  const DayViewCell = ({ timeSlot, events }) => {
    return (
      <CalendarCell
        day={null}
        timeSlot={timeSlot}
        events={events}
      />
    );
  };

  // Year cell component for year view
  const YearCell = ({ month }) => {
    const monthName = getMonthName(month);
    const monthEvents = getEventsForMonth(month);
    
    return (
      <div 
        className="year-cell"
        onClick={() => {
          setCurrentDate(new Date(currentDate.getFullYear(), month, 1));
          setViewType('month');
        }}
      >
        <div className="year-cell-header">{monthName}</div>
        <div className="year-cell-content">
          <div className="event-count">
            {monthEvents.length} {monthEvents.length === 1 ? 'event' : 'events'}
          </div>
        </div>
      </div>
    );
  };

  const dismissError = (id) => {
    setErrorMessages(prev => prev.filter(err => err.id !== id));
  };

  // Render header based on current view
  const renderHeader = () => {
    let title;
    
    switch (viewType) {
      case 'day':
        title = formatDateToString(currentDate);
        break;
      case 'week':
        title = `${formatDateToString(currentWeek.startDate)} to ${formatDateToString(currentWeek.endDate)}`;
        break;
      case 'month':
        title = `${getMonthName(currentDate.getMonth())} ${currentDate.getFullYear()}`;
        break;
      case 'year':
        title = currentDate.getFullYear().toString();
        break;
      default:
        title = '';
    }

    return (
      <div className="calendar-header">
        <div className="nav-buttons">
          <button 
            className="nav-button" 
            onClick={() => navigateDate('prev')}
          >
            Previous {viewType}
          </button>
          <button 
            className="nav-button today-button" 
            onClick={() => {
              const today = new Date();
              setCurrentDate(today);
              if (viewType === 'week') {
                setCurrentWeek(getCurrentWeekRange(today));
              }
            }}
          >
            Today
          </button>
          <button 
            className="nav-button" 
            onClick={() => navigateDate('next')}
          >
            Next {viewType}
          </button>
        </div>
        
        <h2>{title}</h2>
        
        <div className="view-buttons">
          <button 
            className={`view-button ${viewType === 'day' ? 'active' : ''}`}
            onClick={() => handleViewChange('day')}
          >
            Day
          </button>
          <button 
            className={`view-button ${viewType === 'week' ? 'active' : ''}`}
            onClick={() => handleViewChange('week')}
          >
            Week
          </button>
          <button 
            className={`view-button ${viewType === 'month' ? 'active' : ''}`}
            onClick={() => handleViewChange('month')}
          >
            Month
          </button>
          <button 
            className={`view-button ${viewType === 'year' ? 'active' : ''}`}
            onClick={() => handleViewChange('year')}
          >
            Year
          </button>
        </div>
      </div>
    );
  };

  // Render calendar content based on view type
  const renderCalendarContent = () => {
    switch (viewType) {
      case 'day':
        return renderDayView();
      case 'week':
        return renderWeekView();
      case 'month':
        return renderMonthView();
      case 'year':
        return renderYearView();
      default:
        return renderWeekView();
    }
  };

  // Render day view
  const renderDayView = () => {
    return (
      <div className="day-view">
        <div className="day-column single-day">
          <div className="header-cell">{formatDateToString(currentDate)}</div>
          <div className="day-slots">
            {timeSlots.map(timeSlot => {
              const slotEvents = getEventsForDay(currentDate.getDate()).filter(event => {
                const eventStart = new Date(event.startTime);
                const eventEnd = new Date(event.endTime);
                
                const [hours, minutes] = timeSlot.split(':').map(Number);
                const slotStart = new Date(currentDate);
                slotStart.setHours(hours, minutes, 0, 0);
                
                const slotEnd = new Date(slotStart);
                slotEnd.setMinutes(slotEnd.getMinutes() + 30);
                
                return eventStart < slotEnd && eventEnd > slotStart;
              });
              
              return (
                <div key={timeSlot} className="day-time-slot">
                  <div className="time-cell">{timeSlot}</div>
                  <DayViewCell 
                    timeSlot={timeSlot} 
                    events={slotEvents} 
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Render week view (original calendar view)
  const renderWeekView = () => {
    return (
      <div className="calendar-grid">
        {/* Time column */}
        <div className="time-column">
          <div className="header-cell"></div>
          {timeSlots.map(timeSlot => (
            <div key={timeSlot} className="time-cell">
              {timeSlot}
            </div>
          ))}
        </div>
        
        {/* Day columns */}
        {daysOfWeek.map(day => (
          <div key={day} className="day-column">
            <div className="header-cell">{day}</div>
            {timeSlots.map(timeSlot => {
              const slotEvents = getEventsForSlot(day, timeSlot);
              
              return (
                <CalendarCell 
                  key={`${day}-${timeSlot}`}
                  day={day}
                  timeSlot={timeSlot}
                  events={slotEvents}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  // Render month view
  const renderMonthView = () => {
    // Get all days in the month
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    
    // Get the first day of the month
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    
    // Get the last day of the previous month
    const lastDayPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    
    // Array to hold all days to be shown (including days from prev/next months to fill grid)
    const days = [];
    
    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: lastDayPrevMonth - i,
        isCurrentMonth: false,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, lastDayPrevMonth - i)
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
      });
    }
    
    // Next month days (to fill out the grid to 42 cells - 6 rows of 7 days)
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i)
      });
    }
    
    return (
      <div className="month-view">
        <div className="month-header">
          {daysOfWeek.map(day => (
            <div key={day} className="month-weekday">{day.substring(0, 3)}</div>
          ))}
        </div>
        <div className="month-grid">
          {days.map((day, index) => {
            let dayEvents = [];
            if (day.isCurrentMonth) {
              dayEvents = getEventsForDay(day.day);
            }
            
            return (
              <MonthCell 
                key={index}
                day={day.day}
                events={dayEvents}
                isCurrentMonth={day.isCurrentMonth}
              />
            );
          })}
        </div>
      </div>
    );
  };

  // Render year view
  const renderYearView = () => {
    // Generate all months in the year
    const months = [];
    for (let i = 0; i < 12; i++) {
      months.push(i);
    }
    
    return (
      <div className="year-view">
        {months.map(month => (
          <YearCell key={month} month={month} />
        ))}
      </div>
    );
  };

  return (
    <div className="calendar-container">
      {renderHeader()}
      
      {loading && <div className="loading">Loading events...</div>}
      {error && <div className="error">Error loading events: {error}</div>}
      
      {renderCalendarContent()}
      
      {showModal && (
        <EventModal 
          isOpen={showModal}
          onClose={handleCloseModal}
          initialData={selectedSlot}
        />
      )}
      
      {errorMessages.map(err => (
        <ErrorNotification 
          key={err.id}
          message={err.message}
          onDismiss={() => dismissError(err.id)}
        />
      ))}
    </div>
  );
};

export default Calendar;