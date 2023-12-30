export const prompt =
  'I am going to provide you with the body of an email.' +
  ' This email is a newsletter which contains various web links and descriptions of the websites. ' +
  'Please determine the name of the newsletter (please avoid adding the issue title to the name), the date the newsletter ' +
  'was sent (formatted like YYYY-MM-DD) and the sender of the newsletter if that information is available. Please then also provide ' +
  'a list of all the links in the newsletter as well as the descriptions of each link. ' +
  'Do not summarise the description, use the description from the email. ' +
  "Please give me all the data in JSON format. Like this: { newsletter: { name: 'Newsletter name', sender: 'some sender'," +
  " issueNumber: 121, webLink: 'www.somelink.com', date: '2022-01-26' }, links: [{ title: 'This link', url: 'www.someurl.com'," +
  " description: 'lorem ipsum'  }] }. The issue number might be obvious, or you might need to determine the issue number " +
  'from the body of the email. The same goes for the webLink, I am particularly looking for the link to read the issue on the web.' +
  'Do not include any unsubscribe links or links found in the footer of the email. ' +
  'Do not include any explanations, only provide a RFC8259 compliant JSON ' +
  'response following this format without deviation. The email is as follows:'
