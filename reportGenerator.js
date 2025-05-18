// reportGenerator.js

/**
 * Generate a title for a vulnerability report.
 * This simple implementation concatenates key details.
 * @param {string} assetType - The category of the asset (e.g., "Smart Contract" or "Websites and Applications")
 * @param {string} impact - The main impact of the bug selected.
 * @returns {string} - The generated title.
 */
function generateTitle(assetType, impact) {
  return `Vulnerability Report - ${assetType} - Impact: ${impact}`;
}

/**
 * Generate the complete vulnerability report.
 * @param {object} options - The parameters for the report.
 * @param {string} options.assetUrl - The URL or identifier of the asset.
 * @param {string} options.assetType - The type of asset.
 * @param {string} options.impact - The selected impact.
 * @param {string} options.severity - The severity level chosen.
 * @param {string[]} options.references - An array of reference URLs.
 * @param {string} options.poc - The proof of concept code snippet or instructions.
 * @returns {string} - The complete vulnerability report in Markdown format.
 */
function generateVulnerabilityReport({ assetUrl, assetType, impact, severity, references, poc }) {
  // Build the markdown sections
  const title = generateTitle(assetType, impact);
  const briefIntro = `A vulnerability affecting the ${assetType} at ${assetUrl} has been identified. Exploiting this bug could lead to severe consequences including ${impact.toLowerCase()} effects.`;
  
  const vulnerabilityDetails = `The vulnerability occurs due to a flaw in the input validation logic, allowing attackers to manipulate interfaces to trigger unexpected behavior. Issues like unhandled exceptions, improper access controls, or logic bypasses have been observed. Detailed code analysis and testing confirm that the vulnerability exists in a critical area of the application.`;
  
  const impactDetails = `If exploited, the bug can result in ${impact.toLowerCase()}. Depending on the severity level (${severity}), potential damages may include unauthorized data access, financial loss, or service disruption.`;
  
  const referencesSection = references.map(url => \`- \${url}\`).join("\n");
  
  // Construct final report markdown
  return \`
# \${title}

## Brief/Intro
\${briefIntro}

## Vulnerability Details
\${vulnerabilityDetails}

## Impact Details
\${impactDetails}

## References
\${referencesSection}

## Proof of Concept
\${poc}

\`;
}

// Expose the function for global usage in the browser
window.generateVulnerabilityReport = generateVulnerabilityReport;
