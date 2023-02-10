// get total content length in a request sent
const CARBON_DATA = "carbon_data"
const last_sent: any = {}
chrome.storage.local.get(CARBON_DATA, async (data) => {
    if (!data[CARBON_DATA]) {
        await chrome.storage.local.set({
            [CARBON_DATA]: {}
        });
    }
})
chrome.webRequest.onBeforeRequest.addListener(details => {
        chrome.storage.local.get(CARBON_DATA, async data => {
            if (!details.initiator || !details.requestBody) return;
            if(details.initiator.includes("localhost")) return;
            const carbonData = data[CARBON_DATA];
            let {initiator, requestBody} = details;
            if (initiator[initiator.length - 1] === "/") {
                initiator = initiator.slice(0, -1);
            }
            if (!carbonData[initiator]) {
                carbonData[initiator] = 0;
            }
            if (requestBody.raw) {
                for (const raw of requestBody.raw) {
                    carbonData[initiator] += raw.bytes?.byteLength || 0;
                }
            }
            if (requestBody.formData) {
                for (const key in requestBody.formData) {
                    for (const value of requestBody.formData[key]) {

                        // 2 bytes for each character
                        carbonData[initiator] += value.length * 2;
                    }
                }
            }
            await chrome.storage.local.set({
                [CARBON_DATA]: carbonData
            });
        })
    }, {
        urls: [
            // except chrome-extension:
            "http://*/*",
            "https://*/*",
        ]
    },
    ["requestBody"]
);

chrome.webRequest.onBeforeSendHeaders.addListener(details => {
    chrome.storage.local.get(CARBON_DATA, async data => {
        if (!details.initiator || !details.requestHeaders) return;
        if(details.initiator.includes("localhost")) return;
        const carbonData = data[CARBON_DATA];
        const {initiator, requestHeaders} = details;
        if (!carbonData[initiator]) {
            carbonData[initiator] = 0;
        }
        for (const header of requestHeaders) {
            carbonData[initiator] += (header?.value?.length || 0) * 2;
        }
        await chrome.storage.local.set({
            [CARBON_DATA]: carbonData
        });
    })
}, {
    urls: ["http://*/*", "https://*/*"]
}, ["requestHeaders", "extraHeaders"]);


chrome.webRequest.onCompleted.addListener(details => {
    chrome.storage.local.get(CARBON_DATA, async data => {
        if (!details.initiator) return;
        const carbonData = data[CARBON_DATA];
        const {initiator, responseHeaders} = details;
        if (!carbonData[initiator]) {
            carbonData[initiator] = 0;
        }
        // get total content length in a response body
        carbonData[initiator] += parseInt(responseHeaders?.find(header => header.name === "content-length")?.value || "0");

        // get total content length in a response header
        carbonData[initiator] += JSON.stringify(responseHeaders).length * 2;

        await chrome.storage.local.set({
            [CARBON_DATA]: carbonData
        });
    })
}, {urls: ["<all_urls>"]}, ["responseHeaders", "extraHeaders"]);

chrome.alarms.create("send_carbon_data", {
    periodInMinutes: 1
});

chrome.alarms.onAlarm.addListener(async alarm => {
    if (alarm.name !== "send_carbon_data") return;
    chrome.storage.local.get(CARBON_DATA, async data => {
        const toSend: any = {}
        const carbonData = data[CARBON_DATA];
        const keys = Object.keys(carbonData);
        for (const key of keys) {
            if (!last_sent[key]) {
                last_sent[key] = 0;
            }
            if (carbonData[key] > last_sent[key]) {
                toSend[key] = carbonData[key] - last_sent[key];
                last_sent[key] = carbonData[key];
            }
        }
        if (Object.keys(toSend).length > 0) {
            console.log(toSend);
        }
    })
});