import React from 'react'
import { Regions } from 'containers/features'
import { List, ListItem } from 'components/page'
import { Loading } from 'components/text'
import Page from 'layouts/Page'
import externals from 'router/externals'

export default function ForecastRegionList() {
    return (
        <Page
            title="Forecast regions"
            headline="Click on a link below to read the avalanche bulletin.">
            <Regions>{renderer}</Regions>
        </Page>
    )
}

function renderer({ pending, data }) {
    if (pending || !data) {
        return <Loading />
    }

    return (
        <List>
            {data.map(({ id, name }) => {
                const to = externals.has(id) ? externals.get(id) : id
                const target = externals.has(id) ? id : null

                return (
                    <ListItem key={id} to={to} target={target}>
                        {name}
                    </ListItem>
                )
            })}
        </List>
    )
}
