import React, {Component} from 'react';

// import Lmap from './../components/Lmap';
import styles from './watch.css';
export default class Watch extends Component {

    static propTypes = {};

    constructor(props) {
        super(props);
    }

    render() {
        return (
          <div className={styles.map}>
              {/* <Lmap />*/}
          </div>
        );
    }
}
