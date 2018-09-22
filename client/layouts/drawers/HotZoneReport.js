import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from '@reach/router'
import * as Hzr from 'layouts/products/hzr'
import { Container, Navbar, Header, Body, Close } from 'components/page/drawer'
import { Loading } from 'components/text'
import Shim from 'components/Shim'
import Sponsor from 'layouts/Sponsor'
import DisplayOnMap from 'components/page/drawer/DisplayOnMap'
import { Document } from 'prismic/containers'
import { HotZone } from 'containers/features'
import { hotZone } from 'prismic/params'
import * as utils from 'utils/hzr'

export default class HotZoneReportDrawer extends PureComponent {
    static propTypes = {
        name: PropTypes.string.isRequired,
        onCloseClick: PropTypes.func.isRequired,
        onLocateClick: PropTypes.func.isRequired,
    }
    handleLocateClick = () => {
        const { onLocateClick } = this.props

        onLocateClick(utils.geometry(this.zone))
    }
    renderHeader({ document, loading }) {
        const { name } = this.props

        return (
            <Header subject="Hot Zone Report">
                <HotZone name={name}>
                    {({ data }) => {
                        this.zone = data
                        const title = utils.title({
                            loading,
                            report: document,
                            hotZone: data,
                        })

                        return (
                            <h1>
                                {document ? (
                                    <Link to={`/hot-zone-reports/${name}`}>
                                        {title}
                                    </Link>
                                ) : (
                                    <span>{title}</span>
                                )}
                                <DisplayOnMap
                                    onClick={this.handleLocateClick}
                                />
                            </h1>
                        )
                    }}
                </HotZone>
            </Header>
        )
    }
    renderReport = ({ document, loading }) => (
        <Container>
            <Navbar>
                <Sponsor label={null} />
                <Close onClick={this.props.onCloseClick} />
            </Navbar>
            {this.renderHeader({ document, loading })}
            <Body>
                {loading ? (
                    <Shim horizontal>
                        <Loading />
                    </Shim>
                ) : (
                    <Hzr.Report value={document}>
                        <Shim horizontal>
                            <Hzr.Metadata shareable />
                            <Hzr.Header />
                        </Shim>
                        <Hzr.Gallery />
                        <Hzr.CriticalFactors />
                        <Hzr.TerrainAndTravelAdvice />
                        <Hzr.TerrainAdviceSet />
                        <Hzr.Footer />
                    </Hzr.Report>
                )}
            </Body>
        </Container>
    )
    render() {
        return (
            <Document {...hotZone.report(this.props.name)}>
                {this.renderReport}
            </Document>
        )
    }
}
