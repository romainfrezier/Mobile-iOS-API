const moment = require("moment/moment") ;

const calculateSlots = (opening, closing) => {
    const slots = [];
    let openingDate = new Date(opening);
    let closingDate = new Date(closing)
    console.log(opening);
    console.log(openingDate);
    let slotStart = moment(opening);
    let slotEnd = moment(opening).add(2, 'hours');
    console.log(slotStart);
  
    while (slotEnd <= moment(closing)) {
      slots.push({
        start: new Date(slotStart.toISOString()),
        end: new Date(slotEnd.toISOString()),
      });
      slotStart = slotStart.add(2, 'hours');
      slotEnd = slotEnd.add(2, 'hours');
      console.log("here")
      console.log(slots)
    }
  
    const remainingTime = moment(closing).diff(slotStart, 'minutes');
    if (remainingTime > 0) {
      const lastSlot = slots[slots.length - 1];
      const lastSlotDuration = moment(lastSlot.end).diff(lastSlot.start, 'minutes');
      console.log(lastSlotDuration);
      console.log(remainingTime);
  
      if (remainingTime >= 120) {
        slots.push({
          start: new Date(slotStart.toISOString()),
          end: new Date(moment(closing).toISOString()),
        });
      } else if (lastSlotDuration >= 120) {
        lastSlot.end = new Date(moment(closing).toISOString());
      } else {
        const updatedSlotEnd = new Date(moment(lastSlot.end).add(remainingTime, 'minutes').toISOString());
        lastSlot.end = updatedSlotEnd;
      }
    }
    console.log(slots)
  
    return slots;
}

exports.addSlots = async (opening, closing) => {
    let slotsIds = [];
    const newSlots = calculateSlots(opening, closing);
    for (let slot of newSlots){
        await slot.save((err, timeslot) => {
            if (err) {
                console.log(err);
            } else {
                slotsIds.push(timeslot._id);
            }
        })
    }
    return slotsIds;
}