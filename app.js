// Tab Navigation
const tabAnalysis = document.getElementById("tabAnalysis");
const tabReport = document.getElementById("tabReport");
const tabDashboard = document.getElementById("tabDashboard");
const analysisSection = document.getElementById("analysisSection");
const reportSection = document.getElementById("reportSection");
const dashboardSection = document.getElementById("dashboardSection");

function showSection(section) {
  analysisSection.classList.add("hidden");
  reportSection.classList.add("hidden");
  dashboardSection.classList.add("hidden");
  section.classList.remove("hidden");
}

tabAnalysis.addEventListener("click", () => {
  showSection(analysisSection);
  tabAnalysis.classList.add("active");
  tabReport.classList.remove("active");
  tabDashboard.classList.remove("active");
});

tabReport.addEventListener("click", () => {
  showSection(reportSection);
  tabReport.classList.add("active");
  tabAnalysis.classList.remove("active");
  tabDashboard.classList.remove("active");
});

tabDashboard.addEventListener("click", () => {
  showSection(dashboardSection);
  tabDashboard.classList.add("active");
  tabAnalysis.classList.remove("active");
  tabReport.classList.remove("active");
});

// Static Analysis Simulation with Dynamic Spinner and Delay
document.getElementById("analysisForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const target = document.getElementById("targetInput").value.trim();
  const resultContainer = document.getElementById("analysisResult");

  resultContainer.innerHTML = `<div class="spinner"></div>`;
  // Simulate a delay to mimic a real analysis process
  setTimeout(() => {
    let analysisOutput = "";
    if (target.toLowerCase().includes("ens")) {
      analysisOutput += "Analyzing ENS project...\n";
      analysisOutput += "- Detected potential reentrancy in 'ENSRegistry' contract.\n";
      analysisOutput += "- Unchecked external call found in 'Resolver' contract.\n";
      analysisOutput += "- Possible integer overflow in reward calculation module.\n";
      analysisOutput += "Recommendations: Implement reentrancy guards, add input validation, and use safe math libraries.\n";
    } else {
      analysisOutput += `No critical vulnerabilities detected for target: ${target}\n`;
      analysisOutput += "For deeper insights, consider integrating actual static analysis tools like Slither or Mythril.";
    }
    resultContainer.textContent = analysisOutput;
  }, 2500);
});

// Vulnerability Report Generation
document.getElementById("reportForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const assetUrl = document.getElementById("assetUrl").value.trim();
  const assetType = document.getElementById("assetType").value;
  const impact = document.getElementById("impact").value;
  const severity = document.getElementById("severity").value;
  const references = document.getElementById("references").value.split(",").map(s => s.trim());
  const poc = document.getElementById("poc").value.trim();

  const reportOutput = generateVulnerabilityReport({
    assetUrl,
    assetType,
    impact,
    severity,
    references,
    poc
  });

  document.getElementById("reportOutput").textContent = reportOutput;
});

/**
 * Generate a title for the vulnerability report.
 * @param {string} assetType - The type of asset.
 * @param {string} impact - The impact.
 * @returns {string} - The report title.
 */
function generateTitle(assetType, impact) {
  return `Vulnerability Report - ${assetType} | Impact: ${impact}`;
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
  const briefIntro = `A vulnerability has been identified in the ${assetType} at ${assetUrl}. The impact is classified as ${impact.toLowerCase()}.`;
  const vulnerabilityDetails = `Core issues include potential reentrancy, unchecked external calls, integer overflows, and logic errors.`;
  const impactDetails = `Exploitation risks include unauthorized access, fund mismanagement, data loss, or system compromise. Severity is rated as ${severity}.`;
  const referencesSection = references.filter(ref => ref).map(ref => `- ${ref}`).join("\n");
  
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
${poc}`;
}

// Dynamic Dashboard Simulation with Real-Time Logs and Chart
const startDashboardBtn = document.getElementById("startDashboard");
const dashboardOutput = document.getElementById("dashboardOutput");

// Setup chart for simulation
const ctx = document.getElementById("analysisChart").getContext("2d");
const analysisChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Vulnerability Score',
      data: [],
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
      fill: false,
      tension: 0.3
    }]
  },
  options: {
    scales: {
      x: { title: { display: true, text: 'Time (s)' } },
      y: { title: { display: true, text: 'Score' }, beginAtZero: true, max: 100 }
    }
  }
});

startDashboardBtn.addEventListener("click", () => {
  dashboardOutput.textContent = "";
  analysisChart.data.labels = [];
  analysisChart.data.datasets[0].data = [];
  analysisChart.update();

  let time = 0;
  const logMessages = [
    "Initializing advanced static analysis engine...",
    "Scanning source code and smart contracts...",
    "Detecting input validation issues...",
    "Analyzing reentrancy vulnerabilities...",
    "Reviewing external call integrity...",
    "Evaluating integer operations...",
    "Compiling simulation results..."
  ];

  const interval = setInterval(() => {
    if (time < logMessages.length) {
      // Append log message
      dashboardOutput.textContent += logMessages[time] + "\n";

      // Update chart with simulated vulnerability score
      const score = Math.floor(Math.random() * 20) + (time * 10); // Simulated score increase
      analysisChart.data.labels.push(time.toString());
      analysisChart.data.datasets[0].data.push(score);
      analysisChart.update();

      time++;
    } else {
      dashboardOutput.textContent += "\nReal-Time Analysis Complete. Review the dynamic chart above.";
      clearInterval(interval);
    }
  }, 1800);
});
