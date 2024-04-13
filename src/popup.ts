import { Actions } from "./enums/Actions";

const keyElement = document.getElementById('key') as HTMLInputElement;
const promptElement = document.getElementById('prompt') as HTMLTextAreaElement;
const activeElement = document.getElementById('active') as HTMLInputElement
const saveButton = document.getElementById('save') as HTMLButtonElement;

saveButton.addEventListener('click', () => {
  const key = keyElement.value;
  const prompt = promptElement.value;
  const active = activeElement.checked;
  const data = { key, prompt, active };
  chrome.storage.sync.set(data, () => {
    chrome.runtime.sendMessage({ action: Actions.SET_KEY, data });
  });
});

chrome.storage.sync.get(['key', 'prompt', 'active'], (data) => {
  keyElement.value = data.key;
  promptElement.value = data.prompt;
  activeElement.checked = data.active;

  chrome.runtime.sendMessage({ action: Actions.SET_KEY, key: data });

});

const eyeOpenElement = document.getElementById('eye-open') as HTMLElement;
const eyeCloseElement = document.getElementById('eye-close') as HTMLElement;

document.getElementById('show-key').addEventListener('click', () => {
  keyElement.type = keyElement.type === 'password' ? 'text' : 'password';
  eyeOpenElement.style.display = eyeOpenElement.style.display === 'none' ? 'block' : 'none';
  eyeCloseElement.style.display = eyeCloseElement.style.display === 'none' ? 'block' : 'none';
});