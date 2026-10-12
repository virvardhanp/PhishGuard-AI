
// =====================================
// PHISHGUARD AI - FRONTEND SCRIPT
// =====================================

// DOM ELEMENTS
const urlInput = document.getElementById("urlInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const result = document.getElementById("result");

const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

const HISTORY_KEY = "phishguard_scan_history";
const MAX_HISTORY = 10;

// EVENT LISTENERS
analyzeBtn.addEventListener("click", analyzeURL);

urlInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        analyzeURL();
    }
});

// =====================================
// HELPER: CREATE TEXT ELEMENT
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
// HELPER: FORMAT SCAN DETAILS
// =====================================

function formatRisk(value) {
    return value || "Unavailable";
}

function formatScore(value) {
    return value !== undefined && value !== null
        ? value
        : "Unavailable";
}

// =====================================
// SCAN HISTORY: GET SAVED DATA
// =====================================

function getScanHistory() {
    try {
        const history = JSON.parse(
            localStorage.getItem(HISTORY_KEY) || "[]"
        );

        return Array.isArray(history) ? history : [];

    } catch (error) {
        console.error("Unable to read scan history:", error);
        return [];
    }
}

// =====================================
// SCAN HISTORY: SAVE A NEW SCAN
// =====================================

function saveScanHistory(url, overallRisk, data) {
    const history = getScanHistory();

    const newScan = {
        url: url,
        riskLevel: overallRisk,
        riskScore: data.riskScore,
        date: new Date().toISOString(),

        // Save the complete backend response
        scanDetails: data
    };

    history.unshift(newScan);

    // Keep only the latest 10 scans
    const updatedHistory = history.slice(0, MAX_HISTORY);

    try {
        localStorage.setItem(
            HISTORY_KEY,
            JSON.stringify(updatedHistory)
        );

        displayScanHistory();

    } catch (error) {
        console.error("Unable to save scan history:", error);
    }
}

// =====================================
// SCAN HISTORY: DISPLAY DETAILS
// =====================================

function displayScanDetails(scan, detailsContainer) {
    detailsContainer.replaceChildren();

    const data = scan.scanDetails;

    if (!data) {
        detailsContainer.appendChild(
            createTextElement(
                "p",
                "Detailed results are unavailable for this older scan. Scan this URL again to save its complete assessment."
            )
        );

        return;
    }

    // RULE-BASED ANALYSIS
    detailsContainer.appendChild(
        createTextElement("h4", "Rule-Based Analysis")
    );

    detailsContainer.appendChild(
        createTextElement(
            "p",
            "Risk Level: " + formatRisk(data.riskLevel)
        )
    );

    detailsContainer.appendChild(
        createTextElement(
            "p",
            "Risk Score: " + formatScore(data.riskScore)
        )
    );

    detailsContainer.appendChild(
        createTextElement(
            "p",
            data.message || "No additional rule-based message."
        )
    );

    detailsContainer.appendChild(
        createTextElement("strong", "Detected Indicators:")
    );

    const indicatorList = document.createElement("ul");

    const indicators = Array.isArray(data.indicators)
        ? data.indicators
        : [];

    if (indicators.length === 0) {
        indicatorList.appendChild(
            createTextElement(
                "li",
                "No indicators covered by these basic checks were detected."
            )
        );
    } else {
        indicators.forEach((item) => {
            indicatorList.appendChild(
                createTextElement("li", String(item))
            );
        });
    }

    detailsContainer.appendChild(indicatorList);

    // GROQ AI ASSESSMENT
    detailsContainer.appendChild(
        createTextElement("h4", "Groq AI Assessment")
    );

    detailsContainer.appendChild(
        createTextElement(
            "p",
            "AI Risk Level: " + formatRisk(data.aiRiskLevel)
        )
    );

    detailsContainer.appendChild(
        createTextElement(
            "p",
            data.aiAssessment || "AI assessment is unavailable."
        )
    );

    // URLHAUS ASSESSMENT
    detailsContainer.appendChild(
        createTextElement("h4", "URLhaus Malware Intelligence")
    );

    const urlhaus = data.urlhaus || {};

    let urlhausStatusText;

    if (urlhaus.status === "listed") {
        urlhausStatusText =
            "Database Status: Listed - This URL is recorded in URLhaus.";
    } else if (urlhaus.status === "not_listed") {
        urlhausStatusText =
            "Database Status: Not Listed - This URL was not found in URLhaus.";
    } else {
        urlhausStatusText =
            "Database Status: Unavailable - URLhaus could not complete the check.";
    }

    detailsContainer.appendChild(
        createTextElement("p", urlhausStatusText)
    );

    detailsContainer.appendChild(
        createTextElement(
            "p",
            urlhaus.message || "No additional URLhaus information available."
        )
    );

    if (urlhaus.threat) {
        detailsContainer.appendChild(
            createTextElement("p", "Threat Type: " + urlhaus.threat)
        );
    }

    if (urlhaus.urlStatus) {
        detailsContainer.appendChild(
            createTextElement("p", "URL Status: " + urlhaus.urlStatus)
        );
    }

    if (urlhaus.dateAdded) {
        detailsContainer.appendChild(
            createTextElement("p", "Date Added: " + urlhaus.dateAdded)
        );
    }

    // SAFETY DISCLAIMER
    detailsContainer.appendChild(
        createTextElement(
            "p",
            data.disclaimer ||
            "Preliminary assessment only. A URL not listed in URLhaus is not necessarily safe."
        ,
        "safety-disclaimer")
    );
}

