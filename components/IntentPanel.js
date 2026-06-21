export default function IntentPanel({ title = 'Use this page if', useCases = [], bottomLine, beforeYouAct = [] }) {
  const visibleUseCases = useCases.filter(Boolean);
  const visibleActions = beforeYouAct.filter(Boolean);

  if (!visibleUseCases.length && !bottomLine && !visibleActions.length) return null;

  return (
    <section className="intent-panel" aria-labelledby="intent-panel-heading">
      <div className="intent-panel__main">
        <p className="eyebrow">Decision fit</p>
        <h2 id="intent-panel-heading">{title}</h2>
        {visibleUseCases.length ? (
          <ul>
            {visibleUseCases.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="intent-panel__side">
        {bottomLine ? (
          <div className="intent-panel__box">
            <span>Bottom line</span>
            <p>{bottomLine}</p>
          </div>
        ) : null}
        {visibleActions.length ? (
          <div className="intent-panel__box">
            <span>Before you act</span>
            <ol>
              {visibleActions.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
        ) : null}
      </div>
    </section>
  );
}
