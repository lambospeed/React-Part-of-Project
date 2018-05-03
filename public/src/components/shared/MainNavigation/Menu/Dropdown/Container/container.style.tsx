import styled from 'styled-components';

const $Container = styled.ul`
  font-family: Roboto, sans-serif;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: .16em;
  text-transform: uppercase;

  list-style-type: none;
  padding-left: 0px;

  color: rgb(255, 255, 255);
  cursor: pointer;

  position: absolute;
  top: 80px;
  width: 100%;
  margin-left: -30px;

  &:after {
    content: "/";

    font-weight: 700;
    font-size: 12px;

    padding: 0 25px;

    color: rgba(255, 255, 255, .15);
    cursor: default;

  }

  &:last-child:after {
    display: none;
  }

`;

export default $Container
