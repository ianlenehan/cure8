import { atom, useRecoilState } from 'recoil';

const currentUserState = atom({
  key: 'currentUserState',
  default: null,
});

const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useRecoilState<any>(currentUserState);

  return [currentUser, setCurrentUser];
};

export default useCurrentUser;
