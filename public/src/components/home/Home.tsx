import * as React from 'react'
import 'components/home/Home.css'
import { Redirect } from 'react-router-dom'
import { IsSignedIn } from 'api'

import Header from 'components/shared/Header';
import Footer from 'components/shared/Footer/Footer';

class Home extends React.Component {
  render() {
    if (IsSignedIn()) {
      return (
        <div>
          <Header />
          <Footer />
        </div>
      );
    } else {
      return <Redirect to={{ pathname: '/signIn', state: { from: '/' } }} />
    }
  }
}

export default Home;
