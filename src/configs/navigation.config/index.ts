import {
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'

import type { NavigationTree } from '@/@types/navigation'

// Import our new static docs navigation
import staticDocsNavigationConfig from './staticDocsNavigation' // Adjust path if needed

const navigationConfig: NavigationTree[] = [
    // --- ADD OUR STATIC DOCS NAVIGATION HERE ---
    {
        key: 'concepts.landing',
        path: '/home',
        title: 'Home',
        translateKey: 'nav.landing',
        icon: 'homeicon',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        meta: {
            description: {
                translateKey: 'nav.chatDesc',
                label: 'Landing Page',
            },
        },
        subMenu: [],
    },
    {
        key: 'vaults',
        path: '',
        title: 'Vaults',
        translateKey: 'nav.vaults',
        icon: 'vaults',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'vaults.create',
                path: '/vaults/create',
                title: 'Create',
                translateKey: 'nav.vaults.create',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
                icon: 'createicon',
            },
            {
                key: 'vaults.status',
                path: '/vaults/status',
                title: 'Status',
                translateKey: 'nav.vaults.status',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
                icon: 'statusicon',
            },
        ],
    },
    {
        key: 'monitors',
        path: '',
        title: 'Monitors',
        translateKey: 'nav.monitors',
        icon: 'monitorsicon',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'monitors.network',
                path: '/monitors/network',
                title: 'Network',
                translateKey: 'nav.monitors.network',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
                icon: 'networkicon',
            },
            {
                key: 'monitors.stats',
                path: '/monitors/stats',
                title: 'Statistics',
                translateKey: 'nav.monitors.stats',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
                icon: 'statisticsicon',
            },
        ],
    },
    {
        key: 'validators',
        path: '',
        title: 'Validators',
        translateKey: 'nav.validators',
        icon: 'validators',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'validators.dashboard',
                path: '/validators/dashboard',
                title: 'Dashboard',
                translateKey: 'nav.validators.dashboard',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
                icon: '',
            },
            {
                key: 'validators.voting',
                path: '/validators/voting',
                title: 'Voting',
                translateKey: 'nav.validators.voting',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
                icon: '',
            },
            {
                key: 'validators.tests',
                path: '/validators/tests',
                title: 'Tests',
                translateKey: 'nav.validators.tests',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
                icon: '',
            },
        ],
    },
    {
        key: 'concepts.dao',
        path: '',
        title: 'DAO',
        translateKey: 'nav.conceptsDao.dao',
        icon: 'daoicon',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        meta: {
            description: {
                translateKey: 'nav.conceptsDao.daoDesc',
                label: 'Decentralized governance',
            },
        },
        subMenu: [
            {
                key: 'concepts.dao.structure',
                path: '/dao/structure',
                title: 'Structure',
                translateKey: 'nav.conceptsDao.structure',
                icon: 'structureicon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.conceptsDao.structureDesc',
                        label: 'Organization hierarchy',
                    },
                },
                subMenu: [],
            },
            {
                key: 'concepts.dao.governance',
                path: '/dao/governance',
                title: 'Governance',
                translateKey: 'nav.conceptsDao.governance',
                icon: 'governanceicon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.conceptsDao.governanceDesc',
                        label: 'Proposals and voting',
                    },
                },
                subMenu: [],
            },
        ],
    },

    {
        key: 'concepts.Legal',
        path: '',
        title: 'Legal',
        translateKey: 'nav.conceptsLegal.Legal',
        icon: 'law',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        meta: {
            description: {
                translateKey: 'nav.conceptsLegal.legalDesc',
                label: 'Legal',
            },
        },
        subMenu: [
            {
                key: 'concepts.legal.legal',
                path: '/legal/legal-doc',
                title: 'Legal Doc',
                translateKey: 'nav.conceptsLegal.legal',
                icon: 'legalicon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.conceptsLegal.legal',
                        label: 'Create new Legal Doc',
                    },
                },
                subMenu: [],
            },
        ],
    },
    {
        key: 'concepts.helpCenter',
        path: '',
        title: 'Help Center',
        translateKey: 'nav.conceptsHelpCenter.helpCenter',
        icon: 'helpCenter',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        meta: {
            description: {
                translateKey: 'nav.conceptsHelpCenter.helpCenterDesc',
                label: 'Support and articles',
            },
        },
        subMenu: [
            {
                key: 'concepts.helpCenter.tutorial',
                path: '/help/tutorial/introduction',
                title: 'Tutorial',
                translateKey: 'nav.conceptsHelpCenter.tutorial',
                icon: 'tutorialicon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.conceptsHelpCenter.tutorial',
                        label: 'Central support hub',
                    },
                },
                subMenu: [],
            },
            {
                key: 'concepts.helpCenter.userGuide',
                path: '/help/user-guide',
                title: 'User Guide',
                translateKey: 'nav.conceptsHelpCenter.userGuide',
                icon: 'userguideicon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.conceptsHelpCenter.userGuide',
                        label: 'Central support hub',
                    },
                },
                subMenu: [],
            },

            {
                key: 'concepts.helpCenter.FAQ',
                path: '/help/faqs',
                title: 'FAQ',
                translateKey: 'nav.conceptsHelpCenter.FAQ',
                icon: 'faqicon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.conceptsHelpCenter.FAQ',
                        label: 'Central support hub',
                    },
                },
                subMenu: [],
            },
            {
                key: 'concepts.helpCenter.examples',
                path: '/help/examples',
                title: 'Examples',
                translateKey: 'nav.conceptsHelpCenter.examples',
                icon: 'examplesicon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.conceptsHelpCenter.examples',
                        label: 'Central support hub',
                    },
                },
                subMenu: [],
            },
            {
                key: 'concepts.helpCenter.useCases',
                path: '/help/use-cases',
                title: 'Use Cases',
                translateKey: 'nav.conceptsHelpCenter.useCases',
                icon: 'usecasesicon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.conceptsHelpCenter.useCases',
                        label: 'Central support hub',
                    },
                },
                subMenu: [],
            },
            {
                key: 'concepts.helpCenter.zuz-dsl',
                path: '/help/zuz-dsl/use-auth',
                title: 'Zuz Dsl',
                translateKey: 'nav.conceptsHelpCenter.zuz-dsl',
                icon: 'zuzdslicon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.conceptsHelpCenter.zuz-dsl',
                        label: 'Central support hub',
                    },
                },
                subMenu: [],
            },
        ],
    },

    {
        key: 'concepts.about',
        path: '',
        title: 'About',
        translateKey: 'nav.conceptsAbout.About',
        icon: 'about',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        meta: {
            description: {
                translateKey: 'nav.conceptsAbout.aboutDesc',
                label: 'About',
            },
        },
        subMenu: [
            {
                key: 'concepts.about.about',
                path: '/about',
                title: 'About Doc',
                translateKey: 'nav.conceptsAbout.about',
                icon: 'abouticon',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                meta: {
                    description: {
                        translateKey: 'nav.conceptsAbout.about',
                        label: 'Create new About Docs',
                    },
                },
                subMenu: [],
            },
        ],
    },
    ...staticDocsNavigationConfig,
]

export default navigationConfig
