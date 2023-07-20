import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import React, { useEffect, useRef } from "react";
import { useMemo } from "react";
import { useQRCode } from 'next-qrcode';
import { match } from 'ts-pattern'
import holidayJp from '@holiday-jp/holiday_jp'

import { useTimetableForBetweenStopsQuery } from "../graphql/generated/graphql";
import { timeStringToSeconds } from "./utils";

dayjs.extend(utc)

function isNullable(v: unknown) {
  return v === undefined || v === null
}

const specialDays = [
  '8/13',
  '8/14',
  '8/15',
  '12/29',
  '12/30',
  '12/31',
  '1/1',
  '1/2',
  '1/3',
]

function nextDay(type: 'weekday' | 'saturday' | 'holiday') {
  const baseDate = new URL(location.href).searchParams.get('startDate')
  let date = (baseDate ? dayjs(baseDate, 'YYYY-MM-DD') : dayjs()).startOf('day')
  while (true) {
    if (specialDays.includes(date.format('M/D'))) {
      date = date.add(1, 'day')
      continue
    }

    if (type === 'holiday') {
      if (holidayJp.isHoliday(date.toDate()) || [0].includes(date.day())) break
    } else if (type === 'weekday') {
      if (holidayJp.isHoliday(date.toDate()) === false && [1, 2, 3, 4, 5].includes(date.day())) break
    } else if (type === 'saturday') {
      if (holidayJp.isHoliday(date.toDate()) === false && [6].includes(date.day())) break
    }

    date = date.add(1, 'day')
  }

  return date;
}

type TimeTableData = [number, {
  uid: string;
  departure: {
    hour: number;
    minute: number;
  };
  routeIds: string[]
  route: {
    ids: string[],
    name: string
  }
  remote: {
    uid: string
  }
  stop: {
    platform: {
      code: string | null
    }
  }
  moveTimeSec: number
}[]]

function stopTimeTransform(stopTime: ReturnType<typeof useTimetableForBetweenStopsQuery>[0]['data']['timetable']['edges'][number][number]) {
  return match(stopTime)
    .with({ __typename: 'StopTimeArrivalInfo' }, stopTime => ({
      uid: stopTime.uid,
      departure: stopTime.a_departure,
      route: stopTime.route,
      headsign: stopTime.headsign,
      remote: {
        uid: stopTime.remoteVersion.remote.uid
      },
      stop: {
        platform: {
          code: stopTime.stop.platform?.code ?? null
        }
      }
    }))
    .with({ __typename: 'StopTimeDepartureInfo' }, stopTime => ({
      uid: stopTime.uid,
      departure: stopTime.d_departure,
      route: stopTime.route,
      headsign: stopTime.headsign,
      remote: {
        uid: stopTime.remoteVersion.remote.uid
      },
      stop: {
        platform: {
          code: stopTime.stop.platform?.code ?? null
        }
      }
    }))
    .with({ __typename: 'StopTimeInfo' }, stopTime => ({
      uid: stopTime.uid,
      departure: stopTime.departure,
      route: stopTime.route,
      headsign: stopTime.headsign,
      remote: {
        uid: stopTime.remoteVersion.remote.uid
      },
      stop: {
        platform: {
          code: stopTime.stop.platform?.code ?? null
        }
      }
    }))
    .run()
}

function transform(transit: ReturnType<typeof useTimetableForBetweenStopsQuery>[0]['data']['timetable']['edges'][number], firstTransit?: ReturnType<typeof useTimetableForBetweenStopsQuery>[0]['data']['timetable']['edges'][number]) {
  const fromStopTime = stopTimeTransform(transit[0])
  const toStopTime = stopTimeTransform(transit[1])

  const routeName = fromStopTime.route.longName ?? ''
  const routeIds = routeName.includes('：') ? routeName.split('：')[0].split('/') : [fromStopTime.headsign.slice(0, 4)]

  const moveTimeSec = timeStringToSeconds(toStopTime.departure.time) - timeStringToSeconds(fromStopTime.departure.time)

  let hour = 0
  if (firstTransit) {
    const firstFromStopTime = stopTimeTransform(firstTransit[0])
    const diffHour = dayjs(fromStopTime.departure.time).startOf('h').diff(dayjs(firstFromStopTime.departure.time).startOf('h'), 'hour')

    hour = dayjs(firstFromStopTime.departure.time).hour() + diffHour
  } else {
    hour = dayjs(fromStopTime.departure.time).hour()
  }

  return {
    uid: fromStopTime.uid,
    departure: {
      hour: hour,
      minute: dayjs(fromStopTime.departure.time).minute(),
    },
    routeIds: routeIds,
    route: {
      ids: routeIds,
      name: fromStopTime.headsign,
    },
    remote: {
      uid: fromStopTime.remote.uid
    },
    stop: {
      platform: {
        code: fromStopTime.stop.platform.code
      }
    },
    moveTimeSec: moveTimeSec,
  }
}

