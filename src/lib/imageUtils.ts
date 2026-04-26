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
 * Validate image file
 */
export function validateImage(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Please upload JPG, PNG, or WebP images' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Image must be less than 5MB' };
  }
  
  return { valid: true };
}