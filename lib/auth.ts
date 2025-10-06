import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken'

const secret = process.env.JWT_SECRET as string

export function signToken(payload: object, expiresIn: number | `${number}${'s' | 'm' | 'h' | 'd'}` = '7d') {
  const options: SignOptions = { expiresIn: expiresIn as any }  
  return jwt.sign(payload, secret, options)
}

export function verifyToken(token: string): JwtPayload | string | null {
  try {
    return jwt.verify(token, secret)
  } catch {
    return null
  }
}
