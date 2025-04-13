<script lang="ts">
	import type { Editor } from '@tiptap/core';
import { extra } from '../../routes/editor/[slug]/extra.svelte';
	import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
	import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { db, storage, type ImageType } from '$lib';
	import { post } from '../../routes/editor/[slug]/post.svelte';

	let { editor }: { editor: Editor } = $props();
	let imageUrl = $state('');
	let imageAlt = $state('');
	let imageWidth = $state('');
	let imageHeight = $state('');
	let activeTab = $state('url'); // 'url', 'upload', or 'library'
	let imageLibrary: ImageType[] = $state([]);
	let selectedLibraryImage: ImageType | null = $state(null);
	let uploadProgress = $state(0);
	let isUploading = $state(false);
	let isLoadingLibrary = $state(true);
	let isDeleting = $state(false);
	let errorMessage = $state('');

	// Initialize Firebase Storage and Firestore

	onMount(async () => {
		await loadImageLibrary();
	});

	async function loadImageLibrary() {
		isLoadingLibrary = true;
		errorMessage = '';

		try {
			const imageCollection = collection(db, 'images');
			const imageSnapshot = await getDocs(imageCollection);

			const images: ImageType[] = [];
			imageSnapshot.forEach((doc) => {
				const data = doc.data();
				images.push({
					id: doc.id,
					src: data.url,
					alt: data.alt || 'Image',
					thumbnail: data.thumbnailUrl || data.url,
					fileName: data.fileName,
					storagePath: data.storagePath
				});
			});

			imageLibrary = images;
		} catch (error) {
			console.error('Error loading image library:', error);
			errorMessage = 'Failed to load image library. Please try again.';
		} finally {
			isLoadingLibrary = false;
		}
	}

	function insertImage() {
		let src = '';

		if (activeTab === 'url' && imageUrl) {
			src = imageUrl;
		} else if (activeTab === 'upload' && uploadedImageUrl) {
			src = uploadedImageUrl;
		} else if (activeTab === 'library' && selectedLibraryImage) {
			src = selectedLibraryImage.src;
			if (!imageAlt) imageAlt = selectedLibraryImage.alt;
		}

		if (src && !extra.featured) {
			const attrs = {
				src,
				alt: imageAlt
			};

			if (imageWidth) attrs.width = imageWidth;
			if (imageHeight) attrs.height = imageHeight;

			editor.chain().focus().setImage(attrs).run();
		} else {
			post.featuredImage = src;
		}
		resetForm();
	}

	function resetForm() {
		imageUrl = '';
		imageAlt = '';
		imageWidth = '';
		imageHeight = '';
		selectedLibraryImage = null;
		uploadedImageUrl = '';
		uploadProgress = 0;
		isUploading = false;
		errorMessage = '';
		extra.showImageModal = false;
		extra.featured = false;
	}

	let uploadedImageUrl = $state('');
	let fileInput = $state();

	async function handleFileSelect(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;

		// Check file size (limit to 5MB for example)
		if (file.size > 5 * 1024 * 1024) {
			errorMessage = 'File is too large. Maximum size is 5MB.';
			return;
		}

		// Check file type
		if (!file.type.startsWith('image/')) {
			errorMessage = 'Only image files are allowed.';
			return;
		}

		errorMessage = '';

		// Preview the image locally before upload
		const reader = new FileReader();
		reader.onload = (e) => {
			uploadedImageUrl = e.target?.result as string;
		};
		reader.readAsDataURL(file);

		// Upload to Firebase
		uploadToFirebase(file);
	}

	async function uploadToFirebase(file: ArrayBuffer | Blob | Uint8Array) {
		isUploading = true;
		uploadProgress = 0;
		errorMessage = '';

		try {
			// Create a unique filename
			const timestamp = new Date().getTime();
			const fileName = `${timestamp}_${file.name}`;
			const storageRef = ref(storage, `images/${fileName}`);

			// Start the upload
			const uploadTask = uploadBytesResumable(storageRef, file);

			// Listen for state changes
			uploadTask.on(
				'state_changed',
				(snapshot) => {
					// Update progress
					uploadProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
				},
				(error) => {
					// Handle errors
					console.error('Upload failed:', error);
					errorMessage = 'Upload failed. Please try again.';
					isUploading = false;
				},
				async () => {
					// Upload completed successfully
					const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
					uploadedImageUrl = downloadURL;

					// Save image metadata to Firestore
					try {
						await addDoc(collection(db, 'images'), {
							url: downloadURL,
							alt: file.name.replace(/\.[^/.]+$/, ''), // Use filename without extension as alt
							fileName: file.name,
							storagePath: `images/${fileName}`,
							thumbnailUrl: downloadURL, // For simplicity, using same URL for thumbnail
							uploadedAt: new Date()
						});

						// Refresh library
						await loadImageLibrary();
					} catch (error) {
						console.error('Error saving image metadata:', error);
						errorMessage = 'Error saving image metadata. Image may not appear in library.';
					}

					isUploading = false;
				}
			);
		} catch (error) {
			console.error('Error starting upload:', error);
			errorMessage = 'Error starting upload. Please try again.';
			isUploading = false;
		}
	}

	function selectLibraryImage(image: ImageType | null) {
		selectedLibraryImage = image;
	}

	async function deleteLibraryImage(
		image: ImageType,
		event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }
	) {
		// Stop the click event from selecting the image
		event.stopPropagation();

		if (!confirm(`Are you sure you want to delete this image?`)) {
			return;
		}

		isDeleting = true;
		errorMessage = '';

		try {
			// Delete from storage
			if (image.storagePath) {
				const storageRef = ref(storage, image.storagePath);
				await deleteObject(storageRef);
			}

			// Delete from Firestore
			await deleteDoc(doc(db, 'images', image.id));

			// If the deleted image was selected, clear selection
			if (selectedLibraryImage && selectedLibraryImage.id === image.id) {
				selectedLibraryImage = null;
			}

			// Refresh the library
			await loadImageLibrary();
		} catch (error) {
			console.error('Error deleting image:', error);
			errorMessage = 'Failed to delete image. Please try again.';
		} finally {
			isDeleting = false;
		}
	}
