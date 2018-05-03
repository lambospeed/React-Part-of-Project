import * as React from 'react'

// Internal components & Styles
import DropdownProps from './dropdown.props'
import $Dropdown from './dropdown.style'
import $Title from './title.style'

// Private components
import Container from './Container'

const Dropdown: React.SFC<DropdownProps> = ({children, title} : DropdownProps) : JSX.Element =>
  <$Dropdown>
    <$Title><span>{title}</span></$Title>
    <Container>
      {children}
    </Container>
  </$Dropdown>

// Public components
export { Dropdown }
export { Item as DropdownItem } from './Item'
