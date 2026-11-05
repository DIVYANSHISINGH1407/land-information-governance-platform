import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getDistricts,
  getSourceVillages,
  getStateLandUseSummary,
  getStates,
  getTehsils,
  getVillages,
  searchParcels,
} from "../services/api";

const emptyFilters = {
  stateId: "",
  districtId: "",
  tehsilId: "",
  villageId: "",
};

const chartColors = ["#337457", "#d49c45", "#5688a6", "#b9684f", "#788b60"];

function getRecordLocation(parcel, field) {
  return parcel.location?.[field] || parcel[field] || "Not available in source";
}

function countLandUse(records) {
  const counts = {};
  records.forEach((record) => {
    const landUse = record.landUse || "Not specified";
    counts[landUse] = (counts[landUse] || 0) + 1;
  });

  return Object.entries(counts).map(([name, count], index) => ({
    name,
    count,
    color: chartColors[index % chartColors.length],
  }));
}

function SearchResults({ parcels, loading, error, totalRecords, onRetry }) {
  if (loading) {
    return <div className="explorer-state">Loading parcel records…</div>;
  }

  if (error) {
    return (
      <div className="explorer-state explorer-state-error" role="alert">
        <b>We couldn’t load parcel records.</b>
        <span>{error}</span>
        <button type="button" onClick={onRetry}>Try again</button>
      </div>
    );
  }

  if (totalRecords === 0) {
    return (
      <div className="explorer-state">
        <b>No matching records</b>
          <span>Choose another state, district, tehsil, or village.</span>
      </div>
    );
  }

  return (
    <div className="parcel-card-list">
      {parcels.map((parcel) => (
        <article className="parcel-result-card" key={`${parcel.source}-${parcel.parcelId}`}>
          <div className="parcel-card-topline">
            <div>
              <span className="explorer-eyebrow">PARCEL ID</span>
              <h3>{parcel.parcelId}</h3>
            </div>
            <span
              className={`status-pill ${String(parcel.verificationStatus)
                .toLowerCase()
                .replaceAll(" ", "-")}`}
            >
              {parcel.verificationStatus || "Status unavailable"}
            </span>
          </div>

          <div className="parcel-card-grid">
            <div><span>Khasra number</span><b>{parcel.khasraNumber}</b></div>
            <div><span>Village</span><b>{getRecordLocation(parcel, "village")}</b></div>
            <div><span>District</span><b>{getRecordLocation(parcel, "district")}</b></div>
            <div><span>Recorded area</span><b>{parcel.recordedArea} {parcel.areaUnit}</b></div>
            <div><span>Recorded land use</span><b>{parcel.landUse}</b></div>
            <div><span>Revenue record</span><b>{parcel.revenueRecord}</b></div>
          </div>

          <Link
            className="parcel-profile-link"
            to={`/explore/parcels/${encodeURIComponent(parcel.parcelId)}`}
          >
            View complete land profile <span aria-hidden="true">→</span>
          </Link>
        </article>
      ))}
    </div>
  );
}

function LandUseStateSlider({
  states,
  selectedStateId,
  onStateChange,
  summary,
  loading,
  error,
}) {
  const selectedIndex = states.findIndex((state) => state._id === selectedStateId);
  const landUseTypes = summary?.data || [];
  const slices = landUseTypes.map((item, index) => {
    const start = landUseTypes
      .slice(0, index)
      .reduce((total, previous) => total + previous.share, 0);
    return `${chartColors[index % chartColors.length]} ${start}% ${start + item.share}%`;
  });

  return (
    <section className="state-cover-panel">
      <div className="state-cover-heading">
        <div>
          <span className="explorer-eyebrow">STATE LAND COVER</span>
          <h2>Explore land use by state</h2>
          <p>Choose a state to see the land-use mix in its connected parcel records.</p>
        </div>
        <span className="state-cover-selected">
          {states[selectedIndex]?.name || "No state selected"}
        </span>
      </div>

      {states.length > 0 && (
        <div className="state-slider-row">
          <span>{states[0].name}</span>
          <input
            aria-label="Select state for land cover"
            type="range"
            min="0"
            max={Math.max(states.length - 1, 0)}
            step="1"
            value={Math.max(selectedIndex, 0)}
            disabled={states.length < 2}
            onChange={(event) => onStateChange(states[Number(event.target.value)]._id)}
          />
          <span>{states[states.length - 1].name}</span>
        </div>
      )}

      {loading ? (
        <p className="state-cover-message">Loading state summary…</p>
      ) : error ? (
        <p className="state-cover-message state-cover-error" role="alert">{error}</p>
      ) : summary?.totalRecords > 0 ? (
        <div className="state-cover-content">
          <div
            className="state-cover-chart"
            role="img"
            aria-label={`Recorded land-use distribution in ${summary.state}`}
            style={{ background: `conic-gradient(${slices.join(", ")})` }}
          />
          <div className="state-cover-legend">
            {landUseTypes.map((item, index) => (
              <div key={item.landUse}>
                <i style={{ background: chartColors[index % chartColors.length] }} />
                <b>{item.landUse}</b>
                <span>{item.share}% · {item.recordCount} records</span>
              </div>
            ))}
            <p>
              Based on {summary.totalRecords} records in this database. Shares show record counts,
              not the state’s total land area.
            </p>
          </div>
        </div>
      ) : (
        <p className="state-cover-message">
          No land-use records are available for this state yet.
        </p>
      )}
    </section>
  );
}

