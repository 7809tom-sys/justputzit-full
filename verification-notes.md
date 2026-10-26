
## Activities horoscope placement

The actual `/activities` route is the Activity Board. The horoscope card now appears inside the Activities tab, after the activity filters and before the local activity cards. It is labeled “Personal activity,” has a direct “Open horoscope” handoff, and explicitly states that it is separate from verified local event listings. The full-page desktop preview shows the card in the intended content flow without changing official-event hierarchy.

## Local-first connection reframe — desktop verification (2026-09-19)

The authenticated Home, Matches, onboarding entry, and Gym Buddy surfaces were captured at 1440 × 900. The Home discovery feed remains readable and continues to give official-source events a visible first position. The updated match card is clear and compact: it shows the evidence-backed local dining suggestion, a direct official-site handoff, a public-time safety nudge, and the renamed “Choose a public plan” action. The onboarding entry displays the approved Sally portrait cleanly, with no robot treatment.

The Gym Buddy desktop surface has a clear, responsive hero and a readable three-step pathway. Its membership tab was changed to remove the unsupported static franchise-partner promotion. Existing gym directory cards still reflect stored partner metadata; members should always be directed to the gym’s official access, hours, and guest terms. A mobile verification pass and a final public-landing check remain pending.


## Local-first connection reframe — public landing verification (2026-09-19)

The unauthenticated public landing was verified at the managed preview URL. In its first viewport, the headline, free membership positioning, date/friend/activity/Gym Buddy scope, independent-place emphasis, visible safety controls, Sally portrait, and concrete public-plan framing are all readable without scrolling. The primary call to action is “Join free”; supporting actions lead to Safety & Trust, Gym Buddy, and the local-gym partner path. The route did not expose any signed-in member content.


## Local-first connection reframe — mobile verification (2026-09-19)

At 390 × 844, the Home discovery header, onboarding entry, match card, and Gym Buddy hero all remain readable, balanced, and free of horizontal overflow. The mobile Match view preserves the source-backed local-place card in the main reading flow, while the Gym Buddy three-step pathway and its tab controls remain legible above the fixed member navigation. The new connection-intent and first-meet-comfort controls are intentionally in onboarding step four; source-level regression tests cover their presence and persisted payload.


## Gym Buddy home placement — final desktop verification (2026-09-19)

A full-page authenticated Home capture at 1440 × 900 confirms that Gym Buddy now appears as a standard pinned module directly after Local Activities, ahead of Sports and Games. The card clearly offers a workout-partner path and a separate workout-program path while preserving the nearby official-event and local-business hierarchy above it. The restored Home horoscope action is also visible within Sally’s card.

## Official church and Lions Club discovery — 2026-09-24

The Activity Board was checked at 1440 × 1100 and 390 × 844. The Activities layout remains intact on desktop and mobile after the discovery filter update. The Community Events filter now labels the relevant source class **Churches & Lions Clubs**. The live official refresh completed with four healthy sources: Eastbrook Church (33 future records), Corpus Christi Parish (18), Cudahy Lions Club (3), and Waukesha Lions Club (2). Each record retains an official public handoff; public calendar source parsing excludes member login content and internal staff, committee, board, and similar meeting records. The Corpus Christi calendar uses its public iCalendar feed when its human-facing public listing is edge-protected.

## Community-wide churches, help, and booking calendar — 2026-09-24

The Community Events deep link (`/activities?tab=community`) was reviewed at 1440 × 1100 and 390 × 844. The Community directory appears above the verified event feed, offers **All nearby churches** and **Community help** controls, makes the public-map discovery basis explicit, and carries a no-member-data-sharing statement. A safe city fallback keeps the directory useful while a location profile is loading. The live official refresh for James Place Waukesha returned five public future records and Hope Center WI returned one; both sources are healthy and preserve direct official handoffs. The Payment Confirmation surface now offers a direct prefilled Google Calendar action plus Outlook and `.ics` alternatives, clearly stating that Just Putzit does not request calendar access.

## Complete public congregation directory — 2026-09-24

The Community Events directory was upgraded from a limited public-place lookup to a comprehensive, source-labeled OpenStreetMap congregation inventory. The search combines every returned `amenity=place_of_worship` record and explicitly mapped church building within the selected community search area, including non-Christian places of worship where mapped. It never presents calendar partners as a complete directory. Live validation for Milwaukee returned 436 public mapped records within the stated ten-mile community area in approximately 5.3 seconds; the interface loads cards in accessible batches with a show-more action until the complete returned inventory is available. The page labels OpenStreetMap provenance, carries no-faith-ranking and privacy notices, and keeps official public event calendars as a distinct, future-only pathway.
