import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import ErrorBoundary from 'components/ErrorBoundary'
import * as Text from 'components/text'
import * as Page from 'components/page'
import Button, { ButtonSet } from 'components/button'
import styles from 'components/page/Page.css'

Bundle.propTypes = {
    children: PropTypes.element.isRequired,
    fallback: PropTypes.element,
}

export default function Bundle({ children, fallback = <Text.Loading /> }) {
    return (
        <ErrorBoundary capture={false} fallback={<Error />}>
            <Suspense fallback={fallback}>{children}</Suspense>
        </ErrorBoundary>
    )
}

function Error({ error }) {
    if (error instanceof SyntaxError) {
        return <ErrorPage error={error} />
    }

    if (error.name === 'ChunkLoadError') {
        return (
            <ErrorPage
                title="A new version of this page is available!"
                headline="Press the button below to reload it"
                error={error}
            />
        )
    }

    throw error
}

function ErrorPage({
    title = 'Uh oh! We never thought that would happen...',
    headline = 'An error happened while loading this page.',
    error,
}) {
    function reload() {
        window.location.reload(true)
    }

    return (
        <Page.Error>
            <Page.Main>
                <h1>{title}</h1>
                <Page.Headline>
                    {headline}
                    <Text.Error>{error.message}</Text.Error>
                </Page.Headline>
                <ButtonSet>
                    <Button onClick={reload} className={styles.Link}>
                        Reload this page
                    </Button>
                </ButtonSet>
            </Page.Main>
        </Page.Error>
    )
}
