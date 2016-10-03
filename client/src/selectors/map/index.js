import {createStructuredSelector} from 'reselect'
import sources from './sources'
import layers from './layers'
import markers from './markers'
import {computeFitBoundsFactory} from './bounds'
import feature from './feature'
import {
    getZoom as zoom,
    getCenter as center
} from 'reducers/map/getters'

export default createStructuredSelector({
    computeFitBounds: computeFitBoundsFactory,
    feature,
    sources,
    layers,
    markers,
    zoom,
    center,
})
