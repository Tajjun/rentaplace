# RentAPlace glossary

Use one meaning for each term in prompts, code, pages, tests and documentation. Code names are implementation names, not reasons to use a second product meaning.

## People

| Word | Meaning | Code names |
| --- | --- | --- |
| Guest | A person who searches for a home, reserves a stay and pays for it. | `Account` with `role: 'guest'`; `guest_id`, `guestName`, `guestEmail` |
| Host | A person who owns listings, manages their calendars and receives payouts. | `Account` with `role: 'host'`; `host_id`; `Host` UI |
| Operator | A team member who uses the operations page. An operator is neither a guest nor a host. | `/admin` operations domain; no dedicated account role |
| Account | A signed-in identity with one of two roles: guest or host. | `Account`; `users` table |

## Homes and discovery

| Word | Meaning | Code names |
| --- | --- | --- |
| Listing | A host's offer of one whole home: title, location, capacity, prices and cancellation policy. | `Listing`; `listings` table; `listing_id`, `listingBySlug` |
| Home | The guest-facing name for a listing. | `home` variables and routes such as `/homes/[slug]` |
| Region | One of the areas used for discovery, such as Lake Tahoe. | `region`; `regions` table |
| Neighbourhood | A smaller place within a region. | `neighbourhood` |
| Sleeps | The largest number of guests a listing accepts. | `sleeps` |
| Instant book | A listing setting that confirms a reservation immediately instead of waiting for host acceptance. | `instant_book`; `instantBook`; `instant_booking` feature flag |

## Stays and dates

| Word | Meaning | Code names |
| --- | --- | --- |
| Stay | The guest’s time at a home, from check-in through the night before checkout. It is not the reservation record or a host calendar block. | `from_date` and `to_date`; `Stay` type is a booking-row projection used for availability |
| Check-in date | The first date of a stay. | `from_date`; `from` |
| Checkout date | The date the guest leaves. It is exclusive: the guest does not occupy that night. | `to_date`; `to` |
| Checkout flow | The guest’s reservation-submission flow, including review of details and demo payment. Not the departure date. | `/book/[slug]`; `Checkout` page function |
| Night | One occupied date of a stay. A stay from the 10th to the 12th has two nights. | `nights`; `nights` in quotes |
| Weekend night | A Friday or Saturday night, priced at the listing's weekend rate. | `weekend`; `weekend_cents`; `weekendNights` |
| Today | The application's business date. | `RAP_TODAY`; `today()` |

## Reservations

| Word | Meaning | Code names |
| --- | --- | --- |
| Reservation | The record of a guest’s request or arrangement to stay at a listing. It may be pending, confirmed, declined, cancelled, or completed. | `booking`; `bookings` table; `createBooking`; `/reservations` |
| Reservation request | A pending reservation waiting for host acceptance. | Reservation with `status: 'pending'` |
| Trip | The guest-facing list of past and upcoming reservations; the current model has no separate trip entity. | `/trips`; `guestBookings` |
| Reference | The public short code used to identify a reservation. | `reference`, for example `RAP-XXXXXXXX` |
| Reservation status | Where a reservation stands. | `status` on `bookings` |
| Pending | A reservation request that is waiting for host acceptance. Its dates are held. | `status: 'pending'` |
| Confirmed | A reservation accepted by the host or created by instant book. Its dates are held and a payout is scheduled. | `status: 'confirmed'` |
| Declined | A reservation the host did not accept. The guest is refunded in full and the dates are free. | `status: 'declined'` |
| Cancelled | A reservation the guest withdrew. The dates are free and the refund follows the cancellation policy. | `status: 'cancelled'` |
| Completed | A reservation whose stay has happened. | `status: 'completed'` |
| Reservation conflict | Two claims for the same night of the same listing. Pending, confirmed and completed reservations hold nights. | `RESERVATION_CONFLICT`; overlapping `bookings` queries |
| Block | Dates a host closes on a listing calendar for a reason that is not a guest reservation. | `block`; `blocks` table; `blockDates`, `unblockDates` |
| Available | A night with no block and no pending, confirmed or completed reservation holding it. | Calendar `available` status; `assertAvailable` |

## Money

All money is whole US cents. Code must not convert cents to dollars while making a domain calculation.

