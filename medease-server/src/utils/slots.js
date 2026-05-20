const env = require('@/config/env');

function generateTimeSlots(dateStr, bookedSlotStarts = []) {
  const { workingHoursStart, workingHoursEnd, slotInterval } = env.app;
  const slots = [];

  for (let hour = workingHoursStart; hour < workingHoursEnd; hour++) {
    for (let minute = 0; minute < 60; minute += slotInterval) {
      const slotStart = new Date(
        `${dateStr}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00.000Z`
      );
      const slotEnd = new Date(slotStart.getTime() + slotInterval * 60 * 1000);
      slots.push({ start: slotStart.toISOString(), end: slotEnd.toISOString() });
    }
  }

  const bookedSet = new Set(bookedSlotStarts.map((s) => new Date(s).toISOString()));
  const availableSlots = slots.filter((s) => !bookedSet.has(s.start));
  const bookedSlots = slots.filter((s) => bookedSet.has(s.start));

  return {
    date: dateStr,
    availableSlots,
    bookedSlots,
    allSlots: slots,
  };
}

module.exports = generateTimeSlots;
