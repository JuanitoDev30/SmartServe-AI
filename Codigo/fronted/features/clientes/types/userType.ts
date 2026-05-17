import z from 'zod';
import { Userschema } from '../schemas/clientSchema';

export type UserType = z.infer<typeof Userschema>;
