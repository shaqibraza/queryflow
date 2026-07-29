import { compareRefreshToken } from "./refresh-token.js";

type RefreshTokenRecord = {
  id: string;
  tokenHash: string;
  expiresAt: Date;
  isRevoked: boolean;
  userId: string;
};

export const findMatchingRefreshToken = async (
  refreshToken: string,
  refreshTokens: RefreshTokenRecord[]
) => {
  for (const token of refreshTokens) {
    const isMatch = await compareRefreshToken(refreshToken, token.tokenHash);

    if (isMatch) {
      return token;
    }
  }

  return null;
};
