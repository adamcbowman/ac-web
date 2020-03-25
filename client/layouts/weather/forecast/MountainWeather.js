import React from 'react'
import { Router, Link } from '@reach/router'
import isToday from 'date-fns/is_today'
import { Content, Header, Main, Aside } from 'components/page'
import { Warning } from 'components/alert'
import { Page } from 'layouts/pages'
import Sidebar from './Sidebar'
import Forecast from './Forecast'
import Footer from './Footer'
import * as articles from './articles'
import { DateParam } from 'hooks/params'
import { useVisibility } from 'hooks/session'
import { path } from 'utils/url'

export default function Weather({ uri }) {
    const title = <Link to={uri}>Mountain Weather Forecast</Link>
    const [visible, hide] = useVisibility('mwf-covid-warning')

    return (
        <Page>
            <Header title={title} />
            <Content>
                <Main>
                    {visible && (
                        <Warning onDismiss={hide}>
                            Please Note: The Meteorological Service of Canada
                            will continue to produce the Avalanche Canada
                            Mountain Weather Forecast daily as much as
                            operationally possible. Please be prepared for
                            occasional shortened versions of the MWF with the
                            possibility of an occasional “Forecast not
                            available”.
                        </Warning>
                    )}
                    <Router>
                        <ForecastRoute path="/" />
                        <ForecastRoute path=":date" />
                        <articles.HourlyPrecipitation path="hourly-precipitation" />
                        <articles.Precipitation12h path="12h-precipitation" />
                        <articles.Temperatures path="temperatures" />
                        <articles.Winds path="winds" />
                        <articles.SurfaceMaps path="surface-maps" />
                        <articles.OtherMaps path="other-maps" />
                        <articles.Radar path="radar" />
                        <articles.Satellite path="satellite" />
                        <articles.ActualTemperatures path="actual-temperatures" />
                        <articles.Warnings path="warnings" />
                    </Router>
                    <Footer />
                </Main>
                <Aside>
                    <Sidebar />
                </Aside>
            </Content>
        </Page>
    )
}

// Subroutes
function ForecastRoute({ date, navigate }) {
    function handleDateChange(date) {
        date = isToday(date) ? undefined : DateParam.format(date)

        navigate(path('/weather/forecast', date))
    }

    return (
        <Forecast
            date={DateParam.parse(date)}
            onDateChange={handleDateChange}
        />
    )
}
