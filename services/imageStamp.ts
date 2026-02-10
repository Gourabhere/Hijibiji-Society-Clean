/**
 * Stamps date-time text onto an image using Canvas API.
 * Returns a new base64 data URL with the timestamp overlay.
 */
export async function stampDateTimeOnImage(base64DataUrl: string): Promise<string> {
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
            const stampText = `${dateStr}  ${timeStr}`;

            // Calculate font size relative to image width (roughly 3% of width)
            const fontSize = Math.max(14, Math.round(img.width * 0.035));
            ctx.font = `bold ${fontSize}px 'Arial', sans-serif`;

            // Measure text
            const metrics = ctx.measureText(stampText);
            const textWidth = metrics.width;
            const textHeight = fontSize;
            const padding = Math.round(fontSize * 0.5);

            // Position: bottom-right corner
            const x = img.width - textWidth - padding * 2;
            const y = img.height - padding * 2;

            // Semi-transparent dark background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.beginPath();
            ctx.roundRect(x - padding, y - textHeight - padding, textWidth + padding * 2, textHeight + padding * 2, 6);
            ctx.fill();

            // White text
            ctx.fillStyle = '#ffffff';
            ctx.fillText(stampText, x, y);

            // Convert back to data URL
            resolve(canvas.toDataURL('image/jpeg', 0.9));
        };
        img.onerror = () => resolve(base64DataUrl); // fallback to original
        img.src = base64DataUrl;
    });
}
