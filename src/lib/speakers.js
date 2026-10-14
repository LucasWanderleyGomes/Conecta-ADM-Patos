import { supabase, supabaseEnabled } from './supabaseClient';
import { storeGet, storeSet } from './storage';

const KEY = 'speakers:list';
const BUCKET = 'speaker-photos';

export const DEFAULT_SPEAKERS = [
  {
    id: 's1',
    name: 'Profa. Dra. Helena Marques',
    role: 'Coordenação do Curso de Administração',
    talk: 'Empreendedorismo e inovação nos negócios',
    time: '18h50 – 19h30',
    photoUrl: null
  },
  {
    id: 's2',
    name: 'Prof. Dr. Renato Cavalcanti',
    role: 'Núcleo de Estudos em Gestão',
    talk: 'Mercado de trabalho para administradores',
    time: '19h35 – 20h15',
    photoUrl: null
  },
  {
    id: 's3',
    name: 'Msc. Camila Duarte',
    role: 'Consultora de RH convidada',
    talk: 'Gestão de pessoas na era digital',
    time: '20h20 – 21h00',
    photoUrl: null
  },
  {
    id: 's4',
    name: 'Prof. Dr. Ícaro Bezerra',
    role: 'Egresso e empresário local',
    talk: 'Do TCC à carreira: primeiros passos profissionais',
    time: '21h05 – 21h30',
    photoUrl: null
  }
];

export function genSpeakerId() {
  return 's' + Math.random().toString(36).slice(2, 9);
}

export async function loadSpeakers() {
  if (supabaseEnabled) {
    const { data, error } = await supabase.from('event_speakers').select('data').eq('id', 1).maybeSingle();
    if (error || !data || !Array.isArray(data.data) || data.data.length === 0) {
      return DEFAULT_SPEAKERS;
    }
    return data.data;
  }
  try {
    const res = await storeGet(KEY);
    const parsed = JSON.parse(res.value);
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_SPEAKERS;
  } catch (e) {
    return DEFAULT_SPEAKERS;
  }
}

export async function saveSpeakers(list) {
  if (supabaseEnabled) {
    const { error } = await supabase
      .from('event_speakers')
      .update({ data: list, updated_at: new Date().toISOString() })
      .eq('id', 1);
    if (error) throw error;
    return;
  }
  await storeSet(KEY, JSON.stringify(list));
}


export async function uploadSpeakerPhoto(file) {
  if (supabaseEnabled) {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });
    if (error) throw error;
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
    reader.readAsDataURL(file);
  });
}