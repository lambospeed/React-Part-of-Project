import * as React from 'react';
import * as styles from './Dashboard.scss';

import MainNavigation from 'components/shared/MainNavigation';
import CardItem from 'components/shared/card/Card';

const  { cards } = require('components/dashboard/cards.js');

type Card = {
  title: string,
  pic: string
};

interface IDashboardState { cards: Array<Card> }

export default class Dashboard extends React.Component<{}, IDashboardState> {
  public state: IDashboardState = {
    cards: []
  };

  public componentDidMount () {
    this.setState(() => ({ cards }))
  }

  public createCard (card: Card, key: number) {
    return (
      <div key={key} className={styles["dashboard-cards__item"]}>
        <CardItem  {...card}/>
      </div>
    );
  }

  render () {

    if (this.state.cards.length) {
      return (
          <div className={styles["container-wrapper"]}>
            <MainNavigation pinned />
            <div className={styles["dashboard"]}>
            <div className={styles["dashboard__cards"]}>
                {this.state.cards.map((card: Card, idx: number) => this.createCard(card, idx))}
            </div>
            </div>
        </div>
      );
    }

    return (<div className={styles["dashboard"]}>Please wait...</div>);
  }
}
