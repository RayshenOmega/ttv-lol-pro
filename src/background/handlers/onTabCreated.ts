import { Tabs } from "webextension-polyfill";
import getHostFromUrl from "../../common/ts/getHostFromUrl";
import isChromium from "../../common/ts/isChromium";
import { updateProxySettings } from "../../common/ts/proxySettings";
import { twitchTvHostRegex } from "../../common/ts/regexes";
import isChannelWhitelisted from "../../common/ts/isChannelWhitelisted";
import store from "../../store";

export default function onTabCreated(tab: Tabs.Tab): void {
  if (!tab.url || tab.id == null) return;
  const host = getHostFromUrl(tab.url);
  if (host != null && twitchTvHostRegex.test(host)) {
    console.log(`➕ Opened Twitch tab: ${tab.id}`);
    if (isChromium) {
      var isNonWhitelistedChannel = true;
      const url = new URL(tab.url);
      if (url.pathname && url.pathname.length > 0) {
        isNonWhitelistedChannel = !isChannelWhitelisted(url.pathname.substring(1));
      }
      if (isNonWhitelistedChannel && !store.state.chromiumProxyActive) updateProxySettings();
    }
    store.state.openedTwitchTabs.push(tab.id);
  }
}
