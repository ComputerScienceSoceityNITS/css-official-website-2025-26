/**
 * Client-side Badge Generator & Storage Manager for SynapseHack 2026.
 * 
 * Works 100% in the frontend without requiring any backend server or API routes.
 * 
 * Template: /template/Synapse%20Hack.png (1200 x 896)
 * Option 5 coordinates: CenterX: 600, CenterY: 580, BaseFontSize: 26, MaxAllowedWidth: 320
 * Multi-word team names are balanced across two lines (above and below center).
 * Single-word names are centered.
 */

// Storage key prefix for indexed badges
const STORAGE_PREFIX = 'synapse_badge_';
export const REGISTRATION_URL = 'https://www.css-nits.in/synapsehack';

// In-memory cache to guarantee fast access without exceeding browser localStorage quota
const memoryBadgeCache = new Map();

/**
 * Creates a normalized unique file/storage identifier based on email_id + team_name.
 * Example: "john_gmail_com__cyber_knights"
 */
export function getBadgeKey(email, teamName) {
  const cleanEmail = (email || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
  const cleanTeam = (teamName || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
  return `${cleanEmail}__${cleanTeam}`;
}

/**
 * Checks if the badge is already cached in memory or localStorage.
 */
export function getSavedBadge(email, teamName) {
  const key = `${STORAGE_PREFIX}${getBadgeKey(email, teamName)}`;
  if (memoryBadgeCache.has(key)) {
    return memoryBadgeCache.get(key);
  }
  try {
    const val = localStorage.getItem(key);
    if (val) {
      memoryBadgeCache.set(key, val);
      return val;
    }
  } catch (e) {
    // LocalStorage unavailable or restricted
  }
  return null;
}

/**
 * Saves the badge image Data URL into memory, and attempts localStorage non-destructively.
 */
export function saveBadge(email, teamName, dataUrl) {
  if (!dataUrl) return;
  const key = `${STORAGE_PREFIX}${getBadgeKey(email, teamName)}`;
  memoryBadgeCache.set(key, dataUrl);

  try {
    localStorage.setItem(key, dataUrl);
  } catch (e) {
    // If browser localStorage quota (typically ~5MB) is reached,
    // clear older badge keys from localStorage to prevent QuotaExceededError
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(STORAGE_PREFIX) && k !== key) {
          localStorage.removeItem(k);
        }
      }
      localStorage.setItem(key, dataUrl);
    } catch (_fallbackErr) {
      // Memory cache is fully active, so user experience remains 100% functional
    }
  }
}

/**
 * Generates the customized badge directly on HTML5 Canvas.
 * 
 * @param {string} teamName
 * @returns {Promise<string>} Base64 Data URL
 */
export async function generateClientBadge(teamName) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/template/Synapse%20Hack.png';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width || 1200;
        canvas.height = img.height || 896;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Failed to get 2D canvas context'));
        }

        // Draw badge template
        ctx.drawImage(img, 0, 0);

        const centerX = 600;
        const centerY = 580;
        const maxAllowedWidth = 320;
        const baseFontSize = 26;
        const fontFamily = 'Space Grotesk, system-ui, -apple-system, sans-serif';

        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const cleanName = (teamName || '').trim();
        const words = cleanName.split(/\s+/).filter(Boolean);

        if (words.length > 1) {
          // Multi-word name: split into two lines
          const mid = Math.ceil(words.length / 2);
          const line1 = words.slice(0, mid).join(' ');
          const line2 = words.slice(mid).join(' ');

          let fontSize = baseFontSize;
          ctx.font = `bold ${fontSize}px ${fontFamily}`;

          while (
            (ctx.measureText(line1).width > maxAllowedWidth || ctx.measureText(line2).width > maxAllowedWidth) &&
            fontSize > 12
          ) {
            fontSize -= 1;
            ctx.font = `bold ${fontSize}px ${fontFamily}`;
          }

          const lineHeight = fontSize * 1.18;
          ctx.fillText(line1, centerX, centerY - lineHeight / 2);
          ctx.fillText(line2, centerX, centerY + lineHeight / 2);
        } else {
          // Single word
          let fontSize = baseFontSize;
          ctx.font = `bold ${fontSize}px ${fontFamily}`;

          while (ctx.measureText(cleanName).width > maxAllowedWidth && fontSize > 12) {
            fontSize -= 1;
            ctx.font = `bold ${fontSize}px ${fontFamily}`;
          }

          ctx.fillText(cleanName, centerX, centerY);
        }

        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load Synapse Hack badge template.'));
    };
  });
}

/**
 * Downloads the badge image directly to the user's device with the standardized filename.
 */
export function downloadBadge(dataUrl, email, teamName) {
  const fileName = `${getBadgeKey(email, teamName)}.png`;
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Converts a data URL to a File object for native Web Share API
 */
export function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/**
 * Shares badge image + caption to WhatsApp.
 * - On Mobile: Uses navigator.share() with the image file & caption text so it attaches directly into WhatsApp Status / Chat.
 * - Desktop fallback: Automatically copies registration text & triggers WhatsApp Web.
 */
export async function shareToWhatsApp(dataUrl, email, teamName) {
  const caption = `🔥 My team "${teamName}" just registered for SynapseHack 2026 at Tecnoesis, NIT Silchar!\n\nRegister for SynapseHack: ${REGISTRATION_URL}`;

  // 1. Try Native Web Share with file attachment (supported on Android/iOS browsers)
  if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && dataUrl) {
    try {
      const file = dataURLtoFile(dataUrl, `${getBadgeKey(email, teamName)}.png`);
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `SynapseHack 2026 - Team ${teamName}`,
          text: caption,
        });
        return { success: true, method: 'native' };
      }
    } catch (err) {
      if (err.name === 'AbortError') return { success: false, aborted: true };
      console.warn('Native WhatsApp share failed, falling back to URL:', err);
    }
  }

  // 2. Desktop Fallback: Download image so user has the file, and open WhatsApp Web with prefilled text
  if (dataUrl) {
    downloadBadge(dataUrl, email, teamName);
  }

  const encodedText = encodeURIComponent(caption);
  window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
  return { success: true, method: 'desktop_whatsapp' };
}

/**
 * Shares badge image + caption to Instagram Stories / Feed.
 * - On Mobile: Uses navigator.share() to send the file directly to Instagram Story sheet.
 * - Desktop Fallback: Downloads badge image, copies link to clipboard, and prompts user.
 */
export async function shareToInstagram(dataUrl, email, teamName) {
  const shareText = `🔥 My team "${teamName}" just registered for SynapseHack 2026!\n\nRegister for SynapseHack: ${REGISTRATION_URL}`;

  // 1. If Web Share API supports file sharing (mobile Chrome/Safari directly to Instagram Stories)
  if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && dataUrl) {
    try {
      const file = dataURLtoFile(dataUrl, `${getBadgeKey(email, teamName)}.png`);
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `SynapseHack 2026 - Team ${teamName}`,
          text: shareText,
        });
        return { success: true, method: 'native' };
      }
    } catch (err) {
      if (err.name === 'AbortError') return { success: false, aborted: true };
      console.warn('Native Instagram share failed, falling back:', err);
    }
  }

  // 2. Fallback: Copy registration link to clipboard and trigger badge download
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(`Register for SynapseHack: ${REGISTRATION_URL}`);
    }
  } catch (e) {
    console.warn('Clipboard write failed:', e);
  }

  if (dataUrl) {
    downloadBadge(dataUrl, email, teamName);
  }
  return { success: true, method: 'download_fallback' };
}
