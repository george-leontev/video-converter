# Video converter .mov → .mp4

## All instructions for launching are made from under Ubuntu. If you test the app from Windows, then you may have to install some technologies such as nodejs and docker

## Clone the repository
1. Open Visual Studio Code
2. Open WSL
3. ```git clone https://github.com/george-leontev/video-converter.git```

## Install dependencies
```npm install```

## Startup Instructions
1. Install Docker Engine if necessary: <ins>https://docs.docker.com/engine/install/ubuntu/</ins>

2. Enter the command ```docker-compose up -d```

3. Or open docker-compose.yaml file.

4. Right-click on the <ins>docker-compose.yaml</ins> file.

5. Click on the **Compose Up** button.

This may take some time... :)

### After the Docker container are up and running, you finnaly can use the app!
### Access to application:
- API: <ins>http://localhost:3000</ins>

- UI: <ins>http://localhost:5000</ins>
