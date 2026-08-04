const React = require('react');

const mockComponent = (displayName) => {
  const Comp = React.forwardRef((props, ref) =>
    React.createElement(displayName.replace(/^RCT/, ''), { ...props, ref })
  );
  Comp.displayName = displayName;
  return Comp;
};

module.exports = {
  View: mockComponent('RNView'),
  Text: mockComponent('RNText'),
  TouchableOpacity: mockComponent('RNTouchableOpacity'),
  ScrollView: mockComponent('RNScrollView'),
  ActivityIndicator: mockComponent('RNActivityIndicator'),
  StyleSheet: {
    create: (styles) => styles,
    hairlineWidth: 1,
    absoluteFill: {},
    flatten: (style) => style,
  },
  Platform: {
    OS: 'ios',
    select: (obj) => obj.ios,
  },
  Dimensions: {
    get: () => ({ width: 375, height: 812 }),
  },
};
