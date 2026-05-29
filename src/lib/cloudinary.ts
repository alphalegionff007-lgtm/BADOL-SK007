/**
 * Cloudinary unsigned upload helper.
 * Utilizes standard client-side secure uploading via 'unsigned upload presets'.
 */

export const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
export const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

export const isCloudinaryConfigured = !!(cloudName && uploadPreset && cloudName !== 'MY_CLOUDINARY_CLOUD_NAME');

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

/**
 * Upload an image file to Cloudinary.
 * If credentials are not configured, it gracefully returns a beautiful mock Unsplash sports url.
 */
export async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResult> {
  if (!isCloudinaryConfigured) {
    console.warn('Cloudinary not configured. Simulating image upload...');
    
    // Simulate minor network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Select a beautiful fitness placeholder based on name/type
    const randoms = [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=600&auto=format&fit=crop&q=80'
    ];
    const mockUrl = randoms[Math.floor(Math.random() * randoms.length)];
    
    return {
      secure_url: mockUrl,
      public_id: `mock_public_id_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error?.message || 'Failed to upload to Cloudinary');
    }

    const data = await response.json();
    return {
      secure_url: data.secure_url,
      public_id: data.public_id,
    };
  } catch (error) {
    console.error('Cloudinary direct upload failed:', error);
    throw error;
  }
}
