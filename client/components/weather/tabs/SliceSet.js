import React from 'react'
import PropTypes from 'prop-types'
import Loop from '../Loop'
import Meteogram from '../Meteogram'
import { StructuredText } from 'prismic/components/base'

// Could reuse SliceZone

SliceSet.propTypes = {
    slices: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default function SliceSet({ slices = [] }) {
    return slices.map((slice, index) => <Slice key={index} {...slice} />)
}

function Slice({ slice_type, value }) {
    switch (slice_type) {
        case 'text':
            return <StructuredText value={value} />
        case 'loop': {
            const [loop] = value

            if (!loop.type) {
                // in case the loop is empty
                // example: user adds a slice in slice and does not
                // enters any information
                return null
            }

            const [type, run] = loop.type.split('@')
            const props = {
                ...loop,
                type,
                run: Number(run.replace('Z', '')),
            }

            return <Loop {...props} />
        }
        case 'point-meteogram':
        case 'group-meteogram': {
            const [meteogram] = value

            if (!meteogram.type) {
                // in case the meteogram is empty
                // example: user adds a slice in slice and does not
                // enters any information
                return null
            }

            const [model, run] = meteogram.type.split('@')
            const props = {
                model,
                run: Number(run.replace('Z', '')),
                type: slice_type.split('-')[0],
                location: meteogram.location,
            }

            return <Meteogram {...props} />
        }
        default:
            return null
    }
}
