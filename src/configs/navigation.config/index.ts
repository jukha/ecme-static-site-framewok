

import {
  NAV_ITEM_TYPE_COLLAPSE,
  NAV_ITEM_TYPE_ITEM
} from '@/constants/navigation.constant';

import type { NavigationTree } from '@/@types/navigation';

// Import our new static docs navigation
import staticDocsNavigationConfig from './staticDocsNavigation'; // Adjust path if needed

const navigationConfig: NavigationTree[] = [
    // --- ADD OUR STATIC DOCS NAVIGATION HERE ---
    staticDocsNavigationConfig,

    {
      key: 'vaults',
      path: '',
      title: 'Vaults',
      translateKey: 'nav.vaults',
      icon: 'vaults',
      type: NAV_ITEM_TYPE_COLLAPSE,
      authority: [],
      subMenu: [
        { key: 'vaults.create', path: '/vaults/create', title: 'Create', translateKey: 'nav.vaults.create', type: NAV_ITEM_TYPE_ITEM, authority: [], subMenu: [], icon: 'createicon', }, 
        { key: 'vaults.status', path: '/vaults/status', title: 'Status', translateKey: 'nav.vaults.status', type: NAV_ITEM_TYPE_ITEM, authority: [], subMenu: [], icon: 'statusicon', }, 
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
        { key: 'monitors.network', path: '/monitors/network', title: 'Network', translateKey: 'nav.monitors.network', type: NAV_ITEM_TYPE_ITEM, authority: [], subMenu: [], icon: '' }, 
        { key: 'monitors.stats', path: '/monitors/stats', title: 'Statistics', translateKey: 'nav.monitors.stats', type: NAV_ITEM_TYPE_ITEM, authority: [], subMenu: [], icon: '' }, 
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
        { key: 'validators.dashboard', path: '/validators/dashboard', title: 'Dashboard', translateKey: 'nav.validators.dashboard', type: NAV_ITEM_TYPE_ITEM, authority: [], subMenu: [], icon: '' }, 
        { key: 'validators.voting', path: '/validators/voting', title: 'Voting', translateKey: 'nav.validators.voting', type: NAV_ITEM_TYPE_ITEM, authority: [], subMenu: [], icon: '' }, 
        { key: 'validators.tests', path: '/validators/tests', title: 'Tests', translateKey: 'nav.validators.tests', type: NAV_ITEM_TYPE_ITEM, authority: [], subMenu: [], icon: '' }, 
      ],
    },
    {
      key: 'tools',
      path: '',
      title: 'Tools',
      translateKey: 'nav.tools',
      icon: 'apiicon',
      type: NAV_ITEM_TYPE_COLLAPSE,
      authority: [],
      subMenu: [
        { key: 'tools.api', path: '/tools/api', title: 'API', translateKey: 'nav.tools.api', type: NAV_ITEM_TYPE_ITEM, authority: [], subMenu: [], icon: '' }, 
        { key: 'tools.sdk', path: '/tools/sdk', title: 'SDK', translateKey: 'nav.tools.sdk', type: NAV_ITEM_TYPE_ITEM, authority: [], subMenu: [], icon: '' }, 
      ],
    },
    // ... any other route configurations imported or defined here
];

export default navigationConfig;