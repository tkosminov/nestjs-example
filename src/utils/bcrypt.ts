import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

export const passwordToHash = (password: string) => {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  return hash;
};

export const checkPassword = (hash: string, password: string) => {
  return compareSync(password, hash);
};
