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
const indiaStateNames = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

function getChartStates(availableStates) {
  const databaseStates = new Map(
    availableStates.map((state) => [state.name.toLowerCase(), state]),
  );
  const chartStates = indiaStateNames.map((name) =>
    databaseStates.get(name.toLowerCase()) || { _id: `source|${name}`, name },
  );
  const additionalStates = availableStates.filter(
    (state) => !indiaStateNames.some((name) => name.toLowerCase() === state.name.toLowerCase()),
  );

  return [...chartStates, ...additionalStates];
}

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

function LandUseStateChart({
  states,
  selectedStateId,
  onStateChange,
  summary,
  loading,
  error,
}) {
  const landUseTypes = summary?.data || [];
  let usedPercentage = 0;
  const slices = landUseTypes.map((item, index) => {
    const share = (item.recordedArea / summary.totalArea) * 100;
    const start = usedPercentage;
    const end = index === landUseTypes.length - 1 ? 100 : start + share;
    usedPercentage = end;
    return `${chartColors[index % chartColors.length]} ${start}% ${end}%`;
  });

  return (
    <section className="state-cover-panel">
      <div className="state-cover-heading">
        <div>
          <span className="explorer-eyebrow">STATE LAND COVER</span>
          <h2>Explore land use by state</h2>
          <p>Choose a state to compare land-use shares by recorded parcel area.</p>
        </div>
        <label className="state-cover-select">
          <span>Choose a state or union territory</span>
          <select
            value={selectedStateId}
            onChange={(event) => onStateChange(event.target.value)}
          >
            {states.map((state) => (
              <option key={state._id} value={state._id}>{state.name}</option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <p className="state-cover-message">Loading state summary…</p>
      ) : error ? (
        <p className="state-cover-message state-cover-error" role="alert">{error}</p>
      ) : summary?.areaAvailable && summary.totalArea > 0 ? (
        <div className="state-cover-content">
          <div
            className="state-cover-chart"
            role="img"
            aria-label={`Recorded land-area distribution in ${summary.state}`}
            style={{ background: `conic-gradient(${slices.join(", ")})` }}
          />
          <div className="state-cover-legend">
            {landUseTypes.map((item, index) => (
              <div key={item.landUse}>
                <i style={{ background: chartColors[index % chartColors.length] }} />
                <b>{item.landUse}</b>
                <span>
                  {((item.recordedArea / summary.totalArea) * 100).toFixed(1)}% · {item.recordedArea} {summary.areaUnit}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : summary?.totalRecords > 0 ? (
        <p className="state-cover-message">
          Land-area data is not available in a consistent unit for this state yet.
        </p>
      ) : (
        <p className="state-cover-message">
          Data is not available for this state yet.
        </p>
      )}
    </section>
  );
}

export default function ExplorePage() {
  const [filters, setFilters] = useState(emptyFilters);
  const [states, setStates] = useState([]);
  const chartStates = getChartStates(states);
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
        const haryana = availableStates.find(
          (state) => state.name.toLowerCase() === "haryana",
        );
        setSelectedStateId(haryana?._id || "source|Haryana");
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
        </div>
      </section>

      <LandUseStateChart
        states={chartStates}
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
