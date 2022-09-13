import { handleAuth } from "@auth0/nextjs-auth0";

// https://auth0.com/docs/quickstart/webapp/nextjs?a=cLgxKoF9UiQQzAl8ZlkWzWLeLFcFKATv&framed=1&sq=1#install-the-auth0-next-js-sdk
// Creates the me, login, logout, and callback routes for you
export default handleAuth();
