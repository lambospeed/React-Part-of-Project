import * as React from 'react'
import styled from 'styled-components';
import { Grid } from 'react-bootstrap';

import MainNavigation from 'components/shared/MainNavigation';

const StyledHeader = styled.header`
  color: #fff;
  background-color: ${props => props.theme.colorBackground};
  min-height: 100vh;
  padding: 100px 90px;
  display: flex;
  flex-flow: column;
  justify-content: center;
`;

const StyledHighlightedText = styled.span`
  font-size: 102px;
  position: relative;
  letter-spacing: 10px;
  &:after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 20px;
    background-color: ${props => props.theme.colorBackground};
  }

  .highlighted {
    position: relative;
    z-index: 2;
    background-color: #fff;
    color: ${props => props.theme.colorBackground};

    padding: 0 4px;
    margin: 0 7px;
  }
`;

const StyledButton = styled.button`
  background-color: ${props => props.theme.colorPrimary};
  color: #fff;
  height: 44px;
  display: flex !important;
  align-items: center;
  justify-content: center;
  font-size: 10px !important;
  border-radius: 0 !important;

  i {
    font-size: 24px;
    margin-right: 12px;
    vertical-align: bottom;
  }
`;

const StyledSlogan = styled.div`
  font-size: 24px;
  p {
    max-width: 360px;
  }
`;

class Header extends React.Component {
  render() {
    return (
      <StyledHeader>
        <MainNavigation />
        <Grid>
          <StyledSlogan className="slogan">
            <span>THE AGE OF</span>
            <br />
            <StyledHighlightedText>
              SA<span className="highlighted">TO</span>RI
            </StyledHighlightedText>
	    <br />
	    <span>IS HERE</span>
            <p>
              <small>We are enabling a self realization space to simulate alternate futures.</small>
            </p>
          </StyledSlogan>
          <br />
          <br />
          <br />
          <div>
            <StyledButton className="btn">
              <i className="glyphicon glyphicon-play-circle" />PLAY VIDEO
            </StyledButton>
          </div>
        </Grid>
      </StyledHeader>
    )
  }
}

export default Header;
