import requests
from jose import jwt
from fastapi import HTTPException, Header
import os

COGNITO_REGION = os.getenv("COGNITO_REGION")
USER_POOL_ID = os.getenv("USER_POOL_ID")
APP_CLIENT_ID = os.getenv("APP_CLIENT_ID")

JWKS_URL = f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{USER_POOL_ID}/.well-known/jwks.json"

jwks = requests.get(JWKS_URL).json()


def verify_token(authorization: str = Header(...)):
    try:
        token = authorization.split(" ")[1]

        # Decode header to get key id
        headers = jwt.get_unverified_header(token)
        kid = headers["kid"]

        # Find matching key
        key = next(k for k in jwks["keys"] if k["kid"] == kid)

        # Verify token
        payload = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            audience=APP_CLIENT_ID,
            issuer=f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{USER_POOL_ID}",
        )

        return payload

    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")