function timetableArray(rows: ReturnType<typeof transform>[]) {
  const result2: typeof rows[number][][] = [[]]
  rows.forEach((row) => {
    const prev = result2[result2.length - 1][result2[result2.length - 1].length - 1]
    if (prev === undefined) {
      result2[result2.length - 1][result2[result2.length - 1].length] = row
      return
    }

    const hourDiff = row.departure.hour - prev.departure.hour
    for (let i = 0; i < hourDiff; i++) {
      result2.push([])
    }

    result2[result2.length - 1].push(row)
  })

  if (result2[0].length === 0) return []

  const minHour = result2[0][0].departure.hour
  const result3 = result2.map((stopTimes, i) => ([minHour + i, stopTimes]))

  return result3
}

const remoteUidMap = {
  '9b1e8ca3-a9e9-4a23-a993-32fc7ba0c2bc': '熊',
  '56e25970-a23c-437f-8f49-d4af91bfc0f7': '産',
  'bb9ae20c-562b-4ade-b51f-cfa7ae667e08': '都',
  '4ec14a83-e52a-4657-b644-276ef21d2a80': '電',
} as const

const circleNumberMap = {
  '1': '①',
  '2': '②',
  '3': '③',
  '4': '④',
  '5': '⑤',
  '6': '⑥',
  '7': '⑦',
  '8': '⑧',
  '9': '⑨',
  '10': '⑩',
  '11': '⑪',
  '12': '⑫',
  '13': '⑬',
  '14': '⑭',
  '15': '⑮',
  '16': '⑯',
  '17': '⑰',
  '18': '⑱',
  '19': '⑲',
  '20': '⑳',
  '21': '㉑',
  '22': '㉒',
  '23': '㉓',
  '24': '㉔',
  '25': '㉕',
  '26': '㉖',
  '27': '㉗',
  '28': '㉘',
  '29': '㉙',
  '30': '㉚',
  '31': '㉛',
  '32': '㉜',
  '33': '㉝',
  '34': '㉞',
  '35': '㉟',
  '36': '㊱',
  '37': '㊲',
  '38': '㊳',
  '39': '㊴',
  '40': '㊵',
  '41': '㊶',
  '42': '㊷',
  '43': '㊸',
  '44': '㊹',
  '45': '㊺',
  '46': '㊻',
  '47': '㊼',
  '48': '㊽',
  '49': '㊾',
  '50': '㊿'
}

