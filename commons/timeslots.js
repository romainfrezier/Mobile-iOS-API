const moment = require("moment/moment") ;
const Timeslots = require('../models/timeslots.js');

const calculateSlots = (opening, closing) => {
    const slots = [];
    let slotStart = moment(opening);
    let slotEnd = moment(opening).add(2, 'hours');
    while (slotEnd <= moment(closing)) {
      slots.push({
        start: new Date(slotStart.toISOString()),
        end: new Date(slotEnd.toISOString()),
      });
      slotStart = slotStart.add(2, 'hours');
      slotEnd = slotEnd.add(2, 'hours');
    }
    const remainingTime = moment(closing).diff(slotStart, 'minutes');
    if (remainingTime > 0) {
      const lastSlot = slots[slots.length - 1];
      const lastSlotDuration = moment(lastSlot.end).diff(lastSlot.start, 'minutes');
  
      if (remainingTime >= 120) {
        slots.push({
          start: new Date(slotStart.toISOString()),
          end: new Date(moment(closing).toISOString()),
        });
      } else if (lastSlotDuration >= 120) {
          lastSlot.end = new Date(moment(closing).toISOString());
      } else {
          lastSlot.end = new Date(moment(lastSlot.end).add(remainingTime, 'minutes').toISOString());
      }
    }
    return slots;
}

exports.addSlots = async (opening, closing) => {
    let slotsIds = [];
    const newSlots = calculateSlots(opening, closing);
    for (let slot of newSlots){
        let newSlot = new Timeslots({
            start: slot.start,
            end: slot.end
        })
        try {
            let result = await newSlot.save();
            slotsIds.push(result._id);
        } catch (error) {
            console.log(error);
        }
        // await newSlot.save((err, timeslot) => {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         slotsIds.push(timeslot._id.toString());
        //     }
        // })
    }
    console.log("slots created");
    return slotsIds;
}