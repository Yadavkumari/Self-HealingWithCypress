const fs = require('fs');
const path = require('path');

const HISTORY_FILE = 'history.json';
const LATEST_RESULTS = 'cypress/reports/healing-results.json';
const packageJson = require('../../package.json');

function generateHistoricalData() {
    let history = [];
    if (fs.existsSync(HISTORY_FILE)) {
        history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    }

    let latestResults = [];
    if (fs.existsSync(LATEST_RESULTS)) {
        latestResults = JSON.parse(fs.readFileSync(LATEST_RESULTS, 'utf8'));
    } else {
        console.log("No new results found. Creating empty entry for tracking.");
    }

    const runId = process.env.GITHUB_RUN_ID || 'local-' + Date.now();
    const runNumber = process.env.GITHUB_RUN_NUMBER || '0';
    
    const stats = {
        runId: runId,
        runNumber: runNumber,
        workflowName: process.env.GITHUB_WORKFLOW || "CI Self-Healing Test Suite",
        repository: process.env.GITHUB_REPOSITORY || "Yadavkumari/Self-HealingWithCypress",
        branch: process.env.GITHUB_REF_NAME || "main",
        commitSha: process.env.GITHUB_SHA || "unknown",
        event: process.env.GITHUB_EVENT_NAME || "push",
        generatedAt: new Date().toISOString(),
        totalRuns: history.length + 1,
        totalTestsCompleted: latestResults.length || 1, 
        totalSelectorHeals: latestResults.filter(r => r.success).length,
        totalFlowHeals: 0,
        totalFailures: latestResults.filter(r => !r.success).length,
        estimatedTimeSaved: (latestResults.filter(r => r.success).length * 0.5).toFixed(1),
        healSuccessRate: latestResults.length > 0 
            ? ((latestResults.filter(r => r.success).length / latestResults.length) * 100).toFixed(1) 
            : "100.0",
        file: `runs/${runId}.json`
    };

    // Save individual run data
    const runDir = 'runs';
    if (!fs.existsSync(runDir)) fs.mkdirSync(runDir);
    fs.writeFileSync(path.join(runDir, `${runId}.json`), JSON.stringify(latestResults, null, 2));

    // Create latest.json (identical to the first entry of history)
    fs.writeFileSync('latest.json', JSON.stringify(stats, null, 2));

    // Update history (keep top 50 runs)
    history.unshift(stats);
    if (history.length > 50) history = history.slice(0, 50);

    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
    console.log(`✅ history.json and latest.json updated in exact reference format.`);
}

generateHistoricalData();
