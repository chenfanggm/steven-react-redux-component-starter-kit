import classes from './ControlPanel.scss';
import React from 'react';
import { connect } from 'react-redux';
import { switchLight } from './actions';


class ControlPanel extends React.Component {

  constructor(props) {
    super(props);
    this.handleTurnOnLightClicked = this.handleTurnOnLightClicked.bind(this);
  }

  handleTurnOnLightClicked() {
    this.props.dispatch(switchLight());
  }

  render() {
    const { isLightOn } = this.props;
    return (
      <div>
        <div>
          Control Panel
        </div>
        <div>
          <button onClick={this.handleTurnOnLightClicked}>
            Turn On - Light
          </button>
        </div>
        <div>
          <span>Light is: </span><span>{isLightOn.toString()}</span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLightOn: state.controlPanel.isLightOn
  };
};

export default connect(mapStateToProps)(ControlPanel);
