import React from 'react';

export const AppIcon = ({ width = 18, display = 'initial', component, ...rest }) => {
  const style = { width, display, ...(rest.style || {}) };
  return <img alt="" src={component} style={style} {...rest} />;
};

// export const AppIcon = component => props => <CustomIcon component={component} {...props} />;
