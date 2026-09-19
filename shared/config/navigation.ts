import { HomeIcon, MessageSquareShareIcon, PhoneCallIcon, BuildingComplexIcon} from 'lucide-react'

export const USER_NAV_LINKS = [
      { icon: HomeIcon, title: 'main', href: '/' },
      { icon: MessageSquareShareIcon, title: 'appeals', href: '/appeals' },
      { icon: BuildingComplexIcon, title: 'house', href: '/house' },
      { icon: PhoneCallIcon, title: 'contact', href: '/contact' },
] as const
