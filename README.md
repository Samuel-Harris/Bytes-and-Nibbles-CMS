# Bytes and Nibbles CMS
![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/Samuel-Harris/Bytes-and-Nibbles-CMS?utm_source=oss&utm_medium=github&utm_campaign=Samuel-Harris%2FBytes-and-Nibbles-CMS&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

The Content Management System (CMS) of my tech and food blog: [Bytes and Nibbles](https://bytes-and-nibbles.web.app).

## Config files 
For the public version of this repo, I have removed the following files, which you would need to implement yourself:

- firestore.rules
- storage.rules
- src/firebase-config.ts

Learn how to write your own authorisation-defining .rules files [here](https://firebase.google.com/docs/rules/basics).

Learn how to generate your own firebase-config.ts file [here](https://support.google.com/firebase/answer/7015592).

## Usage
To use CMS, execute the comand `npm run dev` and open the CMS at [http://localhost:5173](http://localhost:5173). Changes saved in this site will automatically be reflected in Firebase.
