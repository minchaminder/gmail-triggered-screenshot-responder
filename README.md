# gmail-triggered-screenshot-responder# Email-Triggered-Screenshot-Responder

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

## Script

```javascript
function sanitizeFilename(url) {
  // Limit the length to 200 characters and replace non-alphanumeric characters with underscores
  return url.replace(/[^a-z0-9]/gi, '_').substring(0, 200); 
}

function sendScreenshots(urls, message) {
  try {
    var attachments = [];
    for (var i = 0; i < urls.length; i++) {
      var url = urls[i];
      Logger.log("Fetching URL content from: " + url);
      var response = UrlFetchApp.fetch(url);
      var htmlContent = response.getContentText();
      Logger.log("HTML content fetched successfully.");

      Logger.log("Creating temporary HTML file.");
      var tempFile = Utilities.newBlob(htmlContent, 'text/html', 'temp.html');

      Logger.log("Converting HTML to PDF.");
      var sanitizedFilename = sanitizeFilename(url);
      var pdf = tempFile.getAs('application/pdf').setName("screenshot_" + sanitizedFilename + ".pdf");
      Logger.log("PDF created successfully with name: " + "screenshot_" + sanitizedFilename + ".pdf");
      
      attachments.push(pdf);
    }

    Logger.log("Replying to the email with the screenshots.");
    var replyBody = "Attached are the screen prints you requested.\n\nURLs:\n" + urls.join("\n");
    message.reply(replyBody, {
      attachments: attachments
    });
    Logger.log("Email sent successfully.");
  } catch (error) {
    Logger.log("Error: " + error.message);
  }
}

function processEmails() {
  var alias = 'mygmail+screenshot@gmail.com';  // Hardcoded alias email
  var threads = GmailApp.search('to:' + alias + ' is:unread');
  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages();
    for (var j = 0; j < messages.length; j++) {
      var message = messages[j];
      if (!message.isUnread()) continue;

      var body = message.getBody();
      var subject = message.getSubject();
      
      // Use a Set to store unique URLs
      var urlSet = new Set();
      var bodyMatches = body.match(/https?:\/\/[^\s<>"']+/g);
      var subjectMatches = subject.match(/https?:\/\/[^\s<>"']+/g);

      if (bodyMatches) {
        bodyMatches.forEach(url => urlSet.add(url));
      }
      if (subjectMatches) {
        subjectMatches.forEach(url => urlSet.add(url));
      }

      if (urlSet.size > 0) {
        sendScreenshots(Array.from(urlSet), message);
        message.markRead();
      }
    }
  }
}
