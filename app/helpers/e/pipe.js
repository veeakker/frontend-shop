import { helper } from '@ember/component/helper';

export default helper(function ePipe(positional /*, named*/) {
  return async (...args) => {
    const [firstFunctor, ...otherFunctors] = positional;
    let lastResult = await firstFunctor.apply(this, args);
    for (const fct of otherFunctors) {
      lastResult = await fct.call(this, lastResult);
    }
    return lastResult;
  };
});
