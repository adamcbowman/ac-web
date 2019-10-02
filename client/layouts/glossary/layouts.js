import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Router, Link } from '@reach/router'
import memoize from 'lodash/memoize'
import throttle from 'lodash/throttle'
import escapeRegExp from 'lodash/escapeRegExp'
import { memo } from 'utils/react'
import { FragmentIdentifier } from 'router'
import Sidebar, {
    Item as SidebarItem,
    Header as SidebarHeader,
} from 'components/sidebar'
import { Main, Content, Aside, Headline } from 'components/page'
import { Loading } from 'components/text'
import { TagSet, Tag } from 'components/tag'
import { Muted } from 'components/text'
import { Search } from 'components/form'
import { Document, Documents } from 'prismic/containers'
import { glossary } from 'prismic/params'
import { StructuredText, SliceZone } from 'prismic/components/base'
import SliceComponents from 'prismic/components/slice/rework'
import styles from './Glossary.css'
import Edit from 'prismic/Edit'

export default function Layout() {
    return (
        <Content>
            <Main>
                <Router>
                    <Definition path="terms/:uid" />
                    <Glossary default />
                </Router>
            </Main>
            <Aside>
                <Router primary={false}>
                    <GlossarySidebar path="/" />
                </Router>
            </Aside>
        </Content>
    )
}

const GlossarySidebar = memo.static(function GlossarySidebar() {
    return (
        <Sidebar>
            <SidebarHeader>Related links</SidebarHeader>
            <SidebarItem>
                <a
                    href="http://www.alpine-rescue.org/xCMS5/WebObjects/nexus5.woa/wa/icar?menuid=1088"
                    target="ICAR">
                    ICAR Glossary
                </a>
            </SidebarItem>
            <SidebarItem>
                <a
                    href="//avalanche.ca/fxresources/AvalancheLexiqueLexicon.pdf"
                    target="LexiqueLexicon">
                    Lexique Avalanche - Avalanche Lexicon
                </a>
            </SidebarItem>
        </Sidebar>
    )
})

function Glossary(props) {
    return (
        <Document {...glossary.glossary()}>
            {({ document, pending }) => (
                <Fragment>
                    {pending && <Loading />}
                    {document && (
                        <Fragment>
                            <Edit position="fixed" id={document.id} />
                            <GlossaryContent {...props} {...document.data} />
                        </Fragment>
                    )}
                </Fragment>
            )}
        </Document>
    )
}

Definition.propTypes = {
    uid: PropTypes.string.isRequired,
}
function Definition({ uid }) {
    return (
        <Document {...glossary.definition(uid)}>
            {({ pending, document }) => (
                <Fragment>
                    {pending && <Loading />}
                    {document && (
                        <DefinitionLayout linkToExternal {...document} />
                    )}
                </Fragment>
            )}
        </Document>
    )
}

// Util layouts
DefinitionLayout.propTypes = {
    linkToExternal: PropTypes.bool,
    id: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
    tags: PropTypes.array.isRequired,
    data: PropTypes.object.isRequired,
}

function DefinitionLayout({ id, uid, tags, data, linkToExternal }) {
    const { title } = data

    return (
        <article className={styles.Definition}>
            <h2>
                {linkToExternal ? (
                    title
                ) : (
                    <FragmentIdentifier hash={uid} title={title}>
                        {title}
                    </FragmentIdentifier>
                )}
            </h2>
            <Edit id={id} position="absolute" />
            {tags.length > 0 && (
                <TagSet>
                    {tags.map((tag, index) => (
                        <Tag key={index}>{tag}</Tag>
                    ))}
                </TagSet>
            )}
            <SliceZone
                components={SliceComponents}
                value={data.content.filter(isImage)}
                fullscreen
            />
            <SliceZone
                components={SliceComponents}
                value={data.content.filter(isNotImage)}
            />
            <Related linkToExternal={linkToExternal} items={data.related} />
        </article>
    )
}

Related.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    linkToExternal: PropTypes.bool,
}

