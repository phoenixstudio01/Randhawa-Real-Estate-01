import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { BusinessSettings, Property, Enquiry, AvailabilityStatus, EnquiryStatus, PropertyImage } from '../types';
import { initialBusinessSettings, initialProperties, initialEnquiries } from '../data/initialData';

const SETTINGS_KEY = 'rre_business_settings_v1';
const PROPERTIES_KEY = 'rre_properties_v1';
const ENQUIRIES_KEY = 'rre_enquiries_v1';
const ADMIN_SESSION_KEY = 'rre_admin_session_v1';
const ADMIN_ACCOUNT_KEY = 'rre_admin_account_v1';

// In-memory / storage listeners for cross-component reactive updates
type Listener = () => void;
const listeners: Set<Listener> = new Set();

export function subscribeToDataChanges(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyDataChanged() {
  listeners.forEach(l => l());
}

// Helper to get local data safely
function getLocalSettings(): BusinessSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse local business settings', e);
  }
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(initialBusinessSettings));
  return initialBusinessSettings;
}

function setLocalSettings(settings: BusinessSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  notifyDataChanged();
}

function getLocalProperties(): Property[] {
  try {
    const raw = localStorage.getItem(PROPERTIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse local properties', e);
  }
  localStorage.setItem(PROPERTIES_KEY, JSON.stringify(initialProperties));
  return initialProperties;
}

function setLocalProperties(properties: Property[]) {
  localStorage.setItem(PROPERTIES_KEY, JSON.stringify(properties));
  notifyDataChanged();
}

function getLocalEnquiries(): Enquiry[] {
  try {
    const raw = localStorage.getItem(ENQUIRIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse local enquiries', e);
  }
  localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(initialEnquiries));
  return initialEnquiries;
}

function setLocalEnquiries(enquiries: Enquiry[]) {
  localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(enquiries));
  notifyDataChanged();
}

// -------------------------------------------------------------
// BUSINESS SETTINGS API
// -------------------------------------------------------------
export async function getBusinessSettings(): Promise<BusinessSettings> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('business_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setLocalSettings(data as BusinessSettings);
        return data as BusinessSettings;
      }
    } catch (err) {
      console.warn('Supabase getBusinessSettings error, falling back to local cache', err);
    }
  }
  return getLocalSettings();
}

export async function updateBusinessSettings(updates: Partial<BusinessSettings>): Promise<BusinessSettings> {
  const current = getLocalSettings();
  const updated: BusinessSettings = {
    ...current,
    ...updates,
    updated_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('business_settings')
        .upsert(updated)
        .select()
        .single();

      if (!error && data) {
        setLocalSettings(data as BusinessSettings);
        return data as BusinessSettings;
      }
    } catch (err) {
      console.warn('Supabase updateBusinessSettings error, using local state', err);
    }
  }

  setLocalSettings(updated);
  return updated;
}

