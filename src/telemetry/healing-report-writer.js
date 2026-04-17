/**
 * HealingReportWriter
 * Generates human-readable and machine-readable logs of the healing process.
 */

class HealingReportWriter {
    constructor() {
        this.events = [];
    }

    logHeal(event) {
        this.events.push({
            timestamp: new Date().toISOString(),
            ...event
        });
    }

    generateMarkdown() {
        if (this.events.length === 0) return "# Self-Healing Report\n\nNo healing events occurred. All tests passed with primary selectors.";
        
        let md = `# 🤖 AI Agentic Healing Report\n\n`;
        md += `| Target | Result | Original Selector | Healed Selector | Confidence | Rationale |\n`;
        md += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;
        
        this.events.forEach(e => {
            md += `| ${e.label} | ${e.success ? '✅ FIXED' : '❌ FAILED'} | \`${e.originalSelector}\` | \`${e.healedSelector || 'N/A'}\` | ${e.confidence || 'N/A'} | ${e.rationale || 'N/A'} |\n`;
        });
        
        return md;
    }

    printSummary() {
        console.log('\n--- 🤖 HEALING SUMMARY ---');
        this.events.forEach(e => {
            if (e.success) {
                console.warn(`✅ [HEALED] ${e.label}: ${e.originalSelector} -> ${e.healedSelector}`);
            } else {
                console.error(`❌ [FAILED] ${e.label}: All recovery attempts failed.`);
            }
        });
        console.log('---------------------------\n');
    }
}

export default new HealingReportWriter();
