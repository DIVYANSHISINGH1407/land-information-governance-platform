import { useState } from "react";
import { districtsByState, landData } from "../data/mockData";

const dashboardTabs = ["Overview", "Land Classification", "Ownership"];

// Add commas to a number so large areas are easier to read.
function formatNumber(value) {
  return Math.round(value).toLocaleString("en-IN");
}

// Use district percentages when a district is selected. Otherwise show state figures.
function getLandTypes(stateData, districtData) {
  if (!districtData) {
    return stateData.classification;
  }

  return stateData.classification.map((landType) => {
    const percent = districtData.classification[landType.name];

    return {
      name: landType.name,
      color: landType.color,
      percent,
      area: Math.round((districtData.totalArea * percent) / 100),
    };
  });
}

function CategoryChart({ landTypes, selectedType, onSelectType }) {
  return (
    <div className="simple-category-chart">
      {landTypes.map((landType) => (
        <button
          key={landType.name}
          className={selectedType === landType.name ? "chart-row selected" : "chart-row"}
          onClick={() => onSelectType(landType.name)}
        >
          <span className="chart-row-name">
            <i style={{ background: landType.color }} />
            {landType.name}
          </span>
          <span className="chart-row-track">
            <i
              style={{
                width: `${landType.percent}%`,
                background: landType.color,
              }}
            />
          </span>
          <b>{landType.percent}%</b>
          <small>{formatNumber(landType.area)} km²</small>
        </button>
      ))}
    </div>
  );
}

// Build the colored slices for a CSS pie chart from the land percentages.
function getPieColors(landTypes) {
  let start = 0;
  const slices = landTypes.map((landType) => {
    const end = start + landType.percent;
    const slice = `${landType.color} ${start}% ${end}%`;
    start = end;
    return slice;
  });

  return `conic-gradient(${slices.join(", ")})`;
}

function LandUsePieChart({ landTypes }) {
  return (
    <div className="pie-chart-layout">
      <div
        className="land-use-pie"
        role="img"
        aria-label="Pie chart showing land use by category"
        style={{ background: getPieColors(landTypes) }}
      />
      <div className="pie-chart-legend">
        {landTypes.map((landType) => (
          <div className="pie-legend-row" key={landType.name}>
            <span>
              <i style={{ background: landType.color }} />
              {landType.name}
            </span>
            <b>{landType.percent}%</b>
          </div>
        ))}
      </div>
    </div>
  );
}

function OwnershipChart({ government, privateShare }) {
  return (
    <div className="simple-ownership-chart">
      <div className="ownership-share-bar" aria-label="Ownership share">
        <span style={{ width: `${government}%` }} />
      </div>
      <div className="ownership-share-labels">
        <p>
          <i className="gov-key" />
          Government / public <b>{government}%</b>
        </p>
        <p>
          <i className="private-key" />
          Private / other <b>{privateShare}%</b>
        </p>
      </div>
    </div>
  );
}

function EmptyDistrictNotice() {
  return (
    <section className="explore-empty">
      <span>⌖</span>
      <h2>District data is not available in this demo</h2>
      <p>
        We don’t show state statistics as district figures. Choose “All available area” or a
        district with sample data.
      </p>
    </section>
  );
}

