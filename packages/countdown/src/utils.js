const ONE_SECOND = 1e3
const ONE_MINUTE = 60 * ONE_SECOND
const ONE_HOUR = 60 * ONE_MINUTE
const ONE_DAY = 24 * ONE_HOUR
const REGEX_FORMAT = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g

/* date */
/**
 * @param {string} formatter - 格式化占位符
 * @param {Object} timeData - 时间格式
 * @returns {string}
 */
export const formatTime = (formatter, timeData) => {
	const {
		days,
		hours,
		minutes,
		seconds,
		milliseconds
	} = timeData

	const matches = {
		D: days,
		DD: padStart(days, 2, '0'),
		H: hours,
		HH: padStart(hours, 2, '0'),
		m: minutes,
		mm: padStart(minutes, 2, '0'),
		s: seconds,
		ss: padStart(seconds, 2, '0'),
		SSS: padStart(milliseconds, 3, '0'),
	}

	return formatter.replace(REGEX_FORMAT, (match, $1) => $1 || matches[match])
}

export const parseTimeData = time => {
  return {
    days: Math.floor(time / ONE_DAY),
    hours: Math.floor(time % ONE_DAY / ONE_HOUR),
    minutes: Math.floor(time % ONE_HOUR / ONE_MINUTE),
    seconds: Math.floor(time % ONE_MINUTE / ONE_SECOND),
    milliseconds: Math.floor(time % ONE_SECOND)
  };
}

/* string */

const padStart = (string, length = 2, pad = 0) => {
  const s = String(string)
  if (!s || s.length >= length) return string
  return `${Array((length + 1) - s.length).join(pad)}${string}`
}
