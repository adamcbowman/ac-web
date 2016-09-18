import {createSelector} from 'reselect'
import {HotZoneArea, HotZoneReport} from 'api/schemas'
import {getEntitiesForSchema, getEntityForSchema} from 'reducers/api/entities'
import {getResultsSet} from 'reducers/api/getters'
import {RESULT} from 'reducers/api/results'

function getName(state, {params}) {
    return params.name
}

function getHotZoneArea(state, {params}) {
    return getEntityForSchema(state, HotZoneArea, params.name)
}

function getHotZoneReport(state, {params}) {
    return getEntityForSchema(state, HotZoneReport, params.name)
}

function getHotZoneReportResultsSet(state, {params}) {
    return getResultsSet(state, HotZoneReport, params) || RESULT

}

export default createSelector(
    getName,
    getHotZoneArea,
    getHotZoneReport,
    getHotZoneReportResultsSet,
    (name, area, report, {isFetching, isError}) => {
        if (report) {
            report = report.toJSON()

            return {
                isLoading: isFetching,
                isError,
                title: report.report.headline,
                report,
                link: `/hot-zone-reports/${name}`,
            }
        } else {
            const name = area && area.getIn(['properties', 'name'])

            return {
                isLoading: isFetching,
                isError,
                title: isFetching ? name : name && `${name} report is not available`,
            }
        }
    }
)
