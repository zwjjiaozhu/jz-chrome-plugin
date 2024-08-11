import { env } from 'node:process'
import type { ManifestV3Export } from '@crxjs/vite-plugin'
import packageJson from './package.json'

const { version, name, description, displayName } = packageJson
// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = '0'] = version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, '')
  // split into version parts
  .split(/[.-]/)

export default {
  name: env.mode === 'staging' ? `[INTERNAL] ${name}` : displayName || name,
  description,
  // up to four numbers separated by dots
  version: `${major}.${minor}.${patch}.${label}`,
  // semver is OK in "version_name"
  version_name: version,
  manifest_version: 3,
  // key: '',
  action: {
    default_popup: 'src/popup/index.html',
  },
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      all_frames: false,
      js: ['src/content-script/index.ts'],
      matches: ['*://*/*'],
      run_at: 'document_end',
    },
  ],
  offline_enabled: false,
  host_permissions: [],
  permissions: ['storage', 'background', "contextMenus"],
  // 用来控制外部访问插件中的资源
  web_accessible_resources: [
    {
      matches: ["*://*/*"],  // '*://*/*'
      resources: ['src/content-script/index.ts'],
    },
    {
      matches: ["*://*/*"],
      resources: ['src/content-script/iframe/index.html'],
    },
  ],
  icons: {
    16: 'src/assets/logo.png',
    24: 'src/assets/logo.png',
    32: 'src/assets/logo.png',
    128: 'src/assets/logo.png',
  },
  // 允许那些扩展或者网页可以连接本扩展
  "externally_connectable": {
    "matches": ["http://localhost:8068/\*", "https://jz.zwjjiaozhu.top/*"]
  },
} as ManifestV3Export
