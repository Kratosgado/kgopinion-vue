import type { Post } from '$lib/types';

// src/lib/seo/schemas.ts
export function generateArticleSchema(post: Post) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.title,
		description: post.excerpt,
		image: post.featuredImage,
		datePublished: post.createdAt,
		dateModified: post.updatedAt,
		author: {
			'@type': 'Person',
			name: post.author
		}
	};
}
