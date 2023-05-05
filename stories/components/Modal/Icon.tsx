import React from 'react';

const Icon = ({icon, className}: {icon?: any; className?: any}) => (
  <i className={`material-icons ${className}`}>{icon}</i>
);

export default Icon;
