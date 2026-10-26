# Congregation Coverage Source Evidence

**Research date:** 2026-09-23/24 UTC

Just Putzit’s comprehensive congregation directory should not equate a small set of official event calendars with a complete community inventory. The directory will combine public map sources, label the provenance of each result, and retain each congregation’s official calendar only when it is publicly accessible and safely parseable.

| Source | What it supports | Important limit |
|---|---|---|
| [OpenStreetMap: `amenity=place_of_worship`](https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dplace_of_worship) | A community-maintained public geospatial dataset for places where religious services are conducted. It covers nodes, areas, and multipolygon relations and is religion- and denomination-neutral. | Its mapped coverage is broad but not a universal guarantee; incomplete tags, addresses, or websites must be displayed as missing rather than inferred. |
| [Overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_API_by_Example) | A public query interface for retrieving OSM map data by tags and geographic area/bounding box. It can retrieve nodes, ways, and relations for a defined community footprint. | Public service availability can vary; use graceful fallbacks and do not present an Overpass result as an official organization claim. |
| Google Maps public place search | Supplements map coverage with public business/place listings and direct map handoffs for the selected city. | Results are provider listings, not verified organizational information or proof of active services. |

**Product rule.** “All churches in the community” means the product searches every mapped congregation candidate in the member-selected geographic community rather than publishing a handpicked list. The interface must make clear that public map data can be incomplete and direct people to an organization’s official site for current access, services, and events. No member identity, messages, bookings, or real-time location is supplied to any listing provider or congregation.
