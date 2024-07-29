# gmail-triggered-screenshot-responder#

Google Apps Script to listen for emails, extract URLs, convert web pages to PDFs, and reply with the screenshots as PDF attachments.

## Description

This project uses Google Apps Script to automatically process incoming emails sent to a specific alias (e.g., `mygmail+screenshot@gmail.com`). It performs the following tasks:
- Searches for unread emails sent to the alias.
- Extracts URLs from the email's subject and body.
- Converts the web pages into PDF files.
- Replies to the original email with the PDF screenshots as attachments.

## Setup

1. **Create a Google Apps Script Project:**
   - Go to [Google Apps Script](https://script.google.com/).
   - Click on `New Project`.

2. **Copy and Paste the Script:**
   - Replace any existing code with the script provided below.
   - Make sure to replace `"your-email@example.com"` with your actual email address.

3. **Deploy the Script as a Web App:**
   - Click on `Deploy` -> `New deployment`.
   - Select `Web app`.
   - Configure the deployment:
     - Give it a description.
     - Set `Execute as` to `Me`.
     - Set `Who has access` to `Anyone`.
   - Click `Deploy`.

4. **Set Up Triggers:**
   - Go to `Edit` -> `Current project's triggers`.
   - Add a new trigger:
     - Choose `processEmails` function to run.
     - Select `Time-driven` -> `Minutes timer` -> `Every 5 minutes` (or any suitable frequency).
