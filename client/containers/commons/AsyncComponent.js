import React, { PureComponent } from 'react';


class AsyncComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      Component: null
    };
  }

  componentWillMount() {
    if (!this.state.Component) {
      this.props.moduleLoader().then(({ Component }) => {
        this.setState({ Component });
      });
    }
  }

  render() {
    const { Component } = this.state;
    return (
      <div>
        {Component ? <Component /> : 'loading plugins...'}
      </div>
    );
  }
}

export default AsyncComponent;