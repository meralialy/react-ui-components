import type { ComponentType } from 'react'
import { AlertPage } from './alert-page'
import { AvatarPage } from './avatar-page'
import { BadgePage } from './badge-page'
import { ProgressPage } from './progress-page'
import { SpinnerPage } from './spinner-page'
import { ToastPage } from './toast-page'
import { BreadcrumbsPage } from './breadcrumbs-page'
import { ButtonPage } from './button-page'
import { CardPage } from './card-page'
import { LinkPage } from './link-page'
import { PaginationPage } from './pagination-page'
import { TablePage } from './table-page'
import { TabsPage } from './tabs-page'
import { MenuPage } from './menu-page'
import { ModalPage } from './modal-page'
import { PopoverPage } from './popover-page'
import { TooltipPage } from './tooltip-page'
import { CheckboxPage } from './checkbox-page'
import { ContainerPage } from './container-page'
import { FlexPage } from './flex-page'
import { HeadingPage } from './heading-page'
import { IconPage } from './icon-page'
import { InputPage } from './input-page'
import { RadioPage } from './radio-page'
import { TextPage } from './text-page'
import { TextareaPage } from './textarea-page'
import { SegmentedControlPage } from './segmented-control-page'
import { SelectPage } from './select-page'
import { SplitButtonPage } from './split-button-page'
import { TogglePage } from './toggle-page'

// Sidebar groups, in display order. A group with no pages is left out of the sidebar.
const componentGroups = [
  'Actions',
  'Form controls',
  'Feedback',
  'Overlays',
  'Navigation',
  'Data display',
  'Typography',
  'Layout',
] as const

type ComponentGroup = (typeof componentGroups)[number]

export type ComponentPage = {
  path: string
  title: string
  group: ComponentGroup
  Component: ComponentType
}

// Drives both the routes and the sidebar nav. Add a component's docs page here, in any order:
// the sidebar sorts by group, then alphabetically.
const pages: ComponentPage[] = [
  { path: 'button', title: 'Button', group: 'Actions', Component: ButtonPage },
  { path: 'split-button', title: 'Split button', group: 'Actions', Component: SplitButtonPage },
  { path: 'input', title: 'Input', group: 'Form controls', Component: InputPage },
  { path: 'textarea', title: 'Textarea', group: 'Form controls', Component: TextareaPage },
  { path: 'checkbox', title: 'Checkbox', group: 'Form controls', Component: CheckboxPage },
  { path: 'radio', title: 'Radio', group: 'Form controls', Component: RadioPage },
  { path: 'toggle', title: 'Toggle', group: 'Form controls', Component: TogglePage },
  {
    path: 'segmented-control',
    title: 'Segmented control',
    group: 'Form controls',
    Component: SegmentedControlPage,
  },
  { path: 'select', title: 'Select', group: 'Form controls', Component: SelectPage },
  { path: 'container', title: 'Container', group: 'Layout', Component: ContainerPage },
  { path: 'flex', title: 'Flex', group: 'Layout', Component: FlexPage },
  { path: 'alert', title: 'Alert', group: 'Feedback', Component: AlertPage },
  { path: 'progress', title: 'Progress', group: 'Feedback', Component: ProgressPage },
  { path: 'spinner', title: 'Spinner', group: 'Feedback', Component: SpinnerPage },
  { path: 'toast', title: 'Toast', group: 'Feedback', Component: ToastPage },
  { path: 'menu', title: 'Menu', group: 'Overlays', Component: MenuPage },
  { path: 'modal', title: 'Modal', group: 'Overlays', Component: ModalPage },
  { path: 'popover', title: 'Popover', group: 'Overlays', Component: PopoverPage },
  { path: 'tooltip', title: 'Tooltip', group: 'Overlays', Component: TooltipPage },
  { path: 'breadcrumbs', title: 'Breadcrumbs', group: 'Navigation', Component: BreadcrumbsPage },
  { path: 'link', title: 'Link', group: 'Navigation', Component: LinkPage },
  { path: 'pagination', title: 'Pagination', group: 'Navigation', Component: PaginationPage },
  { path: 'tabs', title: 'Tabs', group: 'Navigation', Component: TabsPage },
  { path: 'avatar', title: 'Avatar', group: 'Data display', Component: AvatarPage },
  { path: 'badge', title: 'Badge', group: 'Data display', Component: BadgePage },
  { path: 'card', title: 'Card', group: 'Data display', Component: CardPage },
  { path: 'table', title: 'Table', group: 'Data display', Component: TablePage },
  { path: 'heading', title: 'Heading', group: 'Typography', Component: HeadingPage },
  { path: 'icon', title: 'Icon', group: 'Typography', Component: IconPage },
  { path: 'text', title: 'Text', group: 'Typography', Component: TextPage },
]

export type NavGroup = { group: ComponentGroup; pages: ComponentPage[] }

export const navGroups: NavGroup[] = componentGroups
  .map((group) => ({
    group,
    pages: pages
      .filter((page) => page.group === group)
      .sort((a, b) => a.title.localeCompare(b.title)),
  }))
  .filter(({ pages }) => pages.length > 0)

/** Every page in sidebar order. */
export const componentPages: ComponentPage[] = navGroups.flatMap(({ pages }) => pages)
