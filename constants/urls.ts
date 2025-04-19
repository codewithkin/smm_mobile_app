export const urls = {
  backendUrl:
    process.env.NODE_ENV === "production"
      ? "https://smm-server-uj4q.onrender.com/api/smm"
      : "http://192.168.1.2:8080/api/smm",
};