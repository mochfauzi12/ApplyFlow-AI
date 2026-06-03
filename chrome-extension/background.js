// Background Service Worker for ApplyFlow AI Chrome Extension

chrome.runtime.onInstalled.addListener(() => {
  console.log('ApplyFlow AI Extension installed and ready.');
});

// In V1.1 Full Release, this background script will handle:
// 1. Authenticating with the Supabase session from the main web app
// 2. Fetching the user's `candidate_profile` from PostgreSQL
// 3. Communicating with the Next.js API /api/extension/autofill 
//    to intelligently map form fields to the candidate data via AI.
