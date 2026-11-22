import Link from 'next/link';
import { Check, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { SimpleSelect } from '@/components/forms';
import { Page, PageHeading } from '@/components/site';
import { AMENITIES } from '../../src/domain/listings.ts';
import { EXTERIOR_COUNTS } from '../../data/images.ts';
import type { Listing } from '../../src/types.ts';

const BLANK = {
  title: '', description: '', neighbourhood: '', region: '', sleeps: 4, bedrooms: 2, beds: 2, bathrooms: 1,
  nightly_cents: 12000, weekend_cents: 15000, cleaning_cents: 5000, minimum_nights: 2, cancellation_policy: 'flexible', status: 'paused',
  instant_book: 1, amenities: ['Wifi', 'Kitchen'], photos: ['/img/photos/cabin-0.jpg', '/img/photos/interior-0.jpg'], lat: 38.95, lng: -120.05,
};

function Field({ id, label, children, className }: { id: string; label: string; children: React.ReactNode; className?: string }) {
  return <div className={`grid gap-1.5 ${className ?? ''}`}><Label htmlFor={id}>{label}</Label>{children}</div>;
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader><CardTitle className="font-serif text-2xl font-normal">{title}</CardTitle>{description ? <CardDescription>{description}</CardDescription> : null}</CardHeader>
      <CardContent className="grid gap-4">{children}</CardContent>
    </Card>
  );
}

export function ListingEditor({ home }: { home?: Listing }) {
  const h = home ?? BLANK;
  const action = home ? `/host/listings/${home.slug}/edit` : '/host/listings/new';
  const collections = Object.keys(EXTERIOR_COUNTS).join(', ');
  return (
    <Page>
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-4"><Link href="/host/listings"><ChevronLeft />All homes</Link></Button>
      <PageHeading eyebrow="The details make the stay" title={home ? home.title : 'Open the door to something good.'} description="Give guests a clear picture of the place they’ll call home." />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
        <form method="post" action={action} className="grid gap-6">
          <Section title="A place with a story">
            <Field id="title" label="Home title"><Input id="title" name="title" maxLength={90} defaultValue={h.title} required /></Field>
            <Field id="description" label="Description"><Textarea id="description" name="description" rows={5} maxLength={6000} defaultValue={h.description} required /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="neighbourhood" label="Neighbourhood"><Input id="neighbourhood" name="neighbourhood" maxLength={100} defaultValue={h.neighbourhood} required /></Field>
              <Field id="region" label="Region"><Input id="region" name="region" maxLength={120} defaultValue={h.region} required /></Field>
              <Field id="lat" label="Map latitude"><Input id="lat" name="lat" type="number" step="any" min={-90} max={90} defaultValue={h.lat} required /></Field>
              <Field id="lng" label="Map longitude"><Input id="lng" name="lng" type="number" step="any" min={-180} max={180} defaultValue={h.lng} required /></Field>
            </div>
          </Section>
          <Section title="Room for everyone">
            <div className="grid gap-4 sm:grid-cols-4">
              <Field id="sleeps" label="Maximum guests"><Input id="sleeps" type="number" name="sleeps" min={1} max={20} defaultValue={h.sleeps} required /></Field>
              <Field id="bedrooms" label="Bedrooms"><Input id="bedrooms" type="number" name="bedrooms" min={0} max={15} defaultValue={h.bedrooms} required /></Field>
              <Field id="beds" label="Beds"><Input id="beds" type="number" name="beds" min={1} max={20} defaultValue={h.beds} required /></Field>
              <Field id="bathrooms" label="Bathrooms"><Input id="bathrooms" type="number" name="bathrooms" min={1} max={15} defaultValue={h.bathrooms} required /></Field>
            </div>
            <fieldset className="grid gap-3">
              <legend className="mb-2 text-sm font-medium">Amenities</legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {AMENITIES.map((a) => <Label key={a} className="font-normal"><Checkbox name="amenities" value={a} defaultChecked={h.amenities.includes(a)} />{a}</Label>)}
              </div>
            </fieldset>
          </Section>
          <Section title="Prices that feel right" description="Weekend rates apply to Friday and Saturday nights. Your host share is the nightly charges and cleaning fee, less a 3% platform fee.">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field id="nightly" label="Weeknight rate (USD)"><Input id="nightly" type="number" name="nightlyDollars" min={1} max={10000} step=".01" defaultValue={(h.nightly_cents / 100).toFixed(2)} required /></Field>
              <Field id="weekend" label="Weekend rate (USD)"><Input id="weekend" type="number" name="weekendDollars" min={1} max={10000} step=".01" defaultValue={(h.weekend_cents / 100).toFixed(2)} required /></Field>
              <Field id="cleaning" label="Cleaning fee (USD)"><Input id="cleaning" type="number" name="cleaningDollars" min={0} max={10000} step=".01" defaultValue={(h.cleaning_cents / 100).toFixed(2)} required /></Field>
              <Field id="minimum-nights" label="Minimum stay (nights)"><Input id="minimum-nights" type="number" name="minimumNights" min={1} max={90} defaultValue={h.minimum_nights} required /><span className="text-xs text-muted-foreground">Guests must book at least this many nights.</span></Field>
            </div>
          </Section>
          <Section title="How you welcome guests">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="policy" label="Cancellation policy"><SimpleSelect id="policy" name="cancellationPolicy" value={h.cancellation_policy} options={[['flexible', 'Flexible'], ['moderate', 'Moderate'], ['strict', 'Strict']]} /></Field>
              <Field id="status" label="Listing status"><SimpleSelect id="status" name="status" value={h.status} options={[['active', 'Active'], ['paused', 'Paused'], ['closed', 'Closed']]} /></Field>
            </div>
            <Label className="flex items-center justify-between gap-4 rounded-xl border p-4 font-normal">
              <span><span className="block font-medium">Instant booking</span><span className="block text-xs text-muted-foreground">Confirm eligible reservations instantly</span></span>
              <Switch name="instantBook" value="1" defaultChecked={Boolean(h.instant_book)} />
            </Label>
          </Section>
          <Section title="Your gallery" description={`One photo path per line, up to eight. Collections: ${collections} (/img/photos/<collection>-<n>.jpg) and interiors (/img/photos/interior-<n>.jpg).`}>
            <Field id="photos" label="Photo paths"><Textarea id="photos" name="photos" rows={4} defaultValue={h.photos.join('\n')} required className="font-mono text-xs" /></Field>
          </Section>
          <div className="flex gap-3">
            <Button type="submit" size="lg">{home ? 'Save changes' : 'Create your home'}<Check /></Button>
            <Button asChild variant="outline" size="lg"><Link href="/host/listings">Back to listings</Link></Button>
          </div>
        </form>
        <aside>
          <Card className="sticky top-24 gap-0 overflow-hidden rounded-2xl py-0">
            <img src={h.photos[0]} alt="Photo preview" width={1200} height={800} className="aspect-[3/2] w-full object-cover" />
            <CardContent className="space-y-3 p-5 text-sm">
              <h3 className="text-xl">Make the small details count.</h3>
              <p className="text-muted-foreground">Help guests plan well: mention stairs, parking, the last stretch of road, and the little things they’ll love.</p>
              <p className="text-muted-foreground">All homes in this marketplace are fictional. Use photos from the local image collection; nothing is fetched from the internet.</p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </Page>
  );
}
