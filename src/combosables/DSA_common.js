import DSA_api from '@/api/dsa_api';

const DSA_Common = () => {
  const convertUTCtoLocalTime = (utcTimeString) => {
    // Tạo một đối tượng Date từ chuỗi thời gian UTC
    const dateTimeWithoutMilliseconds = utcTimeString.replace(/\.\d+$/, '') + 'Z';

    const utcDate = new Date(dateTimeWithoutMilliseconds);
    return utcDate.toLocaleString(); // hoặc localDate.toLocaleDateString() tùy vào nhu cầu
  };

  const downloadFile = async (apiMethod, filename) => {
    try {
      const response = await apiMethod();

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading the file', error);
    }
  };
  return {
    convertUTCtoLocalTime,
    downloadFile,
  };
};

export default DSA_Common;
