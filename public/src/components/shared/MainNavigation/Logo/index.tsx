import * as React from 'react'

// Styles & Assets
const logoImage = require('assets/images/logo.svg')

import $Logo from './logo.style'

const Logo : React.StatelessComponent<{}> = () => (
  <$Logo>
    <img src={logoImage} alt="satori" />
  </$Logo>
)

export default Logo;
