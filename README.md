## About It

This is a prototype of a social media API inspired in Orkut's scraps funcionality.

## Functionalities

- **Create a new User**
- **Authenticate with JWT and refresh tokens**
- **Follow another User**
- **Send a Scrap to another user** 
- **Like any Scrap**

## Documentation:

- **Swagger (in the making)**:
 Just access `/docs` path after running the project

## Development:

**Create a env file in the project root**: 

```
PORT=3333

BASE_URL=http://localhost:3333

DB_CONNECTION=mysql
DB_USERNAME=root
DB_PASSWORD=root
DB_NAME=scraps-db
DB_PORT=3306

JWT_SECRET=cb233d5af9050c850680870e10bb85745965ae530563546c81844e7f8e2dc5c4733108f857c9dbd96bf230e5c24d7af0b79531deb0b378fbd69d4b2790441c3c

# For testing the profile endpoints, you'll need to create an S3 bucket
AWS_BUCKET_NAME=
AWS_BUCKET_REGION=
AWS_BUCKET_ACCESS_KEY=
AWS_BUCKET_SECRET=
```

**Start the Server**:

```
docker-compose up -d
```

**Shutdown**:

```
docker-compose down
```