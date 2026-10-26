import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { makeRequest } = vi.hoisted(() => ({ makeRequest: vi.fn() }));
vi.mock("./_core/map", () => ({ makeRequest }));

import { getCommunityDirectory, isCommunityDirectoryCity } from "./communityDirectory";

const publicPlaces = {
  results: [
    {
      place_id: "church-one",
      name: "Supplemental Community Church",
      formatted_address: "100 Main St, Waukesha, WI",
      types: ["church", "place_of_worship"],
      geometry: { location: { lat: 43.01, lng: -88.23 } },
    },
  ],
};

const publicCongregationMapInventory = {
  elements: [
    { type: "node", id: 101, lat: 43.0101, lon: -88.2311, tags: { name: "First Neighborhood Church", amenity: "place_of_worship", "addr:housenumber": "101", "addr:street": "Main Street", "addr:city": "Waukesha", "addr:state": "WI", religion: "christian", denomination: "lutheran" } },
    { type: "way", id: 102, center: { lat: 43.0202, lon: -88.2422 }, tags: { name: "All Saints Parish", building: "church", "addr:housenumber": "202", "addr:street": "Oak Avenue", "addr:city": "Waukesha", "addr:state": "WI" } },
    { type: "relation", id: 103, center: { lat: 43.0303, lon: -88.2533 }, tags: { name: "Community Mosque", amenity: "place_of_worship", "addr:housenumber": "303", "addr:street": "Elm Road", "addr:city": "Waukesha", "addr:state": "WI", religion: "muslim" } },
  ],
};

function overpassResponse(elements = publicCongregationMapInventory.elements) {
  return { ok: true, json: async () => ({ elements }) };
}

describe("community church and help directory", () => {
  beforeEach(() => {
    makeRequest.mockReset();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("builds the congregation directory from every public mapped worship record, not a handpicked church list", async () => {
    makeRequest.mockResolvedValue(publicPlaces);
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue(overpassResponse() as Response);

    const result = await getCommunityDirectory({ city: "Waukesha", state: "WI", kind: "churches", lat: 43.0117, lng: -88.2315 });

    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("overpass-api.de/api/interpreter?data="), expect.objectContaining({ signal: expect.anything() }));
    const query = decodeURIComponent(String(fetchMock.mock.calls[0]?.[0]).split("data=")[1] ?? "");
    expect(query).toContain('["amenity"="place_of_worship"]');
    expect(query).toContain('["building"="church"]');
    expect(query).toContain('["amenity"="place_of_worship"]');
    expect(result.congregationCoverage).toMatchObject({ available: true, radiusMiles: 10 });
    expect(result.mapResults).toHaveLength(3);
    expect(result.mapResults.map((item) => item.name)).toEqual(expect.arrayContaining(["First Neighborhood Church", "All Saints Parish", "Community Mosque"]));
    expect(result.mapResults.every((item) => item.source === "OpenStreetMap")).toBe(true);
    expect(result.supplementalMapResults).toEqual([]);
    expect(result.verifiedResources).toEqual([]);
    expect(makeRequest).not.toHaveBeenCalled();
  });

  it("marks the full inventory unavailable instead of passing a short fallback list off as complete", async () => {
    makeRequest.mockResolvedValue(publicPlaces);
    vi.mocked(fetch).mockRejectedValue(new Error("Public map temporarily unavailable"));

    const result = await getCommunityDirectory({ city: "Madison", state: "WI", kind: "churches", lat: 43.073, lng: -89.401 });

    expect(result.congregationCoverage).toMatchObject({ available: false });
    expect(result.mapResults).toEqual([]);
    expect(result.supplementalMapResults).toEqual([]);
  });

  it("keeps Waukesha help cards grounded in public official organization pages", async () => {
    makeRequest.mockResolvedValue({ results: [] });

    const result = await getCommunityDirectory({ city: "Waukesha", state: "WI", kind: "help" });
    const names = result.verifiedResources.map((item) => item.name);
    const serialized = JSON.stringify(result.verifiedResources).toLowerCase();

    expect(names).toEqual(expect.arrayContaining([
      "James Place Waukesha",
      "The Salvation Army – Waukesha Corps Community Center",
      "Hope Center WI",
    ]));
    expect(result.verifiedResources).toHaveLength(3);
    expect(serialized).not.toContain("@");
    expect(serialized).not.toContain("staff");
    expect(makeRequest).toHaveBeenCalledWith("/maps/api/place/textsearch/json", expect.objectContaining({ query: "community resource centers in Waukesha, WI" }));
  });

  it("accepts practical city queries and rejects empty city searches", () => {
    expect(isCommunityDirectoryCity("La Crosse")).toBe(true);
    expect(isCommunityDirectoryCity(" ")).toBe(false);
  });

  it("renders complete, source-labeled congregation coverage on the active Community Events route", () => {
    const board = readFileSync(resolve(__dirname, "../client/src/pages/ActivityBoard.tsx"), "utf8");
    const panel = readFileSync(resolve(__dirname, "../client/src/components/CommunityDirectoryPanel.tsx"), "utf8");
    const service = readFileSync(resolve(__dirname, "communityDirectory.ts"), "utf8");

    expect(board).toContain('import { CommunityDirectoryPanel } from "@/components/CommunityDirectoryPanel"');
    expect(board).toContain("<CommunityDirectoryPanel city={userCity ?? effectiveCity}");
    expect(board).toContain('get("tab") === "community"');
    expect(panel).toContain("Every local congregation");
    expect(panel).toContain("Complete public congregation map inventory");
    expect(panel).toContain("Show {Math.min(CONGREGATION_INCREMENT, remainingCongregations)} more congregation");
    expect(panel).not.toContain("slice(0, 40)");
    expect(panel).toContain("Supplemental public Google Maps matches");
    expect(panel).toContain("does not rank one faith community above another");
    expect(panel).toContain("does not send your profile, messages, booking history, or real-time location");
    expect(service).toContain("OpenStreetMap");
    expect(service).toContain("not a handpicked source list");
  });
});
