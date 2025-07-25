import { jwtVerify, SignJWT } from "jose";

// In Edge Runtime, we can access environment variables directly
const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
  throw new Error('JWT_SECRET environment variable is not set');
}

const secret = new TextEncoder().encode(SECRET_KEY);

const EXPIRATION = "24h"; // Token expires in 24 hours

// Generate a JWT token
export const generateToken = async (user) => {
  try {
    const token = await new SignJWT({
      userId: user.userId,
      email: user.email,
      role: user.role,
      version: 1
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d') // Set to 7 days to match cookie expiration
      .setSubject(user.userId.toString()) // Add sub field for userId
      .sign(secret);
    
    // Log token for debugging
    console.log("JWT - Token generated with payload:", {
      userId: user.userId,
      email: user.email,
      role: user.role,
      sub: user.userId.toString()
    });
    
    // Verify token was generated correctly
    try {
      const { payload } = await jwtVerify(token, secret, {
        algorithms: ['HS256']
      });
      console.log("JWT - Token verified with payload:", payload);
    } catch (verifyError) {
      console.error("JWT - Token verification failed:", verifyError);
    }
    
    return token;
  } catch (error) {
    console.error('Token generation failed:', error);
    throw new Error('Failed to generate token');
  }
};

// Verify a JWT token
export const verifyToken = async (token) => {
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256']
    });
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    if (error.code === 'ERR_JWT_EXPIRED') {
      throw new Error('Token has expired');
    }
    throw new Error('Invalid token');
  }
};

// Decode token without verification (useful for debugging)
export const decodeToken = async (token) => {
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256']
    });
    return payload;
  } catch (error) {
    // Still return the decoded payload even if verification fails
    const decoded = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    );
    return decoded;
  }
};

// Generate a refresh token (optional for future expansion)
export const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user.userId }, SECRET_KEY, { expiresIn: "7d" }); // Refresh token valid for 7 days
};

export const signToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
};
