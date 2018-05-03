import * as React from 'react'

// Props
export default interface ItemProps extends React.Props<any> {
  children: React.ReactNode;
  link?: string;
}
