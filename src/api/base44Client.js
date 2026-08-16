export const base44 = {
  auth: {
    me: async () => null,
  },
  integrations: {
    Core: {
      UploadFile: async (/** @type {{file: File}} */ params) => ({ file_url: "mock-url" })
    }
  }
};
