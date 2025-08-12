import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

let client: MongoClient | null = null

async function getClient() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI as string, {
      tls: true,
      tlsInsecure: false,
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 5,
      retryWrites: true,
      retryReads: true
    })
    await client.connect()
  }
  return client
}

// POST /api/data → store a new report
export async function POST(req: NextRequest) {
  try {
    const { name, email, text, coords } = await req.json()
    
    const client = await getClient()
    const db = client.db('map-reports')
    
    const newReport = {
      name,
      email,
      text,
      coords,
      createdAt: new Date(),
    }

    await db.collection('submissions').insertOne(newReport)

    return NextResponse.json({ message: 'Success' }, { status: 200 })
  } catch (err) {
    console.error('POST error:', err)
    return NextResponse.json({ message: 'Error' }, { status: 500 })
  }
}

// GET /api/data → fetch all reports (latest first)
export async function GET() {
  try {
    const client = await getClient()
    const db = client.db('map-reports')
    const reports = await db.collection('submissions').find().sort({ createdAt: -1 }).toArray()

    console.log('Fetched reports:', reports.length)
    return NextResponse.json(reports, { status: 200 })
  } catch (err) {
    console.error('GET error:', err)
    return NextResponse.json({ message: 'Error' }, { status: 500 })
  }
}