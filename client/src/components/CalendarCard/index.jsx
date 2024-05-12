import { useEffect, useState } from 'react'
import './card.css'
import AddEditTaskComp from '../AddEditTaskComp'
import { GetDateDetails, deleteTask } from '../../service'
import moment from 'moment'
import { dateFormat } from '../constants'

export default function CalendarCard({ closeCard }) {

    const [showTaskComp, setshowTaskComp] = useState(false)
    const [dateDetails, setdateDetails] = useState([])
    const [taskData, settaskData] = useState(null)

    const dateDetailsGet = () => {
        GetDateDetails(
            {
                date: localStorage.getItem('date'),
                dateFormat
            }
        )?.then(resp => {
            setdateDetails(resp?.data?.data)
        })
    }

    const deleteTaskFn = (taskId) => {
        deleteTask({
            taskId,
            date: localStorage.getItem('date'),
            dateFormat
        })?.then(resp => {
            console.log(resp);

            if (
                resp?.data?.statusCode == 200
              ) {
                // alert(resp?.data?.statusMsg)
                setshowTaskComp(false)
                dateDetailsGet()
              }
              else {
                alert(resp?.data?.statusMsg)
              }
        })
    }

    useEffect(() => {
        dateDetailsGet()
    }, [localStorage.getItem('operationType')])

    return (
        <div>
            <button onClick={closeCard}>&times;</button>
            <section className="articles">
                <article>
                    <div className="article-wrapper">
                        {/* <figure>
                            <img src="https://picsum.photos/id/1011/800/450" alt="" />
                        </figure> */}
                        <div className="article-body">
                            <h2>{localStorage.getItem('date')}</h2>

                            <h4>Events</h4>
                            <p>
                                * Event 1
                                <br />
                                * Event 2
                            </p>

                            <h4 style={{ display: "flex", justifyContent: "space-between" }}><span>Tasks</span> <span onClick={e => {
                                setshowTaskComp(true)
                                localStorage.setItem('operationType', "I")
                            }}>+</span></h4>
                            {
                                showTaskComp
                                    ?
                                    <AddEditTaskComp
                                        setshowTaskComp={setshowTaskComp}
                                        taskData={taskData}
                                    />
                                    :
                                    <p>
                                        {/* * Task 1
                                        <br />
                                        * Task 2 */}
                                        {
                                            dateDetails?.tasks?.map((e, i, a) => {
                                                return (
                                                    <div key={i} style={{ display: "flex", justifyContent: "space-between", border: "1px solid black", paddingLeft: "5px" }}>
                                                        <div style={{ display: "flex" }}>
                                                            <div style={{ width: "10px", height: "10px", backgroundColor: e?.color, marginRight: "10px", marginTop: "7px" }}></div>
                                                            {`${e?.taskName} - ${e?.taskDesc}`}
                                                        </div>
                                                        {i != a?.length - 1 && <br />}
                                                        <span onClick={eve => {
                                                            settaskData(e)
                                                            localStorage.setItem('operationType', "U")
                                                            localStorage.setItem('taskId', e?.taskId)
                                                            setshowTaskComp(true)
                                                        }}>EDIT</span>
                                                        <span
                                                            onClick={eve => {
                                                                deleteTaskFn(e?.taskId)
                                                            }}
                                                        >
                                                            DELETE
                                                        </span>
                                                    </div>
                                                )
                                            })
                                        }

                                    </p>
                            }

                        </div>
                    </div>
                </article>
            </section>
        </div >
    )
}
