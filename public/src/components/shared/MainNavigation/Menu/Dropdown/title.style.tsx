import styled from 'styled-components'

const $Title = styled.span`
  &:after {
    content: "/";

    font-weight: 700;
    font-size: 12px;

    padding: 0 25px;

    color: rgba(255, 255, 255, .15);
    cursor: default;
  }

  & > span:after {
    font-size: 10px;
    content: "¬";
    margin-left: 5px;
  }
  
`;


export default $Title
