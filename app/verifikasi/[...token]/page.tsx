import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ token: string | string[] }>
}

function StatusBadge({ status }: { status: string }) {
  const isUsed = status === 'SUDAH_DIGUNAKAN'
  return (
    <div className={`inline-flex flex-col items-center justify-center w-28 h-28 rounded-full border-4 ${isUsed ? 'border-red-400 bg-red-50' : 'border-green-500 bg-green-50'} shadow-inner mx-auto`}>
      <svg className={`w-8 h-8 mb-1 ${isUsed ? 'text-red-500' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {isUsed
          ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        }
      </svg>
      <span className={`text-xs font-bold text-center leading-tight px-1 ${isUsed ? 'text-red-600' : 'text-green-700'}`}>
        {isUsed ? 'SUDAH\nDIGUNAKAN' : 'BELUM\nDIGUNAKAN'}
      </span>
    </div>
  )
}

export default async function VerifikasiPage({ params }: PageProps) {
  const resolvedParams = await params
  const rawToken = Array.isArray(resolvedParams.token)
    ? resolvedParams.token.join('/')
    : resolvedParams.token

  let data = await prisma.verifikasi.findUnique({ where: { token: rawToken } })

  if (!data && rawToken.includes('%')) {
    data = await prisma.verifikasi.findUnique({ where: { token: decodeURIComponent(rawToken) } })
  }

  if (!data) {
    notFound()
  }

  const rows = [
    { label: 'Nama', penggugat: data.namaPenggugat, tergugat: data.namaTergugat },
    { label: 'Umur', penggugat: data.umurPenggugat, tergugat: data.umurTergugat },
    { label: 'Agama', penggugat: data.agamaPenggugat, tergugat: data.agamaTergugat },
    { label: 'Pekerjaan', penggugat: data.pekerjaanPenggugat, tergugat: data.pekerjaanTergugat },
    { label: 'Alamat', penggugat: data.alamatPenggugat, tergugat: data.alamatTergugat },
    { label: 'Biodata', penggugat: data.biodataPenggugat, tergugat: data.biodataTergugat },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 px-8 py-6 text-center">
            {/* Logo/Lambang placeholder */}
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur border-2 border-white/40 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
            </div>

            <h1 className="text-white text-2xl font-bold tracking-wide uppercase">
              VERIFIKASI {data.judul}
            </h1>
            <p className="text-teal-100 text-sm mt-2 max-w-lg mx-auto">
              Halaman ini merupakan alamat resmi data verifikasi dokumen. Data ditampilkan sesuai dengan yang tercatat dalam sistem.
            </p>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-2 text-center font-bold text-white text-sm">
            <div className="bg-teal-600 py-2.5">PENGGUGAT</div>
            <div className="bg-emerald-600 py-2.5">TERGUGAT</div>
          </div>

          {/* Data rows */}
          <table className="w-full text-sm">
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.label} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td colSpan={2} className="hidden"></td>
                  <td className="px-0 py-0 w-1/2">
                    <div className="flex">
                      <div className="w-24 min-w-24 bg-teal-50 border-r border-teal-100 px-3 py-3 text-xs font-semibold text-teal-700 flex items-start">
                        {row.label}
                      </div>
                      <div className="flex-1 px-4 py-3 text-gray-800 border-r border-gray-100">
                        {row.penggugat}
                      </div>
                    </div>
                  </td>
                  <td className="px-0 py-0 w-1/2">
                    <div className="flex">
                      <div className="w-24 min-w-24 bg-emerald-50 border-r border-emerald-100 px-3 py-3 text-xs font-semibold text-emerald-700 flex items-start">
                        {row.label}
                      </div>
                      <div className="flex-1 px-4 py-3 text-gray-800">
                        {row.tergugat}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Status row */}
              <tr className="bg-white border-t-2 border-teal-100">
                <td className="py-6 w-1/2">
                  <div className="flex">
                    <div className="w-24 min-w-24 bg-teal-50 border-r border-teal-100 px-3 py-3 text-xs font-semibold text-teal-700 flex items-start">
                      Status Simkah
                    </div>
                    <div className="flex-1 px-4 py-4 flex justify-center border-r border-gray-100">
                      <StatusBadge status={data.statusPenggugat} />
                    </div>
                  </div>
                </td>
                <td className="py-6 w-1/2">
                  <div className="flex">
                    <div className="w-24 min-w-24 bg-emerald-50 border-r border-emerald-100 px-3 py-3 text-xs font-semibold text-emerald-700 flex items-start">
                      Status Simkah
                    </div>
                    <div className="flex-1 px-4 py-4 flex justify-center">
                      <StatusBadge status={data.statusTergugat} />
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer */}
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-3 text-center">
            <p className="text-teal-100 text-xs">
              Data ini dapat diverifikasi kebenarannya. Diakses pada: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Sistem Verifikasi Dokumen — Halaman Publik
        </p>
      </div>
    </div>
  )
}
