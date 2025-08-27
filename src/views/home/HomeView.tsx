import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import Mapbox from '@rnmapbox/maps'

Mapbox.setAccessToken(
    'pk.eyJ1IjoibnR0aGFuaGRhbmgiLCJhIjoiY21ldGhobmRwMDNrcTJscjg5YTRveGU0MyJ9.1-2B8UCQL1fjGqTd60Le9A',
)

const HomeView = () => {
    const [selectedShop, setSelectedShop] = useState<any>(null)

    // Quận 1
    const center: [number, number] = [106.700981, 10.776889]

    // Danh sách cửa hàng mẫu
    const shops = [
        {
            id: 'shop1',
            name: 'Cửa hàng A',
            address: '123 Lê Lợi, Q1',
            coordinate: [106.703981, 10.776889],
        },
        {
            id: 'shop2',
            name: 'Cửa hàng B',
            address: '45 Nguyễn Huệ, Q1',
            coordinate: [106.7045, 10.7755],
        },
        {
            id: 'shop3',
            name: 'Cửa hàng C',
            address: '67 Pasteur, Q1',
            coordinate: [106.6995, 10.7745],
        },
    ]

    return (
        <View style={styles.page}>
            <Mapbox.MapView style={styles.map}>
                <Mapbox.Camera
                    zoomLevel={14}
                    centerCoordinate={center}
                    animationMode="flyTo"
                    animationDuration={2000}
                />

                {/* Render danh sách marker */}
                {shops.map((shop) => (
                    <Mapbox.PointAnnotation
                        key={shop.id}
                        id={shop.id}
                        coordinate={shop.coordinate}
                        onSelected={() => setSelectedShop(shop)}
                    >
                        <View style={styles.shopMarker} />
                    </Mapbox.PointAnnotation>
                ))}
            </Mapbox.MapView>

            {/* Popup hiển thị chi tiết khi chọn shop */}
            {selectedShop && (
                <View style={styles.popup}>
                    <Text style={styles.popupTitle}>{selectedShop.name}</Text>
                    <Text>{selectedShop.address}</Text>
                </View>
            )}
        </View>
    )
}

export default HomeView

const styles = StyleSheet.create({
    page: { flex: 1 },
    map: { flex: 1 },
    shopMarker: {
        height: 18,
        width: 18,
        backgroundColor: 'blue',
        borderRadius: 9,
        borderColor: '#fff',
        borderWidth: 2,
    },
    popup: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    popupTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
})
