# CLAWS MCC 2025

## Prerequisites

Before you begin, ensure you have met the following requirements:
- **Docker**: Install Docker from [Docker's official website](https://www.docker.com/products/docker-desktop).
- **Docker Compose**: Docker Compose comes pre-installed with Docker Desktop, but if you are using Linux, follow the instructions [here](https://docs.docker.com/compose/install/).

## Installation Instructions

1. **Clone the repository**:

    ```bash
    git clone git@github.com:CLAWS-UMICH/claws-mcc-2025.git
    cd claws-mcc-2025
    ```

2. **Build and Start Docker Containers**:

    Use Docker Compose to build and start the containers (this script will take care of everything):

    ```bash
    ./start.sh
    ```

    If you encounter permission issues, run:

    ```bash
    chmod +x start.sh
    ```

## Running the Application

1. Open your browser and navigate to:
    - Frontend: `http://localhost:5173` 
    - Backend: `http://localhost:8080`

2. **Verify**:
    - Verify that the front end and back end services are running as expected.

## Development Workflow

1. **Frontend Hot Reloading**:
    - Make changes to your frontend source files, and Vite will reload the changes automatically.

2. **Backend Hot Reloading**:
    - Make changes to your Flask application, and it will automatically reload.

## Additional Notes

- If you encounter issues, check the Docker logs using:

    ```bash
    docker-compose logs
    ```

- For more detailed control:

    ```bash
    # To stop the containers
    docker-compose down

    # To rebuild the containers
    docker-compose up --build
    ```
