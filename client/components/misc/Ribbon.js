import React from 'react'
import PropTypes from 'prop-types'
import styles from './Ribbon.css'

Ribbon.propTypes = {
    caption: PropTypes.string,
    children: PropTypes.string.isRequired,
}

export default function Ribbon({ children, caption = 'From the reel' }) {
    return (
        <header className={styles.Container}>
            <div className={styles.Caption} title={caption}>
                {caption}
            </div>
            <div className={styles.Title} title={children}>
                {children}
            </div>
        </header>
    )
}
