import { getUserActions } from '@/features/users/actions/getUsersActions';
import UserListComponent from '@/features/users/components/list/UserListComponent';

export default async function UserListPage() {
  const userListrResponse = await getUserActions();

  return <UserListComponent users={userListrResponse} />;
}
