import type { Editor } from '@tiptap/core';

// Function to handle image upload and convert to WebP
export async function handleImageUpload(
	file: File,
	editor: Editor,
	range?: { from: number; to: number }
) {
	// Create a FileReader to read the file
	const reader = new FileReader();

	reader.onload = async (event) => {
		const img = new Image();
		img.onload = async () => {
			// Create canvas for WebP conversion
			const canvas = document.createElement('canvas');
			canvas.width = img.width;
			canvas.height = img.height;

			const ctx = canvas.getContext('2d');
			ctx?.drawImage(img, 0, 0);

			// Convert to WebP format with 0.8 quality
			const webpDataUrl = canvas.toDataURL('image/webp', 0.8);

			// Example of uploading to your server - replace with your actual API
			// const response = await fetch('/api/upload-image', {
			//   method: 'POST',
			//   body: JSON.stringify({ image: webpDataUrl }),
			//   headers: {
			//     'Content-Type': 'application/json'
			//   }
			// });
			// const { imageUrl } = await response.json();

			// For now, we'll just use the data URL
			// In production, you'd use the uploaded URL from your server
			const imageUrl = webpDataUrl;

			// Insert the image at cursor position or the range position if provided
			if (range) {
				editor.chain().focus().deleteRange(range).setImage({ src: imageUrl }).run();
			} else {
				editor.chain().focus().setImage({ src: imageUrl }).run();
			}
		};

		if (event.target?.result) {
			img.src = event.target.result as string;
		}
	};

	reader.readAsDataURL(file);
}
