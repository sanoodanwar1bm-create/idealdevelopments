/**
 * Renders a structured-data block. Server component: the JSON ships in the
 * HTML so crawlers see it without running any JavaScript.
 */
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      // Only our own serialised objects reach this, and `<` is escaped so the
      // payload can never close the script tag early.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }}
    />
  );
}
