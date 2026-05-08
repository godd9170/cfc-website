'use client'

import { useRouter } from 'next/navigation'
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { vendorMap } from '../data/vendors'
import { VENDOR_COORDS } from '../data/vendorCoords'

// Centre of Prince Edward County
const CENTER = [44.0, -77.25]
const ZOOM = 11

export default function VendorMap() {
  const router = useRouter()
  const mapped = vendorMap.filter(v => VENDOR_COORDS[v.slug])

  return (
    <div
      className="overflow-hidden rounded-2xl border border-[#c8bca9] shadow-md"
      style={{ height: 420 }}
    >
      <MapContainer
        center={CENTER}
        zoom={ZOOM}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {mapped.map(vendor => {
          const [lat, lon] = VENDOR_COORDS[vendor.slug]
          return (
            <CircleMarker
              key={vendor.slug}
              center={[lat, lon]}
              radius={9}
              pathOptions={{
                fillColor: '#c8513b',
                fillOpacity: 1,
                color: 'white',
                weight: 2,
              }}
              eventHandlers={{
                click: () => router.push(`/vendors/${vendor.slug}`),
                mouseover: e => e.target.setStyle({ fillColor: '#2F5D50' }),
                mouseout:  e => e.target.setStyle({ fillColor: '#c8513b' }),
              }}
            >
              <Tooltip direction="top" offset={[0, -10]}>
                <span className="text-xs font-semibold">{vendor.name}</span>
              </Tooltip>
            </CircleMarker>
          )
        })}
      </MapContainer>
    </div>
  )
}
