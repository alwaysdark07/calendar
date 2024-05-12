import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import * as path from 'path'
import { connectDB } from "./connectDB.js"
import { calendarCollection } from "./models/calendarCollection.js"
import createMonthJson from './utilities/GetMonthJSON/index.js'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid';
import { log } from 'console'

connectDB()
const app = express()
const port = process.env.PORT || 8000
app.use(cors())
// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }))

// api for getcalendarmonthjson
app.post('/', async (req, res) => {

    let calendarCollectionData = await calendarCollection?.find({})
    let finalData = createMonthJson(req.body.count, req.body.dateFormat, calendarCollectionData)
    res.send(finalData)
})

app.post('/GetDateDetails', async (req, res) => {

    // required monthName, date, tasks, color


    // console.log(req?.body?.date);
    let { date, dateFormat } = req?.body
    let cond = `${moment(date, dateFormat).format('MMMM')}_${moment(date, dateFormat).year()}`

    try {

        const temp = await calendarCollection.find({ [cond]: { $exists: true } })

        let data = temp[0][cond]?.find(e => e?.date == date)

        // console.log(data);

        if (!data) {
            throw new Error('Error occured while fetching data')
        }

        // console.log(data)


        res.status(200).json({ statusCode: 200, data })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error occured while fetching ' })
    }
})

function UpdateRecord(temp, res, operationType) {

    // console.log(temp);

    let objIdToDelete = temp[0]['_id']

    // console.log(objIdToDelete);

    calendarCollection?.findByIdAndDelete(objIdToDelete)
        .then(deletedDocument => {
            console.log(deletedDocument);
            if (deletedDocument) {
                console.log("Document deleted successfully:", deletedDocument);

                // after successfully deleting document, now insert the updated document

                calendarCollection.insertMany(temp[0])?.then(resp => {
                    console.log(resp);

                    res.status(200).json({ statusCode: 200, data: resp, statusMsg: `Record ${operationType == "I" ? "Inserted" : operationType == "U" ? "Updated" : !operationType && "deleted"} Successfully` })

                }).catch(err => {
                    console.log(err);
                    res.status(500).json({ statusCode: 500, data: err })
                })

            } else {
                console.log("Document not found.");
            }
        })
        .catch(err => {
            console.error("Error deleting document:", err);
        });
}

