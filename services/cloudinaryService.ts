const CLOUD_NAME = 'demodqx39';
const API_KEY = '936981127134918'; // stored for reference; unsigned uploads don't need this

export interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
    width: number;
    height: number;
    format: string;
    created_at: string;
}

/**
 * Upload an image to Cloudinary using unsigned upload.
 * Unsigned uploads require ONLY the upload_preset — no API key needed.
 * Make sure you have an unsigned upload preset enabled in Cloudinary settings:
 *   Dashboard → Settings → Upload → Upload Presets → Add/Enable unsigned preset
 */
export const uploadImageToCloudinary = async (
    base64Data: string,
    folder: string = 'societyclean/proof-of-work'
): Promise<CloudinaryUploadResult> => {
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    // Prepare data URI if not already
    const dataUri = base64Data.startsWith('data:')
        ? base64Data
        : `data:image/jpeg;base64,${base64Data}`;

    const formData = new FormData();
    formData.append('file', dataUri);
    formData.append('upload_preset', 'ml_default');
    formData.append('folder', folder);
    // NOTE: Do NOT include api_key for unsigned uploads — it causes authentication errors

    const response = await fetch(url, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Cloudinary upload failed (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    return {
        secure_url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        created_at: result.created_at,
    };
};

