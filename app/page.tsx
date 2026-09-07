import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-teal-100 text-center">
        <div className="w-20 h-20 bg-gradient-to-tr from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md shadow-teal-500/20">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Portal Verifikasi Dokumen
        </h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Sistem Resmi Verifikasi Dokumen & QR Code. Pindai QR Code pada dokumen fisik untuk memeriksa keabsahan data.
        </p>

        <div className="space-y-4">
          <Link
            href="/gw-mgmt-portal-x7k2/login"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold text-sm rounded-xl hover:from-teal-600 hover:to-emerald-700 transition shadow-md shadow-teal-500/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Masuk Portal Admin
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-400">
          Untuk melakukan verifikasi, silakan scan QR Code yang tertera pada dokumen Anda.
        </div>
      </div>
    </div>
  )
}
