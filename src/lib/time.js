export function now() {
  const now = new Date();
  let day = now.getDay();
  if (day) {
    day -= 1;
  } else {
    day = 6;
  }
  const hour = now.getHours();
  const minutes = now.getMinutes() / 60;
  const time = hour + minutes;
  return [day, time];
}
