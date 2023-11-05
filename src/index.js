/* eslint-disable no-console */
const fs = require('fs');

const actions = require('@actions/core');
const { google } = require('googleapis');

const clientId = actions.getInput('client_id', { required: true });
const clientSecret = actions.getInput('client_secret', { required: true });
const redirectUri = actions.getInput('redirect_uri', { required: true });
const credentials = actions.getInput('credentials', { required: true });
const parentFolderId = actions.getInput('parent_folder_id', { required: true });
const target = actions.getInput('target', { required: true });
const childFolder = actions.getInput('child_folder', { required: false });
const override = actions.getBooleanInput('override', { required: false });
let filename = actions.getInput('name', { required: false });

const credentialsJSON = JSON.parse(credentials);
const auth = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

auth.setCredentials(credentialsJSON);
const drive = google.drive({ version: 'v3', auth });

async function getUploadFolderId() {
    if (!childFolder) {
        return parentFolderId;
    }

    // Check if child folder already exists and is unique
    const {
        data: { files },
    } = await drive.files.list({
        q: `name='${childFolder}' and '${parentFolderId}' in parents and trashed=false`,
        fields: 'files(id)',
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
    });

    if (files.length > 1) {
        throw new Error('More than one entry match the child folder name');
    }
    if (files.length === 1) {
        return files[0].id;
    }

    const childFolderMetadata = {
        name: childFolder,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentFolderId],
    };
    const {
        data: { id: childFolderId },
    } = await drive.files.create({
        resource: childFolderMetadata,
        fields: 'id',
        supportsAllDrives: true,
    });

    return childFolderId;
}

async function main() {
    const uploadFolderId = await getUploadFolderId();

    if (!filename) {
        filename = target.split('/').pop();
    }

    const fileMetadata = {
        name: filename,
        parents: [uploadFolderId],
    };
    const fileData = {
        body: fs.createReadStream(target),
    };

    if (override) {
        const res = await drive.files.list({
            q: `'${uploadFolderId}' in parents`,
            fields: 'nextPageToken, files(id, name)',
        });

        const { files } = res.data;

        files.forEach((file) => {
            if (file.name === filename) {
                const fileId = file.id;

                drive.files.delete({ fileId });
            }
        });
    }

    return drive.files.create({
        resource: fileMetadata,
        media: fileData,
        uploadType: 'multipart',
        fields: 'id',
        supportsAllDrives: true,
    });
}

main().catch((error) => actions.setFailed(error));
