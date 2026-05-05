import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

const KEY = 'veeakker-theme';

export default class ThemeService extends Service {
  @tracked preference = localStorage.getItem(KEY) || 'auto';

  constructor() {
    super(...arguments);
    this._apply(this.preference);
  }

  get effectiveTheme() {
    if (this.preference !== 'auto') return this.preference;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  @action
  toggle() {
    const next = this.effectiveTheme === 'dark' ? 'light' : 'dark';
    this.preference = next;
    localStorage.setItem(KEY, next);
    this._apply(next);
  }

  _apply(preference) {
    const root = document.documentElement;
    if (preference === 'light') root.setAttribute('data-theme', 'light');
    else if (preference === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
  }
}
