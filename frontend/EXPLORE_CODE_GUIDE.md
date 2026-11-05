# BhoomiSetu Explore code guide

This guide follows the data from the Explore screen to MongoDB and back. It explains the code in plain language and uses the current files in this project.

## The whole trip in one picture

```text
ExplorePage.jsx
    ↓ calls functions in
services/api.js
    ↓ sends HTTP requests to
Express routes
    ↓ call
Express controllers
    ↓ query with Mongoose
MongoDB collections
    ↓ JSON response returns to
ExplorePage.jsx → parcel cards or charts
```

The browser never opens MongoDB directly. The React page asks the Express backend; Express reads MongoDB and sends the result back as JSON.

## A few JavaScript words used below

- `const name = value` creates a variable that this code will not reassign.
- `function name(...) { ... }` creates a reusable set of instructions.
- `array.map(...)` makes one displayed item for every item in a list.
- `array.filter(...)` keeps only list items matching a condition.
- `array.reduce(...)` combines many values into one value, such as adding counts.
- `async` and `await` let code wait for a request to finish before using its result.
- `useState` remembers a value while the page is open. Changing it asks React to redraw the screen.
- `useEffect` runs code when the page first opens or when a listed value changes. It is used here to fetch data.
- `?.` means “only read this property if the value on the left exists.” It avoids an error for missing data.
- `||` means “use the value on the left, or use the value on the right if the left is empty.”
- `{...object}` copies an object’s existing values. New values after it can replace copied values.
- JSX is HTML-like syntax inside React. `{someJavaScript}` inserts a JavaScript value into the page.

## 1. Explore page: `src/pages/ExplorePage.jsx`

### Lines 1–11: imports

```js
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
```

These import React’s state/effect helpers and the router’s `Link`, which changes pages without doing a full browser reload.

The remaining imports on lines 3–11 are functions from `services/api.js`. Each one requests a different kind of data: states, districts, tehsils, villages, a state summary, or parcel search results.

### Lines 13–20: initial filter values and chart colors

`emptyFilters` is the initial set of location selections. Empty strings mean the visitor has not selected a state, district, tehsil, or village yet.

`chartColors` is only a palette. It is not land data. Real category names, counts, and percentages come from MongoDB.

### Lines 22–24: choosing the location name to display

`getRecordLocation(parcel, field)` first looks for a populated location such as `parcel.location.village`. If it is absent, it looks for a direct field such as `parcel.village`. If neither exists, it displays “Not available in source.”

`parcel.location?.[field]` uses optional chaining plus a variable property name. If `parcel.location` exists and `field` is `"village"`, it reads `parcel.location.village`.

### Lines 26–38: counting land uses on the visible results page

`countLandUse(records)` loops through the parcel records and counts how many are Agricultural, Commercial, and so on. The result becomes a list such as `{ name: "Agricultural", count: 6, color: "..." }`.

Line 30 adds one to the current category count. `(counts[landUse] || 0)` starts a category at zero the first time it appears.

`Object.entries(counts)` turns an object of totals into a list of name/value pairs. `.map(...)` adds a color so the small results chart can draw a slice for each category.

### Lines 40–101: `SearchResults`, the parcel cards

`SearchResults` receives five values from its parent: the records, whether a request is loading, an error message, the total number of matches, and a retry function. These values inside the parentheses are called **props**.

The first `if` (lines 41–43) shows a loading message while Express is answering. The next `if` (lines 45–53) shows an error and a “Try again” button if the request failed. The next `if` (lines 55–62) shows a “No matching records” message if the API found none.

If there are results, lines 64–99 build one card for each parcel:

- `parcels.map(...)` repeats the card markup once per record.
- `key` gives React a stable identifier for each card. The source plus parcel ID makes the value unique when two MongoDB collections are combined.
- `parcel.parcelId`, `parcel.khasraNumber`, `recordedArea`, `landUse`, and `revenueRecord` are values returned from the backend, not examples written into the UI.
- `className` sets the status badge’s style. Converting the status to lowercase and replacing spaces with hyphens makes values such as “Pending review” usable as a CSS class.
- `Link` on lines 91–96 opens `/explore/parcels/<parcelId>`. `encodeURIComponent` safely formats the ID for a URL.

### Lines 103–183: state land-use slider and chart

