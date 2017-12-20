import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import formatDate from 'date-fns/format'
import startOfTomorrow from 'date-fns/start_of_tomorrow'
import startOfYesterday from 'date-fns/start_of_yesterday'
import endOfYesterday from 'date-fns/end_of_yesterday'
import isToday from 'date-fns/is_today'
import subDays from 'date-fns/sub_days'
import addDays from 'date-fns/add_days'
import startOfMonth from 'date-fns/start_of_month'
import endOfMonth from 'date-fns/end_of_month'
import { load } from 'actions/prismic'
import {
    getDocumentFromParams,
    getDocumentsFromParams,
    getResult,
} from 'getters/prismic'
import { parse } from 'prismic'
import * as Predicates from 'vendor/prismic/predicates'
import { DATE } from 'utils/date'
import {
    GENERIC,
    STATIC_PAGE,
    APPLICATION_FEATURE,
    NEWS,
    EVENT,
    BLOG,
    SPECIAL_INFORMATION,
    FATAL_ACCIDENT,
    TOYOTA_TRUCK_REPORT,
    HOTZONE_REPORT,
    SPAW as SPAW_TYPE,
} from 'constants/prismic'
import SponsorsMetadata from 'containers/SponsorsMetadata'
import Container from 'containers/Container'
import * as utils from './utils'

const DocumentContainer = connect(
    createStructuredSelector({
        data(state, { params, messages }) {
            // TODO: More work here to test if document already exists
            const result = getResult(state, params)

            return {
                document: getDocumentFromParams(state, params),
                status: result.asStatus(messages).toObject(),
                metadata: result.toMetadata(),
            }
        },
    }),
    { load }
)(Container)

export const DocumentsContainer = connect(
    createStructuredSelector({
        data(state, { params, messages }) {
            const result = getResult(state, params)

            return {
                documents: getDocumentsFromParams(state, params),
                status: result.asStatus(messages).toObject(),
                metadata: result.toMetadata(),
            }
        },
    }),
    { load }
)(Container)

export class Document extends Component {
    static propTypes = {
        children: PropTypes.func.isRequired,
        uid: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        parse: PropTypes.bool,
    }
    get params() {
        const { type, uid } = this.props

        return {
            predicates: [Predicates.type(type), Predicates.uid(type, uid)],
        }
    }
    children = ({ document, status }) =>
        this.props.children({
            status,
            document: data(document),
        })
    render() {
        const { parse, children } = this.props

        return (
            <DocumentContainer params={this.params}>
                {parse ? this.children : children}
            </DocumentContainer>
        )
    }
}

export class DocumentsOfType extends Component {
    static propTypes = {
        type: PropTypes.string.isRequired,
        children: PropTypes.func.isRequired,
    }
    get params() {
        return {
            predicates: [Predicates.type(this.props.type)],
        }
    }
    render() {
        return (
            <DocumentsContainer params={this.params}>
                {this.props.children}
            </DocumentsContainer>
        )
    }
}

Generic.propTypes = {
    uid: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired,
}

export function Generic({ uid, children }) {
    return (
        <Document type={GENERIC} uid={uid}>
            {children}
        </Document>
    )
}

StaticPage.propTypes = {
    uid: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired,
}

export function StaticPage({ uid, children }) {
    return (
        <Document type={STATIC_PAGE} uid={uid}>
            {children}
        </Document>
    )
}

export class Tutorial extends Component {
    static propTypes = {
        slug: PropTypes.string.isRequired,
        children: PropTypes.func.isRequired,
    }
    get params() {
        const { slug } = this.props

        return {
            predicates: [Predicates.field('tutorial-page', 'slug', slug)],
        }
    }
    render() {
        return (
            <DocumentContainer params={this.params}>
                {this.props.children}
            </DocumentContainer>
        )
    }
}

export function ApplicationFeature({ children }) {
    const params = {
        predicates: [
            Predicates.type(APPLICATION_FEATURE),
            Predicates.dateBefore(
                `my.${APPLICATION_FEATURE}.startDate`,
                utils.formatDate(startOfTomorrow())
            ),
            Predicates.dateAfter(
                `my.${APPLICATION_FEATURE}.endDate`,
                utils.formatDate(startOfYesterday())
            ),
        ],
    }

    return (
        <DocumentContainer params={params}>
            {({ document }) => children(document ? parse(document) : null)}
        </DocumentContainer>
    )
}

export class DocumentsById extends Component {
    static propTypes = {
        ids: PropTypes.arrayOf(PropTypes.string).isRequired,
        children: PropTypes.func.isRequired,
    }
    get params() {
        const { ids } = this.props

        return {
            predicates: [Predicates.in('document.id', ids)],
            options: {
                pageSize: ids.length,
            },
        }
    }
    children = ({ documents, ...rest }) => {
        return this.props.children({
            ...rest,
            documents: documents.filter(Boolean).map(parse),
        })
    }
    render() {
        return (
            <DocumentsContainer params={this.params}>
                {this.children}
            </DocumentsContainer>
        )
    }
}

