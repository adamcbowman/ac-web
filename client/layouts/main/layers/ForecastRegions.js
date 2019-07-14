import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Match } from '@reach/router'
import * as turf from '@turf/helpers'
import { FeatureCollection } from 'containers/mapbox'
import { Source, Fill, Line, Symbol, Map } from 'components/map'
import { FORECASTS as key } from 'constants/drawers'

ForecastRegions.propTypes = {
    visible: PropTypes.bool,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
}

export default function ForecastRegions(props) {
    return (
        <Fragment>
            <FeatureCollection id="regions">
                {({ data = EMPTY }) => {
                    // https://github.com/mapbox/mapbox-gl-js/issues/2716
                    data.features.forEach((feature, index) => {
                        feature.id = index + 1
                        feature.properties.type = key
                    })

                    return (
                        <Source id={key} data={data}>
                            <Fill id={key} {...props} {...styles.fill} />
                            <Line
                                id={`${key}-line`}
                                {...props}
                                {...styles.line}
                            />
                            <Symbol
                                id={`${key}-labels`}
                                {...props}
                                {...styles.labels}
                            />
                        </Source>
                    )
                }}
            </FeatureCollection>
            <Match path="forecasts/:id">
                {({ match }) =>
                    match ? (
                        <Map.With loaded>
                            <ForecastRegionActivator id={match.id} />
                        </Map.With>
                    ) : null
                }
            </Match>
        </Fragment>
    )
}

ForecastRegionActivator.propTypes = {
    id: PropTypes.string.isRequired,
    map: PropTypes.object.isRequired,
}

function ForecastRegionActivator({ id, map }) {
    function setActive(id, active) {
        const [feature] = map.querySourceFeatures(key, {
            filter: ['==', 'id', id],
        })

        if (feature) {
            map.setFeatureState({ source: key, id: feature.id }, { active })
        } else {
            map.on('sourcedata', event => {
                if (event.sourceId === key) {
                    setActive(id, active)
                }
            })
        }
    }

    useEffect(() => {
        setActive(id, true)

        return () => {
            if (map.isStyleLoaded()) {
                setActive(id, false)
            }
        }
    }, [id])

    return null
}

// Constants
const EMPTY = turf.featureCollection([])

// Utils
const styles = {
    fill: {
        paint: {
            'fill-color': [
                'case',
                ['boolean', ['feature-state', 'active'], false],
                '#489BDF',
                '#C8D3D9',
            ],
            'fill-opacity': {
                base: 1,
                stops: [[3, 1], [8, 0]],
            },
        },
    },
    line: {
        paint: {
            'line-color': '#B43A7E',
            'line-width': [
                'case',
                ['boolean', ['feature-state', 'active'], false],
                4,
                1.5,
            ],
        },
    },
    labels: {
        layout: {
            'text-field': '{name}',
            'text-size': 10,
        },
        paint: {
            'text-color': '#B43A7E',
            'text-halo-color': 'hsl(0, 0%, 100%)',
            'text-halo-width': 1,
        },
    },
}
