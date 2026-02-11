/**
 * Stamps date-time text onto an image using Canvas API.
 * Returns a new base64 data URL with the timestamp overlay.
 */
export async function stampDateTimeOnImage(base64DataUrl: string, watermarkText?: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) { resolve(base64DataUrl); return; }

            // Draw original image
            ctx.drawImage(img, 0, 0);

            // Format current date-time
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric'
            });
            const timeStr = now.toLocaleTimeString('en-IN', {
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
            });
            const timestampText = `${dateStr}  ${timeStr}`;

            // Calculate font size relative to image width (roughly 3% of width)
            const fontSize = Math.max(14, Math.round(img.width * 0.035));
            ctx.font = `bold ${fontSize}px 'Arial', sans-serif`;
            const padding = Math.round(fontSize * 0.5);
            const lineHeight = Math.round(fontSize * 1.2);

            // Measure timestamp
            const timeMetrics = ctx.measureText(timestampText);
            let maxWidth = timeMetrics.width;

            // Measure watermark text if present
            if (watermarkText) {
                const wmMetrics = ctx.measureText(watermarkText);
                maxWidth = Math.max(maxWidth, wmMetrics.width);
            }

            const totalHeight = watermarkText ? lineHeight * 2 : lineHeight;

            // Position: bottom-right corner
            const x = img.width - maxWidth - padding * 2;
            const y = img.height - totalHeight - padding * 2;

            // Semi-transparent dark background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.beginPath();
            ctx.roundRect(x - padding, y - padding, maxWidth + padding * 2, totalHeight + padding * 2, 6);
            ctx.fill();

            // White text
            ctx.fillStyle = '#ffffff';
            ctx.textBaseline = 'top';

            // Draw Watermark (Top line)
            if (watermarkText) {
                ctx.fillText(watermarkText, x, y);
                // Draw Timestamp (Bottom line)
                ctx.fillText(timestampText, x, y + lineHeight);
            } else {
                // Draw Timestamp only
                ctx.fillText(timestampText, x, y);
            }

            // Convert back to data URL
            resolve(canvas.toDataURL('image/jpeg', 0.9));
        };
        img.onerror = () => resolve(base64DataUrl); // fallback to original
        img.src = base64DataUrl;
    });
}
