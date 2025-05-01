// remove tokens from table to allow user to log in if they revoked the app

import { removeTokens } from "../api/utils"

export default async function Logout(){
    const token = await removeTokens();

    return <>Tokens Removed!</>
}