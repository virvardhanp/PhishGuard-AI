async function checkURLhaus(value) {
  const authKey = process.env.URLHAUS_AUTH_KEY;

  if (!authKey) {
    return {
      status: "unavailable",
      message: "URLhaus Auth Key is not configured."
    };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("url", value);

    const response = await fetch(
      "https://urlhaus-api.abuse.ch/v1/url/",
      {
        method: "POST",
        headers: {
          "Auth-Key": authKey,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString(),
        signal: AbortSignal.timeout(10000)
      }
    );

    if (!response.ok) {
      throw new Error(`URLhaus returned HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data.query_status === "ok") {
      return {
        status: "listed",
        message: "This URL is listed in URLhaus as a known malware-distribution URL.",
        threat: data.threat || "Not specified",
        dateAdded: data.date_added || "Not specified",
        urlStatus: data.url_status || "Not specified"
      };
    }

    if (data.query_status === "no_results") {
      return {
        status: "not_listed",
        message: "This URL was not found in the URLhaus database."
      };
    }

    return {
      status: "unavailable",
      message: "URLhaus could not provide a result."
    };

  } catch (error) {
    console.error("URLhaus check failed:", error.message);

    return {
      status: "unavailable",
      message: "Unable to check this URL with URLhaus."
    };
  }
}

module.exports = { checkURLhaus };