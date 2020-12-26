# API

## Folders

### Table of contents

-   [User:](/docs/Folders.md/#user)
    -   [All items in folder](/docs/Folders.md/#all-items)
    -   [Create folder](/docs/Folders.md/#create-folder)
    -   [Remove folder](/docs/Folders.md/#remove-folder)

---

#### User:

##### All items:

###### **Request**:

description: Get all files and folders in folder

method: GET

URL: _**api/v1/folders**_

headers:

-   Authorization: {token}

<br>

##### Create folder:

###### **Request**:

description: Create new folder

method: POST

URL: _**api/v1/folders**_

body:

-   name
-   parentPath?

headers:

-   Authorization: {token}

<br>

##### Remove folder:

###### **Request**:

description: Remove one folder

method: DELETE

URL: _**api/v1/folders**_

body:

-   path?

headers:

-   Authorization: {token}

<br>
