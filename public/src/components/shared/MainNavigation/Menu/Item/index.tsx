import * as React from 'react'

// Internal components & Styles
//import ItemProps from './item.props'
import $Item from './item.style';
import $ItemLink from './itemLink.style';

// Props
export interface ItemProps {
  children: React.ReactNode,
  link?: string
}

const Item : React.SFC<ItemProps> = ({children, link} : ItemProps) : JSX.Element => (
  <$Item>
    <$ItemLink href={link}>
      {children}
    </$ItemLink>
  </$Item>
)

// Public components
export { Item }
