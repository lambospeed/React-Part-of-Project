import styled from 'styled-components'

const $Menu = styled.ul`
  display: flex;
  flex-flow: row;
  flex-basis: fit-content;

  margin: 1px;

  list-style-type: none;

  &:after {
    cursor: pointer;
  }
`

export default $Menu
