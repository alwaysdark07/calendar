import mongoose from 'mongoose'

const schema = mongoose.Schema

const calendarCollectionSchema = new schema({}, { strict: false })

export const calendarCollection = mongoose.model('calendarCollection', calendarCollectionSchema, 'calendarCollection')