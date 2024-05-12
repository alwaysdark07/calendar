import React, { useEffect, useState } from 'react'
import { InsertUpdateTask } from '../../service';
import { dateFormat } from '../constants';
import moment from 'moment'

export default function AddEditTaskComp({ setshowTaskComp, taskData }) {

  const [taskName, settaskName] = useState("")
  const [taskDesc, settaskDesc] = useState("")
  const [color, setcolor] = useState("")

  const saveFn = () => {

    console.log(taskName, taskDesc);

    if (
      taskName && taskDesc
    ) {
      let operationType = localStorage.getItem('operationType') == "U" ? "U" : localStorage.getItem('operationType') == "I" ? "I" : !localStorage.getItem('operationType') && "I"

      InsertUpdateTask({
        taskId: localStorage.getItem('taskId'),
        operationType,
        dateFormat,
        date: localStorage.getItem('date'),
        taskName,
        taskDesc,
        color: operationType == "I" ? (color || "#000000") : color
      }).then(resp => {
        console.log(resp);
        if (
          resp?.data?.statusCode == 200
        ) {
          // alert(resp?.data?.statusMsg)
          setshowTaskComp(false)
          localStorage.setItem('operationType', "")
        }
        else {
          alert(resp?.data?.statusMsg)
        }
      })
    }
    else {
      alert('Invalid Task')
    }
  }

  useEffect(() => {
    console.log(taskData);
    settaskName(taskData?.taskName)
    settaskDesc(taskData?.taskDesc)
    setcolor(taskData?.color)
  }, [])


  return (
    <div>
      {/* {JSON.stringify(taskData)} */}
      <h5 onClick={e => setshowTaskComp(false)}>back</h5>
      Name:
      <input
        name="taskName"
        value={taskName}
        onChange={e => {
          settaskName(e.target.value)
        }}
      />

      Description:
      <input
        name="taskDesc"
        value={taskDesc}
        onChange={e => {
          settaskDesc(e.target.value)
        }} />

      Color:
      <input type='color' name="color" value={color} onChange={e => {
        setcolor(e.target.value)
      }} />

      <button onClick={e => {
        saveFn()
      }}>SAVE</button>
    </div >
  )
}
