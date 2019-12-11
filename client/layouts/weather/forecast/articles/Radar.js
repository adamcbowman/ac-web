import React from 'react'
import { Article } from 'components/page'
import Tabs, { HeaderSet, Header, PanelSet, Panel } from 'components/tabs'
import { Loop } from 'components/weather'
import Tutorial from '../Tutorial'

export default function Radar() {
    return (
        <Article title="Radar Imagery">
            <Tabs>
                <HeaderSet>
                    <Header>BC Mosaic</Header>
                    <Header>South Coast</Header>
                    <Header>South Interior</Header>
                    <Header>Alberta Rockies</Header>
                    <Header>Tutorials</Header>
                </HeaderSet>
                <PanelSet>
                    <Panel>
                        <Loop
                            type="AC_RADAR_BC_precip-rate"
                            interval={200}
                            amount={18}
                        />
                    </Panel>
                    <Panel>
                        <Loop
                            type="AC_RADAR_BC-S-CST_precip-rate"
                            interval={200}
                            amount={18}
                        />
                    </Panel>
                    <Panel>
                        <Loop
                            type="AC_RADAR_BC-S-INT_precip-rate"
                            interval={200}
                            amount={18}
                        />
                    </Panel>
                    <Panel>
                        <Loop
                            type="AC_RADAR_Alberta-Rockies_precip-rate"
                            interval={200}
                            amount={18}
                        />
                    </Panel>
                    <Panel>
                        <Tutorial uid="radar" />
                    </Panel>
                </PanelSet>
            </Tabs>
        </Article>
    )
}
