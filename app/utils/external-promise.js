export default class ExternalPromise {
  constructor() {
    this.reset();
  }

  reset() {
    this.promise = new Promise((res,rej) => {
      this.resolve = res;
      this.reject = rej;
    });
  }
}
