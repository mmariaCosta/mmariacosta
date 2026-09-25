const KEY = 'portfolio-image-overrides';

function safeParse(str) {
  try {
    return JSON.parse(str || '{}');
  } catch {
    return {};
  }
}

export function getImageOverride(imageKey) {
  return safeParse(localStorage.getItem(KEY))[imageKey] || null;
}

export function setImageOverride(imageKey, base64) {
  const data = safeParse(localStorage.getItem(KEY));
  data[imageKey] = base64;
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function removeImageOverride(imageKey) {
  const data = safeParse(localStorage.getItem(KEY));
  delete data[imageKey];
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function listOverrides() {
  return safeParse(localStorage.getItem(KEY));
}

export function clearAllOverrides() {
  localStorage.removeItem(KEY);
}

export function notifyImageChange() {
  window.dispatchEvent(new Event('portfolio-image-change'));
}