import { tracked } from '@glimmer/tracking';
export default class ExternalPromise {
  @tracked resolved;
  @tracked rejected;
  @tracked promise;

  constructor() {
    this.reset();
  }

  reset() {
    this.resolved = undefined;
    this.rejected = undefined;
    this.promise = new Promise((res,rej) => {
      this.resolve = (val) => {
        this.resolved = val;
        res(val);
      };
      this.reject = (val) => {
        this.rejected = val;
        rej(val);
      };
    });
  }
}
