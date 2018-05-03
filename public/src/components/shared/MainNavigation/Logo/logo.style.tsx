import styled from 'styled-components'

const $Logo = styled.div`

  min-width: 64px;
  width: 64px;

  overflow: hidden;
  outline: none;

  display: flex;
  flex-flow: column;
  justify-content: center;

  user-select: none;
  cursor: pointer;

  > img {
    width: 100%;
    height: auto;
  }
`;

export default $Logo
