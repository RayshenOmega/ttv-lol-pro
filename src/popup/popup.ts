import { TWITCH_URL_REGEX } from "../common/ts/regexes";
import $ from "../common/ts/$";
import browser from "webextension-polyfill";
import store from "../store";

const streamStatusElement = $("#stream-status") as HTMLDivElement;
const redirectedElement = $("#redirected") as HTMLSpanElement;
const streamIdElement = $("#stream-id") as HTMLSpanElement;
const reasonElement = $("#reason") as HTMLElement;
const proxyCountryElement = $("#proxy-country") as HTMLElement;

store.addEventListener("load", async () => {
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  const activeTab = tabs[0];
  if (activeTab == null) return;
  if (activeTab.url == null) return;

  const match = TWITCH_URL_REGEX.exec(activeTab.url);
  if (match == null) return;
  const [_, streamId] = match;
  if (streamId == null) return;

  const status = store.state.streamStatuses[streamId];
  if (status != null) {
    streamStatusElement.style.display = "flex";
    if (status.redirected) {
      redirectedElement.classList.add("success");
    } else {
      redirectedElement.classList.add("error");
    }
    streamIdElement.textContent = streamId;
    if (status.reason) {
      reasonElement.textContent = status.reason;
    } else {
      reasonElement.style.display = "none";
    }
    if (status.proxyCountry) {
      proxyCountryElement.textContent = `Proxy Country: ${status.proxyCountry}`;
    } else {
      proxyCountryElement.style.display = "none";
    }
  }
});
