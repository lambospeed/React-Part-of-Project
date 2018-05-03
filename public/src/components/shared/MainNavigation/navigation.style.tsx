import styled from 'styled-components'

const $Navigation = styled.nav`

  width: calc(100% - 40px);
  height: 82px;
  margin: 0;
  padding: 0px 35px;
  z-index: 1000;
  top: 54px;
  left: 20px;

  display: flex;
  position: fixed;
  flex-flow: row;
  justify-content: space-between;

  background-color: rgba(0, 0, 0, .9);
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .17);


  &[data-pinned="true"] {
    position: relative;
  }
`


export default $Navigation
