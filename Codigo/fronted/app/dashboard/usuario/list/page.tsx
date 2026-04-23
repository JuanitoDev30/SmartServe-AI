import { getUserActions } from '@/features/usuarios/actions/getUsersActions';
import UserListComponent from '@/features/usuarios/components/list/UserListComponent';

export default async function UserListPage() {
  const userListrResponse = await getUserActions();

  return <UserListComponent users={userListrResponse} />;
}
