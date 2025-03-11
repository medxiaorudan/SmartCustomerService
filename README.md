# SmartCustomerService

SmartCustomerService is a web application designed to enhance customer interactions by providing a platform where users can inquire about company-specific information. Administrators can securely upload and manage company data, while users can select a company from a list and engage in informative conversations based on the provided details. Users can interact directly with a base Large Language Model (LLM) powered by DeepSeek if no company information is available.

## Features

- **Admin Access**: Authorized administrators can log in to securely upload and manage company information.
- **User Interaction**: Users can view a list of available companies and engage in conversations to inquire about specific company details.
- **Fallback Chat**: In the absence of company-specific information, users can interact directly with a base LLM powered by DeepSeek.

## Technologies Used

- **Backend**: [FastAPI](https://fastapi.tiangolo.com/)
- **Frontend**: [React](https://reactjs.org/) with [Next.js](https://nextjs.org/)

## Getting Started

### Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/medxiaorudan/SmartCustomerService.git
   cd SmartCustomerService
   ```


2. **Backend Setup**:

   - Navigate to the backend directory:

     ```bash
     cd SmartCustomerService-main/
     ```

   - Create and activate a virtual environment:

     ```bash
     python -m venv env
     source env/bin/activate  # On Windows, use 'env\Scripts\activate'
     ```

   - Install the required dependencies:

     ```bash
     pip install -r requirements.txt
     ```

   - Start the FastAPI server:

     ```bash
     uvicorn main:app --host 0.0.0.0 --port 8000 --reload
     ```

     The backend API will be accessible at `http://127.0.0.1:8000`.

3. **Frontend Setup**:

   - Navigate to the frontend directory:

     ```bash
     cd ../frontend
     ```

   - Install the required dependencies:

     ```bash
     npm install
     ```

   - Start the Next.js development server:

     ```bash
     npm run dev
     ```

     The frontend will be accessible at `http://localhost:3000`.

## Usage

- **Admin Access**: Navigate to the admin login page at `http://localhost:3000/admin` and enter your credentials to upload or manage company information.
- **User Interaction**: Visit the homepage at `http://localhost:3000/user`, select a company from the list, and start asking questions related to that company. If no company information is available, you can interact directly with the base LLM powered by DeepSeek.

## Deployment

For production deployment, consider using Docker to containerize both the backend and frontend services. Ensure that environment variables are properly set and that the services are configured to run in a production environment.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your proposed changes. Ensure that your code adheres to the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Acknowledgements

- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [DeepSeek](https://deepseek.ai/)

For more information, visit the project repository at [https://github.com/medxiaorudan/SmartCustomerService](https://github.com/medxiaorudan/SmartCustomerService). 


## TODO
* Admin: Fix file upload
* Docker: Setup Docker for hosting of the backend
* Vite: Look into hosting frontend