</script>

<!-- Image Modal -->
{#if extra.showImageModal}
	<div class="modal modal-open">
		<div class="modal-box max-w-2xl">
			<h3 class="font-bold text-lg">Insert Image</h3>

			<!-- Tabs -->
			<div class="tabs tabs-boxed mt-4">
				<button
					class={`tab ${activeTab === 'url' ? 'tab-active' : ''}`}
					onclick={() => (activeTab = 'url')}>URL</button
				>
				<button
					class={`tab ${activeTab === 'upload' ? 'tab-active' : ''}`}
					onclick={() => (activeTab = 'upload')}>Upload</button
				>
				<button
					class={`tab ${activeTab === 'library' ? 'tab-active' : ''}`}
					onclick={() => (activeTab = 'library')}>Library</button
				>
			</div>

			<!-- Error Messages -->
			{#if errorMessage}
				<div class="alert alert-error mt-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6 stroke-current shrink-0"
						fill="none"
						viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
						/></svg
					>
					<span>{errorMessage}</span>
				</div>
			{/if}

			<div class="mt-4">
				<!-- URL Tab -->
				{#if activeTab === 'url'}
					<div class="form-control w-full">
						<label for="" class="label">
							<span class="label-text">Image URL</span>
						</label>
						<input
							type="text"
							bind:value={imageUrl}
							placeholder="https://example.com/image.jpg"
							class="input input-bordered w-full"
						/>
					</div>
				{/if}

				<!-- Upload Tab -->
				{#if activeTab === 'upload'}
					<div class="form-control w-full">
						<label for="" class="label">
							<span class="label-text">Upload Image</span>
						</label>
						<input
							type="file"
							accept="image/*"
							onchange={handleFileSelect}
							bind:this={fileInput}
							class="file-input file-input-bordered w-full"
						/>

						{#if isUploading}
							<div class="mt-2">
								<progress class="progress progress-primary w-full" value={uploadProgress} max="100"
								></progress>
								<p class="text-sm mt-1">Uploading: {uploadProgress}%</p>
							</div>
						{/if}

						{#if uploadedImageUrl}
							<div class="mt-4">
								<img src={uploadedImageUrl} alt="Preview" class="max-h-40 rounded-md shadow-md" />
							</div>
						{/if}
					</div>
				{/if}

				<!-- Library Tab -->
				{#if activeTab === 'library'}
					{#if isLoadingLibrary}
						<div class="flex justify-center items-center p-8">
							<span class="loading loading-spinner loading-lg"></span>
						</div>
					{:else if imageLibrary.length === 0}
						<div class="p-8 text-center text-gray-500">
							<p>No images found in the library</p>
						</div>
					{:else}
						<div class="grid grid-cols-3 gap-2 mt-2 max-h-60 overflow-y-auto">
							{#each imageLibrary as image}
								<div
									aria-roledescription="url"
									class={`relative cursor-pointer border rounded-md p-2 group ${selectedLibraryImage?.id === image.id ? 'border-primary border-2' : 'border-gray-200'}`}
									onclick={() => selectLibraryImage(image)}
								>
									<img src={image.thumbnail} alt={image.alt} class="w-full h-24 object-cover" />
									<p class="text-xs mt-1 truncate">{image.alt}</p>

									<!-- Delete button -->
									<button
										aria-label="delete"
										class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
										onclick={(event) => deleteLibraryImage(image, event)}
										disabled={isDeleting}
										title="Delete image"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</button>
								</div>
							{/each}
						</div>
					{/if}
				{/if}
			</div>

			<!-- Common Fields for All Tabs -->
			<div class="form-control w-full mt-4">
				<label for="" class="label">
					<span class="label-text">Alt Text</span>
				</label>
				<input
					type="text"
					bind:value={imageAlt}
					placeholder="Image description"
					class="input input-bordered w-full"
				/>
			</div>

			<div class="grid grid-cols-2 gap-4 mt-2">
				<div class="form-control w-full">
					<label for="" class="label">
						<span class="label-text">Width (optional)</span>
					</label>
					<input
						type="text"
						bind:value={imageWidth}
						placeholder="e.g., 300px or 50%"
						class="input input-bordered w-full"
					/>
				</div>
				<div class="form-control w-full">
					<label for="" class="label">
						<span class="label-text">Height (optional)</span>
					</label>
					<input
						type="text"
						bind:value={imageHeight}
						placeholder="e.g., 200px"
						class="input input-bordered w-full"
					/>
				</div>
			</div>

			<div class="modal-action">
				<button class="btn" onclick={resetForm}>Cancel</button>
				<button
					class="btn btn-primary"
					onclick={insertImage}
					disabled={(activeTab === 'url' && !imageUrl) ||
						(activeTab === 'upload' && !uploadedImageUrl) ||
						(activeTab === 'library' && !selectedLibraryImage) ||
						isUploading ||
						isDeleting}
				>
					Insert
				</button>
			</div>
		</div>
	</div>
{/if}
