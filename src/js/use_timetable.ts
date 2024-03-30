import dayjs from "dayjs"
import { useTimetableForBetweenStopsQuery } from "../graphql/generated/graphql"
import { useEffect, useMemo, useRef, useState } from "react"

const limit = 100

function generateExecuteVariables(
  props: {
    fromStopUids: string[];
    topStopUids: string[];
    date: dayjs.Dayjs
  },
  pagination: {
    offset: number
    limit: number
  },
  options: {
    pause: boolean
  }
) {
  return {
    variables: {
      conditions: {
        transitStopUids: [props.fromStopUids, props.topStopUids],
        date: props.date.toISOString()
      },
      pagination: {
        offset: pagination.offset,
        limit: pagination.limit,
      }
    },
    pause: options.pause,
  }
}

interface Props {
  fromStopUids: string[]
  topStopUids: string[]
  date: dayjs.Dayjs
}

export const useTimetable = (props: Props) => {
  const [refresh, setRefresh] = useState(new Date().valueOf())

  const [offset, setOffset] = useState(0)
  const tmpTimetable = useRef<ReturnType<typeof useTimetableForBetweenStopsQuery>[0]['data']['timetable']['edges'][number][]>([])
  const [timetable, setTimetable] = useState<ReturnType<typeof useTimetableForBetweenStopsQuery>[0]['data']['timetable']['edges'][number][]>(null)

  const queryParameter = useMemo(() => generateExecuteVariables(
    props,
    {
      offset: offset,
      limit: limit
    }, {
    pause: true,
  }), [props.fromStopUids, props.topStopUids, props.date, offset])
  const [timetableResult, reExecute] = useTimetableForBetweenStopsQuery(queryParameter)

  useEffect(() => {
    reExecute({
      requestPolicy: 'network-only'
    })
  }, [refresh])

  useEffect(() => {
    setOffset(0)
    tmpTimetable.current = []
    setTimetable(null)
    setRefresh(new Date().valueOf())

  }, [props.fromStopUids, props.topStopUids, props.date])

  useEffect(() => {
    if (timetableResult.operation === undefined) return
    if (timetableResult.operation.variables.pagination.offset !== offset) return
    if (timetableResult.fetching) return

    tmpTimetable.current.push(...timetableResult.data.timetable.edges)

    if (timetableResult.data.timetable.pageInfo.hasNextPage) {
      setOffset(offset + limit)
      setRefresh(new Date().valueOf())
    } else {
      setTimetable(tmpTimetable.current)
    }
  }, [timetableResult.fetching])

  return { timetable }
}