app.post('/InsertUpdateTask', async (req, res) => {
    try {

        const { operationType, date, dateFormat, taskName, taskDesc, color, taskId } = req?.body
        let year = moment(date, dateFormat).year()
        let cond = `${moment(date, dateFormat).format('MMMM')}_${year}`



        if (operationType == "I") {

            calendarCollection.find({ [cond]: { $exists: true } })
                .then(foundDocument => {
                    // console.log(foundDocument);

                    if (foundDocument.length == 1) {

                        let temp = [...foundDocument]

                        let checkIfDateExists = temp[0][cond]?.find(e => e?.date == date)

                        let index = temp[0][cond]?.indexOf(checkIfDateExists)

                        if (checkIfDateExists) {

                            // check if taskname and taskdescc already exists
                            if (
                                checkIfDateExists?.tasks?.find(e => e?.taskName?.toUpperCase().includes(taskName?.toUpperCase()) && e?.taskDesc?.toUpperCase().includes(taskDesc?.toUpperCase()))
                            ) {
                                res.status(400).json({ statusCode: 400, statusMsg: "Record Already Exists" })
                            }
                            else {
                                temp[0][cond][index]['tasks']?.push({ taskId: uuidv4(), taskName, taskDesc, color })

                                UpdateRecord(temp, res, operationType)
                            }
                        } else {
                            temp[0][cond]?.push({
                                date,
                                tasks: [
                                    { taskId: uuidv4(), taskName, taskDesc, color }
                                ]
                            })

                            UpdateRecord(temp, res, operationType)
                        }




                    }
                    else if (foundDocument.length == 0) {
                        let obj = {
                            [cond]: [
                                {
                                    date,
                                    tasks: [
                                        { taskId: uuidv4(), taskName, taskDesc, color }
                                    ]
                                }
                            ]
                        }

                        calendarCollection?.insertMany(obj)
                            .then(resp => {
                                console.log(resp);
                                res.status(200).json({ statusCode: 200, data: resp, statusMsg: "Record Inserted Successfully" })
                            }).catch(err => {
                                console.log(err);
                                res.status(500).json({ statusCode: 500, statusMsg: err })
                            })
                    }

                })

                .catch(err => {
                    console.error("Error updating task:", err);
                });

        }
        else if (operationType == "U" && taskId) {
            calendarCollection?.find({ [cond]: { $exists: true } })
                .then(foundDocument => {
                    if (foundDocument?.length == 1) {
                        let temp = [...foundDocument]
                        let findDate = temp[0][cond]?.find(e => e?.date == date)
                        let findDateIndex = temp[0][cond]?.indexOf(findDate)
                        let findTask = temp[0][cond][findDateIndex]['tasks']?.find(e => e?.taskId == taskId)

                        if (findTask) {
                            let findTaskIndex = temp[0][cond][findDateIndex]['tasks']?.indexOf(findTask)
                            temp[0][cond][findDateIndex]['tasks'][findTaskIndex] = {
                                taskId,
                                taskName,
                                taskDesc,
                                color
                            }

                            UpdateRecord(temp, res, operationType)
                        } else {
                            res.status(400).json({ statusCode: 400, data: "Record Not Found!" })
                        }


                    }
                    else {
                        res.status(400).json({ statusCode: 400, data: "Record Not Found" })
                    }
                })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error occured while fetching ' })
    }
})

app.post('/InsertDemoDocument', async (req, res) => {
    let insertDemoDocument = {
        May_2024: [
            {
                date: "01-05-2024",
                tasks: [
                    {
                        taskId: uuidv4(),
                        taskName: "new task for may",
                        taskDesc: "new task desc for may",
                        color: "#ff0000"
                    },
                    {
                        taskId: uuidv4(),
                        taskName: "another new task for may",
                        taskDesc: "another new task desc for may",
                        color: "#ff0000"
                    }
                ]
            },
            {
                date: "02-05-2024",
                tasks: [
                    {
                        taskId: uuidv4(),
                        taskName: "test task for may",
                        taskDesc: "test task desc for may",
                        color: "#ff0000"
                    },
                    {
                        taskId: uuidv4(),
                        taskName: "another test task for may",
                        taskDesc: "another test task desc for may",
                        color: "#ff0000"
                    }
                ]
            },
        ]
    }

    calendarCollection.insertMany(insertDemoDocument)?.then(resp => {
        console.log(resp);
        res.send(resp)
    })
})

app.post('/deleteTask', (req, res) => {
    const { taskId, date, dateFormat } = req?.body
    const monthName = moment(date, dateFormat)?.format('MMMM')
    const year = moment(date, dateFormat)?.year()
    let key = `${monthName}_${year}`

    calendarCollection?.find({ [key]: { $exists: true } })
        .then(resp => {

            if (
                resp?.length == 1
            ) {
                let temp = [...resp]
                let x = temp[0][key]?.find(e => e?.date == date)['tasks'];
                temp[0][key].find(e => e?.date == date)['tasks'] = x?.filter(e => e?.taskId != taskId)

                console.log(temp[0][key]?.find(e => e?.date == date)['tasks']);

                UpdateRecord(temp, res)
            }
            else if (resp?.length == 0) {
                res.status(400).json({ statusCode: 400, statusMsg: "Record Not Found" })
            }

        }).catch(err => {
            console.log(err)
            res.status(500).json({ error: 'Error occured while fetching ' })
        })

})

app.listen(port, () => console.log(`app started on port ${port}`))
