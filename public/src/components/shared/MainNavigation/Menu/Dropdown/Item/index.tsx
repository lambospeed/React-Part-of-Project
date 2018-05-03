import * as React from 'react'

// Internal components & Styles
import ItemProps from './item.props'
import $Icon from './icon.style'
import $Item from './item.style'
import $ItemLink from './itemLink.style'

const Item: React.SFC<ItemProps> = ({children, link, icon}: ItemProps): JSX.Element =>
  <$Item>
    <$Icon>
      <i className={ `fa fa-${icon}` }></i>
    </$Icon>
    <$ItemLink href={link}>{children}</$ItemLink>
  </$Item>

export { Item }
