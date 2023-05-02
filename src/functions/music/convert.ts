export default function convertTime(duration: number) {
  let seconds: number | string = (duration / 1000) % 60;
  let minutes: number | string = (duration / (1000 * 60)) % 60;
  const hours: number | string = (duration / (1000 * 60 * 60)) % 24;
  seconds = (seconds < 10) ? '0' + seconds : seconds;
  if (duration < 3600000) return Math.floor(minutes) + ':' + Math.floor(seconds);
  minutes = (minutes < 10) ? '0' + minutes : minutes;
  return Math.floor(hours) + ':' + Math.floor(minutes) + ':' + Math.floor(seconds);
}