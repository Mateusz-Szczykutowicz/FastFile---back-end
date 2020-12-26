# API

## Files

### Table of contents

-   [User:](#user)
    -   [All files](#all-files)
    -   [One file](#one-file)
    -   [Upload file](#upload-file)
    -   [Download file](#download-file)
    -   [Rename file](#rename-file)
    -   [Remove file](#remove-file)
    -   [View image](#view-image)
-   [Admin:](#admin)
    -   [All files](#all-files---admin)
    -   [One file](#one-file---admin)
    -   [Upload file](#upload-file---admin)
    -   [Download file](#download-file---admin)
    -   [Rename file](#rename-file---admin)
    -   [Remove file](#remove-file)
    -   [View image](#view-image---admin)

---

#### User:

##### All files:

###### **Request**:

description: Get all files

method: GET

URL: _**api/v1/files**_

headers:

-   Authorization: {token}

###### **Response**:

-   status 200
    ```
    {
        status: true,
        message: "Login - success"
        files: [
            {data}
        ]
    }
    ```
-   status 401
    ```
    {
        status: false,
        message: "Unauthorized access"
    }
    ```

<br>

##### One file:

###### **Request**:

description: Get one file

method: GET

URL: _**api/v1/files/:name**_

headers:

-   Authorization: {token}

<br>

##### Upload file:

###### **Request**:

description: Upload one file

method: POST

URL: _**api/v1/files**_

body:

-   upload (file)
-   path?

headers:

-   Authorization: {token}

<br>

##### Download file:

###### **Request**:

description: Download one file

method: GET

URL: _**api/v1/files/:name/download**_

headers:

-   Authorization: {token}

<br>

##### Rename file:

###### **Request**:

description: Rename file

method: PUT

URL: _**api/v1/files/:name**_

body:

-   name

headers:

-   Authorization: {token}

<br>

##### Remove file:

###### **Request**:

description: Remove one file

method: DELETE

URL: _**api/v1/files/:name**_

headers:

-   Authorization: {token}

<br>

##### View image:

###### **Request**:

description: Display image

method: GET

URL: _**api/v1/files/:name/image**_

queries:

-   height?
-   width?

headers:

-   Authorization: {token}

<br>

#### Admin

##### All files - admin:

###### **Request**:

description: Get all user files

method: GET

URL: _**api/v1/admin/files/:user**_

headers:

-   Authorization: {token}

<br>