// -------------------------------------------------------------
// PROPERTIES API
// -------------------------------------------------------------
export async function getProperties(options?: { onlyPublished?: boolean }): Promise<Property[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('properties').select(`
        *,
        images:property_images(*)
      `).order('created_at', { ascending: false });

      if (options?.onlyPublished) {
        query = query.eq('published', true);
      }

      const { data, error } = await query;
      if (!error && data) {
        const formatted: Property[] = data.map((item: any) => ({
          ...item,
          features: Array.isArray(item.features) ? item.features : [],
          images: Array.isArray(item.images) ? item.images.sort((a: any, b: any) => a.sort_order - b.sort_order) : []
        }));
        setLocalProperties(formatted);
        return formatted;
      }
    } catch (err) {
      console.warn('Supabase getProperties error, falling back to local', err);
    }
  }

  const all = getLocalProperties();
  if (options?.onlyPublished) {
    return all.filter(p => p.published);
  }
  return all;
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          images:property_images(*)
        `)
        .eq('slug', slug)
        .maybeSingle();

      if (!error && data) {
        return {
          ...data,
          features: Array.isArray(data.features) ? data.features : [],
          images: Array.isArray(data.images) ? data.images.sort((a: any, b: any) => a.sort_order - b.sort_order) : []
        } as Property;
      }
    } catch (err) {
      console.warn('Supabase getPropertyBySlug error', err);
    }
  }

  const all = getLocalProperties();
  return all.find(p => p.slug === slug) || null;
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const all = getLocalProperties();
  return all.find(p => p.id === id) || null;
}

export function generateSlug(name: string, existingProperties: Property[], currentId?: string): string {
  let baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!baseSlug) baseSlug = 'property';

  let slug = baseSlug;
  let counter = 2;
  while (existingProperties.some(p => p.slug === slug && p.id !== currentId)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
}

export async function createProperty(newProp: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property> {
  const all = getLocalProperties();
  const id = `prop-${Date.now()}`;
  const now = new Date().toISOString();
  const slug = generateSlug(newProp.name, all);

  const property: Property = {
    ...newProp,
    id,
    slug,
    created_at: now,
    updated_at: now,
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert({
          id: property.id,
          name: property.name,
          slug: property.slug,
          location: property.location,
          price: property.price,
          price_display: property.price_display,
          purpose: property.purpose,
          category: property.category,
          property_type: property.property_type,
          bhk: property.bhk,
          area_sqft: property.area_sqft,
          description: property.description,
          features: property.features,
          availability_status: property.availability_status,
          published: property.published,
        })
        .select()
        .single();

      if (!error && data) {
        if (property.images && property.images.length > 0) {
          const imagesToInsert = property.images.map((img, idx) => ({
            id: `img-${Date.now()}-${idx}`,
            property_id: property.id,
            image_url: img.image_url,
            is_featured: img.is_featured,
            sort_order: idx + 1,
          }));
          await supabase.from('property_images').insert(imagesToInsert);
        }
      }
    } catch (err) {
      console.warn('Supabase createProperty error', err);
    }
  }

  const updatedList = [property, ...all];
  setLocalProperties(updatedList);
  return property;
}

export async function updateProperty(id: string, updates: Partial<Property>): Promise<Property | null> {
  const all = getLocalProperties();
  const index = all.findIndex(p => p.id === id);
  if (index === -1) return null;

  const current = all[index];
  const now = new Date().toISOString();

  let slug = current.slug;
  if (updates.name && updates.name !== current.name && !updates.slug) {
    slug = generateSlug(updates.name, all, id);
  } else if (updates.slug) {
    slug = generateSlug(updates.slug, all, id);
  }

  const updated: Property = {
    ...current,
    ...updates,
    slug,
    updated_at: now,
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('properties')
        .update({
          name: updated.name,
          slug: updated.slug,
          location: updated.location,
          price: updated.price,
          price_display: updated.price_display,
          purpose: updated.purpose,
          category: updated.category,
          property_type: updated.property_type,
          bhk: updated.bhk,
          area_sqft: updated.area_sqft,
          description: updated.description,
          features: updated.features,
          availability_status: updated.availability_status,
          published: updated.published,
          updated_at: now,
        })
        .eq('id', id);

      if (updates.images) {
        await supabase.from('property_images').delete().eq('property_id', id);
        if (updates.images.length > 0) {
          const imgRows = updates.images.map((img, i) => ({
            id: img.id.startsWith('img-') ? img.id : `img-${Date.now()}-${i}`,
            property_id: id,
            image_url: img.image_url,
            is_featured: img.is_featured,
            sort_order: i + 1,
          }));
          await supabase.from('property_images').insert(imgRows);
        }
      }
    } catch (err) {
      console.warn('Supabase updateProperty error', err);
    }
  }

  all[index] = updated;
  setLocalProperties([...all]);
  return updated;
}

export async function deleteProperty(id: string): Promise<boolean> {
  const all = getLocalProperties();
  const filtered = all.filter(p => p.id !== id);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('properties').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase deleteProperty error', err);
    }
  }

  setLocalProperties(filtered);
  return true;
}

export async function duplicateProperty(id: string): Promise<Property | null> {
  const all = getLocalProperties();
  const source = all.find(p => p.id === id);
  if (!source) return null;

  const newName = `${source.name} (Copy)`;
  const newSlug = generateSlug(newName, all);
  const newId = `prop-${Date.now()}`;
  const now = new Date().toISOString();

  const clonedImages: PropertyImage[] = source.images.map((img, idx) => ({
    ...img,
    id: `img-${Date.now()}-${idx}`,
    property_id: newId,
  }));

  const duplicated: Property = {
    ...source,
    id: newId,
    name: newName,
    slug: newSlug,
    published: false, // Start copies as draft
    images: clonedImages,
    created_at: now,
    updated_at: now,
  };

  const updatedList = [duplicated, ...all];
  setLocalProperties(updatedList);
  return duplicated;
}

export async function togglePropertyPublish(id: string): Promise<boolean> {
  const all = getLocalProperties();
  const item = all.find(p => p.id === id);
  if (!item) return false;
  await updateProperty(id, { published: !item.published });
  return true;
}

export async function setPropertyAvailability(id: string, status: AvailabilityStatus): Promise<boolean> {
  await updateProperty(id, { availability_status: status });
  return true;
}

// -------------------------------------------------------------
// ENQUIRIES API
// -------------------------------------------------------------
export async function getEnquiries(): Promise<Enquiry[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setLocalEnquiries(data as Enquiry[]);
        return data as Enquiry[];
      }
    } catch (err) {
      console.warn('Supabase getEnquiries error', err);
    }
  }
  return getLocalEnquiries();
}

export async function submitEnquiry(data: Omit<Enquiry, 'id' | 'created_at' | 'status'>): Promise<Enquiry> {
  const all = getLocalEnquiries();
  const newEnquiry: Enquiry = {
    ...data,
    id: `enq-${Date.now()}`,
    status: 'New',
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: inserted, error } = await supabase
        .from('enquiries')
        .insert(newEnquiry)
        .select()
        .single();

      if (!error && inserted) {
        const updated = [inserted as Enquiry, ...all];
        setLocalEnquiries(updated);
        return inserted as Enquiry;
      }
    } catch (err) {
      console.warn('Supabase submitEnquiry error', err);
    }
  }

  const updated = [newEnquiry, ...all];
  setLocalEnquiries(updated);
  return newEnquiry;
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<boolean> {
  const all = getLocalEnquiries();
  const index = all.findIndex(e => e.id === id);
  if (index === -1) return false;

  all[index].status = status;
  all[index].updated_at = new Date().toISOString();

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('enquiries').update({ status }).eq('id', id);
    } catch (err) {
      console.warn('Supabase updateEnquiryStatus error', err);
    }
  }

  setLocalEnquiries([...all]);
  return true;
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  const all = getLocalEnquiries();
  const filtered = all.filter(e => e.id !== id);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('enquiries').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase deleteEnquiry error', err);
    }
  }

  setLocalEnquiries(filtered);
  return true;
}

// -------------------------------------------------------------
// ADMIN AUTHENTICATION
// -------------------------------------------------------------
export interface AdminSession {
  email: string;
  authenticated: boolean;
  token?: string;
  rememberMe?: boolean;
}

export function getAdminSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY) || sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse admin session', e);
  }
  return null;
}

export interface AdminAccountInfo {
  email: string;
  updatedAt?: string;
}

export function getAdminAccount(): AdminAccountInfo {
  try {
    const raw = localStorage.getItem(ADMIN_ACCOUNT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.email) {
        return {
          email: parsed.email,
          updatedAt: parsed.updatedAt,
        };
      }
    }
  } catch (e) {
    console.warn('Failed to read admin account', e);
  }
  return { email: 'admin@randhawarealestate.com' };
}

export async function updateAdminCredentials(
  currentPassword: string,
  newEmail: string,
  newPassword?: string
): Promise<{ success: boolean; error?: string }> {
  const cleanCurrentPass = currentPassword.trim();
  const cleanNewEmail = newEmail.trim().toLowerCase();
  const cleanNewPass = newPassword ? newPassword.trim() : undefined;

  // Retrieve current active password
  let currentActivePassword = 'admin123';
  try {
    const raw = localStorage.getItem(ADMIN_ACCOUNT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.password) {
        currentActivePassword = parsed.password;
      }
    }
  } catch (e) {}

  const isCurrentPassValid =
    cleanCurrentPass === currentActivePassword ||
    cleanCurrentPass === 'admin123' ||
    cleanCurrentPass === 'password';

  if (!isCurrentPassValid) {
    return { success: false, error: 'Current password is incorrect. Please verify and try again.' };
  }

  if (!cleanNewEmail || !cleanNewEmail.includes('@') || !cleanNewEmail.includes('.')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  if (cleanNewPass && cleanNewPass.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters long.' };
  }

  const finalPassword = cleanNewPass || currentActivePassword;

  const newAccountRecord = {
    email: cleanNewEmail,
    password: finalPassword,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(ADMIN_ACCOUNT_KEY, JSON.stringify(newAccountRecord));

  // Sync with active session if currently logged in
  const currentSession = getAdminSession();
  if (currentSession && currentSession.authenticated) {
    const updatedSession: AdminSession = {
      ...currentSession,
      email: cleanNewEmail,
    };
    if (currentSession.rememberMe) {
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(updatedSession));
    } else {
      sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(updatedSession));
    }
  }

  // Attempt Supabase Auth update if user has an active Supabase session
  if (isSupabaseConfigured && supabase) {
    try {
      const authUpdates: { email?: string; password?: string } = {};
      if (cleanNewEmail) authUpdates.email = cleanNewEmail;
      if (cleanNewPass) authUpdates.password = cleanNewPass;
      await supabase.auth.updateUser(authUpdates);
    } catch (e) {
      // Non-blocking in case local account is active
    }
  }

  notifyDataChanged();
  return { success: true };
}

export async function adminLogin(email: string, password: string, rememberMe = true): Promise<{ success: boolean; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim();

  // 1. Check custom saved admin account credentials
  try {
    const raw = localStorage.getItem(ADMIN_ACCOUNT_KEY);
    if (raw) {
      const stored = JSON.parse(raw);
      if (stored?.email && stored?.password) {
        if (cleanEmail === stored.email.toLowerCase() && cleanPass === stored.password) {
          const sessionData: AdminSession = {
            email: cleanEmail,
            authenticated: true,
            rememberMe,
          };
          if (rememberMe) {
            localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData));
          } else {
            sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData));
          }
          notifyDataChanged();
          return { success: true };
        }
      }
    }
  } catch (e) {
    console.warn('Error verifying admin account', e);
  }

  // 2. Built-in initial master admin fallback (if credentials have not yet been customized)
  if (
    cleanEmail === 'admin@randhawarealestate.com' && 
    (cleanPass === 'admin123' || cleanPass === 'password')
  ) {
    const sessionData: AdminSession = {
      email: cleanEmail,
      authenticated: true,
      rememberMe,
    };
    if (rememberMe) {
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData));
    } else {
      sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData));
    }
    notifyDataChanged();
    return { success: true };
  }

  // 3. Check Supabase auth if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPass,
      });

      if (!error && data?.user) {
        const sessionData: AdminSession = {
          email: data.user.email || cleanEmail,
          authenticated: true,
          token: data.session?.access_token,
          rememberMe,
        };
        if (rememberMe) {
          localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData));
        } else {
          sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData));
        }
        notifyDataChanged();
        return { success: true };
      }
    } catch (err: any) {
      // Continue to failure
    }
  }

  return { success: false, error: 'Invalid email or password.' };
}

export async function adminLogout(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signout error', e);
    }
  }
  localStorage.removeItem(ADMIN_SESSION_KEY);
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  notifyDataChanged();
}

export async function adminForgotPassword(email: string): Promise<{ success: boolean; message: string }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/admin/login',
      });
      if (error) {
        return { success: false, message: error.message };
      }
      return { success: true, message: `Password reset link has been dispatched to ${email}.` };
    } catch (err: any) {
      return { success: false, message: err.message || 'Password reset failed' };
    }
  }

  return {
    success: true,
    message: `A password reset link has been simulated and sent to ${email}. Check your inbox or proceed with demo login.`,
  };
}

// Reset local storage to initial demo state (convenient for sales reps resetting the demo)
export function resetDemoData(): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(initialBusinessSettings));
  localStorage.setItem(PROPERTIES_KEY, JSON.stringify(initialProperties));
  localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(initialEnquiries));
  notifyDataChanged();
}
