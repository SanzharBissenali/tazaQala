import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

// POST /api/data → store a new report
export async function POST(req: NextRequest) {
  try {
    const { name, email, text, coords } = await req.json()
    
    const client = await MongoClient.connect(process.env.MONGODB_URI as string, {
      tls: true,
      tlsInsecure: false,
      serverSelectionTimeoutMS: 1000,
      connectTimeoutMS: 1000,
    })
    const db = client.db('map-reports')
    
    const newReport = {
      name,
      email,
      text,
      coords,
      createdAt: new Date(),
    }

    await db.collection('submissions').insertOne(newReport)
    client.close()

    return NextResponse.json({ message: 'Success' }, { status: 200 })
  } catch (err) {
    console.error('POST error:', err)
    return NextResponse.json({ message: 'Error' }, { status: 500 })
  }
}

// GET /api/data → fetch all reports (latest first)
export async function GET() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string, {
      tls: true,
      tlsInsecure: false,
      serverSelectionTimeoutMS: 1000,
      connectTimeoutMS: 1000,
    })
    const db = client.db('map-reports')
    const reports = await db.collection('submissions').find().sort({ createdAt: -1 }).toArray()
    client.close()

    console.log('Fetched reports:', reports.length)
    return NextResponse.json(reports, { status: 200 })
  } catch (err) {
    console.error('GET error:', err)
    return NextResponse.json({ message: 'Error' }, { status: 500 })
  }
}