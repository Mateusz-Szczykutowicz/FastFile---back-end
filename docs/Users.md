# API

## Users

### Table of contents

-   [User:](#user)
    -   [Login](#login)
    -   [Register](#register)
    -   [Logout](#logout)
    -   [Account information](#account-information)
    -   [Change password](#change-password)
    -   [Delete account](#delete-account)
    -   [Recover password](#recover-password)
    -   [Change recover password](#change-recover-password)
-   [Admin](#admin)
    -   [All users](#all-users)
    -   [One user](#one-user)
    -   [User role](#user-role)
    -   [Change password](#change-password---admin)
    -   [Delete user](#delete-user)

---

#### User:

##### Login:

###### **Request**:

description: Login user

method: POST

URL: _**api/v1/users/login**_

body:

-   login
-   password

###### **Response**:

-   status 200
    ```
    {
        status: true,
        message: Login - success
        token: {token}
    }
    ```

<br>

##### Register:

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

###### **Request**:

description: Logout user

method: GET

URL: _**api/v1/users/logout**_

headers:

-   Authorization: {token}

<br>

##### Account information:

###### **Request**:

description: Get information about account

method: GET

URL: _**api/v1/users**_

headers:

-   Authorization: {token}

<br>

##### Change password:

###### **Request**:

description: Change user's password

method: PUT

URL: _**api/v1/users**_

body:

-   password

headers:

-   Authorization: {token}

<br>

##### Delete account:

###### **Request**:

description: Delete user's account

method: DELETE

URL: _**api/v1/users**_

headers:

-   Authorization: {token}

<br>

##### Recover password:

###### **Request**:

description: Recover password via email

method: POST

URL: _**api/v1/users/recover**_

body:

-   login

<br>

##### Change recover password:

###### **Request**:

description: Change password

method: PUT

URL: _**api/v1/users/recover**_

body:

-   password

<br>

---

<br>

#### Admin:

##### All users:

###### **Request**:

description: Get all users account

method: GET

URL: _**api/v1/admin/users**_

headers:

-   Authorization: {token}

<br>

##### One user:

###### **Request**:

description: Get one user's account

method: GET

URL: _**api/v1/admin/users/:user**_

headers:

-   Authorization: {token}

<br>

##### User role:

###### **Request**:

description: Get information about user's role

method: GET

URL: _**api/v1/admin/users/:user/admin**_

headers:

-   Authorization: {token}

<br>

##### Change password - admin:

###### **Request**:

description: Get information about user's role

method: PUT

URL: _**api/v1/admin/users/:user**_

body:

-   password

headers:

-   Authorization: {token}

<br>

##### Delete user:

###### **Request**:

description: Get information about user's role

method: DELETE

URL: _**api/v1/admin/users/:user**_

headers:

-   Authorization: {token}
