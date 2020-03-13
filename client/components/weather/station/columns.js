import { setUTCOffset } from 'utils/date'
import format from 'date-fns/format'

const DASH = '—'

//
// Check if properties are null/undefined/NaN and return a dash otherwise
// process and return that value
//
function maybeNull(name, fn = x => x) {
    return function(obj) {
        const value = obj[name]

        if (value === undefined || value === null || isNaN(value)) {
            return DASH
        }

        return fn(value)
    }
}

function singleDecimal(number) {
    return (Math.round(number * 10) / 10).toFixed(1)
}

export const Hour = {
    name: 'hour',
    title: 'Hour',
    property({ measurementDateTime, utcOffset }) {
        return format(setUTCOffset(measurementDateTime, utcOffset), 'HH[h]')
    },
}

export const SnowHeight = {
    name: 'snowHeight',
    title: 'Height',
    property: maybeNull('snowHeight', snowHeight => Math.round(snowHeight)),
    style: {
        minWidth: 65,
    },
}

export const NewSnow = {
    name: 'newSnow',
    title: 'New',
    property: maybeNull('newSnow'),
    style: {
        minWidth: 65,
    },
}

export const AirTemperatureAvg = {
    name: 'airTempAvg',
    title: 'Air Temperature Average (°C)',
    property: maybeNull('airTempAvg', singleDecimal),
    style: {
        minWidth: 65,
    },
}

export const AirTemperatureMax = {
    name: 'airTempMax',
    title: 'Air Temperature Max (°C)',
    property: maybeNull('airTempMax'),
    style: {
        minWidth: 65,
    },
}

export const AirTemperatureMin = {
    name: 'airTempMin',
    title: 'Air Temperature Min (°C)',
    property: maybeNull('airTempMin'),
    style: {
        minWidth: 65,
    },
}

export const WindSpeedAvg = {
    name: 'windSpeedAvg',
    title: 'Wind Speed Average (km/h)',
    property: maybeNull('windSpeedAvg', singleDecimal),
    style: {
        minWidth: 65,
    },
}

export const WindDirectionAvg = {
    name: 'windDirAvg',
    title: 'Wind Direction Average',
    property({ windDirAvg, windDirCompass }) {
        if (typeof windDirAvg === 'number') {
            const value = windDirAvg + ' °'

            if (windDirCompass) {
                return value + ` (${windDirCompass})`
            }

            return value
        }

        if (windDirCompass) {
            return windDirCompass
        }

        return DASH
    },
    style: {
        minWidth: 105,
    },
}

export const WindSpeedGust = {
    name: 'windSpeedGust',
    title: 'Wind Speed Gust (km/h)',
    property: maybeNull('windSpeedGust', singleDecimal),
    style: {
        minWidth: 65,
    },
}

export const RelativeHumidity = {
    name: 'relativeHumidity',
    title: 'Relative Humidity (%)',
    property: maybeNull('relativeHumidity', rh =>
        Math.min(Math.round(rh), 100)
    ),
    style: {
        minWidth: 65,
    },
}
