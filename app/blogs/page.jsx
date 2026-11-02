import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";
import Navbar from "@components/Navbar";
import CallToAction from "@components/CallToAction";
import JsonLd from "@components/JsonLd";
import SectionHeading from "@components/ui/SectionHeading";
import { FadeUp } from "@components/ui/Reveal";
import blogPosts from "@lib/blogs.json";
import { ORGANIZATION_ID, WEBSITE_ID, absolute, breadcrumbLd, graph, pageMeta, url } from "@lib/seo";

const description =
  "Guidance on building in Pakistan from the IDEAL Developments team: architectural trends, sustainable materials, costs and how to get more out of a small plot.";

export const metadata = pageMeta({
  title: "Blog — Construction & Design Guidance for Pakistani Homes",
  description,
  path: "/blogs",
});

const ld = graph(
  {
    "@type": "Blog",
    "@id": `${url("/blogs")}#blog`,
    url: url("/blogs"),
    name: "IDEAL Developments blog",
    description,
    publisher: { "@id": ORGANIZATION_ID },
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: "en-PK",
    blogPost: blogPosts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.excerpt,
      url: url(`/blog/${p.slug}`),
      datePublished: p.date,
      image: absolute(p.image),
      author: { "@type": "Person", name: p.author.name },
    })),
  },
  breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blogs" },
  ])
);

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });

export default function BlogsPage() {
  const [lead, ...rest] = blogPosts;

  return (
    <main id="main">
      <JsonLd data={ld} />
      <Navbar />

      <section className="relative overflow-hidden bg-[linear-gradient(170deg,#e8eef2_0%,#eef0ea_55%,#f7f5f0_100%)] pb-16 pt-32 sm:pb-20 lg:pt-40">
        <div className="absolute inset-0 bg-blueprint opacity-60 mask-fade-edges" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            index="Journal"
            eyebrow="Notes from site"
            title="What we learn building"
            accent="homes in Pakistan."
            description="Practical writing on design, materials and cost, from the people actually pouring the concrete."
          />
        </div>
      </section>

      <section className="relative bg-ivory pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {/* Lead article */}
          <FadeUp className="-mt-8 sm:-mt-12">
            <Link
              href={`/blog/${lead.slug}`}
              className="group grid overflow-hidden rounded-[2rem] bg-white shadow-lift lg:grid-cols-2"
            >
              <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[24rem]">
                <Image
                  src={lead.image}
                  alt={lead.imageAlt ?? lead.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 640px"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <span className="absolute left-5 top-5 rounded-full bg-ink/85 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-gold-400 backdrop-blur">
                  {lead.category}
                </span>
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-10">
                <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.14em] text-ink/45">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-teal" />
                    {formatDate(lead.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-teal" />
                    {lead.readTime}
                  </span>
                </div>
                <h2 className="mt-4 font-display text-[clamp(1.6rem,3vw,2.5rem)] font-bold leading-[1.08] tracking-tightest text-ink">
                  {lead.title}
                </h2>
                <p className="mt-4 leading-relaxed text-ink/60">{lead.excerpt}</p>
                <span className="mt-7 inline-flex items-center gap-3 text-[15px] font-bold text-ink">
                  Read the article
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-gold-400 transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight size={18} />
                  </span>
                </span>
              </div>
            </Link>
          </FadeUp>

          {/* The rest */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <FadeUp key={post.slug} delay={i * 0.08} y={22}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-soft transition-transform duration-500 hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.imageAlt ?? post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-teal backdrop-blur">
                      {post.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/45">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-teal" />
                        {formatDate(post.date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={13} className="text-teal" />
                        {post.readTime}
                      </span>
                    </div>
                    <h2 className="mt-3 font-display text-xl font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-teal">
                      {post.title}
                    </h2>
                    <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink/60">{post.excerpt}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-teal">
                      Read more
                      <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:rotate-45" />
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
