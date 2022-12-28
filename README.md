# ASUFE CPC Management System
An online management system for ASUFE CPC

## Before initial run

Open [.env_sample](.env_sample) and update the fields' values to match your database credentials, secret key (anything you want), and the credentials for your organization's email* (this email will be used for system-generated emails).

Rename .env_sample to .env

Note that your database should have the same schema as the one in this [link](https://drawsql.app/teams/team-770/diagrams/cpc-management-system).

*If you're using Gmail, you'll need to enter an app password in the EMAIL_PASSWD field. Click [here](https://support.google.com/mail/answer/185833?hl=en-GB) to find out how to generate an app password for your Gmail.

## Setting up dependencies

Install python if you don't have it already.

To setup all dependencies, open a terminal in the project's root directory and then run the following command:

``` 
pip install -r requirements.txt
```

## Running the website on localhost

### Initializing backend server

Open a new terminal in the project's root directory and then run the following commands:

``` 
cd controller
```
``` 
python app.py
```

### Initializing view server

Open <ins>**another**</ins> new terminal in the project's root directory and then run the following commands:

``` 
cd view
```
``` 
npm start
```

### Accessing the website

After initializing both the view and backend servers, navigate to [localhost:3000](http://localhost:3000/) in your browser. 
