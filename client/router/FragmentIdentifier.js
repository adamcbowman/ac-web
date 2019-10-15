import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Location } from '@reach/router'
import { useEventListener } from 'hooks'

FragmentIdentifier.propTypes = {
    hash: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
}

export default function FragmentIdentifier(props) {
    return (
        <Location>
            {({ location }) => (
                <FragmentIdentifierWithLocation
                    location={location}
                    {...props}
                />
            )}
        </Location>
    )
}

function FragmentIdentifierWithLocation({ location, hash, children, ...rest }) {
    const href = `#${hash}`
    const anchor = useRef()
    function scroll() {
        if (window.location.hash === href) {
            anchor.current.scrollIntoView(true)

            const { scrollY } = window

            if (scrollY) {
                setTimeout(() => {
                    window.scroll(0, scrollY - 90)
                })
            }
        }
    }

    useEventListener('hashchange', scroll)
    useEffect(scroll, [location.hash])

    return (
        <a ref={anchor} name={hash} href={href} {...rest}>
            {children}
        </a>
    )
}
