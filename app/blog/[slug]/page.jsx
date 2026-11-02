import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Calendar, Clock } from "lucide-react";
import blogsData from "@lib/blogs.json";
import Navbar from "@components/Navbar";
import CallToAction from "@components/CallToAction";
import JsonLd from "@components/JsonLd";
import { FadeUp } from "@components/ui/Reveal";
import {
  ORGANIZATION_ID,
  WEBSITE_ID,
  absolute,
  breadcrumbLd,
  graph,
  pageMeta,
  url,
} from "@lib/seo";

export async function generateStaticParams() {
  return blogsData.map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = blogsData.find((blog) => blog.slug === slug);
  if (!post) return {};
  return pageMeta({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    images: [post.image],
    type: "article",
    published: new Date(post.date).toISOString(),
  });
}

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });

const initials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

function Block({ block }) {
  switch (block.type) {
    case "paragraph":
      return <p className="mt-6 text-lg leading-relaxed text-ink/70">{block.text}</p>;
    case "heading":
      return (
        <h2 className="mt-12 font-display text-[clamp(1.5rem,2.6vw,2rem)] font-bold tracking-tight text-ink">
          {block.text}
        </h2>
      );
    case "list":
      return (
        <ul className="mt-6 space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-lg leading-relaxed text-ink/70">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
              {item}
            </li>
          ))}
        </ul>
      );
    case "image":
      return (
        <figure className="mt-10">
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl shadow-lift">
            <Image src={block.src} alt={block.alt ?? ""} fill sizes="(max-width: 896px) 100vw, 896px" className="object-cover" />
          </div>
          {block.alt && <figcaption className="mt-3 text-center text-sm text-ink/50">{block.alt}</figcaption>}
        </figure>
      );
    default:
      return null;
  }
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = blogsData.find((blog) => blog.slug === slug);

  if (!post) {
    notFound();
  }

  const path = `/blog/${slug}`;
  const related = blogsData.filter((b) => b.slug !== post.slug).slice(0, 3);
  const ld = graph(
    {
      "@type": "BlogPosting",
      "@id": `${url(path)}#article`,
      headline: post.title,
      description: post.excerpt,
      url: url(path),
      image: absolute(post.image),
      datePublished: new Date(post.date).toISOString(),
      dateModified: new Date(post.date).toISOString(),
      articleSection: post.category,
      keywords: post.tags?.join(", "),
      inLanguage: "en-PK",
      author: { "@type": "Person", name: post.author.name, description: post.author.bio },
      publisher: { "@id": ORGANIZATION_ID },
      isPartOf: { "@id": WEBSITE_ID },
      mainEntityOfPage: url(path),
    },
    breadcrumbLd([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blogs" },
      { name: post.title, path },
    ])
  );

  return (
    <main id="main">
      <JsonLd data={ld} />
      {/* The hero photo is dark, so the bar needs its own surface */}
      <Navbar solid />

      {/* Hero */}
      <header className="relative h-[62svh] min-h-[24rem] w-full overflow-hidden">
        <Image
          src={post.image}
          alt={post.imageAlt ?? post.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/20" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-4xl px-5 pb-10 sm:px-8 sm:pb-14">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition-colors hover:text-white"
            >
              <ArrowLeft size={16} />
              All articles
            </Link>
            <span className="mt-5 block text-xs font-bold uppercase tracking-[0.25em] text-gold-400">
              {post.category}
            </span>
            <h1 className="mt-3 font-display text-[clamp(1.9rem,4.6vw,3.5rem)] font-bold leading-[1.05] tracking-tightest text-white">
              {post.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
              <span className="flex items-center gap-2">
                <Calendar size={15} className="text-gold-400" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={15} className="text-gold-400" />
                {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </header>

      <article className="relative bg-ivory pb-20 pt-12 sm:pt-16">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          {/* Author */}
          <div className="flex items-center gap-4 border-b border-ink/10 pb-8">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-mint font-display text-sm font-bold text-teal">
              {initials(post.author.name)}
            </span>
            <div>
              <p className="font-display font-bold text-ink">{post.author.name}</p>
              <p className="text-sm text-ink/50">{post.author.bio}</p>
            </div>
          </div>

          <FadeUp y={20}>
            {post.content.map((block, index) => (
              <Block key={index} block={block} />
            ))}
          </FadeUp>

          {/* Tags */}
          <div className="mt-14 border-t border-ink/10 pt-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-ink/45">Filed under</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink/70 shadow-soft"
                >
                  #{tag}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>

      {/* Related */}
      <section className="bg-[#eef5f2] py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Keep reading
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, i) => (
              <FadeUp key={item.slug} delay={i * 0.08} y={22}>
                <Link
                  href={`/blog/${item.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-soft transition-transform duration-500 hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.imageAlt ?? item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 380px"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal">
                      {item.category}
                    </span>
                    <h3 className="mt-2 font-display text-lg font-bold leading-snug tracking-tight text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink/60">{item.excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-ink">
                      Read
                      <ArrowUpRight size={15} className="transition-transform duration-500 group-hover:rotate-45" />
                    </span>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <CallToAction />
    </main>
  );
}
