Here it is a backend of fully functional api which is used for file uploading, removing, listing and updating the data.
This project is used different technologies list are given below:
1. TypeScript
2. Node
3. AWS-S3
4. MySQL


Follow the steps to setup the project on the local machine run these cammands given below:

1. npm install
2. cd fileupload backend

3. for production use
    3.1. npm run build
    3.2. npm start
    or
   for devlopment use
    npm run dev

4. update the .env file
    ex:-
        AWS_ACCESS_KEY_ID=key_from_aws_s3_bucket
        AWS_SECRET_ACCESS_KEY=key_from_aws_s3_bucket
        AWS_REGION=Region_from_aws_s3_bucket
        AWS_BUCKET_NAME=_from_aws_s3_bucket
        PORT=Port_number

        DB_Host=localhost
        DB_PORT=3306(for mysql default)
        DB_USER=your_mysql_database_user_name
        DB_PASSWORD=your_database_password
        DB_NAME=your_database_name

setup a schema for mysql database on your local machine:
    CREATE TABLE files (
    id VARCHAR(255) PRIMARY KEY,
    s3_key VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

test api using postman:
1. uploading a file:
    http://localhost:3000/files
    
    in postman go to body->formdata fill the key:value like given below:
        file(type:file): upload file
        name(type:text): write file name
        description: write file decription

2. for deleting:
    http://localhost:3000/files/id:


3. for getting the data:
    http://localhost:3000/files