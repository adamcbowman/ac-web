import React, { Fragment, useReducer } from 'react'
import PropTypes from 'prop-types'
import { Responsive, PageSizeSelector } from 'components/table'
import {
    Table,
    TBody,
    Header,
    HeaderCell,
    Row,
    Cell,
    Caption,
} from 'components/table'
import Pagination from 'components/pagination'
import { Loading, Muted } from 'components/text'
import { Br } from 'components/misc'
import snakeCase from 'lodash/snakeCase'
import { NONE, DESC } from 'constants/sortings'
import { StructuredText } from 'prismic/components/base'
import { Documents } from 'prismic/containers'
import * as Predicates from 'prismic/predicates'
import { createAction } from 'utils/reducer'

PrismicTable.propTypes = {
    value: PropTypes.array.isRequired,
}

export default function PrismicTable({ value }) {
    const columns = value.map(createColumn)
    const type = value?.[0]?.source
    const initial = {
        sorting: [null, NONE],
        pageSize: 10,
        page: 1,
        onSortingChange(...sorting) {
            dispatch(setSorting(sorting))
        },
        onPageSizeChange(pageSize) {
            dispatch(setPageSize(pageSize))
        },
        onPageChange(page) {
            dispatch(setPage(page))
        },
    }
    const [state, dispatch] = useReducer(reducer, initial)
    const orderings = []
    const [name, order] = state.sorting

    if (name && order !== NONE) {
        orderings.push(
            `my.${type}.${snakeCase(name)} ${
                order === DESC ? 'desc' : ''
            }`.trim()
        )
    }

    const params = {
        predicates: [Predicates.type(type)],
        orderings,
        pageSize: state.pageSize,
        page: state.page,
    }

    function getSorting(column) {
        if (column.sortable) {
            const [name, order] = state.sorting

            if (column.name === name) {
                return order
            }

            return NONE
        }
    }

    return (
        <Documents {...params}>
            {({ documents = [], pending, total_pages, total_results_size }) => (
                <Fragment>
                    <Br />
                    <Responsive>
                        <Table bordered>
                            <Header>
                                <Row>
                                    {columns.map(column => (
                                        <HeaderCell
                                            key={column.name}
                                            sorting={getSorting(column)}
                                            onSortingChange={state.onSortingChange.bind(
                                                null,
                                                column.name
                                            )}>
                                            {column.title}
                                        </HeaderCell>
                                    ))}
                                </Row>
                            </Header>
                            <TBody>
                                {documents.map(row => (
                                    <Row key={row.id}>
                                        {columns.map(({ name, property }) => (
                                            <Cell key={name}>
                                                {property(row.data)}
                                            </Cell>
                                        ))}
                                    </Row>
                                ))}
                            </TBody>
                            <Caption>
                                {pending ? (
                                    <Loading>Loading documents...</Loading>
                                ) : (
                                    <Muted>
                                        {`Total of ${total_results_size} documents
                                    found.`}
                                    </Muted>
                                )}
                            </Caption>
                        </Table>
                    </Responsive>
                    <PageSizeSelector
                        value={state.pageSize}
                        onChange={state.onPageSizeChange}
                        suffix="documents par page"
                    />
                    <Pagination
                        active={state.page}
                        onChange={state.onPageChange}
                        total={total_pages}
                    />
                </Fragment>
            )}
        </Documents>
    )
}

// Reducer and actions
const setSorting = createAction('SORTING')
const setPageSize = createAction('PAGE_SIZE')
const setPage = createAction('PAGE')
function reducer(state, { type, payload }) {
    switch (type) {
        case 'SORTING':
            return {
                ...state,
                sorting: payload,
                page: 1,
            }
        case 'PAGE_SIZE':
            return {
                ...state,
                pageSize: payload,
                page: 1,
            }
        case 'PAGE':
            return {
                ...state,
                page: payload,
            }
        default:
            return state
    }
}

// Constants
const YES = 'Yes'

// Utils
function createProperty(type, property, option1) {
    switch (type) {
        case 'Link':
            return function link(data) {
                return (
                    <a href={data[option1]} target="_blank">
                        {data[property]}
                    </a>
                )
            }
        case 'Html':
            return function html(data) {
                return <StructuredText value={data[property]} />
            }
        default:
            return data => data[property]
    }
}

function createColumn({ name, sortable, type, property, filterable, option1 }) {
    return {
        name: property,
        title: name,
        sortable: sortable === YES,
        filterable: filterable === YES,
        property: createProperty(type, property, option1),
    }
}
