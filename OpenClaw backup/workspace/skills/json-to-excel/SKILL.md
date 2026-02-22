---
name: json-to-excel
description: Convert JSON files to formatted Excel (.xlsx) workbooks using ExcelJS. Use when the user wants to create a spreadsheet from JSON data, export data to Excel, turn an array of objects into .xlsx, or generate Excel reports from structured data.
---

# JSON to Excel

Convert JSON arrays-of-objects into styled Excel workbooks.

## Quick start

```bash
node <skill-dir>/scripts/json-to-excel.js input.json output.xlsx --pretty --filter
```

## Usage

```
node json-to-excel.js <input.json> [output.xlsx] [options]
```

If `output.xlsx` is omitted, the output filename mirrors the input with a `.xlsx` extension.

### Input format

- A JSON array of objects: `[{"name":"Alice","age":30}, ...]`
- Or a wrapper object containing an array (e.g. `{"data":[...]}`) — the first array property is used automatically.

### Options

| Flag | Effect |
|---|---|
| `--sheet <name>` | Sheet name (default: `Sheet1`) |
| `--columns <a,b,c>` | Include only these columns |
| `--date-cols <a,b>` | Parse listed columns as Excel dates |
| `--number-cols <a,b>` | Force listed columns to numeric type |
| `--no-header` | Omit the header row |
| `--no-autofit` | Disable auto-fit column widths |
| `--no-freeze-header` | Don't freeze the header row |
| `--filter` | Enable auto-filter on header row |
| `--pretty` | Bold white-on-blue header styling |

## Examples

Basic conversion:
```bash
node json-to-excel.js data.json
```

Styled report with filtered columns:
```bash
node json-to-excel.js users.json report.xlsx --pretty --filter --columns name,email,role
```

Date and number formatting:
```bash
node json-to-excel.js sales.json sales.xlsx --date-cols date,created_at --number-cols amount,quantity --pretty
```

## Workflow

1. Ensure the JSON file exists (create it from user data if needed).
2. Run the script with appropriate options.
3. Deliver the resulting `.xlsx` file to the user.

## Dependencies

Requires `exceljs` (install globally: `npm install -g exceljs`).
