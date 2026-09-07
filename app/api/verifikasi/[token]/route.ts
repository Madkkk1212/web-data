import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/verifikasi/[token] - ambil satu data berdasarkan token (publik, tidak perlu login)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

  const verifikasi = await prisma.verifikasi.findUnique({
    where: { token },
  })

  if (!verifikasi) {
    return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 })
  }

  return NextResponse.json(verifikasi)
}

// PUT /api/verifikasi/[token] - update data (admin only) — diakses pakai id bukan token di URL tapi field id dipakai sebagai token disini kita gunakan id field
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { token } = await params
  const id = parseInt(token)

  const body = await req.json()

  const updated = await prisma.verifikasi.update({
    where: { id },
    data: {
      judul: body.judul,
      namaPenggugat: body.namaPenggugat,
      umurPenggugat: body.umurPenggugat,
      agamaPenggugat: body.agamaPenggugat,
      pekerjaanPenggugat: body.pekerjaanPenggugat,
      alamatPenggugat: body.alamatPenggugat,
      biodataPenggugat: body.biodataPenggugat,
      statusPenggugat: body.statusPenggugat,
      namaTergugat: body.namaTergugat,
      umurTergugat: body.umurTergugat,
      agamaTergugat: body.agamaTergugat,
      pekerjaanTergugat: body.pekerjaanTergugat,
      alamatTergugat: body.alamatTergugat,
      biodataTergugat: body.biodataTergugat,
      statusTergugat: body.statusTergugat,
    },
  })

  return NextResponse.json(updated)
}

// DELETE /api/verifikasi/[token] - hapus data (admin only) — token here is id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { token } = await params
  const id = parseInt(token)

  await prisma.verifikasi.delete({ where: { id } })

  return NextResponse.json({ message: 'Data berhasil dihapus' })
}
