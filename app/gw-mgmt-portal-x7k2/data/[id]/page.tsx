'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { QRCodeCanvas } from 'qrcode.react'
import AdminShell from '@/components/AdminShell'
import Link from 'next/link'

interface Verifikasi {
  id: number
  token: string
  judul: string
  namaPenggugat: string
  umurPenggugat: string
  agamaPenggugat: string
  pekerjaanPenggugat: string
  alamatPenggugat: string
  biodataPenggugat: string
  statusPenggugat: string
  namaTergugat: string
  umurTergugat: string
  agamaTergugat: string
  pekerjaanTergugat: string
  alamatTergugat: string
  biodataTergugat: string
  statusTergugat: string
  createdAt: string
}

export default function DataDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [data, setData] = useState<Verifikasi | null>(null)
  const [loading, setLoading] = useState(true)
  const qrRef = useRef<HTMLDivElement>(null)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

  const fetchData = useCallback(async () => {
    // We use GET /api/verifikasi?id=... trick but since our API uses token-based GET,
    // we fetch list and find by id
    const res = await fetch(`/api/verifikasi?page=1&limit=1000`)
    const json = await res.json()
    const found = json.data?.find((d: Verifikasi) => d.id === parseInt(id))
    setData(found ?? null)
    setLoading(false)
  }, [id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  function handleDownloadQR() {
    const canvas = qrRef.current?.querySelector('canvas')
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `qrcode-${data?.token ?? id}.png`
    link.href = url
    link.click()
  }

  function handlePrint() {
    window.print()
  }

  if (loading) {
    return (
      <AdminShell>
        <div className="p-8 text-center text-gray-500">Memuat data...</div>
      </AdminShell>
    )
  }

  if (!data) {
    return (
      <AdminShell>
        <div className="p-8 text-center text-gray-500">Data tidak ditemukan.</div>
      </AdminShell>
    )
  }

  const verifikasiUrl = `${baseUrl}/verifikasi/${data.token}`

  return (
    <AdminShell>
      <div className="p-8">
        {/* Back */}
        <div className="mb-5">
          <Link
            href="/gw-mgmt-portal-x7k2/dashboard"
            className="inline-flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            ← Kembali ke Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* QR Code panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center">
            <h2 className="text-lg font-bold text-gray-800 mb-1">QR Code Verifikasi</h2>
            <p className="text-xs text-gray-500 mb-5 break-all">{verifikasiUrl}</p>

            <div ref={qrRef} className="p-4 border-2 border-teal-100 rounded-xl mb-6">
              <QRCodeCanvas
                value={verifikasiUrl}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button
                id="btn-download-qr"
                onClick={handleDownloadQR}
                className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold text-sm rounded-lg hover:from-teal-600 hover:to-emerald-700 transition shadow-md"
              >
                ⬇ Download QR (PNG)
              </button>
              <button
                id="btn-print-qr"
                onClick={handlePrint}
                className="w-full py-2.5 bg-gray-100 text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-200 transition"
              >
                🖨 Print Barcode
              </button>
              <Link
                href={`/verifikasi/${data.token}`}
                target="_blank"
                className="w-full py-2.5 bg-blue-50 text-blue-600 font-medium text-sm rounded-lg hover:bg-blue-100 transition text-center"
              >
                🔗 Buka Halaman Publik
              </Link>
              <Link
                href={`/gw-mgmt-portal-x7k2/edit/${data.id}`}
                className="w-full py-2.5 bg-amber-50 text-amber-700 font-medium text-sm rounded-lg hover:bg-amber-100 transition text-center"
              >
                ✏ Edit Data
              </Link>
            </div>
          </div>

          {/* Data detail */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4">
              <h1 className="text-white font-bold text-xl">VERIFIKASI {data.judul}</h1>
              <p className="text-teal-100 text-sm mt-1">
                Token: <code className="font-mono bg-teal-700 px-1.5 py-0.5 rounded text-xs">{data.token}</code>
              </p>
            </div>

            <div className="grid grid-cols-2 divide-x divide-gray-100">
              {/* Penggugat */}
              <div>
                <div className="bg-teal-50 px-4 py-2 border-b border-gray-100">
                  <h3 className="font-semibold text-teal-800 text-sm">PENGGUGAT</h3>
                </div>
                <dl className="divide-y divide-gray-50">
                  {[
                    ['Nama', data.namaPenggugat],
                    ['Umur', data.umurPenggugat],
                    ['Agama', data.agamaPenggugat],
                    ['Pekerjaan', data.pekerjaanPenggugat],
                    ['Alamat', data.alamatPenggugat],
                    ['Biodata', data.biodataPenggugat],
                  ].map(([label, value]) => (
                    <div key={label} className="px-4 py-3">
                      <dt className="text-xs text-gray-500 font-medium">{label}</dt>
                      <dd className="text-sm text-gray-800 mt-0.5">{value}</dd>
                    </div>
                  ))}
                  <div className="px-4 py-3">
                    <dt className="text-xs text-gray-500 font-medium">Status Simkah</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${data.statusPenggugat === 'SUDAH_DIGUNAKAN' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {data.statusPenggugat === 'SUDAH_DIGUNAKAN' ? 'SUDAH DIGUNAKAN' : 'BELUM DIGUNAKAN'}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Tergugat */}
              <div>
                <div className="bg-emerald-50 px-4 py-2 border-b border-gray-100">
                  <h3 className="font-semibold text-emerald-800 text-sm">TERGUGAT</h3>
                </div>
                <dl className="divide-y divide-gray-50">
                  {[
                    ['Nama', data.namaTergugat],
                    ['Umur', data.umurTergugat],
                    ['Agama', data.agamaTergugat],
                    ['Pekerjaan', data.pekerjaanTergugat],
                    ['Alamat', data.alamatTergugat],
                    ['Biodata', data.biodataTergugat],
                  ].map(([label, value]) => (
                    <div key={label} className="px-4 py-3">
                      <dt className="text-xs text-gray-500 font-medium">{label}</dt>
                      <dd className="text-sm text-gray-800 mt-0.5">{value}</dd>
                    </div>
                  ))}
                  <div className="px-4 py-3">
                    <dt className="text-xs text-gray-500 font-medium">Status Simkah</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${data.statusTergugat === 'SUDAH_DIGUNAKAN' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {data.statusTergugat === 'SUDAH_DIGUNAKAN' ? 'SUDAH DIGUNAKAN' : 'BELUM DIGUNAKAN'}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
