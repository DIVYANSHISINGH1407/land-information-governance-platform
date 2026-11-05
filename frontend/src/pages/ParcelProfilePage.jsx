import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getParcelProfile } from "../services/api";

function display(value) {
  return value === undefined || value === null || value === "" ? "Not available in source" : value;
}

function RecordSection({ title, eyebrow, children }) {
  return (
    <section className="profile-section">
      <span className="explorer-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function ExternalRecord({ label, url }) {
  if (!url) return <span className="profile-unavailable">Not available in source</span>;
  return <a href={url} target="_blank" rel="noreferrer">{label} ↗</a>;
}

export default function ParcelProfilePage() {
  const { parcelId } = useParams();
  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getParcelProfile(parcelId)
      .then((result) => { if (active) setParcel(result.data); })
      .catch((requestError) => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [parcelId]);

  if (loading) return <main className="inner-page profile-page"><div className="explorer-state">Loading parcel profile…</div></main>;
  if (error || !parcel) {
    return (
      <main className="inner-page profile-page">
        <div className="explorer-state explorer-state-error" role="alert">
          <b>Parcel profile is unavailable.</b>
          <span>{error || "The parcel could not be found."}</span>
          <Link to="/explore">Return to search →</Link>
        </div>
      </main>
    );
  }

  const location = parcel.location || {};
  const ownership = parcel.ownershipRecord;
  const map = parcel.cadastralMap;
  const registration = parcel.registrationRecord;

  return (
    <main className="inner-page profile-page">
      <Link className="profile-back-link" to="/explore">← Back to land search</Link>
      <header className="profile-heading">
        <div>
          <span className="overline">UNIFIED LAND INFORMATION PROFILE</span>
          <h1>{parcel.parcelId}</h1>
          <p>{display(location.village || parcel.village)} · {display(location.district || parcel.district)}</p>
        </div>
        <span className={`status-pill ${String(parcel.verificationStatus).toLowerCase().replaceAll(" ", "-")}`}>
          {display(parcel.verificationStatus)}
        </span>
      </header>

      <RecordSection eyebrow="01 · PARCEL OVERVIEW" title="Basic parcel information">
        <dl className="profile-facts">
          <div><dt>Parcel ID</dt><dd>{display(parcel.parcelId)}</dd></div>
          <div><dt>Khasra number</dt><dd>{display(parcel.khasraNumber)}</dd></div>
          <div><dt>State</dt><dd>{display(location.state)}</dd></div>
          <div><dt>District</dt><dd>{display(location.district || parcel.district)}</dd></div>
          <div><dt>Tehsil</dt><dd>{display(location.tehsil)}</dd></div>
          <div><dt>Village</dt><dd>{display(location.village || parcel.village)}</dd></div>
          <div><dt>Recorded area</dt><dd>{display(parcel.recordedArea)} {parcel.areaUnit || ""}</dd></div>
          <div><dt>Recorded land use</dt><dd>{display(parcel.landUse)}</dd></div>
        </dl>
      </RecordSection>

      <div className="profile-section-grid">
        <RecordSection eyebrow="02 · REVENUE" title="Revenue information">
          <dl className="profile-facts profile-facts-stacked">
            <div><dt>Revenue record availability</dt><dd>{display(parcel.revenueRecord)}</dd></div>
            <div><dt>Record reference</dt><dd>{display(parcel.revenueRecordReference)}</dd></div>
          </dl>
        </RecordSection>
        <RecordSection eyebrow="03 · OWNERSHIP" title="Ownership information">
          <dl className="profile-facts profile-facts-stacked">
            <div><dt>Availability</dt><dd>{display(ownership?.availability)}</dd></div>
            <div><dt>Reference</dt><dd>{display(ownership?.reference)}</dd></div>
          </dl>
          <p className="profile-section-note">Owner names are shown only when a source record provides them.</p>
        </RecordSection>
        <RecordSection eyebrow="04 · CADASTRAL MAP" title="Map information">
          <dl className="profile-facts profile-facts-stacked">
            <div><dt>Availability</dt><dd>{display(map?.availability)}</dd></div>
            <div><dt>Map resource</dt><dd><ExternalRecord label="Open cadastral map" url={map?.mapUrl} /></dd></div>
          </dl>
        </RecordSection>
        <RecordSection eyebrow="05 · REGISTRATION" title="Registration information">
          <dl className="profile-facts profile-facts-stacked">
            <div><dt>Availability</dt><dd>{display(registration?.availability)}</dd></div>
            <div><dt>Reference</dt><dd>{display(registration?.reference)}</dd></div>
            <div><dt>Document</dt><dd><ExternalRecord label="Open registration document" url={registration?.documentUrl} /></dd></div>
          </dl>
        </RecordSection>
      </div>

      <RecordSection eyebrow="06 · SOURCE STATUS" title="Verification status">
        <div className="profile-verification">
          <span className={`status-pill ${String(parcel.verificationStatus).toLowerCase().replaceAll(" ", "-")}`}>
            {display(parcel.verificationStatus)}
          </span>
          <p>This status is displayed as stored in the source record. BhoomiSetu does not independently verify the record.</p>
        </div>
      </RecordSection>
      <p className="profile-source-note">Record source: {parcel.source === "parcel_imports" ? "Imported source dataset" : "Linked land records"}. Missing fields are marked unavailable; no ownership, map or registration details are inferred.</p>
    </main>
  );
}
