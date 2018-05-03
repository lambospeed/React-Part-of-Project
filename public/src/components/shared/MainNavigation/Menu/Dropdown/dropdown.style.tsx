import styled from 'styled-components'

// Ref styles
import $Container from './Container/container.style'
import $Item from './Item/item.style'

const $Dropdown = styled.li`
  
  position: relative;
  display: flex;
  flex-flow: column;
  justify-content: center;

  font-family: Roboto, sans-serif;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: .16em;
  text-transform: uppercase;

  color: rgb(255, 255, 255);
  cursor: pointer;

  &:before {
    position: absolute;

    left: 0px;
    bottom: 0px;

    width: 0px;
    height: 4px;

    content: "";
    transition: width 0.25s, background 0.25s;
  }

  // dropdown animation
  // in
  & > ${$Container} > ${$Item} {
    margin-bottom: 3px;
    opacity: 0;
    transform: translateY(-100%);
    transition: all .24s cubic-bezier(.23, 1, .32, 1);
  }
  // out
  &:hover > ${$Container} > ${$Item} {
    opacity: 1;
    transform: translateY(10%);
  }

`;

export default $Dropdown;
