export function combineDateAndTime(workDate: Date, time: string | Date): Date {
  const date = new Date(workDate);

  if (typeof time === 'string') {
    const [h, m, s = '0'] = time.split(':');
    date.setHours(Number(h), Number(m), Number(s), 0);
  } else {
    date.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), 0);
  }

  return date;
}
