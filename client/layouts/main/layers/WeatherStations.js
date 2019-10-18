import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import * as turf from '@turf/helpers'
import { Source, Symbol } from 'components/map'
import { useStations } from 'hooks/async/weather'
import { WEATHER_STATION as key } from 'constants/drawers'

WeatherStations.propTypes = {
    visible: PropTypes.bool,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
}

export default function WeatherStations(props) {
    const [stations = []] = useStations()
    const data = useMemo(
        () => turf.featureCollection(stations.map(createFeature)),
        [stations]
    )

    return (
        <Source id={key} cluster clusterMaxZoom={14} data={data}>
            <Symbol id={key} {...props} {...styles} />
        </Source>
    )
}

// Utils
function createFeature({ stationId, name, longitude, latitude }) {
    return turf.point([longitude, latitude], {
        id: stationId,
        type: key,
        title: name,
    })
}

// Styles
const styles = {
    layout: {
        'icon-image': 'weather-station',
        'icon-allow-overlap': true,
        'icon-size': 0.65,
        'text-font': ['Open Sans Extrabold'],
        'text-field': '{point_count}',
        'text-size': 10,
        'text-offset': [-0.75, 0],
    },
    paint: {
        'text-color': '#000000',
        'text-halo-color': '#FFFFFF',
        'text-halo-width': 2,
    },
}
