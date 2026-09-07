import Link from 'next/link'

export default function VerifikasiNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5C2.57 18.333 3.532 20 5.072 20z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Data Tidak Ditemukan</h1>
        <p className="text-gray-500 text-sm mb-8">
          Token verifikasi tidak valid atau data yang Anda cari tidak ada dalam sistem. Pastikan Anda menggunakan link yang benar dari QR Code yang valid.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-xs text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Token tidak valid
        </div>
      </div>
    </div>
  )
}
