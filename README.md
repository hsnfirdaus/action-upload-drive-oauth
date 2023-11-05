# Action Upload Google Drive OAuth
Github Action To Upload to Google Drive Using A Google OAuth2 Credential.

## Usage
#### Simple example:
```
steps:
    - uses: actions/checkout@v4.1.1

    - name: Upload Artifacts TO Google Drive
      uses: hsnfirdaus/action-upload-drive-oauth@v1.0.0
      with:
        target: <LOCAL_PATH_TO_YOUR_FILE>
        client_id: ${{ secrets.<YOUR_OAUTH2_CREDENTIALS> }}
        client_secret: ${{ secrets.<YOUR_OAUTH2_CLIENT_SECRET> }}
        redirect_uri: ${{ secrets.<YOUR_OAUTH2_REDIRECT_URI> }}
        credentials: ${{ secrets.<YOUR_OAUTH2_CREDENTIALS> }}
        parent_folder_id: <YOUR_DRIVE_FOLDER_ID>
```

### Inputs
#### `target` (Required):
Local path to the file to upload, can be relative from github runner current directory.

#### `client_id` (Required):
Google OAuth Client ID

#### `client_secret` (Required):
Google OAuth Client Secret

#### `redirect_uri` (Required):
Google OAuth Redirect URI

#### `credentials` (Required):
A OAuth2 Credential (JSON access_token, scope, token_type,...) encoded in base64.

[https://developers.google.com/oauthplayground](https://developers.google.com/oauthplayground)

#### `parent_folder_id` (Required):
The id of the drive folder where you want to upload your file. It is the string of characters after the last `/` when browsing to your folder URL. You must share the folder with the service account (using its email address) unless you specify a `owner`.

#### `name` (Optional):
The name of the file to be uploaded. Set to the `target` filename if not specified.

#### `child_folder` (Optional):
A sub-folder where to upload your file. It will be created if non-existent and must remain unique. Useful to organize your drive like so:

```
📂 Release // parent folder
 ┃
 ┣ 📂 v1.0 // child folder
 ┃ ┗ 📜 uploaded_file_v1.0
 ┃
 ┣ 📂 v2.0 // child folder
 ┃ ┗ 📜 uploaded_file_v2.0
```

#### `override` (Optional):
If set true, delete files with the same name before uploading.
