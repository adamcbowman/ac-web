import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from '@reach/router'
import { pathname } from 'utils/prismic'
import { Loading } from 'components/text'
import { DocumentByUID } from 'prismic/containers'

const DocumentType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
})

export default class DocumentLink extends PureComponent {
    static propTypes = {
        value: PropTypes.shape({
            document: DocumentType.isRequired,
            isBroken: PropTypes.bool.isRequired,
        }).isRequired,
        document: DocumentType,
        children: PropTypes.node,
    }
    renderer({ document }) {
        return document?.data?.title || <Loading />
    }
    get children() {
        const { type, uid } = this.props.value.document

        return (
            <DocumentByUID type={type} uid={uid}>
                {this.renderer}
            </DocumentByUID>
        )
    }
    render() {
        const { children, value, document, ...props } = this.props

        return (
            <Link to={pathname(value.document)} {...props}>
                {children || this.children}
            </Link>
        )
    }
}
