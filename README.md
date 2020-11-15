![FastFile](https://cdn.discordapp.com/attachments/758257695458983947/777473345905491979/FastFile-web.png)

# Back-end

## About

## API

<br>

---

### Table of contents

-   [User:](#user)
    -   [Login](#login)
    -   [Register](#register)
    -   [Logout](#logout)
    -   [Account information](#account-information)
    -   [Change password](#change-password)
    -   [Delete account](#delete-account)
-   [Admin](#admin)
    -   [All users](#all-users)
    -   [One user](#one-user)
    -   [User role](#user-role)
    -   [Change password](#change-password---admin)
    -   [Delete user](#delete-user)

---

### User:

<br>

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

<br>

#### Register:

description: Register new user

method: POST

url: api/v1/users/login

body:

-   login
-   password
-   email

<br>

#### Logout:

description: Logout user

method: GET

url: api/v1/users/logout

header:

-   Authorization: {token}

<br>

#### Account information:

description: Get information about account

method: GET

url: api/v1/users

header:

-   Authorization: {token}

<br>

#### Change password:

description: Change user's password

method: PUT

url: api/v1/users

body:

-   password

header:

-   Authorization: {token}

<br>

#### Delete account:

description: Delete user's account

method: DELETE

url: api/v1/users

header:

-   Authorization: {token}

<br>

---

<br>

### Admin:

#### All users:

description: Get all users account

method: GET

url: api/v1/admin/users

header:

-   Authorization: {token}

<br>

#### One user:

description: Get one user's account

method: GET

url: api/v1/admin/users/:user

header:

-   Authorization: {token}

<br>

#### User role:

description: Get information about user's role

method: GET

url: api/v1/admin/users/:user/admin

header:

-   Authorization: {token}

<br>

#### Change password - admin:

description: Get information about user's role

method: PUT

url: api/v1/admin/users/:user

body:

-   password

header:

-   Authorization: {token}

<br>

#### Delete user:

description: Get information about user's role

method: DELETE

url: api/v1/admin/users/:user

header:

-   Authorization: {token}

---
