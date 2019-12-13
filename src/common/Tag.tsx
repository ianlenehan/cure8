import React, { FunctionComponent } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { colors } from '.';

const styles = {
  tagView: {
    padding: 3,
    backgroundColor: '#ccc',
    margin: 4,
    borderRadius: 15,
    marginBottom: 5
  },
  tag: {
    paddingRight: 6,
    paddingLeft: 6,
    color: 'white'
  }
};

type Props = {
  tag: string;
  onPress: (tag: string) => void;
  style?: any;
  selected: boolean;
};

const Tag: FunctionComponent<Props> = ({ tag, style, selected, onPress }) => {
  const handlePress = () => {
    onPress(tag);
  };
  return (
    <TouchableOpacity
      style={[
        styles.tagView,
        selected && { backgroundColor: colors.primaryGreen }
      ]}
      key={tag}
      onPress={handlePress}>
      <Text style={styles.tag}>{tag}</Text>
    </TouchableOpacity>
  );
};

export default Tag;
