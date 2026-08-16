/**
 * HoodRoost allowlist collector.
 *
 * Setup:
 * 1. Create a Google Sheet (any name).
 * 2. Extensions -> Apps Script, delete the boilerplate, paste this file in.
 * 3. Deploy -> New deployment -> type "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web app URL and set it as GOOGLE_SHEETS_WEBAPP_URL in
 *    hoodroost's .env.local.
 * 5. Re-deploy (Manage deployments -> edit -> new version) any time you
 *    change this file — Apps Script doesn't auto-update a live deployment.
 */

const SHEET_NAME = "Allowlist";
const HEADERS = ["Timestamp", "Handle", "Wallet", "Invite Code"];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function doPost(e) {
  const sheet = getSheet_();

  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ error: "Invalid JSON body." });
  }

  const handle = String(data.handle || "").trim();
  const wallet = String(data.wallet || "").trim();
  const inviteCode = String(data.inviteCode || "").trim();

  if (!handle || !wallet || !inviteCode) {
    return json_({ error: "Missing handle, wallet, or inviteCode." });
  }

  // Dedupe on wallet (case-insensitive), same rule as the app's own check.
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][2]).toLowerCase() === wallet.toLowerCase()) {
      return json_({ error: "duplicate", position: i });
    }
  }

  sheet.appendRow([new Date(), handle, wallet, inviteCode]);
  const position = sheet.getLastRow() - 1; // exclude header row

  return json_({ ok: true, position: position });
}

function doGet() {
  const sheet = getSheet_();
  const count = Math.max(sheet.getLastRow() - 1, 0);
  return json_({ count: count });
}
