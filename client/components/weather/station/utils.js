import formatDate from 'date-fns/format'

export function getDateExtent(data) {
    const dates = data.map(observation => observation.measurementDateTime)

    return {
        min: new Date(Math.min(...dates)),
        max: new Date(Math.max(...dates)),
    }
}

export function formatHours(date, index) {
    let format = 'HH[h]'

    if (index === 0 || date.getHours() === 0) {
        format = 'HH[h][\n]YYYY-MM-DD'
    }

    return formatDate(date, format)
}

export const scatterEvents = [
    {
        target: 'data',
        eventHandlers: {
            onMouseOver() {
                return [
                    {
                        target: 'data',
                        mutation({ style }) {
                            return {
                                style: {
                                    ...style,
                                    fill: style.stroke,
                                },
                            }
                        },
                    },
                    {
                        target: 'labels',
                        mutation() {
                            return {
                                active: true,
                            }
                        },
                    },
                ]
            },
            onMouseOut() {
                return [
                    {
                        target: 'data',
                        mutation({ style }) {
                            return {
                                style: {
                                    ...style,
                                    fill: 'white',
                                },
                            }
                        },
                    },
                    {
                        target: 'labels',
                        mutation() {
                            return {
                                active: false,
                            }
                        },
                    },
                ]
            },
        },
    },
]

export const barEvents = [
    {
        target: 'data',
        eventHandlers: {
            onMouseOver() {
                return [
                    {
                        target: 'data',
                        mutation({ style }) {
                            return {
                                style: {
                                    ...style,
                                    opacity: 0.5,
                                },
                            }
                        },
                    },
                    {
                        target: 'labels',
                        mutation() {
                            return {
                                active: true,
                            }
                        },
                    },
                ]
            },
            onMouseOut() {
                return [
                    {
                        target: 'data',
                        mutation({ style }) {
                            return {
                                style: {
                                    ...style,
                                    opacity: 1,
                                },
                            }
                        },
                    },
                    {
                        target: 'labels',
                        mutation() {
                            return {
                                active: false,
                            }
                        },
                    },
                ]
            },
        },
    },
]
