import React from 'react';
import { Path } from 'react-native-svg';

const Arrow = ({ x1, y1, x2, y2 }) => {
  const arrowLength = 10;
  const arrowAngle = Math.PI / 6;
  const arrowX = x2 - arrowLength * Math.cos(Math.atan2(y2 - y1, x2 - x1) - arrowAngle);
  const arrowY = y2 - arrowLength * Math.sin(Math.atan2(y2 - y1, x2 - x1) - arrowAngle);

  const path = `M ${x2} ${y2} L ${arrowX} ${arrowY} L ${arrowX + arrowLength * Math.cos(Math.atan2(y2 - y1, x2 - x1) + arrowAngle)} ${arrowY + arrowLength * Math.sin(Math.atan2(y2 - y1, x2 - x1) + arrowAngle)}`;

  return (
    <Path d={path} stroke="black" strokeWidth={1} fill="none" />
  );
};

export {Arrow};
