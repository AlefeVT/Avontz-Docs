export const AUTHENTICATION_ERROR_MESSAGE =
  "Você precisa estar logado para visualizar este conteúdo";

export const PRIVATE_GROUP_ERROR_MESSAGE =
  "Você não tem permissão para visualizar este grupo";

export const AuthenticationError = class AuthenticationError extends Error {
  constructor() {
    super(AUTHENTICATION_ERROR_MESSAGE);
    this.name = "AuthenticationError";
  }
};

export const PrivateGroupAccessError = class PrivateGroupAccessError extends Error {
  constructor() {
    super(PRIVATE_GROUP_ERROR_MESSAGE);
    this.name = "PrivateGroupAccessError";
  }
};

export const NotFoundError = class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
};
