import z from 'zod';
import { Userschema } from '../schemas/userSchema';

export type UserType = z.infer<typeof Userschema>;
