import styled from 'styled-components';

const $Item = styled.li`

  overflow: hidden;
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

  &:last-child:after {
    display: none;
  }

  &:before {
    position: absolute;

    left: 0px;
    bottom: 0px;

    width: 0px;
    height: 3px;

    content: "";
    transition: width 0.25s, background 0.25s;
  }

  // hover in
  &:hover:before {
    width: calc(100% - 50px);
    background: rgb(255, 255, 255);
  }

  // hover out
  &:not(:hover):before {
    width: 0px;
    transition: width 0.25s, background 0.25s;
    animation-direction: alternate;
  }
`;

export default $Item;
