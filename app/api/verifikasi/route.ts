import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'

// GET /api/verifikasi - list semua data (admin only)
export async function GET(req: NextRequest) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '10')
  const search = searchParams.get('search') ?? ''

  const skip = (page - 1) * limit

  const [data, total] = await Promise.all([
    prisma.verifikasi.findMany({
      skip,
      take: limit,
      where: search
        ? {
            OR: [
              { namaPenggugat: { contains: search, mode: 'insensitive' } },
              { namaTergugat: { contains: search, mode: 'insensitive' } },
              { judul: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.verifikasi.count({
      where: search
        ? {
            OR: [
              { namaPenggugat: { contains: search, mode: 'insensitive' } },
              { namaTergugat: { contains: search, mode: 'insensitive' } },
              { judul: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
    }),
  ])

  return NextResponse.json({ data, total, page, limit })
}

// POST /api/verifikasi - tambah data baru (admin only)
export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()

  // Generate token: nanoid → Buffer base64url encode (URL-safe, no slashes)
  const rawId = nanoid(16)
  const token = Buffer.from(rawId).toString('base64url')

  const verifikasi = await prisma.verifikasi.create({
    data: {
      token,
      judul: body.judul ?? 'AKTA CERAI',
      namaPenggugat: body.namaPenggugat,
      umurPenggugat: body.umurPenggugat,
      agamaPenggugat: body.agamaPenggugat,
      pekerjaanPenggugat: body.pekerjaanPenggugat,
      alamatPenggugat: body.alamatPenggugat,
      biodataPenggugat: body.biodataPenggugat,
      statusPenggugat: body.statusPenggugat ?? 'BELUM_DIGUNAKAN',
      namaTergugat: body.namaTergugat,
      umurTergugat: body.umurTergugat,
      agamaTergugat: body.agamaTergugat,
      pekerjaanTergugat: body.pekerjaanTergugat,
      alamatTergugat: body.alamatTergugat,
      biodataTergugat: body.biodataTergugat,
      statusTergugat: body.statusTergugat ?? 'BELUM_DIGUNAKAN',
    },
  })

  return NextResponse.json(verifikasi, { status: 201 })
}
