import React, { Fragment, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Router, Link, Redirect } from '@reach/router'
import { tutorial } from 'prismic/params'
import * as Page from 'components/page'
import { Warning as Alert } from 'components/alert'
import Tree, { Node } from 'components/tree'
import { SliceZone } from 'prismic/components/base'
import {
    useLocale,
    Provider as LocaleProvider,
    Translate,
} from 'contexts/locale'
import SliceComponents from 'prismic/components/slice/rework'
import { Loading } from 'components/text'
import Pager, { Previous, Next } from 'components/pager'
import Shim from 'components/Shim'
import Drawer, {
    Close,
    Body,
    Navbar,
    Header,
    Container,
} from 'components/page/drawer'
import { Menu } from 'components/icons'
import { Warning } from 'components/text'
import ATESExercise from './ATESExercise'
import RouteFindingExercise from './RouteFindingExercise'
import Quiz from './Quiz'
import Question from './Question'
import Button, { SUBTILE } from 'components/button'
import dictionnaries from './locales'
import { useWindowSize, useBoolean } from 'hooks'
import { FR, EN } from 'constants/locale'
import { useDocument } from 'prismic/hooks'
import { useLocation } from 'router/hooks'

// TODO: Use Context to propagate the tutorial document
// TODO: Brings LocaleProvider out of this layout...should be bring in the index file

Layout.propTypes = {
    location: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
    uri: PropTypes.string.isRequired,
}

export default function Layout(props) {
    const { uri } = props
    const context = useMemo(
        () => ({
            locale: getLocaleFromProps(uri),
            dictionnaries,
        }),
        [uri]
    )
    const { locale } = context

    return (
        <Fragment>
            {locale === FR && (
                <Alert>
                    Quelques sections de notre tutoriel ne sont pas à jour.
                    Revenez regulièrement pour consulter les améliorations que
                    nous y apportons.
                    <br />
                    Some sections of the French tutorial are outdated. We are
                    currently working on improvements so stay tuned for updates!
                </Alert>
            )}
            <Page.Page>
                <Page.Content>
                    <LocaleProvider value={context}>
                        <LayoutContent {...props} />
                    </LocaleProvider>
                </Page.Content>
            </Page.Page>
        </Fragment>
    )
}

function LayoutContent({ uri, path, location }) {
    const [document] = useHome()
    const isExact = path === uri
    const title = document?.data?.title[0]?.text

    return (
        <Fragment>
            <Sidebar
                location={location}
                items={document?.data?.items}
                title={title}
            />
            <Content>
                <h1>
                    {title ? (
                        isExact ? (
                            title
                        ) : (
                            <Link to={uri}>{title}</Link>
                        )
                    ) : (
                        <Loading />
                    )}
                </h1>
            </Content>
        </Fragment>
    )
}

Sidebar.propTypes = {
    title: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
}

function Sidebar({ title, location, items = [], path }) {
    const { width } = useWindowSize()
    const [opened, , close, toggle] = useBoolean(false)
    const tree = (
        <Tree>
            {items
                .reduce(reduceTreeNode, [])
                .map(node => renderTreeNode(node, path))}
        </Tree>
    )

    useEffect(close, [location.pathname])

    return width > 860 ? (
        <Page.Aside style={ASIDE_STYLE}>
            <Shim vertical right>
                {tree}
            </Shim>
        </Page.Aside>
    ) : (
        <Fragment>
            <Button kind={SUBTILE} onClick={toggle} style={BUTTON_STYLE}>
                <Menu />
            </Button>
            <Drawer
                open={opened}
                width={0.75 * width}
                backdrop
                onCloseClick={close}>
                <Container>
                    <Navbar>
                        <Close onClick={close} />
                    </Navbar>
                    <Header subject={title} style={HEADER_STYLE} />
                    <Body>{tree}</Body>
                </Container>
            </Drawer>
        </Fragment>
    )
}

function Content({ children }) {
    const { location } = useLocation()
    const params = new URLSearchParams(location.search)

    return (
        <Page.Main style={CONTENT_STYLE}>
            {children}
            <Router>
                <Home path="/" />
                <Tutorial path="/*" />
            </Router>
            {params.has('uid') && <Redirector uid={params.get('uid')} />}
        </Page.Main>
    )
}

function Redirector({ uid }) {
    const [document] = useHome()

    if (!document) {
        return null
    }

    const { items } = document.data
    function findByUID({ link }) {
        return link.uid == uid
    }

    if (!items.some(findByUID)) {
        return null
    }

    const index = items.findIndex(findByUID)
    const paths = []
    let level = Number(items[index].level)
    function finder(item) {
        return item.level == level
    }
    const usefullItems = items.slice(0, index + 1).reverse()

    do {
        const item = usefullItems.find(finder)
        const { uid } = item.link

        paths.push(uid)

        level = level - 1
    } while (level > 0)

    paths.push(location.pathname)

    return <Redirect noThrow to={paths.reverse().join('/')} />
}