// =====================================
// SCAN HISTORY: DISPLAY SAVED SCANS
// =====================================

function displayScanHistory() {
    if (!historyList) return;

    historyList.replaceChildren();

    const history = getScanHistory();

    if (history.length === 0) {
        const emptyBox = document.createElement("div");
        emptyBox.className = "history-empty";

        emptyBox.append(
            createTextElement("span", "◷"),
            createTextElement("h4", "No scan history yet"),
            createTextElement(
                "p",
                "Your analyzed URLs will appear here."
            )
        );

        historyList.appendChild(emptyBox);
        return;
    }

    history.forEach((scan, index) => {
        const historyItem = document.createElement("div");
        historyItem.className = "history-item";

        // LEFT SIDE: URL AND DATE
        const details = document.createElement("div");
        details.className = "history-details";

        const urlText = createTextElement(
            "p",
            scan.url || "URL unavailable",
            "history-url"
        );

        const date = new Date(scan.date);

        const dateText = createTextElement(
            "small",
            isNaN(date.getTime())
                ? "Date unavailable"
                : date.toLocaleString(),
            "history-date"
        );

        details.append(urlText, dateText);

        // RIGHT SIDE: RISK AND SCORE
        const riskDetails = document.createElement("div");
        riskDetails.className = "history-risk-details";

        const risk = createTextElement(
            "span",
            scan.riskLevel || "Incomplete",
            "history-risk"
        );

        const validRiskClasses = [
            "high",
            "medium",
            "low",
            "incomplete"
        ];

        const riskClass = String(
            scan.riskLevel || "Incomplete"
        ).toLowerCase();

        if (validRiskClasses.includes(riskClass)) {
            risk.classList.add("risk-" + riskClass);
        }

        const scoreText = createTextElement(
            "small",
            "Score: " + (
                Number.isFinite(Number(scan.riskScore))
                    ? scan.riskScore
                    : "N/A"
            ),
            "history-score"
        );

        // VIEW DETAILS BUTTON
        const viewButton = createTextElement(
            "button",
            "View Details",
            "history-view-btn"
        );

        viewButton.type = "button";

        // DETAILS PANEL
        const detailsContainer = document.createElement("div");
        detailsContainer.className = "history-detail-panel";
        detailsContainer.hidden = true;

        viewButton.addEventListener("click", () => {
            const isHidden = detailsContainer.hidden;

            detailsContainer.hidden = !isHidden;

            viewButton.textContent = isHidden
                ? "Hide Details"
                : "View Details";

            if (isHidden) {
                displayScanDetails(scan, detailsContainer);
            }
        });

        riskDetails.append(risk, scoreText, viewButton);

        historyItem.append(details, riskDetails);

        // Put the detail panel below the history row
        const historyEntry = document.createElement("div");
        historyEntry.className = "history-entry";

        historyEntry.append(historyItem, detailsContainer);

        historyList.appendChild(historyEntry);
    });
}

