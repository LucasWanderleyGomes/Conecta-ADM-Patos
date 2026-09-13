import { supabase, supabaseEnabled } from './supabaseClient';
import { storeGet, storeSet } from './storage';

export const CONFIG_KEY = 'config:event';

export const DEFAULT_CONFIG = {
  eventName: 'Conecta ADM Patos',
  dateLabel: '19 de novembro de 2026',
  timeLabel: '18h30',
  locationLabel: 'UNIFIP — Auditório',
  capacity: 120,
  eventEndISO: '2026-11-19T21:30:00',
  certificatesReleased: false
};

function fromRow(row) {
  return {
    eventName: row.event_name,
    dateLabel: row.date_label,
    timeLabel: row.time_label,
    locationLabel: row.location_label,
    capacity: row.capacity,
    eventEndISO: row.event_end,
    certificatesReleased: row.certificates_released
  };
}

export async function loadConfig() {
  if (supabaseEnabled) {
    const { data, error } = await supabase.from('event_config').select('*').eq('id', 1).maybeSingle();
    if (error || !data) return { ...DEFAULT_CONFIG };
    return fromRow(data);
  }
  try {
    const res = await storeGet(CONFIG_KEY);
    return { ...DEFAULT_CONFIG, ...JSON.parse(res.value) };
  } catch (e) {
    return { ...DEFAULT_CONFIG };
  }
}

export async function saveConfig(config) {
  if (supabaseEnabled) {
    const { error } = await supabase.from('event_config').upsert({
      id: 1,
      event_name: config.eventName,
      date_label: config.dateLabel,
      time_label: config.timeLabel,
      location_label: config.locationLabel,
      capacity: config.capacity,
      event_end: config.eventEndISO,
      certificates_released: config.certificatesReleased,
      updated_at: new Date().toISOString()
    });
    if (error) throw error;
    return;
  }
  await storeSet(CONFIG_KEY, JSON.stringify(config));
}

export function eventIsOver(config) {
  return !!config.certificatesReleased || new Date() >= new Date(config.eventEndISO);
}