function Home() {
    const [document] = useHome()

    if (!document) {
        return null
    }

    const [first] = document.data.items

    return (
        <Fragment>
            <SliceZone
                components={TutorialSliceComponents}
                value={document.data.content}
            />
            <Pager>
                <Next
                    to={getUIDFromMenuItem(first)}
                    subtitle={<Translate>Start with</Translate>}>
                    {first.title}
                </Next>
            </Pager>
        </Fragment>
    )
}

Tutorial.propTypes = {
    ['*']: PropTypes.string.isRequired,
    uri: PropTypes.string.isRequired,
}

function Tutorial(props) {
    const { uri } = props
    const [uid] = props['*'].split('/').reverse()
    const [article, pending] = useArticle(uid)

    if (pending) {
        return (
            <h2>
                <Loading />
            </h2>
        )
    }

    if (article) {
        return (
            <Fragment>
                <h2>{article.data.title[0].text}</h2>
                <SliceZone
                    components={TutorialSliceComponents}
                    value={article.data.content}
                />
                <HomePager uid={uid} uri={uri} />
            </Fragment>
        )
    }

    return <NoDocument uid={uid} uri={uri} />
}

function HomePager({ uid, uri }) {
    const [document] = useHome()

    if (!document) {
        return null
    }

    const { items, title } = document.data
    const item = items.find(item => getUIDFromMenuItem(item) === uid)
    const index = items.indexOf(item)
    const previous = items[index - 1]
    const next = items[index + 1]
    const previousSubtitle = previous ? 'Previous' : 'Back to'

    return (
        <Pager>
            <Previous
                to={previous ? buildNodeLink(previous, items, uri) : uri}
                subtitle={<Translate>{previousSubtitle}</Translate>}>
                {previous ? previous.title : title[0].text}
            </Previous>
            {next && (
                <Next
                    to={buildNodeLink(next, items, uri)}
                    subtitle={<Translate>Next</Translate>}>
                    {next.title}
                </Next>
            )}
        </Pager>
    )
}

NoDocument.propTypes = {
    uid: PropTypes.string.isRequired,
    uri: PropTypes.string.isRequired,
}

function NoDocument({ uid, uri }) {
    const [document] = useHome()
    function getItemTitle(document) {
        if (!document) {
            return uid
        }

        const item = document.data.items.find(
            item => item.link?.value?.document?.uid === uid
        )

        return item ? item.title : uid
    }

    return (
        <Fragment>
            <Warning>
                <Translate>There is no document for</Translate>{' '}
                {getItemTitle(document)}.
            </Warning>
            <Pager>
                <Next to={uri} subtitle={<Translate>Visit the</Translate>}>
                    {document?.data?.title?.[0]?.text || null}
                </Next>
            </Pager>
        </Fragment>
    )
}

// Utils
function getUIDFromMenuItem({ link }) {
    return link.uid
}
function renderTreeNode({ title, link, children }, splat) {
    const { uid } = link
    const uids = [splat, uid].filter(Boolean)

    splat = uids.join('/')

    return (
        <Node key={uid} link={splat} label={title} title={title}>
            {children.map(node => renderTreeNode(node, splat))}
        </Node>
    )
}
function reduceTreeNode(nodes, item) {
    const { level, ...node } = item

    node.children = []

    return pushNode(node, Number(level) - 1, nodes)
}
function pushNode(node, deep, nodes) {
    switch (deep) {
        case 0:
            nodes.push(node)
            break
        case 1:
            if (nodes[nodes.length - 1]) {
                nodes[nodes.length - 1].children.push(node)
            }
            break
        default:
            if (nodes[nodes.length - 1]) {
                pushNode(node, deep - 1, nodes[nodes.length - 1].children)
            }
    }
    return nodes
}
function buildNodeLink(node, nodes, root) {
    let level = Number(node.level) - 1
    const index = nodes.indexOf(node)
    const uids = [getUIDFromMenuItem(node)]
    const previousItems = nodes.slice(0, index)

    previousItems.reverse()

    for (node of previousItems) {
        if (node.level == level) {
            level = level - 1
            uids.unshift(getUIDFromMenuItem(node))
        }
    }

    return [root, ...uids].join('/')
}
function getLocaleFromProps(uri) {
    return uri === '/tutoriel' ? FR : EN
}
function useHome() {
    const { locale } = useLocale()

    return useDocument(tutorial.home(locale))
}
function useArticle(uid) {
    const { locale } = useLocale()

    return useDocument(tutorial.article(uid, locale))
}

// Styles
const HEADER_STYLE = {
    paddingBottom: '1em',
}
const ASIDE_STYLE = {
    width: 350,
    flex: 'none',
}
const CONTENT_STYLE = {
    flex: 1,
}
const BUTTON_STYLE = {
    float: 'left',
    padding: '1em',
    position: 'relative',
    top: '-0.75em',
}

// Components
const TutorialSliceComponents = new Map([
    ...SliceComponents,
    ['atesExercise', ATESExercise],
    ['routeFindingExercise', RouteFindingExercise],
    ['quiz', Quiz],
    ['question', Question],
])
