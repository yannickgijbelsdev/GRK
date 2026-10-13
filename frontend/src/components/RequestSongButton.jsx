import React from 'react';

// "Vraag je plaat aan" button hidden on request — kept as a no-op so
// any existing callers (HomePage, LevensloopGenkListPage) render nothing
// and the /plaat route itself stays reachable via direct URL.
const RequestSongButton = () => null;

export default RequestSongButton;
