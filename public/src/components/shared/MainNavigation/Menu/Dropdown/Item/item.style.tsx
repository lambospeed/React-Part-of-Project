import styled from 'styled-components';

const $Item = styled.li`

  // padding: 17px 25px;
  padding: 17px 0px 17px 25px;
  position: relative;
  display: flex;
  flex-flow: row;
  align-items: center;

  font-family: Roboto, sans-serif;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: .16em;
  text-transform: uppercase;

  cursor: pointer;

  color: rgb(255, 255, 255);
  background: rgba(0, 0, 0, .9);
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .17);


  &:before {
    position: absolute;

    left: 0px;
    top: 0px;

    width: 3px;
    height: 0px;

    content: "";
    transition: height 0.5s, background 0.5s;
  }

  // hover in
  &:hover:before {
    height: 100%;
    background: rgb(255, 255, 255);
  }

  // hover out
  &:not(:hover):before {
    height: 0px;
    transition: height 0.5s, background 0.5s;
    animation-direction: alternate;
  }
`;

export default $Item
