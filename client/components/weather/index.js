// TODO All of these components should be moved to "layouts"

import React from 'react'
import PropTypes from 'prop-types'
import Forecast from './Forecast'
import Legacy from './Legacy'
import styles from './Forecast.css'

export Loop from './Loop'
export Image from 'components/loop'

Index.propTypes = {
    forecast: PropTypes.object.isRequired,
}

export default function Index({ forecast }) {
    return (
        <section className={styles.Index}>
            <h2 className={styles.Headline}>{forecast.headline}</h2>
            {Array.isArray(forecast.outlook) ? (
                <Legacy forecast={forecast} />
            ) : (
                <Forecast forecast={forecast} />
            )}
        </section>
    )
}
