/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
/* ============================================================
   roster-import.js — Shared Roster / Class List Importer
   Supports: Excel (.xlsx, .xls), CSV, TSV, HTML tables, TXT lists
   Handles Swiss ENT / ISM exports, dual-column names, title-casing
   ============================================================ */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.RosterImport = factory();
        // Also expose directly on window for drop-in backward compatibility
        root.parseRosterContent = root.RosterImport.parseRosterContent;
        root.extractNamesFromTableRows = root.RosterImport.extractNamesFromTableRows;
        root.parseNamesList = root.RosterImport.parseNamesList;
    }
}(typeof self !== 'undefined' ? self : this, function () {

    function getXLSX() {
        if (typeof window !== 'undefined' && window.XLSX) return window.XLSX;
        if (typeof globalThis !== 'undefined' && globalThis.XLSX) return globalThis.XLSX;
        if (typeof XLSX !== 'undefined') return XLSX;
        try {
            if (typeof require === 'function') {
                try { return require('./vendor/xlsx.full.min.js'); } catch (e1) { }
                try { return require('../vendor/xlsx.full.min.js'); } catch (e2) { }
                try { return require('./assets/js/vendor/xlsx.full.min.js'); } catch (e3) { }
                try { return require('../assets/js/vendor/xlsx.full.min.js'); } catch (e4) { }
                try { return require('../../../assets/js/vendor/xlsx.full.min.js'); } catch (e5) { }
                return require('xlsx');
            }
        } catch (e) { }
        return null;
    }

    function formatCapitalize(str) {
        if (!str) return '';
        const trimmed = str.trim();
        if (trimmed.length > 2 && trimmed === trimmed.toUpperCase()) {
            return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
        }
        return trimmed;
    }

    function formatTitleCase(str) {
        if (!str) return '';
        return str.split(/\s+/).map(w => formatCapitalize(w)).join(' ');
    }

    function extractNamesFromTableRows(rows) {
        if (!rows || !rows.length) return [];

        const HEADER_NAME_FULL_REGEX = /^(?:nom\s*(?:et|\/|&)?\s*pr[eé]nom|pr[eé]nom\s*(?:et|\/|&)?\s*nom|nom\s+complet|identit[eé]|élève|eleve|student|pupil)$/i;
        const HEADER_LAST_NAME_REGEX = /^(?:nom|nom\s+de\s+famille|last\s*name|surname)$/i;
        const HEADER_FIRST_NAME_REGEX = /^(?:pr[eé]nom|first\s*name|given\s*name|call\s*name)$/i;
        const HEADER_ID_REGEX = /^(?:identifiant\s+ism|identifiant|id|matricule)$/i;

        let headerRowIdx = -1;
        let colFullName = -1;
        let colLastName = -1;
        let colFirstName = -1;
        let colId = -1;

        // Scan the first 30 rows to locate the header row
        for (let r = 0; r < Math.min(rows.length, 30); r++) {
            const row = rows[r];
            if (!row || !row.length) continue;

            let foundFullName = -1;
            let foundLastName = -1;
            let foundFirstName = -1;
            let foundId = -1;

            for (let c = 0; c < row.length; c++) {
                const val = String(row[c] || '').trim();
                if (HEADER_NAME_FULL_REGEX.test(val)) foundFullName = c;
                else if (HEADER_LAST_NAME_REGEX.test(val)) foundLastName = c;
                else if (HEADER_FIRST_NAME_REGEX.test(val)) foundFirstName = c;
                else if (HEADER_ID_REGEX.test(val)) foundId = c;
            }

            if (foundFullName !== -1 || (foundLastName !== -1 && foundFirstName !== -1)) {
                headerRowIdx = r;
                colFullName = foundFullName;
                colLastName = foundLastName;
                colFirstName = foundFirstName;
                colId = foundId;
                break;
            }
        }

        const names = [];
        const seen = new Set();

        if (headerRowIdx !== -1) {
            for (let r = headerRowIdx + 1; r < rows.length; r++) {
                const row = rows[r];
                if (!row || !row.length) continue;

                let extracted = '';
                if (colFullName !== -1) {
                    extracted = formatTitleCase(String(row[colFullName] || '').trim());
                } else if (colLastName !== -1 && colFirstName !== -1) {
                    const ln = formatCapitalize(String(row[colLastName] || '').trim());
                    const fn = formatCapitalize(String(row[colFirstName] || '').trim());
                    if (fn && ln) extracted = `${fn} ${ln}`;
                    else extracted = fn || ln;
                }

                extracted = extracted.replace(/^["']|["']$/g, '').replace(/^[0-9\.\-\_\s]+/, '').trim();
                // Ignore non-student rows like summaries, footers, etc.
                if (extracted && extracted.length >= 2 && !/^(?:total|effectif|garçons|filles|moyenne|classe|école|degre|degré|mur\s+fd)/i.test(extracted)) {
                    const key = extracted.toLowerCase();
                    if (!seen.has(key)) {
                        seen.add(key);
                        names.push(extracted);
                    }
                }
            }
        }

        return names;
    }

    function parseRosterContent(input) {
        if (!input) return [];

        // 1. Array of rows (e.g. from SheetJS sheet_to_json)
        if (Array.isArray(input)) {
            if (input.length > 0 && Array.isArray(input[0])) {
                const res = extractNamesFromTableRows(input);
                if (res.length > 0) return res;
            }
            return input.map(s => String(s || '').trim()).filter(Boolean);
        }

        // 2. Binary ArrayBuffer, Uint8Array, Buffer, etc. (XLSX, XLS, ODS, etc.)
        const isBinary = input instanceof ArrayBuffer ||
            (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView && ArrayBuffer.isView(input)) ||
            (typeof Buffer !== 'undefined' && Buffer.isBuffer && Buffer.isBuffer(input)) ||
            (input && typeof input === 'object' && input.byteLength !== undefined && (input.buffer !== undefined || input.BYTES_PER_ELEMENT !== undefined));

        const xlsxLib = getXLSX();

        if (isBinary) {
            if (xlsxLib) {
                try {
                    const isNodeBuf = typeof Buffer !== 'undefined' && Buffer.isBuffer && Buffer.isBuffer(input);
                    const readType = isNodeBuf ? 'buffer' : 'array';
                    const readData = (input instanceof ArrayBuffer) ? new Uint8Array(input) : input;
                    const wb = xlsxLib.read(readData, { type: readType });
                    const firstSheet = wb.Sheets[wb.SheetNames[0]];
                    const rows = xlsxLib.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });
                    const res = extractNamesFromTableRows(rows);
                    if (res.length > 0) return res;
                } catch (err) {
                    console.warn('XLSX parse error:', err);
                }
            }
            // Fallback to text decoding
            if (typeof TextDecoder !== 'undefined') {
                try {
                    input = new TextDecoder('utf-8').decode(input);
                } catch (e) {
                    input = String(input);
                }
            } else {
                input = String(input);
            }
        }

        if (typeof input !== 'string') return [];

        // 3. HTML table in string (typical for some legacy ENT exports named .xls)
        if (/<table[\s>]/i.test(input)) {
            if (xlsxLib) {
                try {
                    const wb = xlsxLib.read(input, { type: 'string' });
                    const firstSheet = wb.Sheets[wb.SheetNames[0]];
                    const rows = xlsxLib.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });
                    const res = extractNamesFromTableRows(rows);
                    if (res.length > 0) return res;
                } catch (e) { }
            }
        }

        // 4. CSV / TSV with lines
        const lines = input.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        if (!lines.length) return [];

        const tableRows = lines.map(line => {
            let delimiter = ';';
            const semiCount = (line.match(/;/g) || []).length;
            const commaCount = (line.match(/,/g) || []).length;
            const tabCount = (line.match(/\t/g) || []).length;
            if (tabCount > semiCount && tabCount > commaCount) delimiter = '\t';
            else if (commaCount > semiCount) delimiter = ',';

            return line.split(delimiter).map(c => c.replace(/^["']|["']$/g, '').trim());
        });

        const structuredNames = extractNamesFromTableRows(tableRows);
        if (structuredNames.length > 0) return structuredNames;

        // 5. Fallback line-by-line / column-by-column
        const cleanNames = [];
        const seen = new Set();
        const HEADER_REGEX = /\b(nom|prenom|prénom|name|student|pupil|eleve|élève|classe|degré|degre|degree|grade|matricule|naissance|birth|date|sexe|gender|genre)\b/i;

        for (const row of tableRows) {
            for (const col of row) {
                const cleaned = col.replace(/^[0-9\.\-\_\s]+/, '').trim();
                if (cleaned.length >= 2 && !HEADER_REGEX.test(cleaned)) {
                    const key = cleaned.toLowerCase();
                    if (!seen.has(key)) {
                        seen.add(key);
                        cleanNames.push(cleaned);
                    }
                }
            }
        }
        return cleanNames;
    }

    // Handles mixed separators (newlines, commas, semicolons) in manual text inputs
    function parseNamesList(rawText) {
        if (!rawText) return [];
        return rawText
            .split(/[\r\n,;]+/)
            .map(n => n.trim())
            .filter(Boolean);
    }

    return {
        parseRosterContent,
        extractNamesFromTableRows,
        parseNamesList,
        formatTitleCase,
        formatCapitalize
    };
}));

