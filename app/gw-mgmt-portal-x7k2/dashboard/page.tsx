'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import AdminShell from '@/components/AdminShell'

interface Verifikasi {
  id: number
  token: string
  judul: string
  namaPenggugat: string
  namaTergugat: string
  statusPenggugat: string
  statusTergugat: string
  createdAt: string
}

export default function DashboardPage() {
  const [data, setData] = useState<Verifikasi[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const limit = 10

  const fetchData = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      search,
    })
    const res = await fetch(`/api/verifikasi?${params}`)
    const json = await res.json()
    setData(json.data ?? [])
    setTotal(json.total ?? 0)
    setLoading(false)
  }, [page, search])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const totalPages = Math.ceil(total / limit)

  async function handleDelete(id: number) {
    if (!confirm('Yakin ingin menghapus data ini?')) return
    setDeletingId(id)
    await fetch(`/api/verifikasi/${id}`, { method: 'DELETE' })
    setDeletingId(null)
    fetchData()
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const statusBadge = (status: string) => (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
        status === 'SUDAH_DIGUNAKAN'
          ? 'bg-red-100 text-red-700'
          : 'bg-green-100 text-green-700'
      }`}
    >
      {status === 'SUDAH_DIGUNAKAN' ? 'Sudah Digunakan' : 'Belum Digunakan'}
    </span>
  )

  return (
    <AdminShell>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Kelola data verifikasi dokumen</p>
          </div>
          <Link
            id="btn-tambah-data"
            href="/gw-mgmt-portal-x7k2/tambah"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-sm font-semibold rounded-lg hover:from-teal-600 hover:to-emerald-700 transition-all shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Data Baru
          </Link>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            id="search-input"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari nama penggugat, tergugat, atau judul..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-800"
          />
          <button
            id="btn-search"
            type="submit"
            className="px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition"
          >
            Cari
          </button>
          {search && (
            <button
              id="btn-reset-search"
              type="button"
              onClick={() => { setSearch(''); setSearchInput(''); setPage(1) }}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition"
            >
              Reset
            </button>
          )}
        </form>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
                <th className="px-4 py-3 text-left font-semibold">No</th>
                <th className="px-4 py-3 text-left font-semibold">Judul</th>
                <th className="px-4 py-3 text-left font-semibold">Penggugat</th>
                <th className="px-4 py-3 text-left font-semibold">Tergugat</th>
                <th className="px-4 py-3 text-left font-semibold">Status Penggugat</th>
                <th className="px-4 py-3 text-left font-semibold">Status Tergugat</th>
                <th className="px-4 py-3 text-left font-semibold">Tanggal</th>
                <th className="px-4 py-3 text-left font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    Memuat data...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                data.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={`border-t border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-teal-50 transition-colors`}
                  >
                    <td className="px-4 py-3 text-gray-500">
                      {(page - 1) * limit + idx + 1}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{item.judul}</td>
                    <td className="px-4 py-3 text-gray-700">{item.namaPenggugat}</td>
                    <td className="px-4 py-3 text-gray-700">{item.namaTergugat}</td>
                    <td className="px-4 py-3">{statusBadge(item.statusPenggugat)}</td>
                    <td className="px-4 py-3">{statusBadge(item.statusTergugat)}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/gw-mgmt-portal-x7k2/data/${item.id}`}
                          className="px-3 py-1 bg-teal-600 text-white text-xs rounded hover:bg-teal-700 transition"
                        >
                          Detail / QR
                        </Link>
                        <Link
                          href={`/gw-mgmt-portal-x7k2/edit/${item.id}`}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
                        >
                          Edit
                        </Link>
                        <button
                          id={`btn-delete-${item.id}`}
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition disabled:opacity-50"
                        >
                          {deletingId === item.id ? '...' : 'Hapus'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              Menampilkan {(page - 1) * limit + 1}–{Math.min(page * limit, total)} dari {total} data
            </p>
            <div className="flex gap-2">
              <button
                id="btn-prev-page"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ← Prev
              </button>
              <span className="px-3 py-1.5 text-sm font-medium text-gray-700">
                {page} / {totalPages}
              </span>
              <button
                id="btn-next-page"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
