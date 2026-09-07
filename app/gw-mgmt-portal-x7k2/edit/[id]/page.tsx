'use client'

import { useState, useEffect, FormEvent, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AdminShell from '@/components/AdminShell'
import Link from 'next/link'

interface FormData {
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
}

const agamaOptions = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu']
const statusOptions = [
  { value: 'BELUM_DIGUNAKAN', label: 'Belum Digunakan' },
  { value: 'SUDAH_DIGUNAKAN', label: 'Sudah Digunakan' },
]

export default function EditPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [form, setForm] = useState<FormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/verifikasi?page=1&limit=1000`)
    const json = await res.json()
    const found = json.data?.find((d: FormData & { id: number }) => d.id === parseInt(id))
    if (found) {
      setForm({
        judul: found.judul,
        namaPenggugat: found.namaPenggugat,
        umurPenggugat: found.umurPenggugat,
        agamaPenggugat: found.agamaPenggugat,
        pekerjaanPenggugat: found.pekerjaanPenggugat,
        alamatPenggugat: found.alamatPenggugat,
        biodataPenggugat: found.biodataPenggugat,
        statusPenggugat: found.statusPenggugat,
        namaTergugat: found.namaTergugat,
        umurTergugat: found.umurTergugat,
        agamaTergugat: found.agamaTergugat,
        pekerjaanTergugat: found.pekerjaanTergugat,
        alamatTergugat: found.alamatTergugat,
        biodataTergugat: found.biodataTergugat,
        statusTergugat: found.statusTergugat,
      })
    }
    setLoading(false)
  }, [id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  function handleChange(key: keyof FormData, value: string) {
    setForm((prev) => prev ? { ...prev, [key]: value } : prev)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form) return
    setError('')
    setSaving(true)

    const res = await fetch(`/api/verifikasi/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setSaving(false)

    if (!res.ok) {
      setError('Gagal menyimpan perubahan. Coba lagi.')
      return
    }

    router.push(`/gw-mgmt-portal-x7k2/data/${id}`)
  }

  if (loading) {
    return (
      <AdminShell>
        <div className="p-8 text-center text-gray-500">Memuat data...</div>
      </AdminShell>
    )
  }

  if (!form) {
    return (
      <AdminShell>
        <div className="p-8 text-center text-gray-500">Data tidak ditemukan.</div>
      </AdminShell>
    )
  }

  const renderSection = (prefix: 'Penggugat' | 'Tergugat', title: string) => (
    <div className="flex-1 border border-gray-200 rounded-xl overflow-hidden">
      <div className={`bg-gradient-to-r ${prefix === 'Penggugat' ? 'from-teal-600 to-teal-700' : 'from-emerald-600 to-emerald-700'} text-white px-5 py-3`}>
        <h2 className="font-semibold text-base">{title}</h2>
      </div>
      <div className="p-5 space-y-4">
        {[
          { key: `nama${prefix}` as keyof FormData, label: 'Nama Lengkap' },
          { key: `umur${prefix}` as keyof FormData, label: 'Umur / Tahun Lahir' },
          { key: `pekerjaan${prefix}` as keyof FormData, label: 'Pekerjaan' },
          { key: `alamat${prefix}` as keyof FormData, label: 'Alamat' },
        ].map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            <input
              id={`edit-${field.key}`}
              type="text"
              required
              value={form[field.key]}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-800"
            />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Agama</label>
          <select
            id={`edit-agama${prefix}`}
            value={form[`agama${prefix}` as keyof FormData]}
            onChange={(e) => handleChange(`agama${prefix}` as keyof FormData, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none text-gray-800 bg-white"
          >
            {agamaOptions.map((a) => <option key={a}>{a}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Biodata</label>
          <textarea
            id={`edit-biodata${prefix}`}
            rows={3}
            value={form[`biodata${prefix}` as keyof FormData]}
            onChange={(e) => handleChange(`biodata${prefix}` as keyof FormData, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none text-gray-800 resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status Simkah</label>
          <select
            id={`edit-status${prefix}`}
            value={form[`status${prefix}` as keyof FormData]}
            onChange={(e) => handleChange(`status${prefix}` as keyof FormData, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none text-gray-800 bg-white"
          >
            {statusOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>
    </div>
  )

  return (
    <AdminShell>
      <div className="p-8">
        <div className="mb-5">
          <Link href={`/gw-mgmt-portal-x7k2/data/${id}`} className="inline-flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-medium">
            ← Kembali ke Detail
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Edit Data</h1>
          <p className="text-sm text-gray-500 mt-1">Perbarui data verifikasi dokumen</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6 bg-white rounded-xl border border-gray-200 p-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Dokumen</label>
            <input
              id="edit-judul"
              type="text"
              value={form.judul}
              onChange={(e) => handleChange('judul', e.target.value)}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none text-gray-800"
            />
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div className="flex gap-6 mb-6">
            {renderSection('Penggugat', 'Data Penggugat')}
            {renderSection('Tergugat', 'Data Tergugat')}
          </div>

          <div className="flex gap-4">
            <button
              id="btn-save-edit"
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-emerald-700 transition-all shadow-md disabled:opacity-60"
            >
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
            <button
              id="btn-cancel-edit"
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </AdminShell>
  )
}
