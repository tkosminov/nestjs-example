import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

export const passwordToHash = (password: string) => {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  return hash;
};

export const checkPassword = (password: string, hash: string) => {
  return compareSync(password, hash);
};
