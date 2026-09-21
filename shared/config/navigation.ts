import { HomeIcon, PhoneCallIcon, NewspaperIcon, UserIcon, ToolboxIcon} from 'lucide-react'

export const USER_NAV_LINKS = [
      { icon: HomeIcon, title: 'main', href: '/main' },
      { icon: ToolboxIcon, title: 'appeals', href: '/appeals' },
      { icon: NewspaperIcon, title: 'news', href: '/news' },
      { icon: PhoneCallIcon, title: 'contact', href: '/contact' },
] as const

export const OWNER_NAV_LINKS = [
      { icon: HomeIcon, title: 'main', href: '/main' },
      { icon: UserIcon, title: 'tenants', href: '/tenants' },
      { icon: ToolboxIcon, title: 'appeals', href: '/appeals' },
      { icon: NewspaperIcon, title: 'news', href: '/news' },
      { icon: PhoneCallIcon, title: 'contact', href: '/contact' },
]