import { createServerFileRoute } from '@tanstack/react-start/server';
import { generateOpenGraphImage } from '~/utils/generateOpenGraph';
import { getPostBySlug } from '~/utils/markdown.server';

export const ServerRoute = createServerFileRoute('/api/og/blog/$slug').methods({
    GET: async ({ params }) => {
        try {
            const slug = params.slug;
            const post = await getPostBySlug(slug);

            if (!post) {
                return new Response('Blog post not found', { status: 404 });
            }

            const image = await generateOpenGraphImage({
                title: post.title,
                subtitle: 'Blog Post'
            });

            return new Response(image, {
                headers: {
                    'Content-Type': 'image/png',
                    'Cache-Control': 'public, max-age=31536000, immutable',
                },
            });
        } catch (error) {
            console.error('Error generating OG image:', error);
            return new Response('Error generating image', { status: 500 });
        }
    },
});
