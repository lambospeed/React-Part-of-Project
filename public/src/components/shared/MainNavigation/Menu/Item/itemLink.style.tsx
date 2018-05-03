import styled from 'styled-components';

const $ItemLink = styled.a`
  text-decoration: none;  
  color: inherit;

  &:hover {
    text-decoration: none;
    color: inherit;
  }

  &:after {
    content: "/";

    font-weight: 700;
    font-size: 12px;

    padding: 0 25px;

    color: rgba(255, 255, 255, .15);
    cursor: default;
  }
`;

export default $ItemLink;
