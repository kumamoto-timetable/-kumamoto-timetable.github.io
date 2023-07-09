import dayjs from 'dayjs'

export function timeStringToSeconds(iso8601: string) {
  const date = dayjs(iso8601)
  const hour = date.hour()
  const minute = date.minute()
  const seconds = date.second()

  return (
    hour * 60 * 60 + // hour to seconds
    minute * 60 + // minute to seconds
    seconds
  )
}
