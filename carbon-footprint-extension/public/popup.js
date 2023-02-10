chrome.storage.local.get("carbon_data", (data) => {
    const websiteData = data.carbon_data;
    const total_bytes_used = Object.values(websiteData).reduce((a, b) => a + b, 0);

    const total_carbon_footprint = bytesToCarbon(total_bytes_used);

    const carbon_eq_span = document.getElementById("carbon-eq");
    carbon_eq_span.innerText = total_carbon_footprint.toFixed(2);

    const carbon_eq_website = document.getElementById("carbon-eq-website");
    const website_url_span = document.getElementById("website-url");
    chrome.tabs.query({active: true}, tabs => {
        console.log(tabs);
        let url = tabs[0].url;
        // remove paths and query params but keep subdomains and protocol
        url = url.split("//")[0] + "//" + url.split("//")[1].split("/")[0];

        const website_bytes_used = websiteData[url] || 0;
        const website_gigabytes_used = website_bytes_used / (1024 * 1024 * 1024);
        const website_carbon_footprint = website_gigabytes_used * 11 / (1000 * 1000);
        carbon_eq_website.innerText = website_carbon_footprint.toFixed(2);
        website_url_span.innerText = url;

        const carbon_eq_rank_top_5 = Object.keys(websiteData).sort((a, b) => websiteData[b] - websiteData[a]).slice(0, 5);
        const carbon_eq_top_website_list = document.getElementById("carbon-eq-top-website-list");
        carbon_eq_rank_top_5.forEach(website => {
            const li = document.createElement("li");
            li.innerHTML = `<span>${website}</span><span>${(bytesToCarbon(websiteData[website])).toFixed(2)}</span>`;
            carbon_eq_top_website_list.appendChild(li);
        });
    });
})

const bytesToCarbon = (bytes) => {
    const gigabytes_used = bytes / (1024 * 1024 * 1024);
    const carbon_footprint = gigabytes_used * 11 / (1000 * 1000);
    return carbon_footprint;
}