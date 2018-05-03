import * as React from 'react'

// Internal componetns & Styles & Assets
//const defaultIcon = require('./defaultIcon.svg')
import { SectionProps } from './section.props'
import $Section from './section.style'
import $Container from './container.style'

const Section: React.SFC<SectionProps> = ({children, isActive, onMouseEnter, onMouseLeave}: SectionProps): JSX.Element =>
  <$Section data-is-active={`${isActive}`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
    <$Container>
      {children}
    </$Container>
  </$Section>

// Public components
export { Section }