// =====================================
// SCAN HISTORY: CLEAR ALL HISTORY
// =====================================

if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", () => {
        const history = getScanHistory();

        if (history.length === 0) {
            return;
        }

        const confirmClear = confirm(
            "Are you sure you want to clear all scan history?"
        );

        if (!confirmClear) return;

        localStorage.removeItem(HISTORY_KEY);

        displayScanHistory();
    });
}

// Load saved history when page opens
displayScanHistory();

// =====================================
// MAIN URL ANALYSIS FUNCTION
// =====================================

async function analyzeURL() {
    const value = urlInput.value.trim();

    // Clear previous results
    result.className = "result";
    result.replaceChildren();

    // Check empty URL
    if (!value) {
        result.textContent = "Please enter a website URL.";
        result.classList.add("error");
        return;
    }

    // Validate URL
    let parsedUrl;

    try {
        parsedUrl = new URL(value);
    } catch {
        result.textContent =
            "Invalid URL. Enter a complete address, such as https://example.com.";

        result.classList.add("error");
        return;
    }

    // Allow HTTP and HTTPS only
    if (
        !["http:", "https:"].includes(parsedUrl.protocol) ||
        !parsedUrl.hostname.includes(".") ||
        parsedUrl.hostname.startsWith(".")
    ) {
        result.textContent =
            "Please enter a valid HTTP or HTTPS website address.";

        result.classList.add("error");
        return;
    }

    // Disable button during analysis
    analyzeBtn.disabled = true;

    result.textContent = "Analyzing URL... Please wait.";

    try {
        // SEND URL TO BACKEND
        const response = await fetch(
            "https://phishguard-ai-f2z0.onrender.com/api/analyze",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ url: value })
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Analysis failed.");
        }

        // Clear loading message
        result.replaceChildren();
        result.className = "result";

        // MAIN HEADING
        const heading = createTextElement(
            "h3",
            "Analysis Result"
        );

        // 1. OVERALL RISK ASSESSMENT
        const overallTitle = createTextElement(
            "h4",
            "Overall Risk Assessment"
        );

        const overallRisk = data.overallRiskLevel || "Incomplete";

        const overallCard = document.createElement("div");
        overallCard.className = "overall-risk-card";

        const overallStatus = createTextElement(
            "h2",
            overallRisk,
            "overall-risk-level"
        );

        overallCard.classList.add(
            "risk-" + overallRisk.toLowerCase()
        );

        const overallDescription = document.createElement("p");

        const descriptions = {
            High: "High-risk indicators detected. Avoid interacting with this URL.",
            Medium: "Some suspicious indicators were detected. Use caution.",
            Low: "No major warning signs were detected by the available checks. This does not guarantee safety.",
            Incomplete: "Some analysis services were unavailable. A complete assessment could not be performed."
        };

        overallDescription.textContent =
            descriptions[overallRisk] || descriptions.Incomplete;

        overallCard.append(
            overallStatus,
            overallDescription
        );

        // 2. RULE-BASED ANALYSIS
        const ruleTitle = createTextElement(
            "h4",
            "Rule-Based Analysis"
        );

        const risk = createTextElement(
            "p",
            "Risk Level: " + (data.riskLevel || "Unavailable")
        );

        const score = createTextElement(
            "p",
            "Risk Score: " + (data.riskScore ?? "Unavailable")
        );

        const message = createTextElement(
            "p",
            data.message || ""
        );

        const indicatorTitle = createTextElement(
            "p",
            "Detected Indicators:"
        );

        const indicatorList = document.createElement("ul");

        const indicators = Array.isArray(data.indicators)
            ? data.indicators
            : [];

        if (indicators.length === 0) {
            indicatorList.appendChild(
                createTextElement(
                    "li",
                    "No indicators covered by these basic checks were detected."
                )
            );
        } else {
            indicators.forEach((item) => {
                indicatorList.appendChild(
                    createTextElement("li", String(item))
                );
            });
        }

        // 3. GROQ AI ASSESSMENT
        const aiTitle = createTextElement(
            "h4",
            "Groq AI Assessment"
        );

        const aiRisk = createTextElement(
            "p",
            "AI Risk Level: " + (data.aiRiskLevel || "Unavailable")
        );

        const aiMessage = document.createElement("p");

        const cleanAIMessage = (
            data.aiAssessment ||
            "AI assessment is unavailable. Please check the backend terminal."
        )
            .replace(/\\([*`_])/g, "$1")
            .replace(/\*\*/g, "")
            .replace(/`/g, "");

        aiMessage.textContent = cleanAIMessage;

        // 4. URLHAUS MALWARE INTELLIGENCE
        const urlhausTitle = createTextElement(
            "h4",
            "URLhaus Malware Intelligence"
        );

        const urlhaus = data.urlhaus || {};

        let urlhausStatusText;

        if (urlhaus.status === "listed") {
            urlhausStatusText =
                "Database Status: Listed - This URL is recorded in URLhaus.";
        } else if (urlhaus.status === "not_listed") {
            urlhausStatusText =
                "Database Status: Not Listed - This URL was not found in URLhaus.";
        } else {
            urlhausStatusText =
                "Database Status: Unavailable - URLhaus could not complete the check.";
        }

        const urlhausStatus = createTextElement(
            "p",
            urlhausStatusText
        );

        const urlhausMessage = createTextElement(
            "p",
            urlhaus.message || "No additional URLhaus information available."
        );

        const urlhausDetails = document.createElement("div");

        if (urlhaus.status === "listed") {
            if (urlhaus.threat) {
                urlhausDetails.appendChild(
                    createTextElement("p", "Threat Type: " + urlhaus.threat)
                );
            }

            if (urlhaus.urlStatus) {
                urlhausDetails.appendChild(
                    createTextElement("p", "URL Status: " + urlhaus.urlStatus)
                );
            }

            if (urlhaus.dateAdded) {
                urlhausDetails.appendChild(
                    createTextElement("p", "Date Added: " + urlhaus.dateAdded)
                );
            }
        }

        // 5. SAFETY DISCLAIMER
        const disclaimer = createTextElement(
            "p",
            data.disclaimer ||
            "Preliminary assessment only. A URL not listed in URLhaus is not necessarily safe."
        );

        disclaimer.className = "safety-disclaimer";

        // 6. DISPLAY ALL RESULTS
        result.append(
            heading,
            overallTitle,
            overallCard,
            ruleTitle,
            risk,
            score,
            message,
            indicatorTitle,
            indicatorList,
            aiTitle,
            aiRisk,
            aiMessage,
            urlhausTitle,
            urlhausStatus,
            urlhausMessage,
            urlhausDetails,
            disclaimer
        );

        // 7. SAVE COMPLETE SCAN TO HISTORY
        saveScanHistory(
            value,
            overallRisk,
            data
        );

    } catch (error) {
        result.className = "result error";

        result.textContent =
            "Unable to analyze this URL. " + error.message;

        console.error("Frontend analysis error:", error);

    } finally {
        analyzeBtn.disabled = false;
    }
}
