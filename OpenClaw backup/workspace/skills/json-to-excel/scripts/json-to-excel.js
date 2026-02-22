#!/usr/bin/env node
/**
 * json-to-excel — Convert a JSON file (array of objects) to an Excel (.xlsx) workbook.
 *
 * Usage:
 *   node json-to-excel.js <input.json> [output.xlsx] [options]
 *
 * Options:
 *   --sheet <name>       Sheet name (default: "Sheet1")
 *   --no-header          Omit the header row
 *   --columns <a,b,c>    Comma-separated list of columns to include (default: all)
 *   --date-cols <a,b>    Comma-separated columns to parse as dates
 *   --number-cols <a,b>  Comma-separated columns to format as numbers
 *   --autofit            Auto-fit column widths (default: true)
 *   --freeze-header      Freeze the header row (default: true)
 *   --filter             Enable auto-filter on header row
 *   --pretty             Bold header row with a light fill colour
 *
 * The input JSON must be an array of objects or an object whose first array
 * value is used (handy for wrapped API responses like { "data": [...] }).
 */

const fs = require("fs");
const path = require("path");

let ExcelJS;
try {
  ExcelJS = require("exceljs");
} catch {
  // Fall back to global node_modules
  const { execSync } = require("child_process");
  const globalRoot = execSync("npm root -g", { encoding: "utf-8" }).trim();
  ExcelJS = require(path.join(globalRoot, "exceljs"));
}

// ── Arg parsing ──────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
function flag(name) {
  const i = args.indexOf(name);
  if (i === -1) return false;
  args.splice(i, 1);
  return true;
}
function option(name) {
  const i = args.indexOf(name);
  if (i === -1 || i + 1 >= args.length) return null;
  const val = args[i + 1];
  args.splice(i, 2);
  return val;
}

const sheetName = option("--sheet") || "Sheet1";
const noHeader = flag("--no-header");
const columnsRaw = option("--columns");
const dateColsRaw = option("--date-cols");
const numberColsRaw = option("--number-cols");
const autofit = !flag("--no-autofit");
const freezeHeader = !flag("--no-freeze-header");
const enableFilter = flag("--filter");
const pretty = flag("--pretty");

const selectedColumns = columnsRaw ? columnsRaw.split(",").map((c) => c.trim()) : null;
const dateCols = new Set(dateColsRaw ? dateColsRaw.split(",").map((c) => c.trim()) : []);
const numberCols = new Set(numberColsRaw ? numberColsRaw.split(",").map((c) => c.trim()) : []);

const inputPath = args[0];
if (!inputPath) {
  console.error("Usage: json-to-excel <input.json> [output.xlsx] [options]");
  process.exit(1);
}

const outputPath = args[1] || inputPath.replace(/\.json$/i, "") + ".xlsx";

// ── Read & normalise JSON ────────────────────────────────────────────────────
let raw;
try {
  raw = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
} catch (err) {
  console.error(`Error reading ${inputPath}: ${err.message}`);
  process.exit(1);
}

let rows;
if (Array.isArray(raw)) {
  rows = raw;
} else if (typeof raw === "object" && raw !== null) {
  // Find the first array value inside the object (common API wrapper pattern)
  const firstArray = Object.values(raw).find(Array.isArray);
  if (firstArray) {
    rows = firstArray;
  } else {
    console.error("JSON must be an array of objects or contain an array property.");
    process.exit(1);
  }
} else {
  console.error("JSON must be an array of objects.");
  process.exit(1);
}

if (rows.length === 0) {
  console.error("JSON array is empty — nothing to convert.");
  process.exit(1);
}

// ── Determine columns ────────────────────────────────────────────────────────
const allKeys = [...new Set(rows.flatMap(Object.keys))];
const columns = selectedColumns
  ? selectedColumns.filter((c) => allKeys.includes(c))
  : allKeys;

if (columns.length === 0) {
  console.error("No matching columns found.");
  process.exit(1);
}

// ── Build workbook ───────────────────────────────────────────────────────────
async function build() {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName);

  // Define columns
  sheet.columns = columns.map((key) => ({ header: noHeader ? undefined : key, key, width: 12 }));

  // Add rows
  for (const obj of rows) {
    const row = {};
    for (const col of columns) {
      let val = obj[col];
      if (val !== undefined && val !== null) {
        if (dateCols.has(col)) {
          const d = new Date(val);
          val = isNaN(d) ? val : d;
        } else if (numberCols.has(col)) {
          const n = Number(val);
          val = isNaN(n) ? val : n;
        }
      }
      row[col] = val ?? "";
    }
    sheet.addRow(row);
  }

  // ── Styling ──────────────────────────────────────────────────────────────
  if (pretty && !noHeader) {
    const headerRow = sheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4472C4" } };
      cell.alignment = { vertical: "middle" };
    });
  }

  if (freezeHeader && !noHeader) {
    sheet.views = [{ state: "frozen", ySplit: 1 }];
  }

  if (enableFilter && !noHeader) {
    sheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: columns.length },
    };
  }

  // Auto-fit column widths
  if (autofit) {
    for (const col of sheet.columns) {
      let maxLen = col.header ? String(col.header).length : 0;
      col.eachCell({ includeEmpty: false }, (cell) => {
        const len = cell.value != null ? String(cell.value).length : 0;
        if (len > maxLen) maxLen = len;
      });
      col.width = Math.min(Math.max(maxLen + 2, 8), 60);
    }
  }

  // ── Write ────────────────────────────────────────────────────────────────
  await workbook.xlsx.writeFile(outputPath);
  console.log(`✔ Created ${outputPath}  (${rows.length} rows, ${columns.length} columns, sheet "${sheetName}")`);
}

build().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