| Word | Meaning | Code names |
| --- | --- | --- |
| Quote | The full price calculation for a proposed stay, shown before reservation creation. | `Quote`; `quote`; `priceStay` |
| Nightly rate | The listing’s base charge for one occupied night, before cleaning, service fee, and tax. | `nightly_cents`; `weekend_cents`; `nightlyCents`; `weekendCents` |
| Stay total | The full amount for the selected dates and guests, including fees and tax. | `Quote.totalCents`; `total_cents`; `totalCents` |
| Demo payment | A test-only reservation payment flow; no real money moves and the card number is not stored. | `payment_status`; `cardNumber` validation |
| Accommodation | The sum of the independent nightly rates for every night of a stay. | `accommodationCents`; `accommodation_cents` |
| Cleaning fee | A fixed fee per stay set by the host. | `cleaningCents`; `cleaning_cents` |
| Subtotal | Accommodation plus the cleaning fee. | `subtotalCents`; `subtotal_cents` |
| Service fee | 12% of the subtotal, charged to the guest. The current code returns it as part of a full refund, but excludes it from partial refunds. | `serviceFeeCents`; `service_fee_cents` |
| Tax | 8% of the subtotal. | `taxCents`; `tax_cents` |
| Total | Subtotal plus service fee plus tax. | `totalCents`; `total_cents` |
| Payout | The host’s share for a reservation, scheduled for the day after check-in. This demo records payout status; it does not transfer money. | `Payout`; `payout`; `payouts` table; `hostPayoutCents`; `host_payout_cents` |
| Payout status | Where a host payout stands. | `scheduled`, `paid`, `cancelled` on `payouts.status` |

## Cancelling

| Word | Meaning | Code names |
| --- | --- | --- |
| Cancellation policy | The listing's refund rule, fixed on the reservation when it is created. | `Policy`; `policy`; `cancellation_policy` |
| Flexible | Full refund one or more days before check-in. | `Policy = 'flexible'` |
| Moderate | Current code gives a full refund more than five days before check-in. Otherwise it refunds half of accommodation and tax, plus the cleaning fee. The page copy says “at least 5 days,” which differs at exactly five days. | `Policy = 'moderate'`; `cancellationRefund`; `policyText` |
| Strict | At least 14 days before check-in: half of accommodation and tax, plus the cleaning fee. Closer to check-in: the cleaning fee only. | `Policy = 'strict'` |
| Refund | Money returned to the guest when a reservation is declined or cancelled. Pending reservations and cancellations that qualify for a full refund return the full total, including the service fee; partial refunds follow the saved policy. | `refundCents`; `refund_cents`; `cancellationRefund` |

## Reviews and help

| Word | Meaning | Code names |
| --- | --- | --- |
| Review | A guest’s rating and comment about a listing after a completed stay. | `reviews` table; `Review`; `rating`, `text` |
| Page feedback | A guest’s or host’s comment about the RentAPlace page or experience, not a home review. | `feedback` table; `Feedback`; `/feedback` |
| Support question | A message asking the operating team for help. | `support_tickets` table; `SupportTicket`; `createTicket` |

Use “reservation request” for a pending stay awaiting host acceptance and “support question” for a help message. Avoid bare “request,” which can mean either.

## Listing status

`Status` is intentionally scoped to the thing being described; it is not a single cross-domain value.

| Word | Meaning | Code names |
| --- | --- | --- |
| Active listing | A listing visible and eligible for guest discovery and booking. | `status: 'active'` |
| Paused listing | A listing not eligible for discovery or booking while the host keeps it. | `status: 'paused'` |
| Closed listing | A listing the host has stopped and will not return to discovery. | `status: 'closed'` |

## Words to avoid

| Avoid | Use instead | Why |
| --- | --- | --- |
| Booking (as a noun) | Reservation | `booking` is a code and table name; one checkout button currently says “Confirm demo booking,” which needs a product-language decision. |
| Property, unit, rental | Listing in code and documentation; home on guest-facing pages | These are broader or inconsistent terms. |
| Customer, user | Guest or host | The account roles have different rights and workflows. |
| Block as a stay | Block for host-held dates; stay only for a guest reservation | Blocks and stays must not share a meaning. |
| Check-out | Checkout date | Use “checkout date” for the guest’s departure date and “checkout flow” for submitting a reservation. |
| Request (without a modifier) | Reservation request or support question | The word can refer to either a pending stay or a help message. |
| Workspace (as a RentAPlace entity) | Host tools, demo account, or demo scenario | There is no RentAPlace workspace entity; Pi/Herdr workspaces are a separate technical concept. |
| Price (without a qualifier) | Nightly rate or stay total | Search cards show a nightly rate before fees, while the quote shows the full stay total; name which one is meant. |
| Dollar amount in domain logic | Integer cents | Money in the domain is always USD cents. |
| Minimum stay | The minimum number of nights a guest must reserve for a listing; hosts set 1–90 nights, with new listings defaulting to 2. | Enforced for search, quotes, and reservation creation. |
