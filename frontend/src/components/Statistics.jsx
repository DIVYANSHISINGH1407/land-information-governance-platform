function Statistics() {
  const statistics = [
    { label: "Land Records", value: "1,250+" },
    { label: "Districts", value: "25" },
    { label: "Research Reports", value: "150" },
    { label: "Government Policies", value: "80" },
  ];

  return (
    <section className="section statistics">
      <div className="container">
        <h2 className="statistics-title">BhoomiSetu at a glance</h2>
        <div className="statistics-grid">
          {statistics.map((statistic) => (
            <div className="statistics-card" key={statistic.label}>
              <p className="statistics-value">{statistic.value}</p>
              <p className="statistics-label">{statistic.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Statistics;
