/*
 * 5 elements
 * each element split by space
 * order matters
 *
 * minute (0-59)
 * hour (0-23)
 * day of month (1-31)
 * month (1-12)
 * day of week (0-6, 0 is Sunday)
 *
 * each element can be split by
 * - comma (,) to specify multiple values
 * - dash (-) to specify a range
 * - asterisk (*) to specify all values
 * - slash (/) to specify increments
*/

const RULES = [
  { range: [0, 59] },
  { range: [0, 23] },
  { range: [1, 31] },
  { range: [1, 12] },
  { range: [0, 6] }
]

export const parseAsterisk = (index) => {
  const result = [];

  // return all values in the range
  for (let i = RULES[index].range[0]; i <= RULES[index].range[1]; i++) {
    result.push(i);
  }

  return result;
}

export const parseRange = (part, index) => {
  const result = [];

  // split by dash and parse the range
  const range = part.split('-').map(n => Number(n.trim()));
  if (range.length !== 2 || range[0] > range[1]) {
    throw new Error(`Invalid range in part: ${part}`);
  }

  if (range[0] < RULES[index].range[0] || range[1] > RULES[index].range[1]) {
    throw new Error(`Range out of bounds in part: ${part}`);
  }

  for (let i = range[0]; i <= range[1]; i++) {
    result.push(i);
  }

  return result;
}

export const parseComma = (part, index) => {
  const result = [];

  // split by comma and parse each value
  const values = part.split(',');
  for (let i = 0; i < values.length; i++) {
    result.push(...parsePart(values[i].trim(), index));
  }

  return result;
}

export const parseSteps = (part, index) => {
  const result = [];
  // split by slash and find each combination
  const [ range, step ] = part.split('/').map((n, index) => {
    if (index === 0) {
      return parsePart(n, index);
    }

    return Number(n.trim());
  });

  for (let i = RULES[index].range[0]; i <= RULES[index].range[1]; i += step) {
    if (!range.includes(i)) {
      continue;
    }

    if (i < RULES[index].range[0]) {
      continue;
    }

    result.push(i);
  }

  return result;
}

export const parsePart = (part, index) => {
  if (part === '*') {
    return parseAsterisk(index);
  }

  if (part.includes(',')) {
    return parseComma(part, index);
  }

  if (part.includes('/')) {
    return parseSteps(part, index);
  }

  if (part.includes('-')) {
    return parseRange(part, index);
  }

  const num = Number(part.trim());
  if (num < RULES[index].range[0] || num > RULES[index].range[1]) {
    throw new Error(`Number out of bounds in part: ${part}`);
  }

  return [num];
}

export const parseCronExpression = (pattern) => {
  const parts = pattern.split(' ');

  if (parts.length !== 6) {
    throw new Error('Invalid cron pattern: must have exactly 6 parts');
  }

  const [
    minutes,
    hours,
    dayOfMonth,
    months,
    daysOfWeek,
    command
  ] = parts.map((part, index) => {
    if (index === 5) {
      return part;
    }

    return parsePart(part, index);
  });

  return {
    minutes,
    hours,
    days_of_month: dayOfMonth,
    months,
    days_of_week: daysOfWeek,
    command,
  };
};

export default parseCronExpression;
