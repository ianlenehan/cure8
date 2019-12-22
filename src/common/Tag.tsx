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

type Tag = {
  id: string;
  name: string;
};

type Props = {
  tag: Tag;
  onPress?: (tag: Tag) => void;
  selected: boolean;
};

const Tag: FunctionComponent<Props> = ({ tag, selected, onPress }) => {
  const handlePress = () => {
    if (!onPress) return null;

    onPress(tag);
  };

  return (
    <TouchableOpacity
      style={[
        styles.tagView,
        selected && { backgroundColor: colors.primaryGreen }
      ]}
      key={tag.id}
      onPress={handlePress}>
      <Text style={styles.tag}>{tag.name}</Text>
    </TouchableOpacity>
  );
};

export default Tag;