function Related({ items, linkToExternal }) {
    items = items.filter(hasDefinition)
    return items.length === 0 ? null : (
        <div>
            <Muted>See also: </Muted>
            <ul>
                {items.filter(isNotBroken).map(({ definition }) => {
                    const { uid } = definition
                    const { title } = definition.data

                    return (
                        <li key={uid}>
                            {linkToExternal ? (
                                <Link to={`../${uid}`} title={title}>
                                    {title}
                                </Link>
                            ) : (
                                <a href={`#${uid}`} title={title}>
                                    {title}
                                </a>
                            )}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

LetterTag.propTypes = {
    letter: PropTypes.string.isRequired,
}

function LetterTag({ letter }) {
    return (
        <Tag key={letter}>
            <a href={`#${letter.toLowerCase()}`}>
                <b>{letter.toUpperCase()}</b>
            </a>
        </Tag>
    )
}

class GlossaryContent extends Component {
    static propTypes = {
        headline: PropTypes.arrayOf(PropTypes.object).isRequired,
        location: PropTypes.object.isRequired,
        navigate: PropTypes.func.isRequired,
    }
    get term() {
        const params = new URLSearchParams(this.props.location.search)

        return params.has('q') ? params.get('q') : ''
    }
    shouldComponentUpdate({ location }) {
        return location.search !== this.props.location.search
    }
    handleSearchChange = throttle(term => {
        const params = new URLSearchParams()

        if (term) {
            params.set('q', term)
        }

        this.props.navigate(`?${params.toString()}`)
    }, 250)
    createSections = memoize(pages => {
        const documents = pages.reduce(
            (documents, page) => [...documents, ...(page.documents || [])],
            []
        )
        const allDefinitions = new Map(
            documents.map(document => [
                document.uid,
                createDefinition(document),
            ])
        )

        return LETTERS.reduce((sections, letter) => {
            const definitions = this.props[letter.toLowerCase()]
                .filter(hasDefinition)
                .map(({ definition }) => allDefinitions.get(definition.uid))
                .filter(Boolean)

            if (definitions.length > 0) {
                sections.push({
                    letter,
                    definitions,
                })
            }

            return sections
        }, [])
    })
    renderContent(pages) {
        const { term } = this
        const pending = pages.some(page => page.pending)
        const fulfilled = pages.every(page => page.fulfilled)
        let sections = this.createSections(pages)

        if (fulfilled && term) {
            sections = filterSections(term, sections)
        }

        return (
            <Fragment>
                {pending ? (
                    <Loading>Loading definitions...</Loading>
                ) : sections.length === 0 ? (
                    <Muted>No definition matches your criteria.</Muted>
                ) : null}
                {fulfilled && (
                    <TagSet>
                        {sections.map(({ letter }) => (
                            <LetterTag key={letter} letter={letter} />
                        ))}
                    </TagSet>
                )}
                {fulfilled && sections.map(renderSection)}
            </Fragment>
        )
    }
    render() {
        const params = glossary.definitions()

        return (
            <Fragment>
                <Headline>
                    <StructuredText value={this.props.headline} />
                </Headline>
                <Search
                    onChange={this.handleSearchChange}
                    value={this.term}
                    placeholder="Search for a definition"
                />
                <Documents {...params} page={1}>
                    {first => (
                        <Documents {...params} page={2}>
                            {second => this.renderContent([first, second])}
                        </Documents>
                    )}
                </Documents>
            </Fragment>
        )
    }
}

Section.propTypes = {
    letter: PropTypes.string.isRequired,
    definitions: PropTypes.array.isRequired,
}

function Section({ letter, definitions }) {
    if (definitions.length === 0) {
        return null
    }

    return (
        <section key={letter} className={styles.Section}>
            <h1>
                <FragmentIdentifier hash={letter.toLowerCase()}>
                    {letter}
                </FragmentIdentifier>
            </h1>
            {definitions.map(definition => (
                <DefinitionLayout key={definition.uid} {...definition} />
            ))}
        </section>
    )
}

// Constants
const LETTERS = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ')

// Utils
function hasDefinition({ definition }) {
    return Boolean(definition)
}
function isNotBroken({ definition }) {
    return definition.isBroken === false
}
function isText({ slice_type }) {
    return slice_type === 'text'
}
function isImage({ slice_type }) {
    return slice_type === 'image'
}
function isNotImage({ slice_type }) {
    return slice_type !== 'image'
}
function renderSection(props) {
    return <Section key={props.letter} {...props} />
}
function createDefinition(definition) {
    const { uid, data, tags } = definition

    const images = data.content.filter(isImage)
    const related = data.related.filter(hasDefinition).filter(isNotBroken)
    const texts = data.content.filter(isText)
    const searchables = [
        uid,
        data.title,
        related.reduce(
            (previous, current) => [...previous, current.definition.data.title],
            []
        ),
        texts.reduce(
            (previous, current) =>
                current.primary.content.reduce(
                    (previous, current) => [...previous, current.text],
                    previous
                ),
            []
        ),
        images.reduce(
            (previous, current) => [
                current.primary.credit,
                current.primary.caption.reduce(
                    (previous, current) => [...previous, current.text],
                    previous
                ),
            ],
            []
        ),
        tags,
    ]
        .flat()
        .filter(Boolean)

    return {
        ...definition,
        searchable: searchables.join(' '),
    }
}
const filterSections = memoize((term, sections) => {
    const regexp = new RegExp(escapeRegExp(term), 'gi')
    function predicate(definition) {
        return regexp.test(definition.searchable)
    }

    return sections.reduce((sections, section) => {
        if (section.definitions.some(predicate)) {
            sections.push({
                ...section,
                definitions: section.definitions.filter(predicate),
            })
        }

        return sections
    }, [])
})
