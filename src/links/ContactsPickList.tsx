import React, { FunctionComponent } from 'react';
import { Text, SectionList, StyleSheet } from 'react-native';
import { ContactRow, colors } from '../common';

const styles = StyleSheet.create({
  sectionHeader: {
    backgroundColor: '#f3f3f3',
    padding: 5
  },
  contactsHint: {
    padding: 20
  }
});

type Props = {
  selectedContactIds: [string];
  onPress: (contactId: string) => void;
  contacts: any;
  editMode: boolean;
  loading: boolean;
};

const ContactPickList: FunctionComponent<Props> = ({
  selectedContactIds,
  onPress,
  contacts,
  groups,
  loading,
  editMode
}) => {
  const getIconColour = (contactId: string) => {
    if (selectedContactIds.includes(contactId)) {
      return colors.primaryGreen;
    }
    return colors.backgroundGrey;
  };

  const renderItem = ({ item }: any) => {
    const iconColour = getIconColour(item.id);
    return (
      <ContactRow
        title={item.name}
        isMember={item.member}
        chevronType="circle"
        iconType="font-awesome"
        iconColour={iconColour}
        onPress={() => onPress(item.id)}
      />
    );
  };

  const renderSectionHeader = ({ section }: any) => {
    if (section.key === 'Groups' && !groups.length) return null;

    return <Text style={styles.sectionHeader}>{section.key}</Text>;
  };

  if (loading) return null;

  if (contacts && contacts.length) {
    return (
      <SectionList
        sections={[
          { data: groups, key: 'Groups' },
          { data: contacts, key: 'Contacts' }
        ]}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        // editMode={editMode}
        keyExtractor={item => item.id.toString()}
        removeClippedSubviews={false}
      />
    );
  }
  const text =
    "No contacts here? Add contacts from your phone using the app's contacts" +
    " section if you'd like to share this link with anyone.";
  return <Text style={styles.contactsHint}>{text}</Text>;
};

export default ContactPickList;