`LandUseStateSlider` receives the state list, selected state ID, a function for changing the state, the API summary, and loading/error information.

- Line 111 finds which position the selected state has in the list.
- Line 112 uses the summary’s `data` list, or an empty list while data has not arrived.
- Lines 113–118 build the CSS pie-chart slice ranges. `start` adds the percentages before this category. `conic-gradient` uses those ranges to paint the pie.
- Lines 121–131 display the panel heading and selected state name.
- Lines 133–148 show the slider only when at least one state exists. `min` and `max` set its allowed range. `step="1"` means it moves one state at a time. It is disabled if MongoDB currently has fewer than two states, because there is nowhere to slide to.
- The slider’s `onChange` calls the parent function with the newly selected state’s ID. The parent then fetches a new summary.
- Lines 150–180 choose one of three views: loading, error, a real category chart, or “No land-use records.”
- Lines 163–169 repeat a legend row per category. Each row displays MongoDB’s category, percentage, and parcel count.
- Lines 170–173 explain that the percentages describe record counts, not the full land area of the state.

### Lines 185–201: values the page remembers

`ExplorePage` is the main screen. Each `useState(...)` creates one remembered value and its setter:

- `filters`: selected location IDs used for parcel search.
- `states`, `districts`, `tehsils`, `villages`: choices returned by the location APIs.
- `selectedStateId`: state currently used by the land-use chart. It is separate from `filters.stateId`, which is the state selected for a parcel search.
- `stateSummary`, `summaryForStateId`, `summaryError`: the last chart response, the state it belongs to, and an error if one occurred.
- `parcels`, `page`, `pagination`: records and page information returned by search.
- `loading`, `error`, `locationError`: request status messages.
- `searched`: whether the visitor has pressed Explore. It keeps parcel cards hidden on the initial screen.

### Lines 203–211: load states when Explore opens

`useEffect(..., [])` runs when the page first appears. `getStates()` calls the backend. `.then(...)` handles a successful response and stores the returned list. If there is at least one state, the first state is selected for the chart. `.catch(...)` stores a readable error if loading states fails.

The empty `[]` at the end means this first load is not repeated every time another filter changes.

### Lines 213–226: reload the chart when its selected state changes

This effect stops immediately if no state is selected. Otherwise it calls `getStateLandUseSummary(selectedStateId)`.

On success, it saves the summary, remembers which state it belongs to, and clears an old error. On failure, it clears the old summary and saves the error. `[selectedStateId]` means the effect runs again whenever the slider selects another state.

### Lines 228–254: load dependent location choices

The first effect watches `filters.stateId`. When a state is chosen, `getDistricts` loads only that state’s districts.

The next effect watches `filters.districtId`. When a district is chosen, `getTehsils` asks for tehsils in that district.

The last effect loads villages. For a source district (its ID begins with `source|`), it calls `getSourceVillages(stateName, districtName)`. Otherwise, when a linked tehsil is selected, it calls `getVillages(tehsilId)`.

The source records do not have tehsil assignments. That is why source villages load directly from the selected district and the tehsil list is empty for those records.

### Lines 256–282: changing a dropdown

`updateFilter(field, value)` is called when a selection changes. It clears lower-level choices so an old district/village cannot accidentally stay selected after choosing a different state.

`setFilters(current => ...)` receives the previous filter object (`current`) and returns the next one. `{ ...current, [field]: value }` copies the old selections, then updates the field whose name is in `field`. For example, if `field` is `"stateId"`, it changes the state selection.

The `if` blocks clear dependent values:

- changing state clears district, tehsil, and village;
- changing district clears tehsil and village;
- changing tehsil clears village.

### Lines 284–311: run a parcel search

`search(nextPage = 1)` is an asynchronous function. The default page is 1.

First it checks that at least one location has been selected. If not, it shows an instruction and does not make a database request. Otherwise it turns on the loading message, clears an old error, and sets `searched` to true so the results area appears.

`searchParcels({ ...filters, page: nextPage, limit: 10 })` sends the selected location IDs and page settings to Express. `await` waits for the response.

- On success, it saves the returned page of records, total count/pages, and current page.
- `result.data || []` uses an empty list if the API did not include data.
- `catch` handles connection or server errors and clears old results.
- `finally` runs after either success or failure and turns off the loading message.

