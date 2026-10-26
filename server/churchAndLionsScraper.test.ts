import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  parseCorpusChristiWaukeshaEvents,
  parseCorpusChristiWaukeshaIcal,
  parseCudahyLionsClubEvents,
  parseEastbrookChurchEvents,
  parseHopeCenterWaukeshaEvents,
  parseJamesPlaceWaukeshaEvents,
  parseWaukeshaLionsClubEvents,
} from "./communityScraper";

const eastbrookFixture = `<table><tbody><tr>
  <td class="jubilee-calendar-table-day" data-date="2027-10-02">
    <ul class="jubilee-calendar-table-day-events">
      <li><a href="/events/missionsfest-night/">MissionsFest: Community Night</a><span class="jubilee-calendar-table-day-event-time">7:00 pm – 9:00 pm</span></li>
      <li><a href="/events/staff-huddle/">Staff Huddle</a><span class="jubilee-calendar-table-day-event-time">8:00 am</span></li>
    </ul>
  </td>
  <td class="jubilee-calendar-table-day" data-date="2027-10-02">
    <ul class="jubilee-calendar-table-day-events">
      <li><a href="/events/missionsfest-night/">MissionsFest: Community Night</a><span class="jubilee-calendar-table-day-event-time">7:00 pm – 9:00 pm</span></li>
    </ul>
  </td>
  <td class="jubilee-calendar-table-day" data-date="2027-09-02">
    <ul class="jubilee-calendar-table-day-events">
      <li><a href="/events/past/">Past public event</a><span class="jubilee-calendar-table-day-event-time">7:00 pm</span></li>
    </ul>
  </td></tr></tbody></table>`;

const corpusFixture = `
  <article class="event-card">
    <a href="/events/fall-rummage-sale">Corpus Christi Parish Fall Rummage Sale</a>
    <p>Thursday, October 1, 2027, 8:00 AM - 6:00 PM</p>
    <p>Discover great bargains while supporting our parish.</p>
    <a href="/events/fall-rummage-sale">Read More</a>
  </article>
  <article class="event-card">
    <a href="/events/private-committee">Private Committee Meeting</a>
    <p>Friday, October 2, 2027, 8:00 AM</p>
  </article>`;

const cudahyFixture = `
  <div style="padding: 10px;"><strong>Cudahy Lions Club Meat Raffle.</strong><br><strong>October 17, 2027</strong><br>2:00PM-4:00PM<br>Varies<br>KRanch 4840 S. Whitnall Avenue, Cudahy<br>Meat and 50/50 Raffles.<br></div>
  <div style="padding: 10px;"><strong>Members Meeting</strong><br><strong>October 20, 2027</strong><br>6:30PM<br>KRanch 4840 S. Whitnall Avenue, Cudahy<br></div>`;

const waukeshaFixture = `
  <div style="padding: 10px;"><strong>Oktoberfest</strong><br><strong>September 25, 2027</strong><br>Frame Park<br></div>
  <div style="padding: 10px;"><strong>Club Board Meeting</strong><br><strong>September 26, 2027</strong><br>Machine Shed<br></div>`;

const jamesPlaceFixture = `
  <article class="tribe-events-calendar-list__event">
    <a class="tribe-events-calendar-list__event-title-link" href="https://jamesplacewi.org/event/public-waukesha-recovery/">Waukesha Celebrate Recovery</a>
    <time class="tribe-events-calendar-list__event-datetime" datetime="2027-10-05">October 5 @ 9:30 am</time>
    <span class="tribe-events-calendar-list__event-venue-title">James Place - Waukesha</span>
    <span class="tribe-events-calendar-list__event-venue-address">129 W. Broadway, Waukesha, WI, United States</span>
    <div class="tribe-events-calendar-list__event-description">A public support and community connection gathering.</div>
  </article>
  <article class="tribe-events-calendar-list__event">
    <a class="tribe-events-calendar-list__event-title-link" href="https://outside.example/private">Staff Planning</a>
    <time class="tribe-events-calendar-list__event-datetime" datetime="2027-10-06">October 6 @ 9:00 am</time>
  </article>`;

const hopeCenterFixture = `
  <article class="tribe-events-calendar-list__event">
    <a class="tribe-events-calendar-list__event-title-link" href="https://hopecenterwi.org/event/annual-dinner/">Annual Dinner Fundraiser</a>
    <time class="tribe-events-calendar-list__event-datetime" datetime="2027-11-19">November 19 @ 5:00 pm - 10:00 pm</time>
    <span class="tribe-events-calendar-list__event-venue-title">Brookfield Conference Center</span>
    <span class="tribe-events-calendar-list__event-venue-address">325 South Moorland Rd., Brookfield</span>
    <div class="tribe-events-calendar-list__event-description">Cocktails, dinner, and auction supporting Hope Center.</div>
    <div class="tribe-events-calendar-list__event-cost">$150</div>
  </article>`;

