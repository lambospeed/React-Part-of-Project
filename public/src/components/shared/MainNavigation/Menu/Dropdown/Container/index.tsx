import * as React from 'react'

// Internal components & Styles
import ContainerProps from './container.props'
import $Container from './container.style'

const Container: React.SFC = ({children}: ContainerProps): JSX.Element =>
  <$Container>
    {children}
  </$Container>

export default Container
