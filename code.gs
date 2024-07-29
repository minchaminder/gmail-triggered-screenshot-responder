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
