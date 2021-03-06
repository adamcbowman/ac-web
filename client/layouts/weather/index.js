import React, { lazy } from 'react'
import { Router, Redirect } from '@reach/router'
import Bundle from 'components/Bundle'
import WeatherStation from './station/WeatherStation'
import WeatherStationList from './station/WeatherStationList'
import { Page } from 'layouts/pages'
import { Main, Content, Header, Aside } from 'components/page'
import WeatherSidebar from './forecast/Sidebar'
import styles from 'layouts/glossary/Glossary.css'

export default function Weather() {
    return (
        <Router>
            <Redirect from="/" to="weather/forecast" />
            <MountainWeatherForecast path="forecast/*" />
            <WeatherStationList path="stations" />
            <WeatherStation path="stations/:id" />
            <WeatherGlossary path="glossary" uid="weather" />
        </Router>
    )
}

// Subroutes
const MountainWeather = lazy(() => import('./forecast/MountainWeather'))
const Glossary = lazy(() =>
    import('layouts/glossary/layouts').then(glossary =>
        Promise.resolve({ default: glossary.Glossary })
    )
)

function MountainWeatherForecast(props) {
    return (
        <Bundle>
            <MountainWeather {...props} />
        </Bundle>
    )
}

function WeatherGlossary(props) {
    return (
        <Page className={styles.Page}>
            <Header title="Weather Glossary" />
            <Content>
                <Main>
                    <Bundle>
                        <Glossary {...props} />
                    </Bundle>
                </Main>
                <Aside>
                    <WeatherSidebar />
                </Aside>
            </Content>
        </Page>
    )
}
