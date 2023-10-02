export default function wait(time) {
  return new Promise((success) => {
    window.setTimeout( success, time );
  });
}
