import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProjectHeader } from '@/components/gallery/ProjectHeader';
import { Spacer } from '@/components/ui/Spacer';
import { evolutionSimPosts, getPostBySlug } from '@/data/evolutionSimPosts';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';

export function generateStaticParams() {
  return evolutionSimPosts.map((post) => ({ slug: post.slug }));
}

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

export default async function EvolutionSimPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <ProjectHeader />

      <Spacer className="h-30" />

      <article className="pb-24 px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="max-w-3xl w-full">
          <Link
            href="/side-quests/evolution-sim"
            className="inline-flex items-center text-sm text-emerald-400 hover:text-emerald-300 transition-colors mb-8"
          >
            ← Back to all posts
          </Link>

          <header className="mb-10">
            <time className="text-sm text-gray-500">{formatDate(post.date)}</time>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-5">
              {post.title}
            </h1>
            {post.tags && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="prose prose-invert prose-lg max-w-none [&>blockquote]:ml-6 [&>blockquote]:border-l-2 [&>blockquote]:border-emerald-500/30 [&>blockquote]:pl-4 [&>blockquote]:my-4 [&>blockquote]:text-gray-400">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex, rehypeHighlight]}
              components={{
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-emerald-400 hover:text-emerald-300 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>
      </article>
    </div>
  );
}
