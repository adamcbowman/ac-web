import React, { useMemo } from 'react'
import * as params from 'prismic/params'
import { STATIC_PAGE } from 'constants/prismic'
import Navbar from 'components/navbar'
import menu from /* preval */ '../constants/menus/avcan'
import logo from 'styles/AvalancheCanada.svg'
import { useDocument } from 'prismic/hooks'

export default function AvalancheCanadaNavbar() {
    const props = params.uid(STATIC_PAGE, 'ambassadors')
    const [ambassadors] = useDocument(props)
    const menuWithAmbassadors = useMemo(() => {
        // FIXME It is risky to access these properties

        const value = ambassadors?.data?.content?.[0]?.value

        if (!Array.isArray(value)) {
            return menu
        }

        const parent = menu.children[4].children[1]

        parent.children = value.map(ambassador => {
            const fullName = ambassador['full-name']
            const hash = fullName.toLowerCase().replace(/\s/, '-', 'g')

            return {
                id: hash,
                label: fullName,
                to: parent.to + '#' + hash,
            }
        })

        return menu
    }, [ambassadors])

    return <Navbar logo={logo} menu={menuWithAmbassadors} />
}
