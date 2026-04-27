// Image styling utilities for antique effect

/**
 * Apply antique CSS filter to create warm, faded, paper-like effect
 * Effects: sepia tone, reduced saturation, soft contrast
 */
export const antiqueFilter = 'sepia(30%) saturate(80%) brightness(95%) contrast(90%)';

/**
 * Apply stronger antique effect for variety
 */
export const strongAntiqueFilter = 'sepia(40%) saturate(70%) brightness(92%) contrast(85%)';

/**
 * Get CSS filter for styled image display
 */
export function getStyledFilter(intensity: 'normal' | 'strong' = 'normal'): string {
  return intensity === 'strong' ? strongAntiqueFilter : antiqueFilter;
}

/**
 * Convert file to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Compress and resize an image to fit within maxDimension,
 * outputting JPEG at the given quality (0–1).
 * Phone photos (3–10MB) are reduced to ~100–300KB automatically.
 */
export function compressImage(
  file: File,
  maxDimension = 1200,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Scale down if either dimension exceeds maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width >= height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Validate image file type only (no size limit — we compress automatically)
 */
export function validateImage(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Please upload JPG, PNG, or WebP images' };
  }

  return { valid: true };
}
