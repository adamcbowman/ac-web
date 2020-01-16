import React from 'react'
import { Link } from '@reach/router'
import styles from './Footer.css'
import { memo } from 'utils/react'

export default memo.static(Footer)

function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer className={styles.Container}>
            <div className={styles.Content}>
                <nav className={styles.Nav}>
                    <Link className={styles.Link} to="/about#contact-us">
                        Contact
                    </Link>
                    <Link className={styles.Link} to="/privacy-policy">
                        Privacy Policy
                    </Link>
                    <Link className={styles.Link} to="/terms-of-use">
                        Terms of use
                    </Link>
                </nav>
                <span className={styles.Rights}>
                    ©{year} Avalanche Canada, All Rights Reserved
                </span>
            </div>
        </footer>
    )
}
