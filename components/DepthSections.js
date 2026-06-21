function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

export default function DepthSections({ sections = [], navLabel = 'In this page' }) {
  const normalizedSections = sections
    .filter(section => section?.heading)
    .map((section, sectionIndex) => ({
      ...section,
      id: section.id || `${slugify(section.heading)}-${sectionIndex + 1}`,
    }));

  if (!normalizedSections.length) return null;

  return (
    <>
      <nav className="section-nav" aria-label={navLabel}>
        <p>{navLabel}</p>
        <ol>
          {normalizedSections.map(section => (
            <li key={section.id}>
              <a href={`#${section.id}`}>{section.heading}</a>
            </li>
          ))}
        </ol>
      </nav>

      {normalizedSections.map(section => (
        <section id={section.id} className="content-block content-block--depth" key={section.id}>
          <h2>{section.heading}</h2>
          {(section.paragraphs || []).map((paragraph, paragraphIndex) => (
            <p key={`${section.id}-p-${paragraphIndex}`}>{paragraph}</p>
          ))}
          {section.bullets?.length ? (
            <ul className="break-list">
              {section.bullets.map((item, itemIndex) => (
                <li key={`${section.id}-b-${itemIndex}`}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </>
  );
}
