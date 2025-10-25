// utils/MapboxConfig.ts
import MapboxGL from '@rnmapbox/maps'

export const MAPBOX_ACCESS_TOKEN =
    'pk.eyJ1IjoibnR0aGFuaGRhbmgiLCJhIjoiY21ldGhobmRwMDNrcTJscjg5YTRveGU0MyJ9.1-2B8UCQL1fjGqTd60Le9A'

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN)

// 🎯 Types
export type Bounds = {
    ne: [number, number]
    sw: [number, number]
}

export type Coordinate = [number, number]

// 🎯 Bounds TP.HCM (giới hạn chặt chẽ để giảm tiles)
export const HCMC_BOUNDS: Bounds = {
    ne: [106.85, 10.88], // Đông Bắc
    sw: [106.58, 10.69], // Tây Nam
}

export const HCMC_CENTER: Coordinate = [106.7, 10.78]

// 🎨 MapView config - Giảm tiles tối đa
export const MAPVIEW_CONFIG = {
    styleURL: MapboxGL.StyleURL.Street, // Vector tiles (nhẹ hơn Raster)
    compassEnabled: false,
    logoEnabled: false,
    attributionEnabled: false,
    scaleBarEnabled: false,

    // ✅ Giới hạn zoom để giảm tiles
    minZoomLevel: 16, // Không zoom ra quá xa
    maxZoomLevel: 18, // Không zoom vào quá gần (zoom 18+ tốn nhiều tiles)

    // ✅ Tắt tính năng không cần thiết
    pitchEnabled: false, // Không xoay 3D
    rotateEnabled: false, // Không xoay map

    regionDidChangeDebounceTime: 1000,
}

// 🎨 Camera config
export const CAMERA_CONFIG = {
    zoomLevel: 16,
    animationDuration: 1000,
    animationMode: 'flyTo' as const,
}

// 🔧 Helper: Tính khoảng cách giữa 2 tọa độ (mét)
export const getDistance = (coord1: Coordinate, coord2: Coordinate): number => {
    const R = 6371e3 // Bán kính Trái Đất (mét)
    const lat1 = (coord1[1] * Math.PI) / 180
    const lat2 = (coord2[1] * Math.PI) / 180
    const deltaLat = ((coord2[1] - coord1[1]) * Math.PI) / 180
    const deltaLng = ((coord2[0] - coord1[0]) * Math.PI) / 180

    const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

// 🔧 Helper: Tính bounds từ danh sách tọa độ
export const getBounds = (coords: Coordinate[]) => {
    const lngs = coords.map((c) => c[0])
    const lats = coords.map((c) => c[1])
    return {
        minLng: Math.min(...lngs),
        maxLng: Math.max(...lngs),
        minLat: Math.min(...lats),
        maxLat: Math.max(...lats),
    }
}

// 🔧 Helper: Fetch route từ Mapbox Directions API
export const fetchRoute = async (
    from: Coordinate,
    to: Coordinate,
): Promise<{
    coordinates: number[][]
    distance: string
    duration: string
} | null> => {
    try {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${from[0]},${from[1]};${to[0]},${to[1]}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`
        const res = await fetch(url)
        const data = await res.json()

        if (data.routes?.[0]) {
            const route = data.routes[0]
            return {
                coordinates: route.geometry.coordinates,
                distance: `${(route.distance / 1000).toFixed(1)} km`,
                duration: `${Math.round(route.duration / 60)} phút`,
            }
        }
        return null
    } catch (error) {
        console.error('❌ Fetch route failed:', error)
        return null
    }
}

// 🔧 Helper: Fetch địa chỉ từ Mapbox Geocoding API
export const fetchAddress = async (lng: number, lat: number): Promise<string> => {
    try {
        const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=1`,
        )
        const json = await res.json()

        if (json.features?.length > 0) {
            return json.features[0].place_name
        }
        return 'Không tìm thấy địa chỉ'
    } catch (error) {
        console.error('❌ Fetch address failed:', error)
        return 'Lỗi tải địa chỉ'
    }
}
