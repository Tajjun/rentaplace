import type { DatabaseSync } from 'node:sqlite';
import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { decodeListing, listingBySlug } from '../db.ts';
import { AppError, integer, textInput, requireValue } from '../errors.ts';
import { requireUser } from '../auth.ts';
import { now, ROOT } from '../config.ts';
import { log } from '../log.ts';
import type { Account } from '../types.ts';
export const AMENITIES=['Wifi','Kitchen','Free parking','Heating','Washer','Patio','Fireplace','Air conditioning','EV charger','Lake access','Pet friendly','Workspace'];
export function hostListings(db: DatabaseSync,user: Account | undefined) {
  const account=requireUser(user,'host');
  return db.prepare('SELECT * FROM listings WHERE host_id=? ORDER BY title,id').all(account.id).map(decodeListing);
}
export function ownedListing(db: DatabaseSync,slug: string,user: Account | undefined) {
  const account=requireUser(user,'host'), home=listingBySlug(db,slug);
  if(!home || home.host_id!==account.id)throw new AppError(404,'NOT_FOUND','Listing not found.');
  return home;
}
export function dollarsToCents(value: string) {
  requireValue(/^\d{1,5}(\.\d{1,2})?$/.test(value),'Enter a price with at most two decimal places.');
  const [dollars,cents='']=value.split('.');return Number(dollars)*100+Number(cents.padEnd(2,'0'));
}
export function saveListing(db: DatabaseSync,input: any,user: Account | undefined,slug?: string) {
  const account=requireUser(user,'host'), old=slug?ownedListing(db,slug,user):undefined;
  const title=textInput(input.title,'Title',90), description=textInput(input.description,'Description',6000);
  const neighbourhood=textInput(input.neighbourhood,'Neighbourhood',100),region=textInput(input.region,'Region',120);
  const sleeps=integer(input.sleeps,'Guests',1,20),bedrooms=integer(input.bedrooms,'Bedrooms',0,15),beds=integer(input.beds ?? Math.max(1,bedrooms),'Beds',1,20),bathrooms=integer(input.bathrooms ?? 1,'Bathrooms',1,15);
  const nightly=integer(input.nightlyCents ?? dollarsToCents(String(input.nightlyDollars || '')),'Nightly rate',100,1000000);
  const weekend=integer(input.weekendCents ?? dollarsToCents(String(input.weekendDollars || '')),'Weekend rate',100,1000000);
  const cleaning=integer(input.cleaningCents ?? dollarsToCents(String(input.cleaningDollars || '0')),'Cleaning fee',0,1000000);
  const minimumNights=integer(input.minimumNights ?? old?.minimum_nights ?? 2,'Minimum stay',1,90);
  const policy=String(input.cancellationPolicy),status=String(input.status);
  requireValue(['flexible','moderate','strict'].includes(policy),'Choose a cancellation policy.');
  requireValue(['active','paused','closed'].includes(status),'Choose a listing status.');
  const amen=Array.isArray(input.amenities)?input.amenities:typeof input.amenities==='string'?input.amenities.split(',').map((s:string)=>s.trim()).filter(Boolean):[];
  requireValue(amen.length<=AMENITIES.length && amen.every((a:string)=>AMENITIES.includes(a)),'Choose amenities from the available list.');
  const photos=Array.isArray(input.photos)?input.photos:typeof input.photos==='string'?input.photos.split(/[\n,]/).map((s:string)=>s.trim()).filter(Boolean):[];
  requireValue(photos.length>=1 && photos.length<=8 && photos.every((p:string)=>/^\/img\/photos\/[a-z0-9-]+\.jpg$/.test(p)&&existsSync(join(ROOT,'public',p))),'Choose 1–8 local photos from the image collection.');
  const lat=Number(input.lat ?? old?.lat ?? 38.95),lng=Number(input.lng ?? old?.lng ?? -120.05);
  requireValue(Number.isFinite(lat)&&lat>=-90&&lat<=90&&Number.isFinite(lng)&&lng>=-180&&lng<=180,'Enter valid map coordinates.');
  const instant=input.instantBook===true || input.instantBook==='1' || input.instantBook==='on'?1:0;
  const id=old?.id || randomUUID(), newSlug=old?.slug || `${title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}-${id.slice(0,6)}`;
  if(old)db.prepare('UPDATE listings SET title=?,description=?,neighbourhood=?,region=?,lat=?,lng=?,sleeps=?,bedrooms=?,beds=?,bathrooms=?,nightly_cents=?,weekend_cents=?,cleaning_cents=?,minimum_nights=?,cancellation_policy=?,status=?,instant_book=?,amenities=?,photos=?,updated_at=? WHERE id=?').run(title,description,neighbourhood,region,lat,lng,sleeps,bedrooms,beds,bathrooms,nightly,weekend,cleaning,minimumNights,policy,status,instant,JSON.stringify([...new Set(amen)]),JSON.stringify(photos),now(),id);
  else db.prepare(`INSERT INTO listings (id,slug,host_id,title,description,neighbourhood,region,lat,lng,sleeps,bedrooms,beds,bathrooms,nightly_cents,weekend_cents,cleaning_cents,minimum_nights,cancellation_policy,status,instant_book,amenities,photos,created_at,updated_at) VALUES (${Array(24).fill('?').join(',')})`).run(id,newSlug,account.id,title,description,neighbourhood,region,lat,lng,sleeps,bedrooms,beds,bathrooms,nightly,weekend,cleaning,minimumNights,policy,status,instant,JSON.stringify([...new Set(amen)]),JSON.stringify(photos),now(),now());
  log('listing.updated',{listingId:id,created:!old,hostId:account.id,status});
  return listingBySlug(db,newSlug)!;
}
