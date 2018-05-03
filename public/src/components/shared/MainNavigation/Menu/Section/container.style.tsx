import styled from 'styled-components'


const $Container = styled.ul`
  flex-flow: row;
  display: flex;
  justify-content: flex-end;

  transform: translateY(100%);
  opacity: 0;
  transition: all 0.3s cubic-bezier(.23, 1, .32, 1);
`;

export default $Container;
