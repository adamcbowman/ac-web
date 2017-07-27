import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { AvalancheCanada, AvalancheCanadaFoundation } from '~/layouts'
import { FallbackPage } from '~/prismic/containers'

// import { scrollPosition } from '~/utils/dom'
// function shouldUpdateScroll(previous, next) {
//     if (!previous) {
//         return true
//     }
//
//     const { location: { hash, pathname } } = next
//
//     if (hash) {
//         return scrollPosition(hash) || [0, 0]
//     }
//
//     return pathname !== previous.location.pathname
// }

// TODO: Look if still need that, it is used for the listen or listenBefore function!
// There is probably a way to get around it!

function redirect({ location }) {
    // Leave the application and goes to nginx to do appropriate redirect
    document.location = location.pathname
}

export default function Router() {
    return (
        <BrowserRouter>
            <Switch>
                <Redirect
                    from="/events/VvLeBSUAAJgDAgX6"
                    to="/events/asa-snowmobile-show-2016"
                />
                <Redirect
                    from="/events/V-r2XyYAACcAblCX"
                    to="/events/spin-safety-fundraiser"
                />
                <Redirect
                    from="/events/VEFS_yYAACYARWyK"
                    to="/events/thunderstuck-fundraiser-2016"
                />
                <Redirect
                    from="/events/V9bxeiYAACgA9jex"
                    to="/events/cardel-homes-movie-ruin-rose"
                />
                <Redirect
                    from="/events/V9By4yYAACgAz0Ni"
                    to="/events/agm-save-the-date-2016"
                />
                <Redirect
                    from="/events/V7Sy6ycAACUAo4u_"
                    to="/events/bcsnowmobileshow_2016"
                />
                <Redirect
                    from="/events/Vmdqex4AAB0AxBYc"
                    to="/events/youth-snow-safety-phoenixmnt-2016"
                />
                <Redirect
                    from="/events/VnCZbR8AAFYKrNgo"
                    to="/events/aad-kananaskis-jan-2016"
                />
                <Redirect
                    from="/events/VoQjoR8AADZzIjEZ"
                    to="/events/aad-whitewater-jan-2016"
                />
                <Redirect
                    from="/events/VnCX1h8AAFYKrM88"
                    to="/events/lake-louise-staying-alive-2016"
                />
                <Redirect
                    from="/events/VliqsR0AAOcTy0Ig"
                    to="/events/aad-general-announcement-2016"
                />
                <Redirect
                    from="/events/VpfKah8AAI1FMEHK"
                    to="/events/aad-mtseymour-jan-2016"
                />
                <Redirect
                    from="/events/Vpf4ACMAACQAX8yN"
                    to="/events/aad-bouldermnt-revelstoke-2016"
                />
                <Redirect
                    from="/events/VsukNiMAACwavKfV"
                    to="/events/shreducation-yukon-feb-2016"
                />
                <Redirect
                    from="/events/VmdsER4AAPYJxB90"
                    to="/events/aad-lake-louise-2016"
                />
                <Redirect
                    from="/events/VoQkah8AAEZvIjSt"
                    to="/events/aad-khmr-jan-2016"
                />
                <Redirect
                    from="/events/VlyuDyUAACUAnMJ-"
                    to="/events/baw-fernie-jan-2016"
                />
                <Redirect
                    from="/events/Vo1p7yIAAMcFB2W7"
                    to="/events/aad-rossland-jan-2016"
                />
                <Redirect
                    from="/events/VpfMIx8AAKlFMEwl"
                    to="/events/aad-crowsnestpass-jan-2016"
                />
                <Redirect
                    from="/events/Vp1xcSYAACUAQUbq"
                    to="/events/aad-mtsima-jan-2016"
                />
                <Redirect
                    from="/events/VlywoyUAACQAnNG8"
                    to="/events/shreducation-revelstoke-jan-2016"
                />
                <Redirect
                    from="/events/VvHBBCwAAAisDiFM"
                    to="/events/avalanche-rescue-challenge-stewart-2016"
                />
                <Redirect
                    from="/events/VvLUTCUAAMEAAc3N"
                    to="/events/saskatchewan-snowmobile-show-nov-2016"
                />
                <Redirect
                    from="/events/VnCWSR8AAMoKrMX6"
                    to="/events/aad-garibaldi-jan-2016"
                />
                <Redirect
                    from="/events/VpRUhx8AABsHG57y"
                    to="/events/aad-kakwa-feb-2016"
                />
                <Redirect
                    from="/events/VpfOKCMAACIAXtdX"
                    to="/events/rumrunner-cherrybowl-presentation-2016"
                />
                <Redirect
                    from="/events/VrJnQisAAGMj2Y_U"
                    to="/events/ascend-splitboard-fest-2016"
                />
                <Redirect
                    from="/events/VrpuBSgAAEIC5kXJ"
                    to="/events/acc-cherrybowl-presentation-2016"
                />
                <Redirect
                    from="/events/VK8DjSMAACUANEm1"
                    to="/events/foundation-calgary-fundraiser-2016"
                />
                <Redirect
                    from="/events/VvBrrywAAHOKBjIg"
                    to="/events/bcsf-agm-pemberton-2016"
                />
                <Redirect
                    from="/events/VkTj0CAAAB8AKQs5"
                    to="/events/staying-alive-khmr-dec-2015"
                />
                <Redirect
                    from="/events/VmdlSR4AAAMNw_cW"
                    to="/events/aad-mt-cain-feb-2016"
                />
                <Redirect
                    from="/events/VoQlZx8AAEZvIjpK"
                    to="/events/aad-fernie-alpine-resort-2016"
                />
                <Redirect
                    from="/events/VownoR8AAIinUi2W"
                    to="/events/aad-apex-jan-2016"
                />
                <Redirect
                    from="/events/VpRSkB8AAOELG5N2"
                    to="/events/aad-whistler-jan-2016"
                />
                <Redirect
                    from="/events/VpmCByMAAFUcaOGm"
                    to="/events/aad-rmr-jan-2016"
                />
                <Redirect
                    from="/events/VqkoRSQAACUAbEwW"
                    to="/events/youth-sled-day-revelstoke-2016"
                />
                <Redirect
                    from="/events/VvLCACUAAMEAAWBL"
                    to="/events/avcan-agm-vancouver-fall-2016"
                />
                <Redirect
                    from="/events/VyE6eiYAAJURUa72"
                    to="/events/caa-spring-conference-case-studies-2016"
                />
                <Redirect
                    from="/events/VvF1CSwAAGKgDF2C"
                    to="/events/issw-2016-breckenridge"
                />
                <Redirect
                    from="/events/Vmdhxx4AAAQNw-Jb"
                    to="/events/aad-banff-jan-2016"
                />
                <Redirect
                    from="/events/Vqfpwh4AACMAso45"
                    to="/events/aad-smithers-2016"
                />
                <Redirect
                    from="/events/VvB06CwAAIqKBmhf"
                    to="/events/isc-2016-snowmobile"
                />
                <Redirect
                    from="/news/V-r0EyYAACcAbkKw"
                    to="/news/register-now"
                />
                <Redirect
                    from="/news/V8hpNyQAABuEOE6V"
                    to="/news/avalanche-canada-has-brand-new-youth-tool-boxes-available"
                />
                <Redirect
                    from="/news/V9Br8SYAACcAzxmI"
                    to="/news/calgary-foundation-grant-award"
                />
                <Redirect
                    from="/news/Vow8-R8AAFDJUq1b"
                    to="/news/transceiver-interference"
                />
                <Redirect
                    from="/news/VEV1hyYAAKwITagl"
                    to="/news/annual-report-2014"
                />
                <Redirect
                    from="/news/VIDCKCsAACcAgEpK"
                    to="/news/donation-request-avalanche-canada"
                />
                <Redirect
                    from="/news/VL63mCUAACYAOeVo"
                    to="/news/canuck-splitfest-fundraiser-success-2015"
                />
                <Redirect
                    from="/news/VL7ZgiUAACMAOilw"
                    to="/news/thunderstruck-fundraiser-donation-2015"
                />
                <Redirect
                    from="/news/VNASWCUAAJQpqGrY"
                    to="/news/deep-winter-photo-challenge-fundraiser-2015"
                />
                <Redirect
                    from="/news/VT_rPiYAACUAbasG"
                    to="/news/mountain-weather-forecast-summer"
                />
                <Redirect
                    from="/news/VftedR8AAIYAI8QW"
                    to="/news/acc-new-hut"
                />
                <Redirect from="/news/ViGKDCEAAEwWNpIz" to="/news/agm-2015" />
                <Redirect
                    from="/news/VHZlwSgAACYAw466"
                    to="/news/boundary-changes-south-rockies"
                />
                <Redirect
                    from="/news/VH-XbykAACwAQbtc"
                    to="/news/arcteryx-deep-winter-photo-challenge-2014"
                />
                <Redirect
                    from="/news/VJIKXCcAACYAFiD-"
                    to="/news/avalanche-awareness-days-2015"
                />
                <Redirect
                    from="/news/VLbN0CMAALqmQ9tp"
                    to="/news/introduction-mountain-information-network"
                />
                <Redirect
                    from="/news/VRmZzR8AAOIMXMnP"
                    to="/news/agm-october-announcement"
                />
                <Redirect
                    from="/news/VZ7psx0AAB0AuUBl"
                    to="/news/recall-bd-jetforce-airbag"
                />
                <Redirect
                    from="/news/ViauYB0AAHAHUPr_"
                    to="/news/new-support-craig-kelly-fund"
                />
                <Redirect
                    from="/news/ViayAx0AAB4AURDZ"
                    to="/news/cora-shea-memorial-awards"
                />
                <Redirect
                    from="/news/VkDizCEAAJsBkh2d"
                    to="/news/bca-backcountry-basics-videos"
                />
                <Redirect
                    from="/news/VDbtkScAAKUBPZm5"
                    to="/news/introducing-avalanche-canada"
                />
                <Redirect
                    from="/news/VH5GLSMAACcAc0vA"
                    to="/news/snorider-brent-strand-announcement"
                />
                <Redirect
                    from="/news/VIockywAACsA-wP3"
                    to="/news/forecasts-inbox-rss"
                />
                <Redirect
                    from="/news/VL6NXiUAACYAOZA3"
                    to="/news/announcement-new-mountain-weather-forecast"
                />
                <Redirect
                    from="/news/VP9AZR4AACQAlToR"
                    to="/news/land-thundering-snow-launch"
                />
                <Redirect
                    from="/news/VRrR-x8AAKBCX0JI"
                    to="/news/recall-ortovox-s1"
                />
                <Redirect
                    from="/news/VQh-RikAACgA6K4B"
                    to="/news/calgary-fundraiser-success-2015"
                />
                <Redirect
                    from="/news/VdNwyB8AAE4Ln13g"
                    to="/news/al-hodgson-memorial-fund"
                />
                <Redirect
                    from="/news/VEbXGiYAACsAaNZV"
                    to="/news/five-snowmobile-safety-messages"
                />
                <Redirect
                    from="/news/VEbHaSYAACsAaLc_"
                    to="/news/tedx-talk-risk"
                />
                <Redirect
                    from="/news/VH-KSykAACkAQaCR"
                    to="/news/baw-success-2014"
                />
                <Redirect
                    from="/news/VIivUisAACYAY0tp"
                    to="/news/avalanche-canada-widget-update"
                />
                <Redirect
                    from="/news/VIoEBSwAACsA-tKL"
                    to="/news/dramatic-rescue-clemina-creek"
                />
                <Redirect
                    from="/news/VEVy9CYAACQATaL-"
                    to="/news/justin-trudeau-message"
                />
                <Redirect
                    from="/news/VVtiryYAAOwJxyOO"
                    to="/news/recall-msr-snow-shovels"
                />
                <Redirect
                    from="/news/VMgrmyUAAJQpmL6o"
                    to="/news/min-how-to-videos"
                />
                <Redirect
                    from="/news/VjkZEB0AAB0AV7J4"
                    to="/news/annual-report-2015"
                />
                <Redirect
                    from="/news/VkogLh8AAB0AI-ag"
                    to="/news/free-ast-youth-course-fernie"
                />
                <Redirect
                    from="/news/Vk4VIh4AAG8G0bZg"
                    to="/news/new-sponsor-g3"
                />
                <Redirect
                    from="/news/VlN8siIAAFANmCkM"
                    to="/news/new-release-throttle-decisions"
                />
                <Redirect
                    from="/news/VlYciR0AADgEB1Sp"
                    to="/news/cross-border-collaboration-training"
                />
                <Redirect
                    from="/news/VpPu3h8AAKAFGUI2"
                    to="/news/avalanche-awareness-days-primer"
                />
                <Redirect
                    from="/news/VrOc4CsAACwA4KjU"
                    to="/news/pr-bc-coroner-avalanche-feb3"
                />
                <Redirect
                    from="/news/VrjoXiYAAEwCjmRs"
                    to="/news/avalanche-ambassador-aad-revelstoke"
                />
                <Redirect
                    from="/news/VN0YqSYAACoAJakp"
                    to="/news/membership-drive"
                />
                <Redirect
                    from="/news/Vst0dyMAADoSu4_N"
                    to="/news/al-hodgson-memorial-award"
                />
                <Redirect
                    from="/news/Vplv7SMAAFQcaHWb"
                    to="/news/sfu-new-research-chair"
                />
                <Redirect from="/news/VpV_lx8AAMUSIpac" to="/news/min-update" />
                <Redirect
                    from="/news/VuxMXiwAALFL7Yyb"
                    to="/news/foundation-calgary-benefit-2016"
                />
                <Redirect
                    from="/news/VjukhiMAACQA2fJX"
                    to="/news/new-office-space"
                />
                <Redirect
                    from="/news/VnHASR8AAIoSs8eR"
                    to="/news/thunderstruck-rsc-fundraiser"
                />
                <Redirect
                    from="/news/Vw6XMCkAAD9f09uB"
                    to="/news/craig-kelly-scholarship-awarded"
                />
                <Redirect
                    from="/news/Vx-6kSkAAEG1OTEL"
                    to="/news/hot-zone-reports"
                />
                <Redirect
                    from="/news/Vk0CliEAAKIFhX3l"
                    to="/news/2015-service-award"
                />
                <Redirect
                    from="/news/Vh1iVx4AALsES5Zw"
                    to="/news/avalanche-ambassador-program-announcement"
                />
                <Redirect
                    from="/news/VyeeSiYAAASDd20a"
                    to="/news/land-of-thundering-snow"
                />
                <Redirect
                    from="/news/VpP3lB8AAKAFGXVS"
                    to="/news/canuck-splitfest-2016"
                />
                <Redirect
                    from="/news/VK7R4iMAACMAM93b"
                    to="/news/snowmobile-loaners-2016"
                />
                <Redirect
                    from="/news/VuhTEiwAAMEK1gWI"
                    to="/news/adjunct-professor-announcement"
                />
                <Redirect
                    from="/news/Vw_rICkAALuO27JE"
                    to="/news/royal-canadian-pacific-fundraiser"
                />
                <Redirect
                    from="/cac/training/ast/courses"
                    to="/training/courses"
                />
                <Redirect from="/cac/training/overview" to="/training" />
                <Redirect from="/cac/training/online-course" to="/tutorial" />
                <Redirect from="/cac" to="/" />
                <Redirect from="/pages/static-page/sled" to="/sled" />
                <Redirect from="/pages/static-page/youth" to="/youth" />
                <Redirect from="/pages/static-page/essential-gear" to="/gear" />
                <Redirect from="/pages/static-page/training" to="/training" />
                <Redirect
                    from="/pages/static-page/mountain-information-network-overview"
                    to="/mountain-information-network"
                />
                <Redirect
                    from="/pages/static-page/mountain-information-network-submission-guidelines"
                    to="/mountain-information-network/submission-guidelines"
                />
                <Redirect from="/pages/static-page/about" to="/about" />
                <Redirect
                    from="/pages/static-page/mountain-information-network-faq"
                    to="/mountain-information-network/faq"
                />
                <Redirect
                    from="/pages/static-page/ambassadors"
                    to="/ambassadors"
                />
                <Redirect from="/pages/static-page/sponsors" to="/sponsors" />
                <Redirect
                    from="/pages/static-page/collaborators"
                    to="/collaborators"
                />
                <Redirect
                    from="/pages/static-page/membership-overview"
                    to="/membership"
                />
                <Redirect from="/generic/privacy-policy" to="/privacy-policy" />
                <Redirect from="/generic/terms-of-use" to="/terms-of-use" />
                <Redirect from="/generic/auction" to="/auction" />
                <Redirect from="/cherrybowl" to="/cherry-bowl" />
                <Redirect from="/min" to="/mountain-information-network" />
                <Redirect
                    from="/min/submit"
                    to="/mountain-information-network/submit"
                />
                <Redirect
                    from="/min/faq"
                    to="/mountain-information-network/faq"
                />
                <Redirect
                    from="/min/submission-guidelines"
                    to="/mountain-information-network/submission-guidelines"
                />
                <Redirect
                    from="/min/submissions/:id"
                    to="/mountain-information-network/submissions/:id"
                />
                <Redirect
                    from="/min/submissions"
                    to="/mountain-information-network/submissions"
                />
                <Redirect from="/learn" to="/training" />
                <Redirect from="/forecast/:name" to="/forecasts/:name" />
                <Redirect
                    from="/submit"
                    to="/mountain-information-network/submit"
                />
                <Route path="/fxresources/*" render={redirect} />
                <Route path="/cherry-bowl*" render={redirect} />
                <Route
                    path="/foundation"
                    component={AvalancheCanadaFoundation}
                />
                <Route path="/pages/:type/:uid" component={FallbackPage} />
                <Route path="/" component={AvalancheCanada} />
            </Switch>
        </BrowserRouter>
    )
}
