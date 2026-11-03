import { policyItems } from "./mockData";

// The single shared localStorage key used by both pages
const STORAGE_KEY = "bhumisetu-policies";

/**
 * 1. Read policies from localStorage.
 * If no policies are saved yet, fall back to initial mockData (policyItems).
 */
export function getStoredPolicies() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error("Error reading policies from localStorage:", error);
      return policyItems;
    }
  }
  return policyItems;
}

/**
 * 2. Save updated policies array to localStorage.
 * This ensures that additions, edits, and deletions made by a Government Official
 * are immediately stored and shared with the public Policies page.
 */
export function saveStoredPolicies(policiesArray) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(policiesArray));
}
