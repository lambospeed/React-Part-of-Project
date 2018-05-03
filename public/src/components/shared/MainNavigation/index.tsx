import * as React from 'react'

// Internal components & Styles
import NavigationProps from './navigation.props'
import $Navigation from './navigation.style'

// Private components
import Logo from './Logo'
import Menu from './Menu'

const MainNavigation : React.SFC<NavigationProps> = ({children, pinned} : NavigationProps) : JSX.Element =>
  <$Navigation data-pinned={pinned}>
    <Logo />
    <Menu />
  </$Navigation>

// Public components
export default MainNavigation
