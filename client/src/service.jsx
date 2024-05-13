import axios from 'axios'

export async function GetCalendarMonthJson(payload) {
    try {
        const response = await axios.post('https://calendar-server-dusky.vercel.app/', payload)
        return response
    } catch (err) {
        return err?.response
    }
}

// insert update task 
export async function InsertUpdateTask(payload) {
    try {
        const response = await axios.post('https://calendar-server-dusky.vercel.app/InsertUpdateTask', payload)
        return response
    } catch (err) {
        return err?.response
    }
}

// get details of a date (events, tasks) using given date 
export async function GetDateDetails(payload) {
    try {
        const response = await axios.post('https://calendar-server-dusky.vercel.app/GetDateDetails', payload)
        return response
    } catch (err) {
        return err?.response
    }
}

// delete task api
export async function deleteTask(payload) {
    try {
        const response = await axios.post('https://calendar-server-dusky.vercel.app/deleteTask', payload)
        return response
    } catch (err) {
        return err?.response
    }
}