export class WeatherForecast extends Component {
    static propTypes = {
        date: PropTypes.instanceOf(Date),
        children: PropTypes.func.isRequired,
    }
    static defaultProps = {
        date: new Date(),
    }
    state = {
        date: this.props.date,
    }
    get messages() {
        const date = formatDate(this.state.date, DATE)

        return {
            isLoading: `Loading weather forecast for ${date}...`,
            isError: `Error happened to load weather forecast for ${date}.`,
        }
    }
    get params() {
        const date = utils.formatDate(this.state.date)

        return {
            predicates: [Predicates.field('weather-forecast', 'date', date)],
        }
    }
    componentWillReceiveProps({ date }) {
        if (date !== this.props.date) {
            this.setState({ date })
        }
    }
    componentDidUpdate() {
        const { date } = this.state

        if (isToday(date) && this.status.isLoaded && !this.document) {
            // Between midnight and usual 4am publish time, we are showing
            // the day before forecast
            this.setState({
                date: subDays(date, 1),
            })
        }
    }
    children = ({ status, document }) => {
        this.status = status
        this.document = document

        // TODO: messages should be set in layout at component level

        return this.props.children({
            status: status.set('messages', this.messages),
            forecast: data(document),
        })
    }
    render() {
        return (
            <DocumentContainer params={this.params}>
                {this.children}
            </DocumentContainer>
        )
    }
}

export class WeatherTutorial extends Component {
    static propTypes = {
        uid: PropTypes.string.isRequired,
        children: PropTypes.func.isRequired,
    }
    children = ({ status, document }) =>
        this.props.children({
            status,
            tutorial: data(document),
        })
    render() {
        return (
            <Document type="weather-forecast-tutorial" uid={this.props.uid}>
                {this.children}
            </Document>
        )
    }
}

const FEED_TYPES = [NEWS, BLOG, EVENT]

export class Post extends Component {
    static propTypes = {
        type: PropTypes.oneOf(FEED_TYPES).isRequired,
        uid: PropTypes.string.isRequired,
        children: PropTypes.func.isRequired,
    }
    children = ({ status, document }) =>
        this.props.children({
            status,
            post: parse(document),
        })
    render() {
        const { type, uid } = this.props

        return (
            <Document type={type} uid={uid}>
                {this.children}
            </Document>
        )
    }
}

function descending(a, b) {
    return b.date - a.date
}
function ascending(a, b) {
    return a.date - b.date
}

const FEED_SORTERS = new Map([
    [NEWS, descending],
    [BLOG, descending],
    [EVENT, ascending],
])

export class Feed extends Component {
    static propTypes = {
        type: PropTypes.oneOf(FEED_TYPES).isRequired,
        children: PropTypes.func.isRequired,
    }
    get params() {
        return {
            predicates: [Predicates.type(this.props.type)],
            options: {
                pageSize: 250,
            },
        }
    }
    children = ({ documents, status }) => {
        const transformed = documents.map(document => parse(document))
        let sorted = transformed.sort(FEED_SORTERS.get(this.props.type))

        // Bringing the first featured one on top!
        if (sorted.some(isFeaturedPost)) {
            const featured = sorted.find(isFeaturedPost)

            sorted = sorted.filter(post => featured !== post)

            sorted.unshift(featured)
        }

        return this.props.children({
            status,
            documents: sorted,
        })
    }
    render() {
        return (
            <DocumentsContainer params={this.params}>
                {this.children}
            </DocumentsContainer>
        )
    }
}

export class FeedSplash extends Component {
    static propTypes = {
        type: PropTypes.oneOf(FEED_TYPES).isRequired,
        tags: PropTypes.arrayOf(PropTypes.string),
        children: PropTypes.func.isRequired,
    }
    get params() {
        const { type, tags } = this.props
        const predicates = [Predicates.type(type)]
        let ordering = `my.${type}.date desc`

        if (Array.isArray(tags) && tags.length > 0) {
            predicates.push(Predicates.tags(tags))
        }

        if (type === EVENT) {
            ordering = `my.${EVENT}.start_date`
            predicates.push(
                Predicates.dateAfter(
                    `my.${EVENT}.start_date`,
                    utils.formatDate(new Date())
                )
            )
        }

        return {
            predicates,
            options: {
                pageSize: 5,
                orderings: [ordering],
            },
        }
    }
    // TODO: Reuse that function
    children = ({ documents, status }) =>
        this.props.children({
            status,
            documents: documents.map(document => parse(document)),
        })
    render() {
        return (
            <DocumentsContainer params={this.params}>
                {this.children}
            </DocumentsContainer>
        )
    }
}

