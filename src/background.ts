import { GoogleGenerativeAI } from "@google/generative-ai"
import { Actions } from "./enums/Actions";
let initialMessage = `Write a LinkedIn comment on given LinkedIn Post test in English. Comment should be consist of 1 to 2 lines and in Appriciavtive Manner.  do not add emojis.  Please add no prasing words in the beginning! make it a healty conversation. "


`;

let key = '';
let active = false;

const run = async (prompt: string) => {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(initialMessage + prompt);
    const response = result.response;
    const text = response.text();
    return text;
  }

let genAI: GoogleGenerativeAI;

let activatedTabId: number;

// chrome.runtime.onInstalled.addListener(() => {
//     chrome.storage.sync.set({ key: '', prompt: initialMessage, active: false });
//     console.log('Default configuration set');
// });

if (!chrome.tabs.onActivated.hasListeners()) {
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, _tab) {
        activatedTabId = tabId;
        if (changeInfo.status == 'complete') {
            chrome.storage.sync.get(['key', 'prompt', 'active'], (data) => {
                key = data.key;
                active = data.active;
                initialMessage = data.prompt;
                genAI = new GoogleGenerativeAI(key);
            });
            chrome.tabs.sendMessage(tabId, { action: Actions.START });
        }
        if (!chrome.runtime.onMessage.hasListeners()) {
            chrome.runtime.onMessage.addListener(async (request, _sender, sendResponse) => {
                console.log('background.ts received message', request);
                if (request.action === Actions.DESCRIPTION) {
                    if (!active || !key) {
                        return;
                    }
                    const description = request.description;
                    const result = await run(description)
                    console.log('background.ts sending response', result);
                    chrome.tabs.sendMessage(activatedTabId, { action: Actions.COMMENT, comment: result });
                }
                if (request.action === Actions.SET_KEY) {
                    chrome.storage.sync.get(['key', 'prompt', 'active'], (data) => {
                        key = data.key;
                        active = data.active;
                        initialMessage = data.prompt;
                        genAI = new GoogleGenerativeAI(key);
                    });
                }
            });
        }

        if (!chrome.storage.onChanged.hasListeners()) {
            chrome.storage.onChanged.addListener((changes, _areaName) => {
                if (changes.key) {
                    key = changes.key.newValue;
                    genAI = new GoogleGenerativeAI(key);
                }
                if (changes.prompt) {
                    initialMessage = changes.prompt.newValue;
                }
                if (changes.active) {
                    active = changes.active.newValue;
                }
            });
        }
    });
}

chrome.tabs.onRemoved.addListener((tabId, _detachInfo) => {
    if (tabId === activatedTabId) {
        activatedTabId = 0;
    }

    chrome.runtime.onMessage.removeListener(() => {
        console.log('Removed listener');
    });

    chrome.storage.onChanged.removeListener(() => {
        console.log('Removed listener');
    });
});

chrome.tabs.onDetached.addListener((tabId, _detachInfo) => {
    if (tabId === activatedTabId) {
        activatedTabId = 0;
    }

    chrome.runtime.onMessage.removeListener(() => {
        console.log('Removed listener');
    });

    chrome.storage.onChanged.removeListener(() => {
        console.log('Removed listener');
    });
});