import React, { Fragment } from 'react'
import { Stations } from 'containers/weather'
import ErrorBoundary from 'components/ErrorBoundary'
import {
    List,
    ListItem,
    Page,
    Header,
    Content,
    Main,
    Headline,
} from 'components/page'
import { Fulfilled, Pending } from 'components/fetch'
import { Error, Muted } from 'components/text'
import { path } from 'utils/station'

export default function WeatherStationList() {
    const error = (
        <Error>
            Oups!! An error happened while loading weather station data.
        </Error>
    )

    return (
        <Page>
            <Header title="Weather stations" />
            <Content>
                <Main>
                    <ErrorBoundary fallback={error}>
                        <Stations>{children}</Stations>
                    </ErrorBoundary>
                </Main>
            </Content>
        </Page>
    )
}

// Renderers
function children() {
    return (
        <Fragment>
            <Pending>
                <Muted>Loading weather station data...</Muted>
            </Pending>
            <Fulfilled>{renderData}</Fulfilled>
        </Fragment>
    )
}
function renderData(data) {
    return (
        <Fragment>
            <Headline>
                Click on a link below to see weather station data.
            </Headline>
            <List>
                {data.map(({ stationId, name }) => {
                    return (
                        <ListItem key={stationId} to={path(stationId)}>
                            {name}
                        </ListItem>
                    )
                })}
            </List>
        </Fragment>
    )
}