export default function ExplorePage() {
  const [filters, setFilters] = useState(emptyFilters);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [tehsils, setTehsils] = useState([]);
  const [villages, setVillages] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [stateSummary, setStateSummary] = useState(null);
  const [summaryForStateId, setSummaryForStateId] = useState("");
  const [summaryError, setSummaryError] = useState("");
  const [parcels, setParcels] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalRecords: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    getStates()
      .then((result) => {
        const availableStates = result.data || [];
        setStates(availableStates);
        if (availableStates.length > 0) setSelectedStateId(availableStates[0]._id);
      })
      .catch((requestError) => setLocationError(requestError.message));
  }, []);

  useEffect(() => {
    if (!selectedStateId) return;
    getStateLandUseSummary(selectedStateId)
      .then((result) => {
        setStateSummary(result);
        setSummaryForStateId(selectedStateId);
        setSummaryError("");
      })
      .catch((requestError) => {
        setStateSummary(null);
        setSummaryForStateId(selectedStateId);
        setSummaryError(requestError.message);
      });
  }, [selectedStateId]);

  useEffect(() => {
    if (!filters.stateId) return;
    getDistricts(filters.stateId)
      .then((result) => setDistricts(result.data || []))
      .catch((requestError) => setLocationError(requestError.message));
  }, [filters.stateId]);

  useEffect(() => {
    if (!filters.districtId) return;
    getTehsils(filters.districtId)
      .then((result) => setTehsils(result.data || []))
      .catch((requestError) => setLocationError(requestError.message));
  }, [filters.districtId]);

  useEffect(() => {
    if (filters.districtId.startsWith("source|")) {
      const [, stateName, districtName] = filters.districtId.split("|");
      getSourceVillages(stateName, districtName)
        .then((result) => setVillages(result.data || []))
        .catch((requestError) => setLocationError(requestError.message));
      return;
    }
    if (!filters.tehsilId) return;
    getVillages(filters.tehsilId)
      .then((result) => setVillages(result.data || []))
      .catch((requestError) => setLocationError(requestError.message));
  }, [filters.districtId, filters.tehsilId]);

  function updateFilter(field, value) {
    if (field === "stateId") {
      setDistricts([]);
      setTehsils([]);
      setVillages([]);
    }
    if (field === "districtId") {
      setTehsils([]);
      setVillages([]);
    }
    if (field === "tehsilId") setVillages([]);

    setFilters((current) => {
      const next = { ...current, [field]: value };
      if (field === "stateId") {
        next.districtId = "";
        next.tehsilId = "";
        next.villageId = "";
      }
      if (field === "districtId") {
        next.tehsilId = "";
        next.villageId = "";
      }
      if (field === "tehsilId") next.villageId = "";
      return next;
    });
  }

  async function search(nextPage = 1) {
    const hasSelectedArea = Boolean(
      filters.stateId || filters.districtId || filters.tehsilId || filters.villageId,
    );
    if (!hasSelectedArea) {
      setSearched(true);
      setError("Select a state, district, tehsil, or village to browse its records.");
      setParcels([]);
      setPagination({ totalRecords: 0, totalPages: 0 });
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const result = await searchParcels({ ...filters, page: nextPage, limit: 10 });
      setParcels(result.data || []);
      setPagination(result.pagination || { totalRecords: 0, totalPages: 0 });
      setPage(nextPage);
    } catch (requestError) {
      setParcels([]);
      setPagination({ totalRecords: 0, totalPages: 0 });
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  function clearFilters() {
    setFilters(emptyFilters);
    setDistricts([]);
    setTehsils([]);
    setVillages([]);
    setParcels([]);
    setPagination({ totalRecords: 0, totalPages: 0 });
    setPage(1);
    setSearched(false);
    setError("");
  }

  const resultLandUse = countLandUse(parcels);
  const visibleRecordCount = resultLandUse.reduce((total, item) => total + item.count, 0);
  const resultSlices = resultLandUse.map((item, index) => {
    const start = resultLandUse
      .slice(0, index)
      .reduce((total, previous) => total + (previous.count / visibleRecordCount) * 100, 0);
    return `${item.color} ${start}% ${start + (item.count / visibleRecordCount) * 100}%`;
  });
  const summaryIsLoading = Boolean(selectedStateId && summaryForStateId !== selectedStateId);

  return (
    <main className="inner-page explorer-page">
      <section className="explorer-heading">
        <div>
          <span className="overline">BHUMISETU · PUBLIC LAND RECORDS</span>
          <h1>Land Information Explorer</h1>
          <p>Explore and access organized land parcel information through a unified digital platform.</p>
        </div>
        <div className="live-data-mark"><i /> Live database</div>
      </section>

      <LandUseStateSlider
        states={states}
        selectedStateId={selectedStateId}
        onStateChange={setSelectedStateId}
        summary={stateSummary}
        loading={summaryIsLoading}
        error={summaryForStateId === selectedStateId ? summaryError : ""}
      />

      <section className="explorer-search-panel">
        <div className="explorer-panel-heading">
          <div>
            <span className="explorer-eyebrow">BROWSE BY LOCATION</span>
            <h2>Choose an area to explore</h2>
          </div>
          <span className="optional-note">Select a state or a more specific area</span>
        </div>

        <form
          className="explorer-form"
          onSubmit={(event) => {
            event.preventDefault();
            search(1);
          }}
        >
          <label>
            <span>State</span>
            <select value={filters.stateId} onChange={(event) => updateFilter("stateId", event.target.value)}>
              <option value="">All available states</option>
              {states.map((state) => <option value={state._id} key={state._id}>{state.name}</option>)}
            </select>
          </label>
          <label>
            <span>District</span>
            <select value={filters.districtId} onChange={(event) => updateFilter("districtId", event.target.value)} disabled={!filters.stateId}>
              <option value="">All available districts</option>
              {districts.map((district) => <option value={district._id} key={district._id}>{district.name}</option>)}
            </select>
          </label>
          <label>
            <span>Tehsil</span>
            <select value={filters.tehsilId} onChange={(event) => updateFilter("tehsilId", event.target.value)} disabled={!filters.districtId}>
              <option value="">{filters.districtId.startsWith("source|") ? "Not included in source records" : "All available tehsils"}</option>
              {tehsils.map((tehsil) => <option value={tehsil._id} key={tehsil._id}>{tehsil.name}</option>)}
            </select>
          </label>
          <label>
            <span>Village</span>
            <select value={filters.villageId} onChange={(event) => updateFilter("villageId", event.target.value)} disabled={!filters.tehsilId && !filters.districtId.startsWith("source|")}>
              <option value="">All available villages</option>
              {villages.map((village) => <option value={village._id} key={village._id}>{village.name}</option>)}
            </select>
          </label>
          <div className="explorer-form-actions">
            <button className="explorer-submit" type="submit">Explore selected area <span>→</span></button>
            <button className="explorer-clear" type="button" onClick={clearFilters}>Clear filters</button>
          </div>
        </form>
        {locationError && <p className="explorer-note" role="status">Location filters: {locationError}</p>}
        {!locationError && states.some((state) => state.source === "parcel_imports") && (
          <p className="explorer-note">Tehsil assignments are not included in the current source records. Choose a district and then a village to filter those records.</p>
        )}
      </section>

      {searched && (
        <>
          <section className="explorer-results-heading">
            <div>
              <span className="explorer-eyebrow">SEARCH RESULTS</span>
              <h2>{pagination.totalRecords} matching records</h2>
            </div>
            {visibleRecordCount > 0 && (
              <div className="result-landuse-summary">
                <div className="result-landuse-pie" role="img" aria-label="Land use breakdown for visible results" style={{ background: `conic-gradient(${resultSlices.join(", ")})` }} />
                <div><b>Land use in these results</b>{resultLandUse.map((item) => <span key={item.name}><i style={{ background: item.color }} />{item.name} · {item.count}</span>)}</div>
              </div>
            )}
          </section>

          <SearchResults
            parcels={parcels}
            loading={loading}
            error={error}
            totalRecords={pagination.totalRecords}
            onRetry={() => search(page)}
          />

          {!loading && !error && pagination.totalPages > 1 && (
            <nav className="explorer-pagination" aria-label="Parcel search pages">
              <button type="button" disabled={page <= 1} onClick={() => search(page - 1)}>← Previous</button>
              <span>Page {page} of {pagination.totalPages}</span>
              <button type="button" disabled={page >= pagination.totalPages} onClick={() => search(page + 1)}>Next →</button>
            </nav>
          )}
        </>
      )}
    </main>
  );
}
