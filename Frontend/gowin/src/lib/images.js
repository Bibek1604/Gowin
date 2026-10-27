/** Resolves true when the browser can actually display the URL as an image (used before a photo link is accepted). */
export const probeImage = (url, timeout = 12000) => new Promise((resolve) => {
  const img = new Image();
  const timer = setTimeout(() => { img.src = ''; resolve(false); }, timeout);
  img.onload = () => { clearTimeout(timer); resolve(img.naturalWidth > 0); };
  img.onerror = () => { clearTimeout(timer); resolve(false); };
  img.src = url;
});
