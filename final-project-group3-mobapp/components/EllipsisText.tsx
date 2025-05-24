import React from 'react';
import { Text, StyleProp, TextStyle } from 'react-native';

type EllipsisTextProps = {
  children: React.ReactNode;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
};

const EllipsisText: React.FC<EllipsisTextProps> = ({
  children,
  numberOfLines = 1,
  style,
}) => {
  return (
    <Text numberOfLines={numberOfLines} ellipsizeMode="tail" style={style}>
      {children}
    </Text>
  );
};

export default EllipsisText;