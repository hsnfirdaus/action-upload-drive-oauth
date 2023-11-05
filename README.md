# Action Upload Google Drive OAuth

Github Action To Upload to Google Drive Using A Google OAuth2 Credentials. This is alternative of Google Drive action that use service account.

For example, you want to upload using Google Workspace Account but doesn't have permission to change the domain-wide delegation permission.

## Usage

#### Simple example using workflow dispatch inputs credentials:

```
steps:
    - uses: actions/checkout@v4.1.1

    - name: Upload Artifacts TO Google Drive
      uses: hsnfirdaus/action-upload-drive-oauth@v2.0.0
      with:
        target: <LOCAL_PATH_TO_YOUR_FILE>
        client_id: ${{ secrets.<YOUR_OAUTH2_CLIENT_ID> }}
        client_secret: ${{ secrets.<YOUR_OAUTH2_CLIENT_SECRET> }}
        redirect_uri: ${{ secrets.<YOUR_OAUTH2_REDIRECT_URI> }}
        credentials: ${{ github.event.inputs.credentials }}
        parent_folder_id: <YOUR_DRIVE_FOLDER_ID>
```

At above example, we are using [Github Actions Input for Manual Workflow](https://github.blog/changelog/2021-11-10-github-actions-input-types-for-manual-workflows/).

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

A OAuth2 Credential (JSON access_token, scope, token_type,...).

You can get the JSON using [Google OAuth Playground](https://developers.google.com/oauthplayground). Make sure to select Drive API V3 Scope. After get authorization code, click "Exchange authorization code for token" button. In the response, It will looks something like this:

```json
{
  "access_token": "XXX",
  "scope": "https://www.googleapis.com/auth/drive",
  "token_type": "Bearer",
  "expires_in": 3599,
  "refresh_token": "XXX"
}
```

#### `parent_folder_id` (Required):

The id of the drive folder where you want to upload your file. It is the string of characters after the last `/` when browsing to your folder URL.

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
