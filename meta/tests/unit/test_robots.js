/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const robotsPath = path.resolve(__dirname, '../../../robots.txt');

test('robots.txt - blocks crawlers from indexing /alpha/', () => {
    assert.ok(fs.existsSync(robotsPath), 'robots.txt must exist at repository root');
    const content = fs.readFileSync(robotsPath, 'utf8');
    const lines = content.split(/\r?\n/).map(line => line.trim());

    assert.ok(lines.includes('User-agent: *'), 'robots.txt must target all crawlers (User-agent: *)');
    assert.ok(lines.includes('Disallow: /alpha/'), 'robots.txt must disallow /alpha/');
});
