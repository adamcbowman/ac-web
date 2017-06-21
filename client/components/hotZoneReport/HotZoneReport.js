import React from 'react'
import PropTypes from 'prop-types'
import { withProps } from 'recompose'
import CSSModules from 'react-css-modules'
import BasePanel, { INVERSE } from '~/components/panel'
import Generic from '~/prismic/components/Generic'
import CriticalFactors from './CriticalFactors'
import TerrainAndTravelAdvice from './TerrainAndTravelAdvice'
import TerrainAdviceSet from './TerrainAdviceSet'
import ImageGallery from '~/components/gallery'
import styles from './HotZoneReport.css'
import ArchiveWarning from './ArchiveWarning'

const Panel = withProps({
    theme: INVERSE,
    expandable: true,
})(BasePanel)

HotZoneReport.propTypes = {
    report: PropTypes.object,
    previous: PropTypes.object,
    next: PropTypes.object,
}

function HotZoneReport({ report, previous, next }) {
    const { title, headline, images } = report
    let gallery = null

    if (images) {
        gallery = images.length > 0 && {
            items: images.map(({ value, caption = {} }) => ({
                original: value.main.url,
                description: caption.value,
            })),
            showBullets: images.length > 1,
            showPlayButton: images.length > 1,
            showThumbnails: false,
        }
    }
    return (
        <div styleName="HotZoneReport">
            <ArchiveWarning report={report} next={next} previous={previous} />
            {title &&
                <div styleName="Title">
                    {title}
                </div>}
            {headline &&
                <div styleName="Headline">
                    {headline}
                </div>}
            {gallery && <ImageGallery {...gallery} />}
            <CriticalFactors report={report} />
            <TerrainAndTravelAdvice report={report} />
            <TerrainAdviceSet report={report} />
            <Panel header="More information">
                <Generic uid="hot-zone-report-more-information" />
            </Panel>
            <Panel header="About">
                <Generic uid="hot-zone-report-about" />
            </Panel>
        </div>
    )
}

export default CSSModules(HotZoneReport, styles)