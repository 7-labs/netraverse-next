import Icon from './Icon';

// Presentational filter/search bar for the database listing pages. Holds no
// data logic — each page owns its useState/useMemo and passes handlers in.
// Filtering is progressive enhancement: the page still renders the full list
// from props on first paint, so crawlers see every item.
export default function CatalogFilter({
  search,
  onSearch,
  placeholder = 'Search…',
  groups = [],
  sort,
  count,
  total,
  onClear,
}) {
  const hasActiveFilters =
    Boolean(search && search.trim()) || groups.some(g => g.active && g.active.size > 0);

  return (
    <section className="catalog-filter" aria-label="Filter and search">
      <div className="catalog-filter__bar">
        <div className="catalog-filter__search">
          <Icon name="search" />
          <input
            type="search"
            value={search}
            onChange={event => onSearch(event.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
          />
        </div>
        {sort ? (
          <label className="catalog-filter__sort">
            <span>Sort</span>
            <select value={sort.value} onChange={event => sort.onChange(event.target.value)}>
              {sort.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      {groups.map(group => (
        <div
          key={group.key}
          className="catalog-filter__group"
          role="group"
          aria-label={group.label}
        >
          <span className="catalog-filter__group-label">{group.label}</span>
          <div className="catalog-filter__pills">
            {group.options.map(option => {
              const active = Boolean(group.active && group.active.has(option.value));
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`filter-pill${active ? ' filter-pill--active' : ''}`}
                  aria-pressed={active}
                  onClick={() => group.onToggle(option.value)}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <p className="catalog-filter__count" role="status" aria-live="polite">
        Showing <strong>{count}</strong> of {total}
        {hasActiveFilters ? (
          <button type="button" className="catalog-filter__clear" onClick={onClear}>
            <Icon name="check" />
            Clear filters
          </button>
        ) : null}
      </p>
    </section>
  );
}
