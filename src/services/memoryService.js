import api from "./api";

export const getMemory = async(key) => {
  return await api.post(
    "memory/get/",{
        key
    }
  );
};

export const saveMemory = async(key, value) => {
  return await api.post(
    "memory/save/",{
        key,
        value
    }
  );
};

export const deleteMemory = async(key) => {
  return await api.delete(
    "memory/save/",{
        key
    }
  );
};

export const processMemroy = async(text) =>{
  return await api.post(
    "memory/process/",
    {
      text
    }
  );
};

export const forgetMemory = async (
  text
) =>{
  return await api.post(
    "memory/forget/",{
      text
    }
  );
};

export const callContact = async (text)=>{
  return await api.post(
    "memory/contact/call/",{
      text
    }
  );
}