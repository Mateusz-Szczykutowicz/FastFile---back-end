# FastFile - back-end

## About

## API

### Table of contents

-   [User:](#user)
    -   [Login](#login)
    -   [Register](#register)
    -   [Logout](#logout)
    -   [Account information](#account-information)
    -   [Change password](#change-password)
    -   [Delete account](#delete-account)

### User:

#### Login:

description: Login user

method: POST

url: api/v1/users/login

body:

-   login
-   password

response:

-   status 200:
    -   {token}

---

#### Register:

description: Register new user

method: POST

url: api/v1/users/login

body:

-   login
-   password
-   email

---

#### Logout:

description: Logout user

method: GET

url: api/v1/users/logout

header:

-   Authorization: {token}

---

#### Account information:

description: Get information about account

method: GET

url: api/v1/users/

header:

-   Authorization: {token}

---

#### Change password:

description: Change user's password

method: PUT

url: api/v1/users/

body:

-   password

header:

-   Authorization: {token}

---

#### Delete account:

description: Delete user's account

method: DELETE

url: api/v1/users/

header:

-   Authorization: {token}

---
