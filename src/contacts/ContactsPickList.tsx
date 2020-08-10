import React, { useState, FunctionComponent } from 'react';
import { Text, SectionList, StyleSheet } from 'react-native';
import { uniq } from 'lodash';
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

type Group = {
  id: string;
  name: string;
  memberIds: string[];
  owner: any;
  members: any;
};

type Props = {
  selectedContactIds: string[];
  onPress: (contactIds: string[]) => void;
  contacts: any;
  loading?: boolean;
  groups?: Group[];
};

const ContactPickList: FunctionComponent<Props> = ({
  selectedContactIds,
  onPress,
  contacts,
  groups = [],
  loading
}) => {
  const [selectedGroupIds, setSelectdGroupIds] = useState<string[]>([]);

  const getIconColour = (item: any) => {
    if (item.memberIds && selectedGroupIds.includes(item.id)) {
      return colors.primaryGreen;
    }
    if (!item.memberIds && selectedContactIds.includes(item.id)) {
      return colors.primaryGreen;
    }
    return colors.backgroundGrey;
  };

  const getSelectedMemberIds = (groupIds: string[]) => {
    const selectedGroups: Group | any = groups.filter(
      ({ id }: { id: string }) => groupIds.includes(id)
    );

    return uniq(
      selectedGroups
        .map(({ memberIds }: { memberIds: string[] }) => memberIds)
        .flat()
    );
  };

  const handleDeselectGroup = (itemId: string) => {
    const otherIds = selectedGroupIds.filter(groupId => groupId !== itemId);
    const groupIds: string[] = otherIds;

    const group: Group | any =
      groups.find(({ id }: { id: string }) => id === itemId) || {};
    const contactIds: string[] = group.memberIds.filter((id: string) => {
      const otherGroupMemberIds = getSelectedMemberIds(groupIds);
      return !otherGroupMemberIds.includes(id);
    });
    setSelectdGroupIds(groupIds);
    onPress(contactIds);
  };

  const handleSelectGroup = (itemId: string) => {
    const groupIds: string[] = [...selectedGroupIds, itemId];
    const selectedMemberIds: any = getSelectedMemberIds(groupIds);
    const contactIds: string[] = selectedMemberIds.filter(
      (id: string) => !selectedContactIds.includes(id)
    );

    setSelectdGroupIds(groupIds);
    onPress(contactIds);
  };

  const renderItem = ({ item }: any) => {
    const iconColour = getIconColour(item);

    let handlePress = () => onPress([item.id]);

    if (item.memberIds) {
      if (selectedGroupIds.includes(item.id)) {
        handlePress = () => handleDeselectGroup(item.id);
      } else {
        handlePress = () => handleSelectGroup(item.id);
      }
    }

    return (
      <ContactRow
        title={item.name}
        isMember={item.member}
        chevronType="circle"
        iconType="font-awesome"
        iconColour={iconColour}
        onPress={handlePress}
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
        keyExtractor={(item: any) => item.id.toString()}
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
