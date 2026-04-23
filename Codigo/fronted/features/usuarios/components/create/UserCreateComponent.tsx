'use client';

import { useForm } from 'react-hook-form';
import { Userschema } from '../../schemas/userSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserType } from '../../types/userType';
import { createUserActions } from '../../actions/createUserActions';

export default function UserCreateComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(Userschema),
    mode: 'all',
  });

  const onSubmit = async (data: UserType) => {
    const result = await createUserActions(data);
    if (result.error) {
      console.error(result.error);
    } else {
      // console.log(result.success);
    }
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="name">Name</label>
      <input type="text" id="name" {...register('name')} />
      {errors.name && <p>{errors.name.message}</p>}

      <label htmlFor="email">Email</label>
      <input type="email" id="email" {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}
      <button type="submit">Create User</button>
    </form>
  );
}
