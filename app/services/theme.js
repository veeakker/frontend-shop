import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

const PREF_KEY = 'veeakker-theme';
const OS_KEY   = 'veeakker-theme-os';

function getCookie(name) {
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
}

function setCookie(name, value, maxAge = 31536000) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function deleteCookie(name) {
  setCookie(name, '', 0);
}

export default class ThemeService extends Service {
  @tracked preference;

  constructor() {
    super(...arguments);

    const osNow  = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    const osLast = getCookie(OS_KEY);
    const stored = getCookie(PREF_KEY) || localStorage.getItem(PREF_KEY) || 'auto';

    if (osLast && osLast !== osNow) {
      // OS preference changed since last visit — discard manual override
      this.preference = 'auto';
      deleteCookie(PREF_KEY);
      localStorage.removeItem(PREF_KEY);
    } else {
      this.preference = stored;
    }

    setCookie(OS_KEY, osNow);
    this._apply(this.preference);

    this._mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    this._onOsChange = () => {
      this.preference = 'auto';
      deleteCookie(PREF_KEY);
      localStorage.removeItem(PREF_KEY);
      setCookie(OS_KEY, this._mediaQuery.matches ? 'light' : 'dark');
      this._apply('auto');
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
    setCookie(PREF_KEY, next);
    localStorage.setItem(PREF_KEY, next);
    this._apply(next);
  }

  _apply(preference) {
    const root = document.documentElement;
    if (preference === 'light')      root.setAttribute('data-theme', 'light');
    else if (preference === 'dark')  root.setAttribute('data-theme', 'dark');
    else                             root.removeAttribute('data-theme');
  }
}
