import knex from "knexClient";
import getAvailabilities from "./getAvailabilities";

describe("getAvailabilities", () => {
  beforeEach(() => knex("events").truncate());

  describe("case 1", () => {
    it("test 1", async () => {
      const availabilities = await getAvailabilities(new Date("2014-08-10"), 7);
      expect(availabilities.length).toBe(7);
      for (let i = 0; i < 7; ++i) {
        expect(availabilities[i].slots).toEqual([]);
      }
    });
  });

  describe("case 2", () => {
    beforeEach(async () => {
      await knex("events").insert([
        {
          kind: "appointment",
          starts_at: new Date("2014-08-11 10:30"),
          ends_at: new Date("2014-08-11 11:30")
        },
        {
          kind: "opening",
          starts_at: new Date("2014-08-04 09:30"),
          ends_at: new Date("2014-08-04 12:30"),
          weekly_recurring: true
        }
      ]);
    });

    it("test 1", async () => {
      const availabilities = await getAvailabilities(new Date("2014-08-10"), 7);
      expect(availabilities.length).toBe(7);

      expect(String(availabilities[0].date)).toBe(
        String(new Date("2014-08-10"))
      );
      expect(availabilities[0].slots).toEqual([]);

      expect(String(availabilities[1].date)).toBe(
        String(new Date("2014-08-11"))
      );
      expect(availabilities[1].slots).toEqual([
        "9:30",
        "10:00",
        "11:30",
        "12:00"
      ]);

      expect(String(availabilities[6].date)).toBe(
        String(new Date("2014-08-16"))
      );
    });

    it("test 2", async () => {
      const availabilities = await getAvailabilities(new Date("2014-08-16"), 7);
      expect(String(availabilities[0].date)).toBe(
        String(new Date("2014-08-16"))
      );
      expect(availabilities[0].slots).toEqual([]);
      expect(String(availabilities[2].date)).toBe(
        String(new Date("2014-08-18"))
      );
      expect(availabilities[2].slots).toEqual([
        "9:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00"
      ]); 
    });
  });

  describe("case 3", () => {
    beforeEach(async () => {
      await knex("events").insert([
        {
          kind: "appointment",
          starts_at: new Date("2014-08-11 10:30"),
          ends_at: new Date("2014-08-11 11:30")
        },
        {
          kind: "opening",
          starts_at: new Date("2018-08-04 09:30"),
          ends_at: new Date("2018-08-04 12:30"),
          weekly_recurring: true
        }
      ]);
    });

    it("test 1", async () => {
      const availabilities = await getAvailabilities(new Date("2014-08-10"), 7);
      expect(availabilities.length).toBe(7);

      expect(String(availabilities[0].date)).toBe(
        String(new Date("2014-08-10"))
      );
      expect(availabilities[0].slots).toEqual([]);

      expect(String(availabilities[1].date)).toBe(
        String(new Date("2014-08-11"))
      );
      expect(availabilities[6].slots).toEqual([]);
    });
  });

  describe("case 4", () => {
    beforeEach(async () => {
      await knex("events").insert([
        {
          kind: "appointment",
          starts_at: new Date("2014-08-11 10:30"),
          ends_at: new Date("2014-08-11 11:30")
        },
        {
          kind: "opening",
          starts_at: new Date("2014-08-04 09:30"),
          ends_at: new Date("2014-08-04 12:30"),
          weekly_recurring: true
        },
        {
          kind: "appointment",
          starts_at: new Date("2014-08-18 10:30"),
          ends_at: new Date("2014-08-18 11:30")
        },
        {
          kind: "opening",
          starts_at: new Date("2014-08-20 09:30"),
          ends_at: new Date("2014-08-20 12:30"),
          weekly_recurring: true
        },
        {
          kind: "appointment",
          starts_at: new Date("2014-08-20 10:30"),
          ends_at: new Date("2014-08-20 11:30")
        },
        {
          kind: "appointment",
          starts_at: new Date("2014-08-20 9:30"),
          ends_at: new Date("2014-08-20 10:30")
        }
      ]);
    });

    it("test 1", async() => {
      const availabilities = await getAvailabilities(new Date("2014-08-15"), 7);
      expect(availabilities.length).toBe(7);

      expect(String(availabilities[0].date)).toBe(
        String(new Date("2014-08-15"))
      );
      expect(availabilities[0].slots).toEqual([]);
      
      expect(String(availabilities[1].date)).toBe(
        String(new Date("2014-08-16"))
      );
      expect(availabilities[1].slots).toEqual([]);
      
      expect(String(availabilities[3].date)).toBe(
        String(new Date("2014-08-18"))
      );
      expect(availabilities[3].slots).toEqual([
        "9:30",
        "10:00",
        "11:30",
        "12:00"
      ]);
      expect(String(availabilities[4].date)).toBe(
        String(new Date("2014-08-19"))
      );
      expect(availabilities[4].slots).toEqual([]);
      expect(String(availabilities[5].date)).toBe(
        String(new Date("2014-08-20"))
      );
      expect(availabilities[5].slots).toEqual([]);
    });

    it("test 2", async() => {
      const availabilities = await getAvailabilities(new Date("2014-08-04"), 20);
      expect(availabilities.length).toBe(20);

      expect(String(availabilities[0].date)).toBe(
        String(new Date("2014-08-04"))
      );
      expect(availabilities[0].slots).toEqual([
        "9:30",
        "10:00",
        "11:30",
        "12:00"
      ]);
      
      expect(String(availabilities[1].date)).toBe(
        String(new Date("2014-08-05"))
      );
      expect(availabilities[1].slots).toEqual([]);
      
      expect(String(availabilities[3].date)).toBe(
        String(new Date("2014-08-07"))
      );
      expect(availabilities[3].slots).toEqual([]);
      expect(String(availabilities[10].date)).toBe(
        String(new Date("2014-08-14"))
      );
      expect(availabilities[11].slots).toEqual([]);
      expect(String(availabilities[5].date)).toBe(
        String(new Date("2014-08-09"))
      );
      expect(availabilities[5].slots).toEqual([]);
      expect(String(availabilities[8].date)).toBe(
        String(new Date("2014-08-12"))
      );
      expect(String(availabilities[14].date)).toBe(
        String(new Date("2014-08-18"))
      );
      expect(availabilities[14].slots).toEqual([
        "9:30",
        "10:00",
        "11:30",
        "12:00"
      ]);
      expect(String(availabilities[16].date)).toBe(
        String(new Date("2014-08-20"))
      );
      expect(availabilities[16].slots).toEqual([
        "11:30",
        "12:00"
      ]);
    });
  });

});
