import styled from 'styled-components'

// Ref styles
import $Container from './container.style'

const $Section = styled.li`

display: flex;

&:nth-child(1) {

  padding-right: 30px;
  display: flex;
  position: relative;
  justify-content: start;

  & > ${$Container} {
    transform: translateY(0%);
    opacity: 1;
  }
}

// toggle out
&[data-is-active="true"] > ul {
  overflow: hidden;
  & > li {
    transform: translateY(-100%);
    opacity: 0;
  }
}

// toggle in
&[data-is-active="false"] > ul {
  overflow: visible;
  & > li {
    transform: translateY(0%);
    opacity: 1;
  }
}


&:nth-child(2) {

  position: absolute;
  padding-right: 50px;

  width: 100%;
  height: 100%;

  justify-content: flex-end;

  right: calc(-100% + 40px);

  &:hover {

    & > ${$Container} {
      transform: translateY(0%);
      opacity: 1;
    }

    right: 0%;
    width: calc(100% - 144px);
  }

  &:before {

    content: "\f00a";
    font-family: "Font Awesome\ 5 Free";
    font-style: normal;
    font-weight: normal;
    text-decoration: inherit;
    text-align: cetner;
    font-size: 30px;

    position: absolute;
    color: rgb(255, 255, 255);

    width: 40px;
    height: 40px;

    left: -30px;
    top: 20px;

    cursor: pointer;
    opacity: 1;
  }

  &:hover:before {
    opacity: 0;
    right: 40px;
  }

  &:after {
    content: "\f0c8";
    font-family: "Font Awesome\ 5 Free";
    font-style: normal;
    font-weight: 900;
    text-decoration: inherit;
    text-align: cetner;
    font-size: 30px;

    position: absolute;
    color: rgb(255, 255, 255);

    width: 40px;
    height: 40px;

    right: 30px;
    top: 20px;

    cursor: pointer;
    transform: scale(0, 0);
  }

  &:hover:after {
    transform: scale(.5, .5);
  }

}

`;

export default $Section;
