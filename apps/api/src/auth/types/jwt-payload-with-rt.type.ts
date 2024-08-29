import { JwtPayload } from './jwt-payload.type';

export type JwtPayloadWithRT = JwtPayload & { refreshToken: string };
