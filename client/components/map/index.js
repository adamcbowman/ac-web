import React from 'react'
import mapbox from 'mapbox-gl/dist/mapbox-gl'
import Control from './Control'

export Map from './Map'
export StaticMap, { Managed as ManagedStaticMap } from './StaticMap'
export Marker from './Marker'
export Layer, { Symbol, Fill, Line, Circle } from './Layer'
export Source from './sources/GeoJSON'

export function NavigationControl(props) {
    return (
        <Control
            showCompass={false}
            {...props}
            controlClass={mapbox.NavigationControl}
        />
    )
}
export function FullscreenControl(props) {
    return <Control {...props} controlClass={mapbox.FullscreenControl} />
}
export function GeolocateControl(props) {
    return <Control {...props} controlClass={mapbox.GeolocateControl} />
}
