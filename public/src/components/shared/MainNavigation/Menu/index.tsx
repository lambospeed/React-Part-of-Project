import * as React from 'react'

// Internal components & Styles
import MenuProps from './menu.props'
import $Menu from './menu.style'

// Nested components
import { Item } from './Item'
import { Section } from './Section'
import { Dropdown, DropdownItem } from './Dropdown'


class Menu extends React.Component<MenuProps, any> {

  constructor(props: MenuProps) {
    super(props)
    this.state = {
      isActive: false
    }
  }

  toggleMainMenu() {
    this.setState({isActive: !this.state.isActive})
  }

  render() {
    return (
      <$Menu>
        <Section isActive={this.state.isActive}>
          <Item link="#section11">algorithms</Item>
          <Dropdown title="applications">
            <DropdownItem icon="flask" link="#application_security">Science</DropdownItem>
            <DropdownItem icon="sun" link="#application_military">Weather</DropdownItem>
            <DropdownItem icon="tree" link="#application_agriculture">Agriculture</DropdownItem>
          </Dropdown>
          <Dropdown title="satori core">
            <DropdownItem icon="sign-in-alt" link="app/signIn">Sign In</DropdownItem>
            <DropdownItem icon="user-plus" link="app/signUp">Sign Up</DropdownItem>
          </Dropdown>
        </Section>
          <Section onMouseEnter={()=> this.toggleMainMenu()} onMouseLeave={()=> this.toggleMainMenu()}>
            <Item>algorithms</Item>
            <Dropdown title="applications">
              <DropdownItem icon="flask" link="#application_security">Science</DropdownItem>
              <DropdownItem icon="sun" link="#application_military">Weather</DropdownItem>
              <DropdownItem icon="tree" link="#application_agriculture">Agriculture</DropdownItem>
            </Dropdown>
            <Item link="#satori_kore">satori core</Item>
            <Item link="#blog">Blog</Item>
            <Item link="#community">Community</Item>
            <Item link="#about_us">About Us</Item>
            <Item link="/sign_out">Log out</Item>
          </Section>
      </$Menu>
    )
  }
}

// Public components
export default Menu
