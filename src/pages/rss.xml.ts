import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import blogConfig from '../../blog.config.mjs';
import { getPostUrl, sortPosts, stripMarkdown, toAbsoluteUrl } from '../lib/blog';

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = async () => {
  const posts = sortPosts(await getCollection('blog'));

  const items = posts.map((post) => {
    const link = toAbsoluteUrl(getPostUrl(post));
    const rawSummary = post.data.description || stripMarkdown(post.body || '');
    const summary = escapeXml(rawSummary);
    const category = escapeXml(post.data.category);
    const tags = post.data.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('');

    return `<item>
  <title>${escapeXml(post.data.title)}</title>
  <link>${link}</link>
  <guid>${link}</guid>
  <pubDate>${post.data.date.toUTCString()}</pubDate>
  <description>${summary}</description>
  <category>${category}</category>
  ${tags}
</item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(blogConfig.siteName)}</title>
  <link>${escapeXml(blogConfig.siteUrl)}</link>
  <description>${escapeXml(blogConfig.description)}</description>
  <language>zh-CN</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <generator>Astro</generator>
  ${items.join('\n  ')}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
};
