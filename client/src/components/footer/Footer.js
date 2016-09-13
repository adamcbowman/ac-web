import React from 'react'
import {pure} from 'recompose'
import {Link} from 'react-router'
import CSSModules from 'react-css-modules'
import styles from './Footer.css'

function Footer() {
    const year = new Date().getFullYear()

	return (
		<footer styleName='Container'>
            <div styleName='Content'>
                <nav styleName='Nav'>
                    <Link styleName='Link' to='/about'>Contact</Link>
                    <Link styleName='Link' to='/privacy-policy'>Privacy Policy</Link>
                    <Link styleName='Link' to='/terms-of-use'>Terms of use</Link>
                </nav>
                <span styleName='Rights'>
                    ©{year} Avalanche Canada, All Rights Reserved
                </span>
            </div>
		</footer>
	)
}

export default pure(CSSModules(Footer, styles))
