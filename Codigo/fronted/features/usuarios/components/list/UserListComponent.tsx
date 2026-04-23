interface UserListComponentProps {
  users: string[]; // Replace with your actual user type
}

export default function UserListComponent(userList: UserListComponentProps) {
  return (
    <div>
      <h2>User List</h2>
      <ul>
        {userList.users.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
    </div>
  );
}
