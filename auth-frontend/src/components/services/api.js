import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Replace with your backend API URL
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log("here");

    const originalRequest = error.config;

    // Check if the error is due to an expired access token
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("in");

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const refreshResponse = await api.post(
          "http://localhost:9000/api/auth/refresh-token",
          {
            refreshToken,
          }
        );
        const newAccessToken = refreshResponse.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (error) {
        console.log("Error refreshing token:", error);
        // Redirect to login page or handle token refresh error
      }
    }

    return Promise.reject(error);
  }
);

export default api;
