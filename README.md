# Centri
This is a course project for *Programming for Web (CIS 557)* and is a group work produced by a team of four. The project was originally maintained in a Github Classroom private repo and I migrated the code here. As a result, apart from the source code itself, this repo does not contain any working records (e.g., Pull Request history, CI/CD configurations, etc.) that exist in the original repo.

## My Work in this Project:
* Applied **Agile Method** & **Extreme Programming** principles to the teamwork; Hosted weekly meetings to track our progresses in each sprint
* Utilized **Figma** for UI/UX design and **Swagger** for API documentation
* Built the frontend using functional components in **React**, along with **Redux**, **Bootstrap**, **React Router**, etc.
* Built the **Express**-based backend using **Passport** for authentication, **Mongoose** for CRUD operations with **MongoDB**, **Multer** and **GridFS** for file storage in MongoDB
* Tested the project with the **Jest** framework; used **React Test Library**, **Supertest** and **Cypress** to perform various tests and achieved a test coverage of over 80%
* Constructed the CI/CD pipeline with **Travis CI** and **Heroku**; Also deployed the app on **AWS Elastic Beanstalk**

## Design of this Project
### UI/UX Design
We performed the frontend UI/UX design on Figma. The link to our design page is as follows.

[UI design on Figma (Wireframes & Prototypes)](https://www.figma.com/file/ZeWTpthCjEeJKaqZ5zX1YC/CIS557-Project?node-id=0%3A1)

### API Design
We followed the Rest API conventions when designing the backend API. Below is the link to our Swagger design page.

[Swagger API documentation](https://app.swaggerhub.com/apis-docs/xpeteliu/CIS557_Project/1.0.0)

### Database Design
#### ER Diagram
![ER Diagram](https://github.com/xpeteliu/centri/blob/main/wiki/cis557_ER_diagram.png)
#### Entity Schemas
![Entity Schemas](https://github.com/xpeteliu/centri/blob/main/wiki/cis557_ER_NoSQL_schema.png)

## About this Project

This project contains the React-based frontend code in the folder *client* and the Express-based backend code in the folder *api*. It has been configured for building in the Linux environment and is ready for Heroku deployment. The unit/integration/API tests are kept on the *test* branch, and the end-to-end tests are kept on the *e2e-test* branch.
