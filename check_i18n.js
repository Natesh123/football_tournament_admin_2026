const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.html') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./src/app');
let translatedFiles = 0;
let potentialFiles = new Set();
let allHardcoded = [];

files.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');

    if (content.includes('translate')) {
        translatedFiles++;
    }

    // Matches tags with text that starts with a letter and doesn't contain {{ or }} or < or >
    // Regex: >\s*([A-Z][a-zA-Z0-9\s.,!?'-]+)\s*<
    // We ignore anything with @, {, }
    const regex = />\s*([A-Za-z][^<>{]*[a-zA-Z0-9.,!?'-])\s*</g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        let text = match[1].trim();
        if (text && !text.includes('{{') && !text.includes('}}') && !text.includes('@') && !text.includes('=')) {
            // Ignore some common false positives like "daisyUI", "tailwind", HTML entities
            if (text.length > 2 && text !== 'svg' && text !== 'path' && text !== 'Loading...' && !text.startsWith('&')) {
                potentialFiles.add(f);
                allHardcoded.push({ file: f, text: text });
            }
        }
    }

    // Also look for placeholder="..."
    const placeholderRegex = /placeholder="([^"{]+)"/g;
    while ((match = placeholderRegex.exec(content)) !== null) {
        let text = match[1].trim();
        if (text && !text.includes('{{') && !text.includes('}}')) {
            potentialFiles.add(f);
            allHardcoded.push({ file: f, text: `placeholder: ${text}` });
        }
    }

    // Also look for title="..."
    const titleRegex = /title="([^"{]+)"/g;
    while ((match = titleRegex.exec(content)) !== null) {
        let text = match[1].trim();
        if (text && !text.includes('{{') && !text.includes('}}')) {
            potentialFiles.add(f);
            allHardcoded.push({ file: f, text: `title: ${text}` });
        }
    }
});

console.log("=== I18N CHECK REPORT ===");
console.log(`Files using translate: ${translatedFiles}`);
console.log(`Files with potential missing translations: ${potentialFiles.size}`);
console.log("\nDetails of potential hardcoded text:");

// group by file
const grouped = {};
allHardcoded.forEach(item => {
    if (!grouped[item.file]) grouped[item.file] = [];
    grouped[item.file].push(item.text);
});

for (let file in grouped) {
    console.log(`\n📄 ${file}`);
    const uniqueTexts = [...new Set(grouped[file])];
    uniqueTexts.forEach(t => console.log(`   - "${t}"`));
}
