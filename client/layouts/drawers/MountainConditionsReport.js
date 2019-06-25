import React, { memo, Fragment } from 'react'
import PropTypes from 'prop-types'
import { point } from '@turf/helpers'
import { Report } from 'containers/mcr'
import { Loading, Muted } from 'components/text'
import { InnerHTML } from 'components/misc'
import { Locate } from 'components/button'
import {
    Header,
    Container,
    Body,
    Navbar,
    Close,
    Banner,
    Content,
} from 'components/page/drawer'
import {
    Footer,
    Submitter,
    DateSet,
    Location,
    Media,
} from 'layouts/products/mcr'
import { WHITE } from 'constants/colors'

MountainConditionsReport.propTypes = {
    id: PropTypes.string.isRequired,
    onCloseClick: PropTypes.func.isRequired,
    onLocateClick: PropTypes.func.isRequired,
}

function MountainConditionsReport({ id, onCloseClick, onLocateClick }) {
    id = Number(id)

    return (
        <Container>
            <Body>
                <Navbar style={NAVBAR_STYLE}>
                    <Close
                        shadow
                        onClick={onCloseClick}
                        style={CLOSE_BUTTON_STYLE}
                    />
                </Navbar>
                <Report id={id}>
                    {({ data, pending }) => {
                        const {
                            locationDescription,
                            permalink,
                            body,
                            title,
                            images,
                            user,
                            dates,
                            groups,
                            location,
                        } = data || {}

                        return (
                            <Fragment>
                                <Banner>
                                    <Media images={images} />
                                </Banner>
                                <Header subject="Arc'Teryx Mountain Conditions Report">
                                    {title && (
                                        <h1>
                                            <a
                                                href={permalink}
                                                target={permalink}>
                                                {title}
                                            </a>
                                            {Array.isArray(location) && (
                                                <Locate
                                                    onClick={() =>
                                                        onLocateClick(
                                                            point(location)
                                                        )
                                                    }
                                                />
                                            )}
                                        </h1>
                                    )}
                                    {Array.isArray(dates) && (
                                        <DateSet values={dates} />
                                    )}
                                    <Location>{locationDescription}</Location>
                                    {user && (
                                        <Submitter {...user} groups={groups} />
                                    )}
                                </Header>
                                <Content>
                                    <Loading show={pending}>
                                        Loading Mountain Conditions Report...
                                    </Loading>
                                    {body && <InnerHTML>{body}</InnerHTML>}
                                    {!pending && !body && (
                                        <Muted>
                                            Report #{id} is not available
                                            anymore.
                                        </Muted>
                                    )}
                                    <Footer />
                                </Content>
                            </Fragment>
                        )
                    }}
                </Report>
            </Body>
        </Container>
    )
}

export default memo(
    MountainConditionsReport,
    (prev, next) => prev.id === next.id
)

const NAVBAR_STYLE = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
}
const CLOSE_BUTTON_STYLE = {
    backgroundColor: WHITE,
}
