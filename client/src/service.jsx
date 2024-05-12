import axios from 'axios'

export async function GetCalendarMonthJson(payload) {
    try {
        const response = await axios.post('http://localhost:8000/', payload)
        return response
    } catch (err) {
        return err?.response
    }
}

// insert update task 
export async function InsertUpdateTask(payload) {
    try {
        const response = await axios.post('http://localhost:8000/InsertUpdateTask', payload)
        return response
    } catch (err) {
        return err?.response
    }
}

// get details of a date (events, tasks) using given date 
export async function GetDateDetails(payload) {
    try {
        const response = await axios.post('http://localhost:8000/GetDateDetails', payload)
        return response
    } catch (err) {
        return err?.response
    }
}

// delete task api
export async function deleteTask(payload) {
    try {
        const response = await axios.post('http://localhost:8000/deleteTask', payload)
        return response
    } catch (err) {
        return err?.response
    }
}