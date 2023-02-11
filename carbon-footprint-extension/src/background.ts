// get total content length in a request sent
const CARBON_DATA = "carbon_data"
const LAST_SENT = "last_sent"
chrome.storage.local.get(CARBON_DATA, async (data) => {
    if (!data[CARBON_DATA]) {
        await chrome.storage.local.set({
            [CARBON_DATA]: {}
        });
    }
})
chrome.storage.local.get(LAST_SENT, async (data) => {
    if (!data[LAST_SENT]) {
        await chrome.storage.local.set({
            [LAST_SENT]: {}
        });
    }
})
chrome.webRequest.onBeforeRequest.addListener(details => {
        chrome.storage.local.get(CARBON_DATA, async data => {
            if (!details.initiator || !details.requestBody) return;
            if (details.initiator.includes("localhost")) return;
            if (details.initiator.includes("chrome-extension")) return;
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
        if (details.initiator.includes("localhost")) return;
        if (details.initiator.includes("chrome-extension")) return;
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


chrome.webRequest.onCompleted.addListener(async details => {
    chrome.storage.local.get(CARBON_DATA, async data => {
        if (!details.initiator) return;
        if (details.initiator.includes("localhost")) return;
        if (details.initiator.includes("chrome-extension")) return;
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
}, {urls: ["http://*/*", "https://*/*"]}, ["responseHeaders", "extraHeaders"]);

chrome.alarms.create("send_carbon_data", {
    periodInMinutes: 5
});

chrome.alarms.onAlarm.addListener(async alarm => {
    if (alarm.name !== "send_carbon_data") return;
    chrome.storage.local.get(CARBON_DATA, async carbon_data => {
        chrome.storage.local.get(LAST_SENT, async last_sent_data => {
            const toSend: any = {}
            const carbonData = carbon_data[CARBON_DATA];
            const last_sent = last_sent_data[LAST_SENT];
            const keys = Object.keys(carbonData);
            for (const key of keys) {
                if (carbonData[key] > last_sent[key] || !last_sent[key]) {
                    toSend[key] = carbonData[key] - (last_sent[key] || 0);
                    last_sent[key] = carbonData[key];
                }
            }
            if (Object.keys(toSend).length > 0) {
                try{
                    await fetch("https://sudip-mondal-2002-ideal-zebra-7x9r4gj6xrqcrx9q-3000.preview.app.github.dev/api/usage", {
                        method: "POST",
                        body: JSON.stringify(toSend),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                    await chrome.storage.local.set({
                        [LAST_SENT]: last_sent
                    });
                } catch (e) {
                    console.log(e);
                }
            }
        })
    })
});