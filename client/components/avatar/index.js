import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { initials } from 'utils/string'
import { useBoolean } from 'hooks'
import css from './Avatar.css'

Avatar.propTypes = {
    name: PropTypes.string.isRequired,
    url: PropTypes.string,
    size: PropTypes.number,
}

export default function Avatar({ size = 60, url, name }) {
    const [on, , unset] = useBoolean(Boolean(url))
    const style = {
        height: size,
        width: size,
        fontSize: size < 50 ? '0.75em' : '1em',
    }
    const className = classnames({
        [css.Initials]: on,
        [css.Avatar]: !on,
    })

    return (
        <div className={className} data-initials={initials(name)} style={style}>
            {url && (
                <img
                    src={url}
                    alt={initials(name)}
                    title={name}
                    onLoad={unset}
                    onError={unset}
                />
            )}
        </div>
    )
}