### Lines 313–323: clear selections and hide results

`clearFilters()` restores the empty location filters, empties the dropdown options and parcel list, resets the page counters, hides the results by setting `searched` to false, and clears an old error. It does not fetch all parcels.

### Lines 325–333: prepare the results pie chart

`resultLandUse` counts the land-use categories on the current page of results. `visibleRecordCount` adds those counts together.

`resultSlices` calculates each category’s start and end percentage and turns them into strings for `conic-gradient`. This is only a small breakdown of the visible page; the state chart above uses the full backend summary.

`summaryIsLoading` is true while a newly selected state’s summary has not returned yet.

### Lines 335–444: page layout

The `<main>` element contains the page. The first section is the title and “Live database” marker. `LandUseStateSlider` displays the selected state’s live summary.

The form on lines 355–408 contains State, District, Tehsil, and Village dropdowns. `value` connects each dropdown to `filters`; `onChange` calls `updateFilter`. `disabled` prevents choosing a child location before its parent. The form’s `onSubmit` prevents the browser’s normal page reload and calls `search(1)`.

The note explains that tehsil information is missing from the current records. It is shown only if the selected state list includes data from `parcel_imports`.

Lines 410–441 render the results area only after Search is pressed. `SearchResults` shows loading, error, empty, or parcel cards. The pagination buttons call `search` with the previous or next page.

## 2. API service: `src/services/api.js`

This file keeps HTTP requests in one place so page components do not each assemble their own URLs.

- Line 1 reads `VITE_API_BASE_URL`; if it is missing, it uses `http://localhost:3000`.
- `request(path, options)` sends `fetch` to the backend. `try/catch` converts a network failure into a helpful message.
- `response.json()` reads the server’s JSON. If the server did not send valid JSON, it uses an empty object.
- `response.ok` checks the HTTP status. `result.success === false` checks the API’s own success flag. If either indicates failure, it throws an error for the page to display.
- `get(path)` is a small helper for GET requests.
- `getStates`, `getDistricts`, `getTehsils`, `getVillages`, and `getSourceVillages` call the matching location routes.
- `searchParcels(filters)` turns the filters into a query string such as `?stateId=...&page=1&limit=10`. Empty values are skipped.
- `getStateLandUseSummary(stateId)` requests the summary for the slider’s selected state.
- `getParcelProfile(parcelId)` requests one parcel’s detail profile.
- The `export` block makes these functions available to `ExplorePage.jsx` and `ParcelProfilePage.jsx`.

## 3. How the backend reads MongoDB

### `backend-r/src/routes/parcelRoutes.js`

The route file connects URL paths to controller functions:

- `GET /api/parcels/search` runs `searchParcels`.
- `GET /api/parcels/summary` runs `getStateLandUseSummary`.
- `GET /api/parcels/` also runs search.
- `POST /api/parcels/` creates a linked parcel.
- `GET /api/parcels/:parcelId` loads one parcel profile.

The specific routes `/search` and `/summary` are listed before `/:parcelId`, so Express does not mistake the word `summary` for a parcel ID.

### `backend-r/src/controllers/parcelController.js`

The controller contains the database work.

- Lines 1–7 import Mongoose and the State, District, Tehsil, Village, Parcel, and ParcelImport models.
- Lines 9–18 define `locationDetails`. When a linked parcel is fetched, Mongoose follows `villageId` to Village, then to Tehsil, District, and State. This is called `populate`.
- `invalidRequest` creates a 400 error for bad query values. `cleanText` checks that a text filter is not empty. `exactName` escapes special characters before using a name as a case-insensitive exact-match pattern. `validateId` checks whether a value is a MongoDB ObjectId.
- `toProfile` (lines 43–80) converts either kind of parcel into a consistent response. A source row from `parcel_imports` already has text village/district fields, so it gets those values directly and missing tehsil/ownership/map/registration values become `null`. A linked `Parcel` gets its location names from the populated hierarchy.
- `locationFilters` translates selected state/district/tehsil/village IDs into MongoDB conditions. Source IDs start with `source|` and contain names; regular hierarchy IDs are MongoDB ObjectIds. The source rows have no tehsil links, so tehsil searches only search linked Parcel rows.
- `searchParcels` (lines 148–231) checks supported query names, validates `page` and `limit`, creates filters for both collections, reads matching rows from MongoDB, normalizes them with `toProfile`, sorts them by parcel ID, then selects the requested page. The response includes the rows and pagination totals.
- `getStateLandUseSummary` (lines 233–314) groups records by `landUse`. MongoDB’s `$match` keeps rows for one state; `$group` counts records and sums recorded areas. The controller returns category counts and each category’s share of all records. The UI labels those as record-count shares, not statewide land-area shares.
- `getParcelById` checks the linked `parcels` collection first, then `parcel_imports`. If neither has that parcel ID, it returns 404.
- `createParcel` validates the village ID and creates a linked Parcel with the submitted fields.
- The final `module.exports` makes the controller functions available to the route file.