describe("official church and Lions Club community calendars", () => {
  const referenceDate = new Date("2027-09-10T12:00:00.000Z");

  it("keeps only future public Eastbrook events with an official event handoff and Milwaukee location", () => {
    const events = parseEastbrookChurchEvents(eastbrookFixture, referenceDate);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      title: "MissionsFest: Community Night",
      venueName: "Eastbrook Church",
      venueAddress: "5353 N Green Bay Ave, Milwaukee, WI 53209",
      venueCity: "Milwaukee, WI",
      sourceName: "Eastbrook Church",
      sourceUrl: "https://eastbrook.org/events/missionsfest-night/",
      category: "church",
    });
    expect(events[0]?.eventDate.toISOString()).toContain("2027-10-03T00:00:00");
  });

  it("keeps Corpus Christi public calendar records without inventing an unstated venue", () => {
    const events = parseCorpusChristiWaukeshaEvents(corpusFixture, referenceDate);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      title: "Corpus Christi Parish Fall Rummage Sale",
      venueName: null,
      venueAddress: null,
      venueCity: "Waukesha, WI",
      sourceName: "Corpus Christi Parish",
      sourceUrl: "https://ccwauk.org/events/fall-rummage-sale",
      category: "church",
    });
  });

  it("uses the official Corpus Christi public calendar export when the listing page is unavailable to a crawler", () => {
    const events = parseCorpusChristiWaukeshaIcal(`
BEGIN:VCALENDAR
BEGIN:VEVENT
DTSTART:20271001T080000
DTEND:20271001T180000
SUMMARY:Corpus Christi Parish Fall Rummage Sale
DESCRIPTION:Discover great bargains while supporting our parish.
END:VEVENT
BEGIN:VEVENT
DTSTART:20271002T093000
SUMMARY:Sold Out Trip
DESCRIPTION:This trip is SOLD OUT.
END:VEVENT
END:VCALENDAR`, referenceDate);
    expect(events).toEqual([expect.objectContaining({
      title: "Corpus Christi Parish Fall Rummage Sale",
      venueCity: "Waukesha, WI",
      sourceUrl: "https://ccwauk.org/events",
      sourceName: "Corpus Christi Parish",
    })]);
  });

  it("keeps Lions Club fundraisers while excluding internal meetings and preserving official calendar handoffs", () => {
    const cudahy = parseCudahyLionsClubEvents(cudahyFixture, referenceDate);
    expect(cudahy).toHaveLength(1);
    expect(cudahy[0]).toMatchObject({
      title: "Cudahy Lions Club Meat Raffle",
      venueName: "KRanch",
      venueAddress: "4840 S. Whitnall Avenue, Cudahy, WI 53110",
      venueCity: "Cudahy, WI",
      sourceName: "Cudahy Lions Club",
      sourceUrl: "https://e-clubhouse.org/sites/cudahy_wi/calendar.php",
      category: "community",
    });

    const waukesha = parseWaukeshaLionsClubEvents(waukeshaFixture, referenceDate);
    expect(waukesha).toHaveLength(1);
    expect(waukesha[0]).toMatchObject({
      title: "Oktoberfest",
      venueName: "Frame Park",
      venueAddress: null,
      venueCity: "Waukesha, WI",
      sourceName: "Waukesha Lions Club",
      sourceUrl: "https://e-clubhouse.org/sites/waukesha_noon/calendar.php",
    });
  });

  it("keeps future public community-help calendar activities with direct official handoffs", () => {
    const jamesPlace = parseJamesPlaceWaukeshaEvents(jamesPlaceFixture, referenceDate);
    expect(jamesPlace).toEqual([expect.objectContaining({
      title: "Waukesha Celebrate Recovery",
      venueName: "James Place - Waukesha",
      venueAddress: "129 W. Broadway, Waukesha, WI, United States",
      venueCity: "Waukesha, WI",
      sourceName: "James Place Waukesha",
      sourceUrl: "https://jamesplacewi.org/event/public-waukesha-recovery/",
    })]);

    const hopeCenter = parseHopeCenterWaukeshaEvents(hopeCenterFixture, referenceDate);
    expect(hopeCenter).toEqual([expect.objectContaining({
      title: "Annual Dinner Fundraiser",
      venueName: "Brookfield Conference Center",
      venueAddress: "325 South Moorland Rd., Brookfield",
      venueCity: "Brookfield, WI",
      sourceName: "Hope Center WI",
      sourceUrl: "https://hopecenterwi.org/event/annual-dinner/",
      isFree: false,
    })]);
  });

  it("registers official church, community-help, and Lions sources for nightly refresh and exposes church and Lions filters", () => {
    const scraper = readFileSync(resolve(__dirname, "communityScraper.ts"), "utf8");
    const scheduled = readFileSync(resolve(__dirname, "scheduledScrape.ts"), "utf8");
    const activityBoard = readFileSync(resolve(__dirname, "../client/src/pages/ActivityBoard.tsx"), "utf8");
    const schema = readFileSync(resolve(__dirname, "../drizzle/schema.ts"), "utf8");
    const db = readFileSync(resolve(__dirname, "db.ts"), "utf8");

    for (const sourceKey of ["eastbrook_church", "corpus_christi_church", "james_place_waukesha", "hope_center_waukesha", "cudahy_lions", "waukesha_lions"]) {
      expect(scraper).toContain(`sourceKey: \"${sourceKey}\"`);
    }
    expect(scheduled).toContain("scrapeAllMilwaukeeEventsWithHealth");
    expect(activityBoard).toContain("lions_club");
    expect(activityBoard).toContain("Churches & Lions Clubs");
    expect(schema).toContain('"lions_club"');
    expect(db).toContain('"Cudahy Lions Club": "lions_club"');
    expect(db).toContain('"James Place Waukesha": "church"');
    expect(db).toContain('"Hope Center WI": "community"');
  });
});
