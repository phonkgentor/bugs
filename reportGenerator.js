/**
 * Generate a title for the vulnerability report.
 * @param {string} assetType - The type of asset.
 * @param {string} impact - The impact.
 * @returns {string} - The report title.
 */
function generateTitle(assetType, impact) {
  return `Vulnerability Report - ${assetType} - Impact: ${impact}`;
}

/**
 * Generate the vulnerability report in Markdown format.
 * @param {Object} options - Report options.
 * @param {string} options.assetUrl - The asset URL.
 * @param {string} options.assetType - The type of asset.
 * @param {string} options.impact - The selected impact.
 * @param {string} options.severity - The severity level.
 * @param {string[]} options.references - Array of reference URLs.
 * @param {string} options.poc - The proof of concept.
 * @returns {string} - The vulnerability report in Markdown.
 */
function generateVulnerabilityReport({ assetUrl, assetType, impact, severity, references, poc }) {
  const title = generateTitle(assetType, impact);
  const briefIntro = `A vulnerability has been discovered in the ${assetType} at ${assetUrl}, potentially leading to issues such as ${impact.toLowerCase()}.`;
  const vulnerabilityDetails = `The vulnerability arises due to inadequate validation and sanitization, enabling attackers to exploit the system.`;
  const impactDetails = `Exploitation may lead to significant breaches, data loss, or service disruption. The severity is marked as ${severity}.`;
  const referencesSection = references.filter(ref => ref).map(ref => `- ${ref}`).join('\n');
  
  return `# ${title}

## Brief/Intro
${briefIntro}

## Vulnerability Details
${vulnerabilityDetails}

## Impact Details
${impactDetails}

## References
${referencesSection}

## Proof of Concept
${poc}
`;
}
  
// Expose the function globally for use in the browser.
window.generateVulnerabilityReport = generateVulnerabilityReport;
  
// Report Generation Form handling.
document.getElementById('reportForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const assetUrl = document.getElementById('assetUrl').value;
  const assetType = document.getElementById('assetType').value;
  const impact = document.getElementById('impact').value;
  const severity = document.getElementById('severity').value;
  const references = document.getElementById('references').value.split(',').map(s => s.trim());
  const poc = document.getElementById('poc').value;
  
  const report = generateVulnerabilityReport({
    assetUrl,
    assetType,
    impact,
    severity,
    references,
    poc,
  });
  
  document.getElementById('reportOutput').textContent = report;
});
