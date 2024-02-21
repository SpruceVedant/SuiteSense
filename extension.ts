import * as vscode from 'vscode';
import axios, { AxiosRequestConfig } from 'axios';

// Function to make NetSuite REST API call
async function makeNetSuiteAPIRequest(url: string, method: string, data?: any): Promise<any> {
  const accountID = 'YOUR_ACCOUNT_ID';
  const consumerKey = 'YOUR_CONSUMER_KEY';
  const consumerSecret = 'YOUR_CONSUMER_SECRET';
  const tokenID = 'YOUR_TOKEN_ID';
  const tokenSecret = 'YOUR_TOKEN_SECRET';

  // Set up OAuth 1.0a headers
  const oauth = {
    consumer_key: consumerKey,
    consumer_secret: consumerSecret,
    token: tokenID,
    token_secret: tokenSecret,
    signature_method: 'HMAC-SHA1',
    timestamp: Math.floor(Date.now() / 1000),
    nonce: Math.random().toString(36).substring(2),
  };

  const requestData: AxiosRequestConfig = {
    method: method,
    url: url,
    data: data,
    headers: {
      Authorization: generateOAuthHeader(oauth, method, url),
    },
  };

  try {
    const response = await axios(requestData);
    return response.data;
  } catch (error) {
    console.error('NetSuite API Request Error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Function to generate OAuth 1.0a header
function generateOAuthHeader(oauth: any, method: string, url: string): string {
  // Implement OAuth header generation logic based on your requirements
  // This is a simplified example, and you might need to enhance it for your use case
  return 'OAuth ' +
    `oauth_consumer_key="${oauth.consumer_key}",` +
    `oauth_token="${oauth.token}",` +
    `oauth_signature_method="${oauth.signature_method}",` +
    `oauth_timestamp="${oauth.timestamp}",` +
    `oauth_nonce="${oauth.nonce}",` +
    `oauth_version="1.0",` +
    `oauth_signature="${generateOAuthSignature(oauth, method, url)}"`;
}

// Function to generate OAuth 1.0a signature
function generateOAuthSignature(oauth: any, method: string, url: string): string {
  // Implement OAuth signature generation logic based on your requirements
  // This is a simplified example, and you might need to enhance it for your use case
  const baseString = //... implement the OAuth base string logic;
  const signingKey = //... implement the OAuth signing key logic;
  const signature = //... implement the HMAC-SHA1 signature logic;
  return signature;
}

// Example usage: Upload SuiteScript to File Cabinet
async function uploadSuiteScriptToNetSuite(scriptContent: string, fileName: string): Promise<void> {
  const scriptFolderId = 'YOUR_SCRIPT_FOLDER_ID'; // Replace with your actual Script Folder ID
  const scriptUrl = `https://<ACCOUNT_ID>.suitetalk.api.netsuite.com/services/rest/record/v1/file/${scriptFolderId}`;

  const uploadData = {
    name: fileName,
    content: scriptContent,
  };

  try {
    const response = await makeNetSuiteAPIRequest(scriptUrl, 'POST', uploadData);
    console.log('Script uploaded successfully:', response);
    vscode.window.showInformationMessage('Script uploaded successfully.');
  } catch (error) {
    vscode.window.showErrorMessage('Error uploading script to NetSuite.');
  }
}

// Activate extension
export function activate(context: vscode.ExtensionContext) {
  // Register a command to upload SuiteScript
  const disposable = vscode.commands.registerCommand('extension.uploadScript', async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const scriptContent = editor.document.getText();
      const fileName = editor.document.fileName;

      // Call the function to upload SuiteScript
      await uploadSuiteScriptToNetSuite(scriptContent, fileName);
    } else {
      vscode.window.showWarningMessage('Open a script file before attempting to upload.');
    }
  });

  context.subscriptions.push(disposable);
}

// Deactivate extension
export function deactivate() {}
