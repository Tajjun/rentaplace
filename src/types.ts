export type Policy = 'flexible' | 'moderate' | 'strict';
export type Account = { id: string; name: string; email: string; role: 'guest' | 'host' };
export type Listing = {
  id: string; slug: string; title: string; description: string; host_id: string;
  neighbourhood: string; region: string; lat: number; lng: number;
  sleeps: number; bedrooms: number; beds: number; bathrooms: number;
  nightly_cents: number; weekend_cents: number; cleaning_cents: number; minimum_nights: number;
  cancellation_policy: Policy; status: 'active' | 'paused' | 'closed'; instant_book: number;
  amenities: string[]; photos: string[]; rating: number; review_count: number;
  created_at: string; updated_at: string;
};
export type Stay = {
  id: string;
  listing_id: string;
  from_date: string;
  to_date: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'declined' | 'broken';
};
export type CalendarBlock = {
  id: string;
  listing_id: string;
  from_date: string;
  to_date: string;
  status: 'blocked';
};
export type Quote = {
  slug: string; from: string; to: string; guests: number; nights: number;
  nightly: { date: string; weekend: boolean; cents: number }[];
  weeknightNights: number; weekendNights: number; weeknightCents: number; weekendCents: number;
  accommodationCents: number; cleaningCents: number; subtotalCents: number;
  serviceFeeCents: number; taxCents: number; totalCents: number; hostPayoutCents: number;
  currency: 'USD';
};
