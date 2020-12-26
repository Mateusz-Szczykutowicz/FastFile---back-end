# API

<br>

## Users

### Table of contents

-   [Users](#users):
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

#### User:

##### Login:

<br>

###### **Request**:

description: Login user

method: POST

URL: _**api/v1/users/login**_

body:

-   login
-   password

###### **Response**:

-   status 200:
    -   {
        status: true,
        message: Login - success
        token: {token}
        }

<br>

##### Register:

<br>

###### **Request**:

description: Register new user

method: POST

URL: _**api/v1/users/**_

body:

-   login
-   password
-   email

<br>

##### Logout:

<br>

###### **Request**:

description: Logout user

method: GET

URL: _**api/v1/users/logout**_

header:

-   Authorization: {token}

<br>

##### Account information:

<br>

###### **Request**:

description: Get information about account

method: GET

URL: _**api/v1/users**_

header:

-   Authorization: {token}

<br>

##### Change password:

<br>

###### **Request**:

description: Change user's password

method: PUT

URL: _**api/v1/users**_

body:

-   password

header:

-   Authorization: {token}

<br>

##### Delete account:

<br>

###### **Request**:

description: Delete user's account

method: DELETE

URL: _**api/v1/users**_

header:

-   Authorization: {token}

<br>

---

<br>

#### Admin:

##### All users:

<br>

###### **Request**:

description: Get all users account

method: GET

URL: _**api/v1/admin/users**_

header:

-   Authorization: {token}

<br>

##### One user:

<br>

###### **Request**:

description: Get one user's account

method: GET

URL: _**api/v1/admin/users/:user**_

header:

-   Authorization: {token}

<br>

##### User role:

<br>

###### **Request**:

description: Get information about user's role

method: GET

URL: _**api/v1/admin/users/:user/admin**_

header:

-   Authorization: {token}

<br>

##### Change password - admin:

<br>

###### **Request**:

description: Get information about user's role

method: PUT

URL: _**api/v1/admin/users/:user**_

body:

-   password

header:

-   Authorization: {token}

<br>

##### Delete user:

<br>

###### **Request**:

description: Get information about user's role

method: DELETE

URL: _**api/v1/admin/users/:user**_

header:

-   Authorization: {token}

---
