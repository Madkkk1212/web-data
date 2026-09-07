'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import AdminShell from '@/components/AdminShell'

const agamaOptions = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu']
const statusOptions = [
  { value: 'BELUM_DIGUNAKAN', label: 'Belum Digunakan' },
  { value: 'SUDAH_DIGUNAKAN', label: 'Sudah Digunakan' },
]

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

const initialForm: FormData = {
  judul: 'AKTA CERAI',
  namaPenggugat: '',
  umurPenggugat: '',
  agamaPenggugat: 'Islam',
  pekerjaanPenggugat: '',
  alamatPenggugat: '',
  biodataPenggugat: '',
  statusPenggugat: 'BELUM_DIGUNAKAN',
  namaTergugat: '',
  umurTergugat: '',
  agamaTergugat: 'Islam',
  pekerjaanTergugat: '',
  alamatTergugat: '',
  biodataTergugat: '',
  statusTergugat: 'BELUM_DIGUNAKAN',
}

function FieldGroup({
  title,
  prefix,
  form,
  onChange,
}: {
  title: string
  prefix: 'Penggugat' | 'Tergugat'
  form: FormData
  onChange: (key: keyof FormData, value: string) => void
}) {
  const p = prefix
  const headerColor =
    p === 'Penggugat'
      ? 'from-teal-600 to-teal-700'
      : 'from-emerald-600 to-emerald-700'

  return (
    <div className="flex-1 border border-gray-200 rounded-xl overflow-hidden">
      <div className={`bg-gradient-to-r ${headerColor} text-white px-5 py-3`}>
        <h2 className="font-semibold text-base">{title}</h2>
      </div>
      <div className="p-5 space-y-4">
        {[
          { key: `nama${p}` as keyof FormData, label: 'Nama Lengkap', type: 'text' },
          { key: `umur${p}` as keyof FormData, label: 'Umur / Tahun Lahir', type: 'text' },
          { key: `pekerjaan${p}` as keyof FormData, label: 'Pekerjaan', type: 'text' },
          { key: `alamat${p}` as keyof FormData, label: 'Alamat', type: 'text' },
        ].map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            <input
              id={`input-${field.key}`}
              type={field.type}
              required
              value={form[field.key]}
              onChange={(e) => onChange(field.key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-800"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Agama</label>
          <select
            id={`select-agama${p}`}
            value={form[`agama${p}` as keyof FormData]}
            onChange={(e) => onChange(`agama${p}` as keyof FormData, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-800 bg-white"
          >
            {agamaOptions.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Biodata</label>
          <textarea
            id={`textarea-biodata${p}`}
            required
            rows={3}
            value={form[`biodata${p}` as keyof FormData]}
            onChange={(e) => onChange(`biodata${p}` as keyof FormData, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-800 resize-none"
            placeholder="Keterangan tambahan..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status Simkah</label>
          <select
            id={`select-status${p}`}
            value={form[`status${p}` as keyof FormData]}
            onChange={(e) => onChange(`status${p}` as keyof FormData, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-800 bg-white"
          >
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default function TambahPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(key: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/verifikasi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setLoading(false)

    if (!res.ok) {
      setError('Terjadi kesalahan. Coba lagi.')
      return
    }

    const data = await res.json()
    router.push(`/gw-mgmt-portal-x7k2/data/${data.id}`)
  }

  return (
    <AdminShell>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Tambah Data Baru</h1>
          <p className="text-sm text-gray-500 mt-1">Isi data penggugat dan tergugat, lalu sistem akan generate QR Code otomatis</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Judul Dokumen */}
          <div className="mb-6 bg-white rounded-xl border border-gray-200 p-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jenis Dokumen
            </label>
            <input
              id="input-judul"
              type="text"
              value={form.judul}
              onChange={(e) => handleChange('judul', e.target.value)}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-800"
              placeholder="Misal: AKTA CERAI"
            />
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {/* Two column form */}
          <div className="flex gap-6 mb-6">
            <FieldGroup
              title="Data Penggugat"
              prefix="Penggugat"
              form={form}
              onChange={handleChange}
            />
            <FieldGroup
              title="Data Tergugat"
              prefix="Tergugat"
              form={form}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-4">
            <button
              id="btn-submit-tambah"
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-emerald-700 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Menyimpan...' : 'Simpan & Generate QR Code'}
            </button>
            <button
              id="btn-cancel-tambah"
              type="button"
              onClick={() => router.push('/gw-mgmt-portal-x7k2/dashboard')}
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
