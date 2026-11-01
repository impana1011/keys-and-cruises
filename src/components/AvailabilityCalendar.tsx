import { useState } from "react";
import { bookingService } from "@/services/api";
import { maintenanceService } from "@/services/maintenanceService";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2, XCircle, Wrench } from "lucide-react";

interface AvailabilityCalendarProps {
  vehicleId: string;
  selectedPickup?: string | undefined;
  selectedReturn?: string | undefined;
  onSelectRange?: ((pickup: string, ret: string) => void) | undefined;
}

export function AvailabilityCalendar({
  vehicleId,
  selectedPickup = "",
  selectedReturn = "",
  onSelectRange,
}: AvailabilityCalendarProps) {
  // Use November 2026 as current view (matching system mock date 2026-10-31 / 2026-11)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10); // 10 is November (0-indexed)

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Fetch active bookings for this vehicle
  const bookings = bookingService
    .getAll()
    .filter((b) => b.vehicleId === vehicleId && b.status !== "Cancelled");

  const isDateBooked = (dateStr: string) => {
    return bookings.some((b) => dateStr >= b.pickupDate && dateStr <= b.returnDate);
  };

  const isDateUnderMaintenance = (dateStr: string) => {
    const check = maintenanceService.canBookVehicle(vehicleId, dateStr, dateStr);
    return !check.canBook;
  };

  const handleDateClick = (dateStr: string) => {
    if (!onSelectRange) return;
    if (isDateBooked(dateStr) || isDateUnderMaintenance(dateStr)) return;

    if (!selectedPickup || (selectedPickup && selectedReturn)) {
      // Start new selection
      onSelectRange(dateStr, "");
    } else if (selectedPickup && !selectedReturn) {
      if (dateStr > selectedPickup) {
        // Complete range
        onSelectRange(selectedPickup, dateStr);
      } else {
        // Reset pickup
        onSelectRange(dateStr, "");
      }
    }
  };

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm text-card-foreground">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon size={18} className="text-primary" />
          <h3 className="font-bold text-sm">
            {monthNames[currentMonth]} {currentYear}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
            title="Previous month"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
            title="Next month"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-muted-foreground mb-1.5">
        <span>Su</span>
        <span>Mo</span>
        <span>Tu</span>
        <span>We</span>
        <span>Th</span>
        <span>Fr</span>
        <span>Sa</span>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-xs">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="h-8 rounded" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const monthStr = String(currentMonth + 1).padStart(2, "0");
          const dayStr = String(day).padStart(2, "0");
          const dateStr = `${currentYear}-${monthStr}-${dayStr}`;

          const booked = isDateBooked(dateStr);
          const maint = isDateUnderMaintenance(dateStr);
          const isSelectedPickup = selectedPickup === dateStr;
          const isSelectedReturn = selectedReturn === dateStr;
          const isInSelectedRange =
            selectedPickup && selectedReturn && dateStr >= selectedPickup && dateStr <= selectedReturn;

          let bgClass = "bg-background hover:border-primary border border-border text-foreground";
          let cursor = "cursor-pointer hover:bg-primary/10";
          let title = "Available for rental — Click to select";

          if (booked) {
            bgClass = "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300";
            cursor = "cursor-not-allowed opacity-80";
            title = "Booked by another customer";
          } else if (maint) {
            bgClass = "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300";
            cursor = "cursor-not-allowed opacity-80";
            title = "Blocked for scheduled maintenance";
          } else if (isSelectedPickup || isSelectedReturn) {
            bgClass = "bg-primary text-primary-foreground font-bold border-primary shadow-sm";
            title = isSelectedPickup ? "Pickup Date" : "Return Date";
          } else if (isInSelectedRange) {
            bgClass = "bg-primary/20 text-primary font-medium border-primary/40";
            title = "Selected Rental Period";
          }

          return (
            <button
              key={dateStr}
              type="button"
              disabled={booked || maint || !onSelectRange}
              onClick={() => handleDateClick(dateStr)}
              className={`h-8 rounded flex items-center justify-center font-medium transition-all text-center ${bgClass} ${cursor}`}
              title={title}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Calendar Legend */}
      <div className="mt-4 pt-3 border-t grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
          <span>Maintenance</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
          <span>Selected</span>
        </div>
      </div>
      {onSelectRange && (
        <p className="text-[11px] text-muted-foreground mt-2 text-center italic">
          💡 Click an available date to set Pickup, then click another to set Return.
        </p>
      )}
    </div>
  );
}