export function TimetableTable(props: {
  fromStop: { label: string, key: string, uids: string[]; }
  toStop: { label: string, key: string, uids: string[]; }
  checkboxes: { destination: boolean, routeId: boolean, companyName: boolean }
}) {
  const { Canvas } = useQRCode();

  const propsLastChangedAt = useRef<number>(0);
  const timetableLastChangedAt = useRef<number>(0);

  useEffect(() => {
    propsLastChangedAt.current = new Date().valueOf();
  }, [props.fromStop.label, props.toStop.label]);

  const [monday] = useTimetableForBetweenStopsQuery({
    variables: {
      conditions: {
        transitStopUids: [props.fromStop.uids, props.toStop.uids],
        date: nextDay('weekday').startOf('day').toISOString()
      },
      pagination: {
        offset: 0,
        limit: 50
      }
    }
  })
  const [saturday] = useTimetableForBetweenStopsQuery({
    variables: {
      conditions: {
        transitStopUids: [props.fromStop.uids, props.toStop.uids],
        date: nextDay('saturday').startOf('day').toISOString()
      },
      pagination: {
        offset: 0,
        limit: 50
      }
    }
  })
  const [sunday] = useTimetableForBetweenStopsQuery({
    variables: {
      conditions: {
        transitStopUids: [props.fromStop.uids, props.toStop.uids],
        date: nextDay('holiday').startOf('day').toISOString()
      },
      pagination: {
        offset: 0,
        limit: 50
      }
    }
  })

  const timetables = useMemo(() => {
    if (isNullable(monday.data) || isNullable(saturday.data) || isNullable(sunday.data)) return null
    if (monday.data.timetable.totalCount === 0 && saturday.data.timetable.totalCount === 0 && sunday.data.timetable.totalCount === 0) return []

    const days = [
      timetableArray((monday.data?.timetable.edges ?? []).map((transit) => transform(transit, monday.data.timetable.edges[0]))) as TimeTableData[],
      timetableArray((saturday.data?.timetable.edges ?? []).map((transit) => transform(transit, saturday.data?.timetable.edges[0]))) as TimeTableData[],
      timetableArray((sunday.data?.timetable.edges ?? []).map((transit) => transform(transit, sunday.data?.timetable.edges[0]))) as TimeTableData[],
    ]

    let minHour = 23
    days.forEach(timetable => {
      if (timetable.length === 0) return
      if (timetable[0][0] < minHour) minHour = timetable[0][0]
    })
    days.forEach(timetable => {
      if (timetable.length === 0) {
        timetable.unshift([minHour, []])

        return
      }

      const minHourDiff = timetable[0][0] - minHour
      for (let i = 0; i < minHourDiff; i++) {
        timetable.unshift([timetable[0][0] - 1, []])
      }
    })

    let maxHour = 0
    days.forEach(timetable => {
      if (maxHour < timetable[timetable.length - 1][0]) maxHour = timetable[timetable.length - 1][0]
    })
    days.forEach(timetable => {
      const maxHourDiff = maxHour - timetable[timetable.length - 1][0]
      for (let i = 0; i < maxHourDiff; i++) {
        timetable.push([timetable[timetable.length - 1][0] + 1, []])
      }
    })

    if (days[0].length !== days[1].length || days[1].length !== days[2].length) return []

    const result: [number, [TimeTableData[1], TimeTableData[1], TimeTableData[1]]][] = []
    days[0].forEach((_, i) => [
      result.push([days[0][i][0], [days[0][i][1], days[1][i][1], days[2][i][1]]])
    ])
    return result
  }, [monday.data, saturday.data, sunday.data])

  const moveCenterTimeSec = useMemo(() => {
    if (isNullable(monday.data) || isNullable(saturday.data) || isNullable(sunday.data)) return null

    const moveCenterTimes =
      [
        ...(monday.data?.timetable.edges ?? []),
        ...(saturday.data?.timetable.edges ?? []),
        ...(sunday.data?.timetable.edges ?? [])
      ].map((transit) => transform(transit).moveTimeSec).sort((a, b) => a - b)

    const half = Math.floor(moveCenterTimes.length / 2);

    if (moveCenterTimes.length % 2) {
      return moveCenterTimes[half];
    } else {
      return (moveCenterTimes[half - 1] + moveCenterTimes[half]) / 2;
    }
  }, [monday.data, saturday.data, sunday.data])

  useEffect(() => {
    timetableLastChangedAt.current = new Date().valueOf();
  }, [timetables, moveCenterTimeSec]);

  if (timetables === null || timetableLastChangedAt.current < propsLastChangedAt.current)
    return (
      <div>
        時刻表を生成中です... しばらくお待ち下さい
      </div>
    )

  const url = new URL(location.href);
  url.searchParams.set('fromName', props.fromStop.label)
  url.searchParams.set('toName', props.toStop.label)
  url.searchParams.set('displayDestination', props.checkboxes.destination ? 'on' : 'off');
  url.searchParams.set('displayRouteId', props.checkboxes.routeId ? 'on' : 'off')
  url.searchParams.set('displayCompanyName', props.checkboxes.companyName ? 'on' : 'off')
  history.replaceState(null, null, url.href)

  if (timetables.length === 0) return (
    <div>
      この停留所区間は運行しておりません
    </div>
  )

  const qrUrl = `https://km.bus-vision.jp/kumamoto/view/approach.html?stopCdFrom=${props.fromStop.key}&stopCdTo=${props.toStop.key}`

  return (
    <div className='timetable'>
      <div className='timetable_header'>
        <div className='timetable_header_route_name'>{props.fromStop.label} → {props.toStop.label}</div>
        <div className='timetable_header_description'>所要約 <span className='timetable_header_description_minutes'>{moveCenterTimeSec / 60}</span> 分（経路・時間帯・交通状況により前後します）<>< br /><span>下線細字：所要時間が長い便です</span></></div>
        <div className='timetable_header_qr_description'><div className="center">リアル<br />タイム<br />情報▶</div></div>
        <div className="timetable_header_qr">
          <a href={qrUrl} target="_blank" rel="noopener">
            <Canvas
              text={qrUrl}
              options={{
                type: 'image/png',
                quality: 1,
                level: 'M',
                margin: 4,
                scale: 2,
                color: {
                  dark: '#000000FF',
                  light: '#FFFFFFFF',
                },
              }}
            />
          </a>
        </div>
      </div>
      <div style={{
        width: '100%',
        display: 'flex',
      }}>
        <div className="table">
          <div className="table_header">
            <div className="table_header_hour">時</div>

            <div className="table_header_col_wrap">
              <div className="table_header_col weekday">
                <span className="day_name">平日</span><span className="day">（{nextDay('weekday').format('YYYY/MM/DD')}）</span>
              </div>
              <div className="table_header_col saturday">
                <span className="day_name">土曜</span><span className="day">（{nextDay('saturday').format('YYYY/MM/DD')}）</span>
              </div>
              <div className="table_header_col sunday">
                <span className="day_name">日祝</span><span className="day">（{nextDay('holiday').format('YYYY/MM/DD')}）</span>
              </div>
            </div>

            <div className="table_header_hour_right">時</div>
          </div>
          {timetables.map(([hour, timetable], hourIndex) => <>
            <div className="hour_group">
              <div className="hour">{String(hour).padStart(2, '0')}</div>

              <div className="minutes_group">
                {timetable.map((minutes, i) => {
                  const dayName = i === 0 ? 'weekday' : i === 1 ? 'saturday' : 'sunday'

                  const includedPlatformCode = minutes.some(minute => minute.stop.platform.code !== null)
                  const widthType = includedPlatformCode && props.checkboxes.companyName ? '2' : props.checkboxes.companyName || props.checkboxes.routeId ? '1' : '0'

                  return <div className={`minutes minute_width_${widthType} ${dayName} ${dayName}_${hourIndex % 2}`}>
                    {minutes.map((minute) => {
                      // 中央値×2.0以上 AND 中央値+20以上 → 除外　…桜町→市役所で52分などは除外される
                      if (moveCenterTimeSec * 2.0 <= minute.moveTimeSec && moveCenterTimeSec + 60 * 20 <= minute.moveTimeSec) return

                      // 中央値×1.5以上 AND 中央値+10以上 → 色づけ　…中央病院、健軍・県庁周りが色づけ
                      const minute_style = moveCenterTimeSec * 1.5 <= minute.moveTimeSec && moveCenterTimeSec + 60 * 10 <= minute.moveTimeSec ? 'long_time' : ''

                      return (
                        <div key={minute.uid} className="minute_wrap">
                          <div className={`company_name ${props.checkboxes.companyName ? '' : 'none'}`}>{remoteUidMap[minute.remote.uid]}</div>
                          <div className="stop_platform_code">{circleNumberMap[minute.stop.platform.code]}</div>
                          <div className={`minute ${minute_style}`}>{String(minute.departure.minute).padStart(2, '0')}</div>
                          <div className={`route_name ${props.checkboxes.destination ? '' : 'none'}`}>{minute.route.name.split('（')[0].slice(0, 5)}</div>
                          <div className={`route_id ${props.checkboxes.routeId ? '' : 'none'}`}>{minute.routeIds.join('/')}</div>
                        </div>
                      )
                    })}
                  </div>
                })}

                <div className="hour_right">
                  <div className="center">
                    {String(hour).padStart(2, '0')}
                  </div>
                </div>
              </div>
            </div>
          </>)}
        </div>
      </div>
    </div >
  )
}
