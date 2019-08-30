import moment from "moment";
import knex from "knexClient";

export default async function getAvailabilities(date) {
  const availabilities = new Map();
  let finalAvailableSlots = [];
  for (let i = 0; i < 7; ++i) {
    const tmpDate = moment(date).add(i, "days");
    availabilities.set(tmpDate.format("d"), {
      date: tmpDate.toDate(),
      slots: []
    });
  }

  const events = await knex
    .select("kind", "starts_at", "ends_at", "weekly_recurring")
    .from("events")
    .where(function() {
      this.where("weekly_recurring", true).orWhere("ends_at", ">", +date);
    });
  let openings = [];
  let busySlots = [];
  for (const event of events) {
    if (event.kind == "opening") {
      openings.push(event);
    }
  }

  for (const event of events) {
    if (event.kind != "opening") {
      busySlots.push(event);
    }
  }
  for (const opening of openings) {
    for ( let date = moment(opening.starts_at); date.isBefore(opening.ends_at); date.add(30, "minutes")) {
      const getAvailabilityForADay = availabilities.get(date.format("d"));
      if (opening.starts_at - getAvailabilityForADay.date.getTime() < 86400000) {
        if(getAvailabilityForADay.slots.indexOf(date.format("H:mm")) == -1) {
          getAvailabilityForADay.slots.push(date.format("H:mm"));
        }
      }
    }
  }
  for (const busySlot of busySlots) {
    for ( let date = moment(busySlot.starts_at); date.isBefore(busySlot.ends_at); date.add(30, "minutes")) {
      const getAvailabilityForADay = availabilities.get(date.format("d"));
      getAvailabilityForADay.slots = getAvailabilityForADay.slots.filter(
        slot => slot.indexOf(date.format("H:mm")) === -1
      );
    }
  }
  finalAvailableSlots = finalAvailableSlots.concat(Array.from(availabilities.values()));
  return finalAvailableSlots; 
}
