import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = window.SUPABASE_URL || 'https://imecopipntcbzhfznzru.supabase.co';
const SUPABASE_KEY = window.SUPABASE_KEY || 'sb_publishable_SutBY-NKjnj-2BN5E0qSgA_4DUKzHiX';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function showToast(title, message, type = 'success') {
  const toast = document.getElementById('toast');
  const titleEl = document.getElementById('toast-title');
  const msgEl = document.getElementById('toast-msg');
  const iconEl = document.getElementById('toast-icon');

  if (!toast || !titleEl || !msgEl || !iconEl) {
    alert(`${title}: ${message}`);
    return;
  }

  titleEl.textContent = title;
  msgEl.textContent = message;
  toast.classList.remove('bg-emerald-600', 'bg-rose-600');
  toast.classList.add(type === 'success' ? 'bg-emerald-600' : 'bg-rose-600');
  iconEl.className = type === 'success'
    ? 'fa-solid fa-circle-check text-xl'
    : 'fa-solid fa-triangle-exclamation text-xl';

  toast.style.transform = 'translateY(0)';
  setTimeout(() => {
    toast.style.transform = 'translateY(-200%)';
  }, 3500);
}

function getCedulaFromJson(data) {
  if (!data || typeof data !== 'object') return null;
  return data.trabajador_cedula || data.cedula || data.patient?.cedula || null;
}

function normalizeJson(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('El archivo JSON no es válido.');
  }
  return data;
}

export async function savePatientFromJson(rawData) {
  const payload = normalizeJson(rawData);
  const cedula = getCedulaFromJson(payload);

  const { error, data } = await supabase
    .from('patients')
    .insert([
      {
        cedula: cedula || null,
        payload,
        created_at: new Date().toISOString()
      }
    ]);

  if (error) {
    showToast('Error', error.message || 'No se pudo guardar el paciente', 'error');
    throw error;
  }

  showToast('Éxito', 'Paciente guardado en Supabase correctamente', 'success');
  return data;
}

function addImportButton() {
  if (document.getElementById('import-json-btn')) return;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.id = 'import-json-btn';
  btn.className = 'no-print fixed bottom-5 right-5 z-50 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg font-semibold';
  btn.innerHTML = '<i class="fa-solid fa-file-import mr-2"></i> Importar JSON';
  btn.onclick = () => document.getElementById('import-json-input').click();

  const input = document.createElement('input');
  input.type = 'file';
  input.id = 'import-json-input';
  input.accept = 'application/json';
  input.className = 'hidden';
  input.onchange = async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);
      await savePatientFromJson(json);
    } catch (err) {
      showToast('Error', err.message || 'JSON inválido', 'error');
    } finally {
      input.value = '';
    }
  };

  document.body.appendChild(btn);
  document.body.appendChild(input);
}

window.savePatientFromJson = savePatientFromJson;
window.addImportButton = addImportButton;

document.addEventListener('DOMContentLoaded', addImportButton);
