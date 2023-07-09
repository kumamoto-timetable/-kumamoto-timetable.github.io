import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import Select from 'react-select'
import * as Urql from 'urql'
import { useReactToPrint } from 'react-to-print'

import { accessTarget } from './access_target'

import { Language, NormalizeType, Order, useNormalizedStopsQuery, useRemotesQuery, VersionOrderColumn } from '../graphql/generated/graphql'
import { TimetableTable } from './timetable'

export interface ColourOption {
  readonly value: string;
  readonly label: string;
}

function App() {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [userInputted, setUserInputted] = useState<boolean>(false)

  const [fromSearchName, setFromSearchName] = useState(new URL(location.href).searchParams.get('fromName') ?? '')
  const [selectedFrom, setSelectedFromKey] = useState<{ label: string; key: string; value: string[] } | null>(null)

  const [toSearchName, setToSearchName] = useState(new URL(location.href).searchParams.get('toName') ?? '')
  const [selectedTo, setSelectedToKey] = useState<{ label: string; key: string; value: string[] } | null>(null)

  const handleExchange = useCallback(() => {
    setUserInputted(true)
    setFromSearchName(toSearchName)
    setSelectedFromKey(selectedTo)
    setToSearchName(fromSearchName)
    setSelectedToKey(selectedFrom)
  }, [fromSearchName, selectedFrom, toSearchName, selectedTo])

  const [remotes] = useRemotesQuery({
    variables: {
      where: {
        remoteUids: accessTarget.remoteUids
      },
      pagination: {
      },
      versionsPagination: {
        offset: 0,
        limit: 1
      },
      versionOrder: {
        column: VersionOrderColumn.CreatedAt,
        order: Order.Desc
      }
    }
  })
  const remoteUids = useMemo(() => remotes.data?.findRemotes.edges.map(remote => remote.versions.edges[0]?.uid).filter(e => e !== undefined) ?? [], [remotes.data])

  const [fromNormalizedStops] = useNormalizedStopsQuery({
    variables: {
      where: {
        remoteVersionUids: remoteUids,
        name: fromSearchName,
      },
      options: {
        groupBy: NormalizeType.Id,
        languages: [Language.Ja, Language.En],
      },
      stopsOptions: {
        languages: [Language.Ja, Language.En],
      },
      pagination: {
        limit: 20
      },
    }
  })
  const fromStops = useMemo(() => (fromNormalizedStops.data?.searchNormalizedStops.edges ?? []).map((normalizedStop) => ({ label: normalizedStop.name, key: normalizedStop.key, value: normalizedStop.stops.edges.map(s => s.uid) })), [fromNormalizedStops.data])
  const [toNormalizedStops] = useNormalizedStopsQuery({
    variables: {
      where: {
        remoteVersionUids: remoteUids,
        name: toSearchName,
      },
      options: {
        groupBy: NormalizeType.Id,
        languages: [Language.Ja, Language.En],
      },
      stopsOptions: {
        languages: [Language.Ja, Language.En],
      },
      pagination: {
        limit: 20
      },
    }
  })
  const toStops = useMemo(() => (toNormalizedStops.data?.searchNormalizedStops.edges ?? []).map((normalizedStop) => ({ label: normalizedStop.name, key: normalizedStop.key, value: normalizedStop.stops.edges.map(s => s.uid) })), [toNormalizedStops.data])

  useEffect(() => {
    if (!fromSearchName || !toSearchName || !fromNormalizedStops.data || !toNormalizedStops.data || userInputted) return

    if (0 < fromNormalizedStops.data.searchNormalizedStops.totalCount) {
      const stop = fromNormalizedStops.data.searchNormalizedStops.edges[0]
      setFromSearchName(stop.name)
      setUserInputted(true)
      setSelectedFromKey({
        label: stop.name,
        key: stop.key,
        value: stop.stops.edges.map(s => s.uid)
      })
    }

    if (0 < toNormalizedStops.data.searchNormalizedStops.totalCount) {
      const stop = toNormalizedStops.data.searchNormalizedStops.edges[0]
      setToSearchName(stop.name)
      setUserInputted(true)
      setSelectedToKey({
        label: stop.name,
        key: stop.key,
        value: stop.stops.edges.map(s => s.uid)
      })
    }
  }, [fromNormalizedStops.data, toNormalizedStops.data])

  return (
    <>
      <div className='controller'>
        <Select
          className='fromName'
          filterOption={null}
          options={fromStops}
          value={selectedFrom}
          onInputChange={(v, actionMeta) => {
            if (['input-change', 'set-value'].includes(actionMeta.action) === false) return
            setUserInputted(true)
            setFromSearchName(v)
            setSelectedFromKey(null)
          }}
          onChange={(selectedOption) => {
            setUserInputted(true)
            setFromSearchName(selectedOption.label)
            setSelectedFromKey(selectedOption)
          }}
          placeholder='出発地'
        />
        <Select
          className='toName'
          filterOption={null}
          options={toStops}
          value={selectedTo}
          onInputChange={(v, actionMeta) => {
            if (['input-change', 'set-value'].includes(actionMeta.action) === false) return
            setUserInputted(true)
            setToSearchName(v)
            setSelectedToKey(null)
          }}
          onChange={(selectedOption) => {
            setUserInputted(true)
            setToSearchName(selectedOption.label)
            setSelectedToKey(selectedOption)
          }}
          placeholder='停車地'
        />
        <button className='exchange' onClick={handleExchange}>⇅</button>
        <button className='print' disabled={selectedFrom === null || selectedTo === null} onClick={handlePrint}>印刷する</button>
      </div>
      {
        selectedFrom && selectedTo &&
        <div ref={componentRef} >
          <TimetableTable fromStop={{ label: selectedFrom.label, key: selectedFrom.key, uids: selectedFrom.value }} toStop={{ label: selectedTo.label, key: selectedTo.key, uids: selectedTo.value }} />
        </div>
      }
    </>
  )
}

const client = Urql.createClient({
  url: accessTarget.medas.url,
  fetchOptions: {
    headers: {
      Authorization: `Bearer ${accessTarget.medas.accessToken}`
    },
  },
})

const element = document.getElementById('root')
const root = createRoot(element)
root.render(<Urql.Provider value={client}><App /></Urql.Provider>)
