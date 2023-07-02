

### Commentary in PDF format

○ A high level schematic diagram for your website demonstrating all three tiers

of your architecture, the end points that connect client to server.
■ Use a free tool such as figma.com to produce this

○ Extension description

- Specify which extension you implemented.

- Discuss what you did to implement it.

- Highlight aspects which you particularly want us to pay attention

- Use screenshots of code or refer to filenames and line numbers where
  
  appropriate

- 





0. Extension:
   
   You should also enhance your project by completing an extension from the following options.
   You are free to complete as many extensions as you want but we will ONLY consider the first
   extension which is specified in your commentary.
   
   Front end styling and GUI:
- ●  Use CSS styling to create a modern professional look and feel to your application

- ●  You might do this using utility frameworks such as Bootstrap or Tailwind, or write the
  
  CSS from scratch
  
  Add extra functionality:

● Add a range of extra functionality to the app on both author and reader sides. For
example:

- ○  Log article stats such as number of reader visits and read time.

- ○  Add a moderation feature for comments.

- ○  Add further reactions for articles

- ○  Allow authors to add tags to articles and implement a filter by tag for readers
  
  Password access for author pages and routes:

- ●  Secure the author pages with password authentication and write middleware to
  prevent any unauthorised access to author endpoints

- ●  You’ll need to create an author login page which authenticates the author against a
  naively stored server-side password (eg. in an environment variable)

- ●  You’ll also need to use a package such as express-session to create secure sessions
  
  Add a rich text editor:

- ●  Research and add an open source rich text editor such as https://summernote.org/ to
  allow authors greater control over their content.

- ●  You’ll need to make sure that the rich text also gets rendered to the Reader Page as
  well.
  
  Best practices:
  
  Move your code base towards production level by following some recommended best
  practices below:



*dsd*

in visit features we will use redis to aviod date hits!
