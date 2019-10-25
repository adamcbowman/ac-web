import React from 'react'
import { navigate } from '@reach/router'
import { useAuth } from 'contexts/auth'
import * as params from 'prismic/params'
import { Loading } from 'components/text'
import { STATIC_PAGE } from 'constants/prismic'
import Navbar, {
    Item,
    Menu,
    Section,
    UserProfile,
    Header,
    Link,
    ColumnSet,
} from 'components/navbar'
import Avatar from 'components/avatar'
import menu from /* preval */ '../constants/menus/avcan'
import logo from 'styles/AvalancheCanada.svg'
import { useDocument } from 'prismic/hooks'

// FIXME
menu.children[4].children[1].children = Ambassadors

export default function AvalancheCanadaNavbar() {
    const { isAuthenticated, profile, login, logout } = useAuth()
    const { name, picture } = profile || {}
    function handleLoginClick(event) {
        event.preventDefault()

        login()
    }
    function handleLogoutClick(event) {
        event.preventDefault()

        logout().then(() => {
            navigate('/')
        })
    }

    return (
        <Navbar logo={logo} donate="/foundation" menu={menu}>
            {isAuthenticated ? (
                <Item title={<Avatar name={name} url={picture} size={30} />}>
                    <Menu>
                        <Section>
                            <UserProfile name={name} avatar={picture} />
                            <Header>
                                <Link onClick={handleLogoutClick}>Logout</Link>
                            </Header>
                        </Section>
                    </Menu>
                </Item>
            ) : (
                <Item title="Login" onClick={handleLoginClick} />
            )}
        </Navbar>
    )
}

// Utils
function Ambassadors({ to }) {
    const props = params.uid(STATIC_PAGE, 'ambassadors')
    const [document, pending] = useDocument(props)
    const ambassadors = document?.data.content[0].value || []

    return pending ? (
        <Loading />
    ) : (
        <ColumnSet>
            {ambassadors.map(ambassador => {
                const fullName = ambassador['full-name']
                const hash = fullName.toLowerCase().replace(/\s/, '-', 'g')

                return (
                    <Link key={hash} to={`${to}#${hash}`}>
                        {fullName}
                    </Link>
                )
            })}
        </ColumnSet>
    )
}
