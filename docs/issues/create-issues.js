const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const issuesDir = __dirname;
const epicFiles = fs.readdirSync(issuesDir).filter(f => f.startsWith("epic") && f.endsWith(".md")).sort();

let totalCreated = 0;
let totalSkipped = 0;
let createdIssues = [];

for (const epicFile of epicFiles) {
  const filePath = path.join(issuesDir, epicFile);
  const content = fs.readFileSync(filePath, "utf8");

  // Split on H2 issue headers only: \n## Issue #NNN or #NNNb —
  const sections = content.split(/\n(?=## Issue #\d+[a-z]? — )/);

  for (const section of sections) {
    // First line must match "## Issue #NNN — Title"
    const firstLine = section.trimStart().split("\n")[0];
    const headerMatch = firstLine.match(/^## Issue #(\d+[a-z]?)\s*[-—]\s*(.+)/);
    if (!headerMatch) continue;

    const issueNum = headerMatch[1];
    const title = headerMatch[2].trim();
    
    // Skip false positives (title == "Issue #NNN")
    if (title === `Issue #${issueNum}`) {
      console.log(`  Skipping false match: ## Issue #${issueNum}`);
      continue;
    }

    const lines = section.split("\n");

    // Extract metadata line and labels
    let metadataLine = "";
    for (let j = 1; j < lines.length && j < 10; j++) {
      if (lines[j].includes("**Epic:**")) { metadataLine = lines[j]; break; }
    }

    const labels = [];
    const getMeta = (field) => {
      const m = metadataLine.match(new RegExp(`\\*\\*${field}:\\*\\*\\s*([^|]+)`));
      return m ? m[1].trim() : null;
    };

    const epicVal = getMeta("Epic");
    const typeVal = getMeta("Type");
    const priVal = getMeta("Priority");
    const sizeVal = getMeta("Size");

    if (epicVal) labels.push(`epic:${epicVal}`);
    if (typeVal) {
      typeVal.split("/").forEach(t => labels.push(`type:${t.trim()}`));
    }
    if (priVal) labels.push(`priority:${priVal}`);
    if (sizeVal) labels.push(`size:${sizeVal}`);

    // Build body: skip header line + metadata line + following blank lines
    let bodyStart = 1;
    if (metadataLine) bodyStart = lines.indexOf(metadataLine) + 1;
    while (bodyStart < lines.length && lines[bodyStart].trim() === "") bodyStart++;

    const body = lines.slice(bodyStart).join("\n").trim();

    const fullTitle = `Issue #${issueNum} — ${title}`;
    const tmpFile = path.join(issuesDir, `.tmp_issue_${issueNum}.md`);
    fs.writeFileSync(tmpFile, body);

    const args = ["issue", "create", "--title", fullTitle, "--body-file", tmpFile];
    if (labels.length > 0) {
      args.push("--label", labels.join(","));
    }

    console.log(`Creating: Issue #${issueNum}: ${title.substring(0, 55)}...`);

    const result = spawnSync("gh", args, {
      cwd: issuesDir,
      stdio: ["pipe", "pipe", "pipe"],
      encoding: "utf8",
      timeout: 30000,
      env: { ...process.env, GH_PROMPT_DISABLED: "1" }
    });

    try { fs.unlinkSync(tmpFile); } catch {}

    if (result.status === 0) {
      const urlMatch = result.stdout.match(/https:\/\/github\.com\/[^\s]+/);
      console.log(`  ✓ Created: ${urlMatch ? urlMatch[0] : ""}`);
      createdIssues.push({ number: issueNum, title: fullTitle, url: urlMatch?.[0] });
      totalCreated++;
    } else {
      console.error(`  ✗ FAILED #${issueNum}: ${result.stderr.trim().substring(0, 200)}`);
      totalSkipped++;
    }
  }
}

console.log(`\n========================================`);
console.log(`Done. Created: ${totalCreated}, Skipped: ${totalSkipped}`);
