'use strict';

var React = require('react/addons');

var MuiIconButton = require('material-ui').IconButton;
var FontIcon = require('material-ui').FontIcon;

var {Line, Curve, MultiLine, Viewfinder, CursorMove, OnionSkin} = require('./SvgIcons');

var IconButton = React.createClass({

  getInitialState() {
    return {
      keyPressed: false
    };
  },

  componentWillMount() {
    this.bindHotkey(this.props.hotkey);
  },

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.icon !== nextProps.icon ||
      this.props.hotkey !== nextProps.hotkey ||
      this.state.keyPressed !== nextState.keyPressed ||
      this.props.selected !== nextProps.selected;
  },

  componentWillUpdate(nextProps, nextState) {
    if (this.props.hotkey !== nextProps.hotkey) {
      this.unbindHotkey();
      this.bindHotkey(nextProps.hotkey);
    }

    if (!this.state.keyPressed && nextState.keyPressed) {
      this.startRipple();
    }

    if (this.state.keyPressed && !nextState.keyPressed) {
      this.endRipple();
      this.props.onTouchTap();
    }
  },

  componentWillUnmount() {
    if (this.unbindHotkey) {
      this.unbindHotkey();
    }
  },

  bindHotkey(hotkey) {
    if (!hotkey) {
      return;
    }
    var combokeys = this.props.combokeys;
    combokeys.bind(hotkey, this.onHotkeyDown, 'keydown');
    combokeys.bind(hotkey, this.onHotkeyUp, 'keyup');

    this.unbindHotkey = () => {
      combokeys.unbind(hotkey, 'keydown');
      combokeys.unbind(hotkey, 'keyup');
    };
  },

  onHotkeyDown() {
    this.setState({ keyPressed: true });
  },

  onHotkeyUp() {
    this.setState({ keyPressed: false });
  },

  // lol
  startRipple() {
    this.refs.iconButton.refs.button.refs.touchRipple.start();
  },

  endRipple() {
    this.refs.iconButton.refs.button.refs.touchRipple.end();
  },

  getIcon(icon) {
    switch (icon) {
      case 'line':
        return <Line />;
      case 'curve':
        return <Curve />;
      case 'multi-line':
        return <MultiLine />;
      case 'viewfinder':
        return <Viewfinder />;
      case 'cursor-move':
        return <CursorMove />;
      case 'onion-skin':
        return <OnionSkin />;
    }
    return null;
  },

  render() {
    var icon = this.getIcon(this.props.icon);
    var selectRing = <div className={'select-ring' + (this.props.selected ? ' selected' : '')} />;
    if (icon) {
      return (
        <MuiIconButton ref='iconButton' {...this.props}>
          {selectRing}
          {icon}
        </MuiIconButton>
      );
    }
    return (
      <MuiIconButton ref='iconButton' {...this.props}>
        {selectRing}
        <FontIcon className={'mdi mdi-' + this.props.icon} />
      </MuiIconButton>
    );
  }

});

module.exports = IconButton;
