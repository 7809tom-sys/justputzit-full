# La Crosse, Wisconsin Discovery Source Audit

_Reviewed September 2026 for current, future-only Community Events discovery._

## Current Coverage Gap

The active La Crosse activity inventory contains public-access venues, but no active future Community Events were stored under the exact La Crosse city label at the time of review. This explains why a member could see only limited university-origin discovery.

## Accessible Authoritative Sources

| Source | Public URL | Verified value | Adapter decision |
| --- | --- | --- | --- |
| City of La Crosse Parks, Recreation & Forestry | `https://www.cityoflacrosse.org/Your-Government/Departments/Parks-Recreation-Forestry/Recreation/Activities-Calendar` | Current dated city recreation programs, descriptions, detail pages, recurring-occurrence text, and exact City of La Crosse identity. | Candidate for a future-only city recreation source. Parse only dated public programs and their official detail links. |
| La Crosse Public Library | `https://www.lacrosselibrary.org/events/upcoming` | Current dated library programs, time ranges, main-library location, age/program context, and pagination. | Candidate for a future-only library source. Preserve the exact stated location and exclude undated informational content. |
| Explore La Crosse | `https://explorelacrosse.com/events/` | Regional destination calendar with 210 listed events and individual event-detail URLs. Some entries may be outside La Crosse proper. | Candidate only with strict city/venue extraction. Do not label regional listings as La Crosse unless an individual official detail page states La Crosse. |
| La Crosse Center | `https://www.lacrossecenter.com/event-calendar` | Official venue location and ticket/event context, but no static current event cards were exposed in the extracted page. | Hold pending a permitted structured calendar endpoint. |

## Data Rules

1. Store only future occurrences with an official detail or registration handoff.
2. Preserve the venue’s exact city; regional calendars must not be silently relabeled as La Crosse.
3. Treat recurring city-program series as individually dated occurrences only where the official page supplies dates.
4. Exclude internal government meetings, closures, and undated informational notices from the member-facing feed.
5. Maintain source-level health reporting and cross-source duplicate protection.
