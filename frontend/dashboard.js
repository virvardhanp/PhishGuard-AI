
// =====================================
// PHISHGUARD AI - DASHBOARD JAVASCRIPT
// =====================================

// Get dashboard elements
const totalScansElement = document.getElementById("totalScans");
const highRiskElement = document.getElementById("highRisk");
const mediumRiskElement = document.getElementById("mediumRisk");
const lowRiskElement = document.getElementById("lowRisk");

const highBar = document.getElementById("highBar");
const mediumBar = document.getElementById("mediumBar");
const lowBar = document.getElementById("lowBar");

const highPercent = document.getElementById("highPercent");
const mediumPercent = document.getElementById("mediumPercent");
const lowPercent = document.getElementById("lowPercent");

const recentScansElement = document.getElementById("recentScans");

// Same storage key used in script.js
const HISTORY_KEY = "phishguard_scan_history";

// =====================================
// STEP 1: GET SCAN HISTORY
// =====================================

function getScanHistory() {
    try {
        const history = JSON.parse(
            localStorage.getItem(HISTORY_KEY) || "[]"
        );

        return Array.isArray(history) ? history : [];

    } catch (error) {
        console.error("Unable to load scan history:", error);
        return [];
    }
}

// =====================================
// STEP 2: CALCULATE SCAN STATISTICS
// =====================================

function calculateStatistics(history) {

    const statistics = {
        total: history.length,
        high: 0,
        medium: 0,
        low: 0
    };

    history.forEach((scan) => {

        const risk = String(
            scan.riskLevel || ""
        ).toLowerCase();

        if (risk === "high") {
            statistics.high++;
        }

        else if (risk === "medium") {
            statistics.medium++;
        }

        else if (risk === "low") {
            statistics.low++;
        }

    });

    return statistics;
}

// =====================================
// STEP 3: DISPLAY STATISTICS
// =====================================

function displayStatistics(statistics) {

    totalScansElement.textContent = statistics.total;

    highRiskElement.textContent = statistics.high;

    mediumRiskElement.textContent = statistics.medium;

    lowRiskElement.textContent = statistics.low;

    // Calculate percentages
    const total = statistics.total;

    const highValue = total
        ? (statistics.high / total) * 100
        : 0;

    const mediumValue = total
        ? (statistics.medium / total) * 100
        : 0;

    const lowValue = total
        ? (statistics.low / total) * 100
        : 0;

    // Update progress bars
    highBar.style.width = highValue + "%";

    mediumBar.style.width = mediumValue + "%";

    lowBar.style.width = lowValue + "%";

    // Display percentages
    highPercent.textContent = Math.round(highValue) + "%";

    mediumPercent.textContent = Math.round(mediumValue) + "%";

    lowPercent.textContent = Math.round(lowValue) + "%";
}

// =====================================
// STEP 4: DISPLAY RECENT SCANS
// =====================================

function displayRecentScans(history) {

    recentScansElement.replaceChildren();

    if (history.length === 0) {

        recentScansElement.appendChild(
            createTextElement(
                "p",
                "No scans available yet."
            )
        );

        return;
    }

    // Show latest five scans
    const recentScans = history.slice(0, 5);

    recentScans.forEach((scan) => {

        const scanItem = document.createElement("div");
        scanItem.className = "recent-scan-item";

        const details = document.createElement("div");

        const url = createTextElement(
            "p",
            scan.url || "URL unavailable",
            "recent-scan-url"
        );

        const date = new Date(scan.date);

        const dateText = createTextElement(
            "p",
            isNaN(date.getTime())
                ? "Date unavailable"
                : date.toLocaleString(),
            "recent-scan-date"
        );

        details.append(url, dateText);

        const risk = createTextElement(
            "span",
            scan.riskLevel || "Incomplete",
            "recent-scan-risk"
        );

        const riskColors = {
            high: "#ff7777",
            medium: "#ffc66d",
            low: "#69e49a",
            incomplete: "#c4cbd5"
        };

        const riskClass = String(
            scan.riskLevel || "Incomplete"
        ).toLowerCase();

        risk.style.color =
            riskColors[riskClass] || riskColors.incomplete;

        scanItem.append(details, risk);

        recentScansElement.appendChild(scanItem);

    });
}

// =====================================
// HELPER: CREATE SAFE TEXT ELEMENT
// =====================================

function createTextElement(tag, text, className = "") {

    const element = document.createElement(tag);

    element.textContent = text;

    if (className) {
        element.className = className;
    }

    return element;
}

// =====================================
// STEP 5: LOAD DASHBOARD
// =====================================

function loadDashboard() {

    const history = getScanHistory();

    const statistics = calculateStatistics(history);

    displayStatistics(statistics);

    displayRecentScans(history);

}

// Run dashboard
loadDashboard();
