import mongoose, { Schema, model, models } from 'mongoose'

const ReportSchema = new mongoose.Schema(
  {
    name: {},
    email: {},
    text: {},
    coords: {},
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: 'submissions',
    strict: false,  // allow fields not defined in schema
  }
)

// Avoid model overwrite error in dev
const Report = models.Report || model('Report', ReportSchema)

export default Report
