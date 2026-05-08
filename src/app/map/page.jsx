'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { vendorMap } from '../../data/vendors'
import { VENDOR_COORDS } from '../../data/vendorCoords'

const VendorMap = dynamic(() => import('../../components/VendorMap'), { ssr: false })

export default function MapPage() {
  const mappedVendors   = vendorMap.filter(v =>  VENDOR_COORDS[v.slug])
  const unmappedVendors = vendorMap.filter(v => !VENDOR_COORDS[v.slug])

  return (
    <div className="min-h-screen bg-[#f7f4ed] px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm text-[#6d5f50] hover:underline">
          ← Back to Home
        </Link>
        <div className="mt-3 mb-5">
          <h1 className="text-3xl font-bold text-[#3F3228]">Vendor Map</h1>
          <p className="mt-1 text-sm text-[#8a7b69]">
            Approximate farm locations across Prince Edward County. Hover a marker to identify, click to visit.
          </p>
        </div>

        <VendorMap />

        <div className="mt-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#8a7b69]">
            Mapped vendors
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {mappedVendors.map(vendor => (
              <Link
                key={vendor.slug}
                href={`/vendors/${vendor.slug}`}
                className="flex items-center gap-2 rounded-lg border border-[#d9cebf] bg-[#fffdf8] px-3 py-2 text-sm text-[#3F3228] hover:bg-[#f3ece1]"
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#c8513b]" />
                {vendor.name}
              </Link>
            ))}
          </div>
        </div>

        {unmappedVendors.length > 0 && (
          <div className="mt-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#8a7b69]">
              Location not available
            </h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {unmappedVendors.map(vendor => (
                <Link
                  key={vendor.slug}
                  href={`/vendors/${vendor.slug}`}
                  className="flex items-center gap-2 rounded-lg border border-[#e2d8ca] bg-[#faf8f4] px-3 py-2 text-sm text-[#8a7b69] hover:bg-[#f3ece1]"
                >
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#c8bca9]" />
                  {vendor.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        <p className="mt-8 text-xs text-[#b0a090]">
          Locations are approximate and hand-placed — not GPS-verified.
        </p>
      </div>
    </div>
  )
}
