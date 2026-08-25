import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import config from 'veeakker/config/environment';

// veeakker and goedgekozen use their own keys plus an OS-auto default.
const STANDALONE = {
  pref: 'veeakker-theme',
  os: 'veeakker-theme-os',
  default: 'auto',
  resetOnOsChange: true
};
const GOEDGEKOZEN = {
  pref: 'goedgekozen-theme',
  os: 'goedgekozen-theme-os',
  default: 'light',
  resetOnOsChange: false
};

function getCookie(name) {
  if (!name) return null;
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
}

function setCookie(name, value, maxAge = 31536000) {
  if (!name) return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function deleteCookie(name) {
  setCookie(name, '', 0);
}

export default class ThemeService extends Service {
  @tracked preference;

  constructor() {
    super(...arguments);

    const isGoedgekozen =
      config.mainSite.enabled === 'false' && config.marketplaceBrand === 'goedgekozen';
    const cfg = isGoedgekozen ? GOEDGEKOZEN : STANDALONE;
    this._cfg = cfg;

    const osNow  = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    const osLast = getCookie(cfg.os);
    const stored = getCookie(cfg.pref) || localStorage.getItem(cfg.pref) || cfg.default;

    if (cfg.resetOnOsChange && osLast && osLast !== osNow) {
      // OS preference changed since last visit — discard manual override
      this.preference = 'auto';
      deleteCookie(cfg.pref);
      localStorage.removeItem(cfg.pref);
    } else {
      this.preference = stored;
    }

    setCookie(cfg.os, osNow);
    this._apply(this.preference);

    this._mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    this._onOsChange = () => {
      if (cfg.resetOnOsChange) {
        this.preference = 'auto';
        deleteCookie(cfg.pref);
        localStorage.removeItem(cfg.pref);
      }
      setCookie(cfg.os, this._mediaQuery.matches ? 'light' : 'dark');
      this._apply(this.preference);
    };
    this._mediaQuery.addEventListener('change', this._onOsChange);
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this._mediaQuery.removeEventListener('change', this._onOsChange);
  }

  get effectiveTheme() {
    if (this.preference !== 'auto') return this.preference;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  @action
  toggle() {
    const next = this.effectiveTheme === 'dark' ? 'light' : 'dark';
    this.preference = next;
    setCookie(this._cfg.pref, next);
    localStorage.setItem(this._cfg.pref, next);
    this._apply(next);
  }

  _apply(preference) {
    const effective = preference === 'auto'
      ? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
      : preference;

    document.documentElement.setAttribute('data-theme', effective);

    const meta = document.head.querySelector('meta[name="color-scheme"]');
    if (meta) {
      meta.content = effective === 'light' ? 'only light' : 'dark';
    }
  }
}
