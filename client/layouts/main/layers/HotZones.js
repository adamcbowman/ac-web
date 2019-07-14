import React from 'react'
import PropTypes from 'prop-types'
import * as turf from '@turf/helpers'
import memoize from 'lodash/memoize'
import * as features from 'containers/features'
import { Source, Circle } from 'components/map'
import { Documents } from 'prismic/containers'
import { hotZone } from 'prismic/params'
import { HOT_ZONE_REPORTS as key } from 'constants/drawers'

HotZones.propTypes = {
    visible: PropTypes.bool,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
}

export default function HotZones(props) {
    return (
        <features.HotZones>
            {({ data = [] }) => (
                <Documents {...hotZone.reports()}>
                    {({ documents = [] }) => (
                        <Source
                            id={key}
                            data={createFeatureCollection(data)(documents)}>
                            <Circle id={key} {...props} {...styles} />
                        </Source>
                    )}
                </Documents>
            )}
        </features.HotZones>
    )
}

// Utils
function createFeature({ id, name, centroid }, active) {
    return turf.point(
        centroid,
        {
            id,
            type: key,
            title: name,
            active,
        },
        { id }
    )
}
const createFeatureCollection = memoize(zones =>
    memoize(reports => {
        const regions = reports.map(pluckRegion)

        return turf.featureCollection(
            zones.map(zone => createFeature(zone, regions.includes(zone.id)))
        )
    })
)
function pluckRegion({ data }) {
    return data.region
}

// Styles
const styles = {
    paint: {
        'circle-blur': 0.75,
        'circle-opacity': 0.9,
        'circle-color': [
            'case',
            ['boolean', ['get', 'active'], false],
            '#004285',
            'hsl(0, 0%, 55%)',
        ],
        'circle-radius': {
            base: 1,
            stops: [[0, 0], [5, 35], [10, 250], [20, 2000]],
        },
    },
}