export default function ExplorePage() {
  // These values remember the visitor's current selections while the page is open.
  const [state, setState] = useState("Uttar Pradesh");
  const [district, setDistrict] = useState("");
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedType, setSelectedType] = useState("");

  const stateData = landData[state];
  const districts = districtsByState[state] || [];
  const districtData = stateData.districts && stateData.districts[district];
  const landTypes = getLandTypes(stateData, districtData);
  const totalArea = districtData ? districtData.totalArea : stateData.totalArea;
  const governmentShare = districtData ? districtData.government : stateData.government;
  const privateShare = districtData ? districtData.private : stateData.private;

  function changeState(newState) {
    setState(newState);
    setDistrict("");
    setSelectedType("");
  }

  function changeDistrict(newDistrict) {
    setDistrict(newDistrict);
    setSelectedType("");
  }

  function toggleSelectedType(name) {
    setSelectedType(selectedType === name ? "" : name);
  }

  return (
    <main className="inner-page explore-page">
      <section className="page-heading">
        <div>
          <span className="overline">LAND DATA EXPLORER</span>
          <h1>Explore Land</h1>
          <p>Discover land classification and ownership patterns across states and districts.</p>
        </div>
        <span className="demo-label">◉ &nbsp; DEMONSTRATION DATA</span>
      </section>

      <section className="explore-filters">
        <div className="filter-explainer">
          <span className="filter-location-icon">⌖</span>
          <div>
            <b>Select an area</b>
            <small>Choose a state to begin exploring</small>
          </div>
        </div>

        <label>
          <span>STATE</span>
          <select value={state} onChange={(event) => changeState(event.target.value)}>
            {Object.keys(landData).map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>

        <label>
          <span>
            DISTRICT <small>OPTIONAL</small>
          </span>
          <select
            value={district}
            onChange={(event) => changeDistrict(event.target.value)}
            disabled={districts.length === 0}
          >
            <option value="">
              {districts.length > 0 ? "All available area" : "No district demo data"}
            </option>
            {districts.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>

        <span className="unit-pill">Area in km²</span>
      </section>

      <div className="explore-tabbar" role="tablist" aria-label="Explore land dashboard">
        {dashboardTabs.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {district && !districtData ? (
        <EmptyDistrictNotice />
      ) : (
        <>
          <section className="area-title">
            <div>
              <span className="overline">{district ? "DISTRICT OVERVIEW" : "STATE OVERVIEW"}</span>
              <h2>{district ? `${district}, ${state}` : state}</h2>
              <p>Illustrative regional overview · figures are not verified official statistics</p>
            </div>
            <div className="area-total">
              <span>TOTAL GEOGRAPHICAL AREA</span>
              <b>
                {formatNumber(totalArea)} <small>km²</small>
              </b>
            </div>
          </section>

          {activeTab === "Overview" && (
            <>
              <section className="overview-metrics">
                {landTypes.slice(0, 4).map((landType) => (
                  <article key={landType.name}>
                    <span className="metric-swatch" style={{ background: landType.color }} />
                    <small>{landType.name.toUpperCase()} LAND</small>
                    <b>{landType.percent}%</b>
                    <span>{formatNumber(landType.area)} km²</span>
                  </article>
                ))}
              </section>

              <section className="explore-chart-grid">
                <article className="content-panel">
                  <div className="panel-title">
                    <div>
                      <span className="overline">CLASSIFICATION</span>
                      <h3>Land use distribution</h3>
                    </div>
                    <span>Share of area</span>
                  </div>
                  <LandUsePieChart landTypes={landTypes} />
                  <p className="chart-caption">
                    The pie shows each land type’s share of the area. Land ownership is shown
                    separately.
                  </p>
                </article>

                <article className="content-panel">
                  <div className="panel-title">
                    <div>
                      <span className="overline">OWNERSHIP</span>
                      <h3>Government and private land</h3>
                    </div>
                    <span>Share of area</span>
                  </div>
                  <div className="ownership-panel-content">
                    <OwnershipChart government={governmentShare} privateShare={privateShare} />
                    <p className="ownership-explanation">
                      Ownership is separate from land use. Agricultural land can be privately or
                      publicly owned.
                    </p>
                  </div>
                </article>
              </section>

            </>
          )}

          {activeTab === "Land Classification" && (
            <>
              <section className="content-panel classification-detail">
                <div className="panel-title">
                  <div>
                    <span className="overline">LAND CLASSIFICATION</span>
                    <h3>Distribution by land type</h3>
                    <p>Select a category to highlight it in the chart.</p>
                  </div>
                  <span>Area: km² · Share: %</span>
                </div>

                <div className="classification-layout">
                  <CategoryChart
                    landTypes={landTypes}
                    selectedType={selectedType}
                    onSelectType={toggleSelectedType}
                  />
                  <div className="classification-table">
                    <div className="classification-row classification-head">
                      <span>CATEGORY</span>
                      <span>AREA</span>
                      <span>SHARE</span>
                    </div>
                    {landTypes.map((landType) => (
                      <button
                        key={landType.name}
                        className={
                          selectedType === landType.name
                            ? "classification-row row-selected"
                            : "classification-row"
                        }
                        onClick={() => toggleSelectedType(landType.name)}
                      >
                        <span>
                          <i style={{ background: landType.color }} />
                          {landType.name}
                        </span>
                        <b>{formatNumber(landType.area)} km²</b>
                        <b>{landType.percent}%</b>
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <section className="content-panel">
                <div className="panel-title">
                  <div>
                    <span className="overline">COMPARISON</span>
                    <h3>Area by category</h3>
                  </div>
                  <span>Each bar shows the category’s share of the area</span>
                </div>
                <CategoryChart
                  landTypes={landTypes}
                  selectedType={selectedType}
                  onSelectType={toggleSelectedType}
                />
              </section>
            </>
          )}

          {activeTab === "Ownership" && (
            <>
              <section className="content-panel ownership-detail">
                <div className="panel-title">
                  <div>
                    <span className="overline">OWNERSHIP PROFILE</span>
                    <h3>Land by ownership</h3>
                    <p>Ownership and land use are separate measures.</p>
                  </div>
                </div>

                <div className="ownership-overview">
                  <OwnershipChart government={governmentShare} privateShare={privateShare} />
                  <div className="ownership-detail-copy">
                    <h3>Who holds the land</h3>
                    <p>
                      A land parcel can belong to one owner and still be classified as agricultural,
                      forest or another land type.
                    </p>
                  </div>
                </div>

                <div className="ownership-category-table">
                  <div className="ownership-cat-row ownership-cat-head">
                    <span>LAND CLASSIFICATION</span>
                    <span>AREA</span>
                    <span>OWNERSHIP DATA</span>
                  </div>
                  {landTypes.map((landType) => (
                    <div className="ownership-cat-row" key={landType.name}>
                      <span>
                        <i style={{ background: landType.color }} />
                        {landType.name}
                      </span>
                      <b>{formatNumber(landType.area)} km²</b>
                      <span className="ownership-availability">Not available in sample data</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="insight-band">
                <span>ⓘ</span>
                <div>
                  <b>Ownership-by-category detail</b>
                  <p>
                    This demo does not include ownership details for each land category, so those
                    figures are not estimated.
                  </p>
                </div>
              </section>
            </>
          )}
        </>
      )}

    </main>
  );
}
