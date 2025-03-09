### TRAE EDITOR - Prompt inicial para crear el schema de la base de datos

You're an expert software engineer that is working on an Application Tracking System ( ATS ).

Your first task is to work on the database schema the application will use, the schema will be inside , it is using PostgreSQL with Prisma as ORM.

I want you to create an schema to work with the following user history:

"Add candidate to the system"

That feature will include an option to the recruiter to add a new candidate

We will use JWT for recruiting to login to the application, build the schema first to have a signup / signin functionality, the password will be encrypted in the backend, take any considerations to secure it in database.

Then we will need the schema for the feature to add candidate to the system, think on all the possible tables that we will need, the relations between them and create them

It is important that some table includes the candidate information that will inclue minimum:

Name, Surname, Email Address, Phone Number, address, education and experience ( make the corresponding validations in DB on those fields ) 

There will be also the option to load a PDF/DOCX document, so we should be able to save this somewhere and save the path on our DB too.

Based on the context create the corresponding Schema for the above features

### TRAE EDITOR - Prompt inicial para crear el backend

Now that we worked on the schema, we need to build the backend for the features.

Our backend is working with Node.js , Express and is written in TypeScript. The current directory of our backend is 
Inside it you will find our current Schema 

First of all create a Signup / SignIn endpoints in the backend that i can use in Postman to check if those are working, we need to be able to create the Recruiter User or Admin User, create also a route in our app and make sure to create the TDD tests in the corresponding folder. Our code will be inside  and the tests inside it.

After that, create the routes for  the feature to add candidates, it needs to work as a REST API with CRUD methods , remember that we're working on an ATS system and follow the current schema, it is important that our methods contains validations for the fields when creating/updating

It is also important to make sure the information is encrypted , so you can use a custom key in the .env and some bi-directonial algorithm to encrypt/decrypt the information.

We will also need some routes to be able to upload documents in PDF / DOCX that will be the CV of the candidate.

Handle all possible errors with a middleware or some system that capture those and send those back to our front-end so we can later print them

### TRAE EDITOR - Prompts Seguimiento BackEnd

The is having some typescript issues because there are no the corresponding routes in , you have some code in 

make the corresponding fixes to solve that issue

Now we need to update the 

First of all we need to update the create method, as it needs to contain more fields , check them in 
### Nuevo prompt para continuar el backend

After that, create the other methods to update, delete, and read candidates, create also a list method that will list candidates and will work with pagination as an optional parameter, if no pagination it wil return maximum 100 results

Update also the routes if needed

### TRAE EDITOR - Prompt inicial para crear el frontend

Awesome, now that we have the backend and the schema is time to build the frontend

Don't lose the context on how our backend is build at backend

The FrontEnd is build on React and is inside frontend

We will need some routes on our frontend

First of all we will need a Login Screen for our Recruiters, make it simple but beatifull, use TailWind CSS and material UI , the Login Screen should be splitted into 2 sections, left one to include the email input and password and a button to login

The right side will include a background color like a light blue ( which will be our main color )

You need to create also all the logic that will communicate with the backend and then will save the JWT in localStorage

If for any reason the JWT expires, you need to handle that login in all the dashboard screens, to show up a modal so user can re-authenticate with email and password and update locally the JWT.

After the login is done, we'll need a Dashboard.

Create the dashboard with a left sidebar that will be the menu , a top navbar that will be the avatar menu and the rest will be the content

In the top navbar will be the user email, when click on it it will show the user data like name, role etc

The left sidebar ( menu ) will include the "Candidates" options

When click t it it will show a submenu including the following options

"List Candidates" -> Will be the default option and should open it when clicking on Candidates, it is important to create the css to let user know which is the .active option

"Create Candidate" -> This menu option will include the form to create a new candidate with all the required fields, validations, connection with our backend and database and also handle all the notifications ( possible errors, success etc )

In the "List Candidates" we will show the list of current candidates in like a table format but not using tables, use css for it and make sure it can work with pagination too.

Every row will include basic information on candidate and at the right, a pencil ( to edit ) , a trash( to delete it ) and an Eye ( to open it ) those are icons that will execute the functions on the candidate route and the eye one should work with URL params containing the candidate id in the url

"Candidate Screen" -> Will retrieve all the information on the candidate, all the experience, education etc that list won't show and also the option to update it if user wants by clickin an "Edit" button  that will then make the fields editables. it must contain too the option to download the attached CV if it has or to upload it

It is important to handle perfectly all the responses from the backend and implement some notification system at the top right to show success messages or error messages

### Respuesta

Crea ciertos ficheros pero no todos, igualmente el editor te avisa si quieres que continue con ellos y así se lo indicamos

### Prompts de seguimiento de Front-End

There are some issues in frontend

Can you fix them?

### 

We're still having some issues at Sidebar.tsx and AuthContext.tsx

###

Let's fix some issues with the front end and the backend

Right now the backend is throwing the following error regarding dates

Invalid value for argument `startDate`: premature end of input. Expected ISO-8601 DateTime.

Can we update front end to handle this on create candidate?