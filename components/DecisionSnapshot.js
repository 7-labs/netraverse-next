export default function DecisionSnapshot({ title = 'Decision snapshot', items = [] }) {
  const visibleItems = items.filter(item => item?.label && item?.value);
  if (!visibleItems.length) return null;

  return (
    <section className="decision-snapshot" aria-labelledby="decision-snapshot-heading">
      <h2 id="decision-snapshot-heading">{title}</h2>
      <div className="decision-snapshot__grid">
        {visibleItems.map(item => (
          <div className="decision-snapshot__item" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            {item.note ? <p>{item.note}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
