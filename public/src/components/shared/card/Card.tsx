import * as React from 'react';
import Toggle from 'material-ui/Toggle';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {MuiThemeProvider, lightBaseTheme} from "material-ui/styles";

const lightMuiTheme = getMuiTheme(lightBaseTheme);
import * as styles from './Card.css';

interface ICardProps {
  title: string,
  pic: string
};

export default class Card extends React.Component<ICardProps> {
  render () {
    return (
        <MuiThemeProvider muiTheme={lightMuiTheme}>
        <div className={styles["card__wrapper"]}>
            <div className={styles["card__cover"]}></div>
            <div className={styles["card"]}>
                <div className={styles["card__logo"]}>
                    <img src={this.props.pic} />
                </div>

                <div className={styles["card__content"]}>
                    <div className={styles["card__title"]}>
                    {this.props.title}
                    </div>
                </div>
            </div>
            <Toggle  className={styles['toggle']} defaultToggled={true}/>
        </div>
      </MuiThemeProvider>
    )
  }
}
