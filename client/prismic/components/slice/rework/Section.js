import React from 'react'
import PropTypes from 'prop-types'
import { Section as Base } from 'components/page'
import { StructuredText } from 'prismic/components/base'

Section.propTypes = {
    nonRepeat: PropTypes.shape({
        header: PropTypes.object,
        content: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
}

export default function Section({ nonRepeat }) {
    const { content, header } = nonRepeat

    return (
        <Base title={<StructuredText value={header} />}>
            <StructuredText value={content} />
        </Base>
    )
}
