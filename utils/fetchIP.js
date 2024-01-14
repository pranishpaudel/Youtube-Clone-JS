const ENDPOINT = 'http://lumtest.com/myip.json';

export const fetchCurrentIP = async () => {
  try {
    const response = await fetch(ENDPOINT);
    const data = await response.json();
    return (data.ip);
  } catch (error) {
    return null;
  }
};

fetchCurrentIP();
