import { Optional } from '@inspetor/lib/types/optional'
import {
  Building2,
  CalendarDays,
  HelpCircle,
  List,
  SquareUserRound,
  User2,
  UserRound,
  Users,
} from 'lucide-react'
import { ElementType } from 'react'
import { FaTools } from 'react-icons/fa'
import { FiHome } from 'react-icons/fi'
import { GiValve } from 'react-icons/gi'
import { LuTimer } from 'react-icons/lu'
type SidebarMenu = {
  title: string
  icon: ElementType
  pathname?: string
  children?: Array<Optional<SidebarMenu, 'icon'>>
  isCollapsible?: boolean
}

export function getSidebarMenus(): Array<SidebarMenu> {
  return [
    {
      icon: FiHome,
      title: 'Home',
      pathname: '/dashboard',
    },
    {
      icon: UserRound,
      title: 'Clientes',
      pathname: '/dashboard/clients',
    },
    {
      icon: FaTools,
      title: 'Instrumentos',
      pathname: '/dashboard/instruments',
    },
    {
      icon: List,
      title: 'Serviços',
      isCollapsible: true,
      children: [
        {
          title: 'Inspeção de Caldeiras',
          pathname: '/dashboard/boiler-inspection',
          icon: FaTools,
        },
        {
          title: 'Calibração de Manômetro',
          pathname: '/dashboard/manometer-calibration',
          icon: LuTimer,
        },
        {
          title: 'Calibração de Válvula de Segurança',
          pathname: '/dashboard/valve-calibration',
          icon: GiValve,
        },
      ],
    },
    {
      icon: Users,
      title: 'Usuários',
      isCollapsible: true,
      children: [
        {
          title: 'Usuários',
          pathname: '/dashboard/users',
          icon: User2,
        },
        {
          title: 'Empresas',
          pathname: '/dashboard/users/companies',
          icon: Building2,
        },
        {
          title: 'Perfil',
          pathname: '/dashboard/users/profile',
          icon: SquareUserRound,
        },
      ],
    },
    {
      icon: CalendarDays,
      title: 'Agendamentos',
      pathname: '/dashboard/schedules',
    },
    {
      icon: HelpCircle,
      title: 'Ajuda',
      pathname: '/dashboard/help',
    },
  ]
}
