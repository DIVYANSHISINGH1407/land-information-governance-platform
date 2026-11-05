const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error(`Could not connect to the BhoomiSetu API at ${API_BASE_URL}.`);
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.success === false) {
    throw new Error(result.message || `Request failed (${response.status}).`);
  }

  return result;
}

function get(path) {
  return request(path);
}

function getStates() {
  return get("/api/states");
}

function getDistricts(stateId) {
  return get(`/api/districts/${encodeURIComponent(stateId)}`);
}

function getTehsils(districtId) {
  return get(`/api/tehsils/${encodeURIComponent(districtId)}`);
}

function getVillages(tehsilId) {
  return get(`/api/villages/${encodeURIComponent(tehsilId)}`);
}

function getSourceVillages(stateName, districtName) {
  return get(
    `/api/villages/source/${encodeURIComponent(stateName)}/${encodeURIComponent(districtName)}`,
  );
}

function searchParcels(filters) {
  const query = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim()) {
      query.set(key, String(value).trim());
    }
  });

  return get(`/api/parcels/search?${query.toString()}`);
}

function getStateLandUseSummary(stateId) {
  const query = new URLSearchParams({ stateId });
  return get(`/api/parcels/summary?${query.toString()}`);
}

function getParcelProfile(parcelId) {
  return get(`/api/parcels/${encodeURIComponent(parcelId)}`);
}

export {
  getDistricts,
  getParcelProfile,
  getSourceVillages,
  getStateLandUseSummary,
  getStates,
  getTehsils,
  getVillages,
  searchParcels,
};
