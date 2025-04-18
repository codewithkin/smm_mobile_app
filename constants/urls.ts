export const urls = {
  backendUrl:
    process.env.NODE_ENV === "production"
      ? ""
      : "http://192.168.1.2:3030/api/smm",
};