export class FeedSidebar extends Component {
    static propTypes = {
        type: PropTypes.oneOf(FEED_TYPES).isRequired,
        uid: PropTypes.string,
        children: PropTypes.func.isRequired,
    }
    get params() {
        const { type } = this.props
        const predicates = [Predicates.type(type)]
        let ordering
        // TODO: Reuse a bit of the functions from FeedSplash container
        if (type === EVENT) {
            const tomorrow = utils.formatDate(startOfTomorrow())
            predicates.push(
                Predicates.dateAfter('my.event.start_date', tomorrow)
            )
            ordering = 'my.event.start_date'
        } else {
            predicates.push(Predicates.tags('featured'))
            ordering = `my.${type}.date desc`
        }

        return {
            predicates,
            options: {
                pageSize: 7,
                orderings: [ordering],
            },
        }
    }
    children = ({ documents, status }) =>
        this.props.children({
            status,
            documents: documents
                .filter(d => d.uid !== this.props.uid)
                .map(document => parse(document))
                .sort(FEED_SORTERS.get(this.props.type)),
        })
    render() {
        return (
            <DocumentsContainer params={this.params}>
                {this.children}
            </DocumentsContainer>
        )
    }
}

export class Sponsor extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        children: PropTypes.func.isRequired,
    }
    sponsor = ({ status, document }) =>
        this.props.children({
            status,
            sponsor: data(document),
        })
    sponsors = ({ props: { data } }) => {
        if (Object.keys(data).keys().length === 0) {
            return this.props.children({
                status: {
                    isLoading: true,
                },
            })
        }

        const { name } = this.props
        const uid = data[name] || name

        return (
            <Document type="sponsor" uid={uid}>
                {this.sponsor}
            </Document>
        )
    }
    render() {
        return <SponsorsMetadata>{this.sponsors}</SponsorsMetadata>
    }
}

export class SpecialInformation extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        children: PropTypes.func.isRequired,
    }
    render() {
        return (
            <Document parse type={SPECIAL_INFORMATION} uid={this.props.id}>
                {this.props.children}
            </Document>
        )
    }
}

export class FatalAccident extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        children: PropTypes.func.isRequired,
    }
    render() {
        return (
            <Document parse type={FATAL_ACCIDENT} uid={this.props.id}>
                {this.props.children}
            </Document>
        )
    }
}

export class ToyotaTruckReport extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        children: PropTypes.func.isRequired,
    }
    render() {
        return (
            <Document parse type={TOYOTA_TRUCK_REPORT} uid={this.props.id}>
                {this.props.children}
            </Document>
        )
    }
}

export class HotZoneReport extends Component {
    static propTypes = {
        region: PropTypes.string.isRequired,
        date: PropTypes.instanceOf(Date),
        children: PropTypes.func.isRequired,
    }
    get messages() {
        const { region } = this.props

        return {
            isLoading: `Loading ${region} hot zone report...`,
            isError: `Error happened while loading ${region} hot zone report.`,
        }
    }
    get params() {
        return {
            predicates: [
                Predicates.field(HOTZONE_REPORT, 'region', this.props.region),
                ...rangePredicates(
                    `my.${HOTZONE_REPORT}.dateOfIssue`,
                    `my.${HOTZONE_REPORT}.validUntil`,
                    this.props.date
                ),
            ],
            options: {
                pageSize: 1,
                orderings: [`my.${HOTZONE_REPORT}.dateOfIssue desc`],
            },
        }
    }
    children = ({ document, status }) =>
        this.props.children({
            status,
            report: document
                ? parse(document)
                : status.isLoaded ? null : undefined,
        })
    render() {
        return (
            <DocumentContainer params={this.params} messages={this.messages}>
                {this.children}
            </DocumentContainer>
        )
    }
}

export class MonthlyHotZoneReportSet extends Component {
    static propTypes = {
        region: PropTypes.string.isRequired,
        date: PropTypes.instanceOf(Date).isRequired,
        children: PropTypes.func.isRequired,
    }
    get params() {
        const { date, region } = this.props
        const start = startOfMonth(date).getTime()
        const end = endOfMonth(date).getTime()

        return {
            predicates: [
                Predicates.field(HOTZONE_REPORT, 'region', region),
                Predicates.dateBefore(`my.${HOTZONE_REPORT}.dateOfIssue`, end),
                Predicates.dateAfter(`my.${HOTZONE_REPORT}.validUntil`, start),
            ],
        }
    }
    children = ({ documents, status }) =>
        this.props.children({
            status,
            reports: documents.map(document => parse(document)),
        })
    render() {
        return (
            <DocumentsContainer params={this.params}>
                {this.children}
            </DocumentsContainer>
        )
    }
}

export class SPAW extends Component {
    static propTypes = {
        children: PropTypes.func.isRequired,
    }
    get params() {
        return {
            predicates: [
                Predicates.type(SPAW_TYPE),
                ...rangePredicates(
                    `my.${SPAW_TYPE}.start`,
                    `my.${SPAW_TYPE}.end`
                ),
            ],
        }
    }
    children = ({ document, status }) =>
        this.props.children({
            document: data(document),
            status,
        })
    render() {
        return (
            <DocumentContainer params={this.params}>
                {this.children}
            </DocumentContainer>
        )
    }
}

// Utils function
function data(document) {
    return document ? parse(document).data : undefined
}
function isFeaturedPost({ featured }) {
    return featured
}
function rangePredicates(start, end, date = new Date()) {
    return [
        Predicates.dateBefore(start, date.getTime()),
        Predicates.dateAfter(end, subDays(date, 1).getTime()),
    ]
}
