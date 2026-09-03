/**
 * Receives RSVPs from the donor visits website and appends one row per
 * response to this spreadsheet.
 *
 * Setup instructions are in SETUP.md, next to this file.
 */

var SHEET_NAME = 'Responses';

var HEADERS = [
  'Submitted at',
  'Name',
  'Email',
  'Audience',
  'Guests',
  'First choice',
  'Also interested in',
  'Notes',
  'Tour ID',
  'Page'
];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getSheet();

    sheet.appendRow([
      data.submittedAt ? new Date(data.submittedAt) : new Date(),
      data.name || '',
      data.email || '',
      data.audience || '',
      data.guests || '',
      data.firstChoice || '',
      data.alsoInterested || '',
      data.notes || '',
      data.firstChoiceId || '',
      data.page || ''
    ]);

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

/** Lets you open the Web App URL in a browser to confirm it's live. */
function doGet() {
  return json({ ok: true, message: 'RSVP endpoint is live.' });
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#f1f3f4');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 170);
    sheet.setColumnWidth(5, 220);
    sheet.setColumnWidth(6, 240);
    sheet.setColumnWidth(7, 300);
  }
  return sheet;
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Run this once from the editor to create the sheet and headers early. */
function setUpSheet() {
  getSheet();
}
