// ==UserScript==
// @name               YouTube Boost Chat YT名稱修復 Nickname Restoration for YouTube Boost Chat
// @namespace          UserScripts
// @version            0.1.2
// @match              https://*.youtube.com/live_chat*
// @grant              none
// @author             CY Fung + lisheng099 + Pekoradaisuki0112 / AI
// @run-at             document-start
// @grant              none
// @unwrap
// @allFrames          true
// @inject-into        page
// @description        Full Replacement of YouTube Chat Message List with Nickname Restoration
// @description:ja     YouTube Boost Chat ニックネーム復元
// @description:zh-TW  YouTube Boost Chat 暱稱還原
// @description:zh-CN  YouTube Boost Chat 昵称还原
// ==/UserScript==


// Nickname Restoration Integration
const NicknameRestorer = {
  cache: new Map(),
  pendingRequests: new Map(),
  storageKey: 'ytNicknameCache',
  defaultTTL: 15 * 24 * 60 * 60 * 1000, // 15 days

  init() {
    this.loadCache();
    // Auto-save cache every 30 seconds
    setInterval(() => this.saveCache(), 30000);
  },

  loadCache() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        // Convert back to Map and check expiry
        Object.entries(data).forEach(([handle, entry]) => {
          if (Date.now() - entry.timestamp < this.defaultTTL) {
            this.cache.set(handle, entry);
          }
        });
      }
    } catch (e) {
      console.error('Failed to load nickname cache:', e);
    }
  },

  saveCache() {
    try {
      const data = {};
      this.cache.forEach((entry, handle) => {
        data[handle] = entry;
      });
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save nickname cache:', e);
    }
  },

  async getNickname(handle) {
    if (!handle || !handle.startsWith('@')) return null;

    // Check cache first
    const cached = this.cache.get(handle);
    if (cached && Date.now() - cached.timestamp < this.defaultTTL) {
      return cached.name;
    }

    // Check if request is already pending
    if (this.pendingRequests.has(handle)) {
      return this.pendingRequests.get(handle);
    }

    // Start new request
    const promise = this.fetchNickname(handle);
    this.pendingRequests.set(handle, promise);

    try {
      const result = await promise;
      this.pendingRequests.delete(handle);
      return result;
    } catch (e) {
      this.pendingRequests.delete(handle);
      throw e;
    }
  },

  async fetchNickname(handle) {
    const cleanHandle = handle.replace(/^@/, '');
    const targetUrl = `https://www.youtube.com/@${encodeURIComponent(cleanHandle)}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(targetUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept-Language': 'zh-TW',
          'Cache-Control': 'no-cache'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();
      const name = this.parseChannelName(html);

      if (name && name !== 'YouTube') {
        // Cache the result
        this.cache.set(handle, {
          name: name,
          timestamp: Date.now()
        });
        return name;
      }

      return null;
    } catch (e) {
      console.error('Failed to fetch nickname for', handle, e);
      return null;
    }
  },

  parseChannelName(html) {
    try {
      // Extract ytInitialData
      const jsonMatch = html.match(/ytInitialData\s*=\s*({.+?});/);
      if (!jsonMatch) return null;

      const jsonData = JSON.parse(jsonMatch[1]);

      // Navigate to channel name
      const pageHeader = jsonData.header?.pageHeaderRenderer?.content?.pageHeaderViewModel;
      if (pageHeader) {
        return pageHeader.title?.dynamicTextViewModel?.text?.content;
      }

      return null;
    } catch (e) {
      console.error('Failed to parse channel name:', e);
      return null;
    }
  },

  cleanup() {
    this.cache.clear();
    this.pendingRequests.clear();
  },
  info(handle) {

    let cachedName;

    if (typeof handle === "string" && handle.startsWith("@")) {
      const cached = this.cache.get(handle);
      if (cached && Date.now() - cached.timestamp < this.defaultTTL) {
        cachedName = cached.name;
      }

      return {
        handleName: handle,
        cachedName,
        request: NicknameRestorer.request
      }
    }

  }
};

NicknameRestorer.request = function (handleName) {
  return NicknameRestorer.getNickname(this.handleName || handleName);
}

// Initialize nickname restorer
NicknameRestorer.init();

if (!window.getYtAuthorClassicNameByHandle) {
  window.getYtAuthorClassicNameByHandle = (handle) => NicknameRestorer.info(handle);
}