### Location controllers

- `stateController.js`: gets states from both the linked `states` collection and the `state` values in `parcel_imports`. It removes duplicate names and returns source-state options with IDs such as `source|Haryana`.
- `districtController.js`: for a source state ID, it reads distinct district names from MongoDB’s `parcel_imports`. For a regular ObjectId state, it reads linked District documents.
- `tehsilController.js`: returns an empty list for source districts because those source rows have no tehsil. For regular districts, it reads tehsils from MongoDB.
- `villageController.js`: source villages are distinct `village` values filtered by state and district. Linked villages are fetched by `tehsilId` from the Village model.

### `backend-r/src/models/ParcelImport.js`

This Mongoose schema describes the shape of rows already stored in the MongoDB collection named `parcel_imports`. It does not load data from a local file. Fields such as `parcelId`, `district`, `village`, `recordedArea`, and `landUse` describe what a database record must look like. The unique index on `parcelId` prevents two source rows from using the same parcel ID.

## 4. Parcel detail page and route

### `src/App.jsx`

`BrowserRouter` enables client-side page routing. The `/explore` route displays `ExplorePage`. The `/explore/parcels/:parcelId` route displays `ParcelProfilePage`; `:parcelId` means the value is taken from the URL. Both pages are wrapped in `SiteLayout`, so they share the navbar and footer.

### `src/pages/ParcelProfilePage.jsx`

When the visitor clicks a result link, `useParams()` reads the parcel ID from the URL. The effect calls `getParcelProfile(parcelId)`. The page first shows loading, then either an error or the profile.

`display(value)` prints “Not available in source” when a value is absent. `RecordSection` reuses the same heading layout for each profile section. `ExternalRecord` only shows a clickable link when a real URL exists.

The profile renders parcel overview, revenue information, ownership, cadastral map, registration, and verification status. Optional database fields are displayed only when the returned record contains them.

## 5. Styling: `src/pages/explorer.css`

CSS does not fetch or change data. It controls how the JSX looks.

- `.inner-page.explorer-page` and `.inner-page.profile-page` set the page width, padding, and text color.
- `.explorer-heading`, `.explorer-results-heading`, and `.profile-heading` use flex layout to place headings and badges in rows.
- `.state-cover-*` styles the state summary panel, slider, pie chart, and legend.
- `.explorer-search-panel` and `.explorer-form` style the location dropdown form. `grid-template-columns` controls how many columns appear.
- `.parcel-result-card` and `.parcel-card-grid` style the record cards and their information columns.
- `.explorer-state` styles loading, error, and empty messages.
- `.explorer-pagination` styles the previous/next controls.
- `.profile-*` styles the detail page sections and key/value rows.
- The `@media` rules near the bottom switch grids and rows to narrower layouts on phones.

Colors, spacing, font sizes, borders, and shadows are visual choices. The values inside the cards and charts still come from the API response.

## Example: searching Sonipat

1. The page loads states using `getStates()`.
2. Choosing Haryana changes `filters.stateId`.
3. The state effect calls `getDistricts(stateId)` and fills the district dropdown.
4. Choosing Sonipat calls the district and village endpoints. The current source data has no tehsils, so its village list comes directly from the selected district.
5. Pressing **Explore selected area** calls `searchParcels` with the chosen IDs.
6. Express queries the matching MongoDB rows and returns JSON plus pagination information.
7. React stores that response in `parcels`; `SearchResults` creates one card per returned row.
8. Clicking the card’s profile link loads `/api/parcels/<parcelId>` and displays the detail page.

