export default function ReferenceList({ items = [] }) {
  if (!items.length) {
    return null;
  }

  return (
    <section className="content-block">
      <h2>References</h2>
      <ol className="reference-list">
        {items.map(item => (
          <li key={item.url}>
            <a href={item.url} target="_blank" rel="noreferrer">
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}

