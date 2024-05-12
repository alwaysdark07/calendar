import { useState } from 'react'
import './App.css'
import moment from 'moment'
import { useEffect } from 'react'
import { dateFormat } from './components/constants'
import CalendarCard from './components/CalendarCard'
import { GetCalendarMonthJson } from './service'

function App() {

  const [currentMonthAndYear, setcurrentMonthAndYear] = useState('')
  const [count, setcount] = useState(0)
  const [monthJson, setMonthJson] = useState([])
  const [cardState, setcardState] = useState(false)

  const getDate = str => str?.split("-")[0]

  const renderDate = (weekDay, o) => {
    // console.log(o[weekDay]);
    return <div>
      <span>
        {getDate(o[weekDay]?.date)}
        <div style={{ display: "flex" }}>
          {o[weekDay]?.tasks?.map((a, i) => <div key={i} style={{ width: "10px", height: "10px", backgroundColor: a?.color }}></div>)}
        </div>
      </span>
    </div>
  }

  const getMonthJson = (count) => {
    GetCalendarMonthJson({ count, dateFormat })?.then(resp => {
      console.log(resp);
      setMonthJson(resp?.data)
    })
  }

  useEffect(() => {
    // createMonthJson(count)
    if (
      !cardState
    ) {
      getMonthJson(count, dateFormat)
      setcurrentMonthAndYear(`${moment().add(count, 'month').format('MMMM')} ${moment().add(count, 'month').year()}`)
    }

  }, [count, cardState])

  return (
    <>

      <div className='calendar'>

        <div className="head">

          <span
            onClick={() => {
              !cardState && setcount(pre => pre - 1)
            }}
          >left</span>
          <span>{currentMonthAndYear}</span>
          <span
            onClick={() => {
              !cardState && setcount(pre => pre + 1)
            }}
          >right</span>

        </div>

        <div className='table'>
          {
            cardState
              ?
              <CalendarCard
                closeCard={() => setcardState(false)}

              />
              :
              <table>
                <tr>
                  <th>M</th>
                  <th>T</th>
                  <th>W</th>
                  <th>T</th>
                  <th>F</th>
                  <th>S</th>
                  <th>S</th>
                </tr>

                {
                  monthJson?.map((o, i) =>
                    <tr key={i}>

                      <th
                        onClick={() => {
                          setcardState(true)
                          localStorage.setItem('date', o?.Monday?.date)
                        }}
                      >
                        {renderDate('Monday', o)}
                      </th>

                      <th
                        onClick={() => {
                          setcardState(true)
                          localStorage.setItem('date', o?.Tuesday?.date)
                        }}
                      >
                        {renderDate('Tuesday', o)}
                      </th>

                      <th
                        onClick={() => {
                          setcardState(true)
                          localStorage.setItem('date', o?.Wednesday?.date)
                        }}
                      >
                        {renderDate('Wednesday', o)}
                      </th>

                      <th
                        onClick={() => {
                          setcardState(true)
                          localStorage.setItem('date', o?.Thursday?.date)
                        }}
                      >
                        {renderDate('Thursday', o)}
                      </th>

                      <th
                        onClick={() => {
                          setcardState(true)
                          localStorage.setItem('date', o?.Friday?.date)
                        }}
                      >
                        {renderDate('Friday', o)}
                      </th>

                      <th
                        onClick={() => {
                          setcardState(true)
                          localStorage.setItem('date', o?.Saturday?.date)
                        }}
                      >
                        {renderDate('Saturday', o)}
                      </th>

                      <th
                        onClick={() => {
                          setcardState(true)
                          localStorage.setItem('date', o?.Sunday?.date)
                        }}
                      >
                        {renderDate('Sunday', o)}
                      </th>

                    </tr>)
                }

              </table>
          }
        </div>

      </div>

    </>
  )
}

export default App