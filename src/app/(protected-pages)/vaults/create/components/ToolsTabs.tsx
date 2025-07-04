'use client'
import React from 'react'
import Tabs from '@/components/ui/Tabs'
import MonoEditor from './MonocoEditor'
import JSONCrackEditor from './JsonCrackEditor'
import ReactFlowDemo from './ReactFlowDemo'

const { TabNav, TabList, TabContent } = Tabs

const ToolsTabs = () => {
    return (
        <Tabs defaultValue="tab1" variant="pill">
            <TabList>
                <TabNav value="tab1">JSON-Crack</TabNav>
                <TabNav value="tab2">Monaco Editor</TabNav>
                {/* <TabNav value="tab3">ReactFlow</TabNav> */}
            </TabList>
            <div className="p-4">
                <TabContent value="tab1">
                    <JSONCrackEditor />
                </TabContent>
                <TabContent value="tab2">
                    <MonoEditor />
                </TabContent>
                {/* <TabContent value="tab3">
                    <ReactFlowDemo />
                </TabContent> */}
            </div>
        </Tabs>
    )
}

export default ToolsTabs
