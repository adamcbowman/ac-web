import React, { Fragment } from 'react'
import Panel from './Panel'
import { Entry, Symbol, Name, Description } from 'components/map/legend'
import RATINGS, { Texts, Descriptions, Palette } from 'constants/forecast/ates'
import { isTouchable } from 'utils/device'
import styles from '../TripPlanner.css'

export default function Welcome() {
    return (
        <section className={styles.Welcome}>
            <h2>Welcome to the Trip planner</h2>
            <Content />
        </section>
    )
}

export function Help() {
    return (
        <Panel header="Help">
            <div className={styles.PanelContent}>
                <Content />
            </div>
        </Panel>
    )
}

export function Content() {
    return (
        <Fragment>
            <p>
                {isTouchable ? 'Tap' : 'Click'} on a Avalanche Terrain Exposure
                Scale (ATES) area to start your trip planning. If you do not see
                any ATES areas, please zoom in or{' '}
                {isTouchable ? 'tap' : 'click'} on a grey zone to have the map
                zoomed in automatically.
            </p>
            <p>ATES are:</p>
            {Array.from(RATINGS, rating => (
                <Entry key={rating}>
                    <Symbol style={getStyle(rating)} />
                    <Name>{Texts.get(rating)} terrain</Name>
                    <Description>{Descriptions.get(rating)}</Description>
                </Entry>
            ))}
        </Fragment>
    )
}

// Utils
function getStyle(rating) {
    return {
        backgroundColor: Palette.get(rating),
    }
}
