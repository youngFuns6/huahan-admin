import defaultSettings from '@/settings'

const title = defaultSettings.title || '华瀚后台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
