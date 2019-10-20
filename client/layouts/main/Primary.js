import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Router, Match, Redirect } from '@reach/router'
import Forecast from 'layouts/drawers/Forecast'
import HotZoneReport from 'layouts/drawers/HotZoneReport'
import Drawer, { RIGHT } from 'components/page/drawer'
import externals from 'router/externals'
import styles from 'styles/components.css'

// TODO: HOOKS
// "opened" is used outside!!!

export default class Primary extends Component {
    static propTypes = {
        width: PropTypes.number.isRequired,
        onLocateClick: PropTypes.func.isRequired,
        onCloseClick: PropTypes.func.isRequired,
    }
    opened = false
    shouldComponentUpdate({ width }) {
        return this.props.width !== width
    }
    renderContent = ({ match, location }) => {
        const { width, ...events } = this.props
        const { type, name } = match || {}
        const opened =
            typeof type === 'string' &&
            typeof name === 'string' &&
            PATHS.has(type) &&
            !externals.has(name)

        this.opened = opened // TODO Remove
        this.location = location // TODO Remove

        return (
            <Drawer side={RIGHT} open={opened} width={width}>
                <Router className={styles.MatchParent}>
                    <Forecast path="forecasts/:name" {...events} />
                    <HotZoneReport path="advisories/:name" {...events} />
                    <Redirect
                        from="hot-zone-reports/:name"
                        to="map/advisories/:name"
                    />
                </Router>
            </Drawer>
        )
    }
    render() {
        return <Match path=":type/:name">{this.renderContent}</Match>
    }
}

// Constants
const PATHS = new Set(['forecasts', 'advisories'])
