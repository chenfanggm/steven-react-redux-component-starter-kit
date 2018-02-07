import '../../styles/main.scss';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { reportPageView } from '../../utils/analytics';
import classes from './OneColumnLayout.scss';
import Navbar from '../commons/Navbar';
import Footer from '../commons/Footer';
import { actions as authActions } from '../../redux/reducers/userReducer';


class OneColumnLayout extends React.Component {

  componentWillMount() {
    reportPageView();
  }

  componentWillUpdate() {
    reportPageView();
  }

  componentDidMount() {
    // stop bg scrolling on mobile when modal is opened
    document.getElementsByTagName('body')[0].addEventListener('touchmove', (e) => {
      if (document.getElementsByClassName('.noScroll')[0].has(document.getElementsByClassName(e.target)).length)
        e.preventDefault();
    });
    // check login status
    this.props.isLoggedIn();
  }

  render() {
    const { children } = this.props;

    return (
      <div className={classes.container}>
        <Navbar />
        <div className={classes.page}>
          <main className={classes.main}>
            {children}
          </main>
        </div>
        <div className={classes.bottom}>
          <Footer />
        </div>
        <div className={classes.hiddenLayer}>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const isLoading = (state.post && state.post.isLoading) || false;
  return {
    isLoading
  };
};

export default withRouter(connect(mapStateToProps, authActions)(OneColumnLayout));

