import { Authenticator, FirebaseCMSApp } from "firecms";

import "typeface-rubik";
import "@fontsource/ibm-plex-mono";

import { firebaseConfig } from "./firebase-config.ts";
import { byteCollection } from "./collections/bytes.tsx";
import { byteSeriesCollection } from "./collections/byteSeries.tsx";
import { nibbleCollection } from "./collections/nibbles.tsx";
import { useCallback } from "react";
import { User } from "firebase/auth";

export default function App() {
    const myAuthenticator: Authenticator<User> = useCallback(async ({ user, authController }) => {
        console.log("Allowing access to", user?.email);

        const sampleUserRoles = await Promise.resolve(["admin"]);
        authController.setExtra(sampleUserRoles);

        return true;
    }, []);

    return <FirebaseCMSApp
        name={"Bytes and Nibbles CMS"}
        plugins={[]}
        authentication={myAuthenticator}
        collections={[byteCollection, byteSeriesCollection, nibbleCollection]}
        firebaseConfig={firebaseConfig}
        logo={"/logo.png"}
    />;
}
