import React, { Fragment } from 'react'
import { Router } from '@reach/router'
import SPAW from './SPAW'
import Footer from 'components/footer'
import Null from 'components/Null'
import { NotFound } from 'layouts/pages'
import Navbar from 'components/navbar'
import { StaticPage } from 'prismic/layouts'
import logo from 'styles/AvalancheCanadaFoundation.svg'
import menu from /* preval */ '../constants/menus/foundation'

// TODO: Could have an AvCan Foundation not found page, not just a regular one

export default function AvalancheCanadaFoundation() {
    return (
        <Fragment>
            <Navbar logo={logo} menu={menu} donate="/foundation/donate" />
            <SPAW />
            <Router>
                <StaticPage path="/" uid="foundation-home" />
                <StaticPage path="about" uid="foundation-about" title="About" />
                <StaticPage
                    path="programs"
                    uid="foundation-programs"
                    title="Programs"
                />
                <StaticPage
                    path="donors"
                    uid="foundation-donors"
                    title="Donors"
                />
                <StaticPage
                    path="event-sponsors"
                    uid="foundation-event-sponsors"
                    title="Event Sponsors"
                />
                <StaticPage
                    path="news-and-events"
                    uid="foundation-news-and-events"
                />
                <StaticPage
                    path="donate"
                    uid="foundation-donate"
                    title="Donate to Public Avalanche Safety"
                />
                <Funds path="funds/*" />
                <NotFound default />
            </Router>
            <Router primary={false}>
                <Null path="/" />
                <Footer default />
            </Router>
        </Fragment>
    )
}

// Subroutes
function Funds() {
    return (
        <Router>
            <StaticPage
                path="hugh-and-helen-hincks-memorial"
                uid="hugh-and-helen-hincks-memorial-fund"
                title="Hugh & Helen Hincks Memorial Fund"
            />
            <StaticPage
                path="craig-kelly-memorial-scholarship"
                uid="craig-kelly-memorial-scholarship-fund"
                title="Craig Kelly Memorial Scholarship Fund"
            />
            <StaticPage
                path="cora-shea-memorial"
                uid="cora-shea-memorial-fund"
                title="Cora Shea Memorial Fund"
            />
            <StaticPage
                path="al-hodgson-memorial"
                uid="al-hodgson-memorial-fund"
                title="Al Hodgson Memorial Fund"
            />
            <StaticPage path="issw" uid="issw-fund" title="ISSW Fund" />
        </Router>
    )
}
